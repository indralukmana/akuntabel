// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title Akuntabel
 * @dev A decentralized accountability contract for setting and achieving personal goals with milestones
 */
contract Akuntabel is ReentrancyGuard, AccessControl {
    /**
     * Goal struct to store the user, description, stake, 
     * judges, judge approvals, completion, and funds release of a goal.
     * judges is assumed to be less than 256 judges, judge array of 256 is used as an impossible value to indicate that the judge has not approved
     */
    struct Goal {
        address user;
        string description;
        uint256 stake;
        address[] judges;
        uint8 requiredApprovals;
        uint8 currentApprovals;
        bool[] verifiedApprovals;
        string[] milestoneDescriptions;
        bool[] milestoneAchieved;
        bool completed;
        bool fundsReleased;
    }

    mapping(uint256 => Goal) public goals;
    mapping(address => uint256) public goalNonce;

    event GoalCreated(uint256 indexed goalId, address indexed user, string description, uint256 stake);
    event MilestoneAdded(uint256 indexed goalId, uint256 milestoneIndex, string description);
    event MilestoneAchieved(uint256 indexed goalId, uint256 milestoneIndex);
    event JudgeInvited(uint256 indexed goalId, address indexed judge);
    event GoalApproved(uint256 indexed goalId, address indexed judge);
    event GoalCompleted(uint256 indexed goalId);
    event FundsReleased(uint256 indexed goalId, address indexed user, uint256 amount);
    event RequiredApprovalsSet(uint256 indexed goalId, uint256 requiredApprovals);

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Creates a new goal with the specified description, judges, and milestones.
     * @param _description The description of the goal.
     * @param _judges The addresses of the judges.
     * @param _milestoneDescriptions The descriptions of the milestones.
     * @param _requiredApprovals The number of approvals required.
     */
    function createGoal(
        string memory _description,
        address[] memory _judges,
        string[] memory _milestoneDescriptions,
        uint8 _requiredApprovals
    ) external payable nonReentrant {
        require(msg.value > 0, "Stake must be greater than 0");
        require(_judges.length > 0, "At least one judge is required");
        require(_judges.length < 256, "Too many judges");
        require(_milestoneDescriptions.length > 0, "At least one milestone is required");
        require(_requiredApprovals > 0 && _requiredApprovals <= _judges.length, "Invalid number of required approvals");

        uint256 goalId = goalNonce[msg.sender]++;
        Goal storage newGoal = goals[goalId];
        newGoal.user = msg.sender;
        newGoal.description = _description;
        newGoal.stake = msg.value;
        newGoal.judges = _judges;
        newGoal.requiredApprovals = _requiredApprovals;

        for (uint256 i = 0; i < _judges.length; i++) {
            newGoal.verifiedApprovals.push(false);
            emit JudgeInvited(goalId, _judges[i]);
        }

        for (uint256 i = 0; i < _milestoneDescriptions.length; i++) {
            newGoal.milestoneDescriptions.push(_milestoneDescriptions[i]);
            newGoal.milestoneAchieved.push(false);
            emit MilestoneAdded(goalId, i, _milestoneDescriptions[i]);
        }

        emit GoalCreated(goalId, msg.sender, _description, msg.value);
        emit RequiredApprovalsSet(goalId, _requiredApprovals);
    }

    function achieveMilestone(uint256 _goalId, uint256 _milestoneIndex) external {
        Goal storage goal = goals[_goalId];
        require(msg.sender == goal.user, "Only goal creator can achieve milestones");
        require(_milestoneIndex < goal.milestoneAchieved.length, "Invalid milestone index");
        require(!goal.milestoneAchieved[_milestoneIndex], "Milestone already achieved");

        goal.milestoneAchieved[_milestoneIndex] = true;
        emit MilestoneAchieved(_goalId, _milestoneIndex);

        if (areAllMilestonesAchieved(_goalId)) {
            goal.completed = true;
            emit GoalCompleted(_goalId);
        }
    }

    function approveGoal(uint256 _goalId) external nonReentrant {
        Goal storage goal = goals[_goalId];
        uint256 judgeIndex = findJudgeIndex(_goalId, msg.sender);

        require(judgeIndex < 256, "Judge not found");

        require(goal.completed, "All milestones must be achieved before approval");
        require(!goal.fundsReleased, "Funds already released");
        require(!goal.verifiedApprovals[judgeIndex], "Judge has already approved");

        goal.verifiedApprovals[judgeIndex] = true;
        goal.currentApprovals++;
        emit GoalApproved(_goalId, msg.sender);

        if (goal.currentApprovals == goal.requiredApprovals) {
            releaseFunds(_goalId);
        }
    }

    function findJudgeIndex(uint256 _goalId, address _judge) internal view returns (uint256) {
        Goal storage goal = goals[_goalId];
        for (uint256 i = 0; i < goal.judges.length; i++) {
            if (goal.judges[i] == _judge) {
                return i;
            }
        }

        return 256;
    }

  

    function areAllMilestonesAchieved(uint256 _goalId) internal view returns (bool) {
        Goal storage goal = goals[_goalId];
        for (uint256 i = 0; i < goal.milestoneAchieved.length; i++) {
            if (!goal.milestoneAchieved[i]) {
                return false;
            }
        }
        return true;
    }

    function releaseFunds(uint256 _goalId) internal {
        Goal storage goal = goals[_goalId];
        require(goal.completed, "Goal not completed");
        require(!goal.fundsReleased, "Funds already released");

        goal.fundsReleased = true;
        emit FundsReleased(_goalId, goal.user, goal.stake);
        payable(goal.user).transfer(goal.stake);
    }

    function withdrawFunds(uint256 _amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_amount <= address(this).balance, "Insufficient contract balance");
        payable(msg.sender).transfer(_amount);
    }

    function getGoalDetails(uint256 _goalId) external view returns (
        address user,
        string memory description,
        uint256 stake,
        address[] memory judges,
        uint8 requiredApprovals,
        uint8 currentApprovals,
        bool[] memory verifiedApprovals,
        string[] memory milestoneDescriptions,
        bool[] memory milestoneAchieved,
        bool completed,
        bool fundsReleased
    ) {
        Goal storage goal = goals[_goalId];
        return (
            goal.user,
            goal.description,
            goal.stake,
            goal.judges,
            goal.requiredApprovals,
            goal.currentApprovals,
            goal.verifiedApprovals,
            goal.milestoneDescriptions,
            goal.milestoneAchieved,
            goal.completed,
            goal.fundsReleased
        );
    }
}