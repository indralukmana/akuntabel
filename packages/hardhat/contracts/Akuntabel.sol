// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title Akuntabel
 * @dev A decentralized accountability contract for setting and achieving personal goals with milestones
 */
contract Akuntabel is ReentrancyGuard, AccessControl {
    bytes32 private constant JUDGE_ROLE = keccak256("JUDGE_ROLE");
    bytes32 private constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    /**
     * Milestone struct to store the description 
     * and achievement of a goal. 
     */
    struct Milestone {
        string description;
        bool achieved;
    }

    /**
     * Goal struct to store the user, description, stake, 
     * judges, judge approvals, completion, and funds release of a goal.
     */
    struct Goal {
        address user;
        string description;
        uint256 stake;
        address[] judges;
        address[] approvals;
        uint256 requiredApprovals;
        uint256 currentApprovals;
        bool completed;
        bool fundsReleased;
        Milestone[] milestones;
    }

    mapping(bytes32 => Goal) public goals;
    mapping(address => uint256) public goalNonce;

    event GoalCreated(bytes32 indexed goalId, address indexed user, string description, uint256 stake);
    event MilestoneAdded(bytes32 indexed goalId, uint256 milestoneIndex, string description);
    event MilestoneAchieved(bytes32 indexed goalId, uint256 milestoneIndex);
    event JudgeInvited(bytes32 indexed goalId, address indexed judge);
    event GoalApproved(bytes32 indexed goalId, address indexed judge);
    event GoalCompleted(bytes32 indexed goalId);
    event FundsReleased(bytes32 indexed goalId, address indexed user, uint256 amount);
    event RequiredApprovalsSet(bytes32 indexed goalId, uint256 requiredApprovals);

    constructor() {
        _setupRole(ADMIN_ROLE, msg.sender);
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
        uint256 _requiredApprovals
    ) external payable nonReentrant {
        require(msg.value > 0, "Stake must be greater than 0");
        require(_judges.length > 0, "At least one judge is required");
        require(_milestoneDescriptions.length > 0, "At least one milestone is required");
        require(_requiredApprovals > 0 && _requiredApprovals <= _judges.length, "Invalid number of required approvals");

        bytes32 goalId = keccak256(abi.encodePacked(msg.sender, goalNonce[msg.sender]++));

        Goal storage newGoal = goals[goalId];
        newGoal.user = msg.sender;
        newGoal.description = _description;
        newGoal.stake = msg.value;
        newGoal.judges = _judges;
        newGoal.requiredApprovals = _requiredApprovals;

        for (uint256 i = 0; i < _judges.length; i++) {
            _setupRole(JUDGE_ROLE, _judges[i]);
            emit JudgeInvited(goalId, _judges[i]);
        }

        for (uint256 i = 0; i < _milestoneDescriptions.length; i++) {
            newGoal.milestones.push(Milestone({
                description: _milestoneDescriptions[i],
                achieved: false
            }));
            emit MilestoneAdded(goalId, i, _milestoneDescriptions[i]);
        }

        emit GoalCreated(goalId, msg.sender, _description, msg.value);
        emit RequiredApprovalsSet(goalId, _requiredApprovals);
    }

    function achieveMilestone(bytes32 _goalId, uint256 _milestoneIndex) external {
        Goal storage goal = goals[_goalId];
        require(msg.sender == goal.user, "Only goal creator can achieve milestones");
        require(_milestoneIndex < goal.milestones.length, "Invalid milestone index");
        require(!goal.milestones[_milestoneIndex].achieved, "Milestone already achieved");

        goal.milestones[_milestoneIndex].achieved = true;
        emit MilestoneAchieved(_goalId, _milestoneIndex);

        if (areAllMilestonesAchieved(_goalId)) {
            goal.completed = true;
            emit GoalCompleted(_goalId);
        }
    }

    function approveGoal(bytes32 _goalId) external {
        require(hasRole(JUDGE_ROLE, msg.sender), "Caller is not a judge");
        Goal storage goal = goals[_goalId];
        require(goal.completed, "All milestones must be achieved before approval");
        require(!goal.fundsReleased, "Funds already released");
        require(!judgeHasApproved(_goalId, msg.sender), "Judge has already approved");

        goal.approvals.push(msg.sender);
        goal.currentApprovals++;
        emit GoalApproved(_goalId, msg.sender);

        if (goal.currentApprovals >= goal.requiredApprovals) {
            releaseFunds(_goalId);
        }
    }

    function judgeHasApproved(bytes32 _goalId, address _judge) internal view returns (bool) {
        Goal storage goal = goals[_goalId];
        
        for (uint256 i = 0; i < goal.approvals.length; i++) {
            if (goal.approvals[i] == _judge) {
                return true;
            }
        }
        return false;
    }

    function areAllMilestonesAchieved(bytes32 _goalId) internal view returns (bool) {
        Goal storage goal = goals[_goalId];
        for (uint256 i = 0; i < goal.milestones.length; i++) {
            if (!goal.milestones[i].achieved) {
                return false;
            }
        }
        return true;
    }

    function releaseFunds(bytes32 _goalId) internal {
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

    function getGoalDetails(bytes32 _goalId) external view returns (Goal memory) {
        Goal storage goal = goals[_goalId];
        return Goal(
            goal.user, 
            goal.description,
            goal.stake,
            goal.judges,
            goal.approvals,
            goal.requiredApprovals,
            goal.currentApprovals,
            goal.completed,
            goal.fundsReleased,
            goal.milestones
        );
    }
}
