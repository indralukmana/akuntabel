// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title Akuntabel
 * @dev A decentralized accountability contract for setting and achieving personal goals with milestones
 */
contract Akuntabel is ReentrancyGuard, AccessControl {
    bytes32 public constant JUDGE_ROLE = keccak256("JUDGE_ROLE");

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
        uint256 requiredApprovals;
        uint256 currentApprovals;
        mapping(address => bool) judgeApprovals;
        bool completed;
        bool fundsReleased;
        Milestone[] milestones;
    }

    mapping(uint256 => Goal) public goals;
    uint256 public nextGoalId;

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
        uint256 _requiredApprovals
    ) external payable nonReentrant {
        require(msg.value > 0, "Stake must be greater than 0");
        require(_judges.length > 0, "At least one judge is required");
        require(_milestoneDescriptions.length > 0, "At least one milestone is required");
        require(_requiredApprovals > 0 && _requiredApprovals <= _judges.length, "Invalid number of required approvals");

        uint256 goalId = nextGoalId++;
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

    function achieveMilestone(uint256 _goalId, uint256 _milestoneIndex) external {
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

    function approveGoal(uint256 _goalId) external {
        require(hasRole(JUDGE_ROLE, msg.sender), "Caller is not a judge");
        Goal storage goal = goals[_goalId];
        require(goal.completed, "All milestones must be achieved before approval");
        require(!goal.fundsReleased, "Funds already released");
        require(!goal.judgeApprovals[msg.sender], "Judge has already approved");

        goal.judgeApprovals[msg.sender] = true;
        goal.currentApprovals++;
        emit GoalApproved(_goalId, msg.sender);

        if (goal.currentApprovals >= goal.requiredApprovals) {
            releaseFunds(_goalId);
        }
    }

    function areAllMilestonesAchieved(uint256 _goalId) internal view returns (bool) {
        Goal storage goal = goals[_goalId];
        for (uint256 i = 0; i < goal.milestones.length; i++) {
            if (!goal.milestones[i].achieved) {
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

    function getGoalMilestones(uint256 _goalId) external view returns (
        string[] memory descriptions,
        bool[] memory achieved
    ) {
        Goal storage goal = goals[_goalId];
        uint256 milestoneCount = goal.milestones.length;
        
        descriptions = new string[](milestoneCount);
        achieved = new bool[](milestoneCount);
        
        for (uint256 i = 0; i < milestoneCount; i++) {
            descriptions[i] = goal.milestones[i].description;
            achieved[i] = goal.milestones[i].achieved;
        }
    }

    function getGoalDetails(uint256 _goalId) external view returns (
        address user,
        string memory description,
        uint256 stake,
        address[] memory judges,
        uint256 requiredApprovals,
        uint256 currentApprovals,
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
            goal.completed,
            goal.fundsReleased
        );
    }
}
