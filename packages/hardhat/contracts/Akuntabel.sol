// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title Akuntabel
 * @dev A decentralized accountability contract for setting and achieving personal goals
 */
contract Akuntabel is ReentrancyGuard, AccessControl {
    // Roles
    bytes32 public constant JUDGE_ROLE = keccak256("JUDGE_ROLE");

    // Structs
    struct Goal {
        address user;
        string description;
        uint256 stake;
        uint256 deadline;
        address[] judges;
        mapping(address => bool) judgeApprovals;
        bool completed;
        bool fundsReleased;
    }

    // State variables
    mapping(uint256 => Goal) public goals;
    uint256 public nextGoalId;

    // Events
    event GoalCreated(uint256 indexed goalId, address indexed user, string description, uint256 stake, uint256 deadline);
    event JudgeInvited(uint256 indexed goalId, address indexed judge);
    event GoalApproved(uint256 indexed goalId, address indexed judge);
    event GoalCompleted(uint256 indexed goalId);
    event FundsReleased(uint256 indexed goalId, address indexed user, uint256 amount);

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Creates a new goal
     * @param _description Description of the goal
     * @param _deadline Timestamp for the goal deadline
     * @param _judges Array of judge addresses
     */
    function createGoal(string memory _description, uint256 _deadline, address[] memory _judges) external payable nonReentrant {
        require(msg.value > 0, "Stake must be greater than 0");
        require(_deadline > block.timestamp, "Deadline must be in the future");
        require(_judges.length > 0, "At least one judge is required");

        uint256 goalId = nextGoalId++;
        Goal storage newGoal = goals[goalId];
        newGoal.user = msg.sender;
        newGoal.description = _description;
        newGoal.stake = msg.value;
        newGoal.deadline = _deadline;
        newGoal.judges = _judges;

        for (uint256 i = 0; i < _judges.length; i++) {
            _setupRole(JUDGE_ROLE, _judges[i]);
            emit JudgeInvited(goalId, _judges[i]);
        }

        emit GoalCreated(goalId, msg.sender, _description, msg.value, _deadline);
    }

    /**
     * @dev Allows a judge to approve a goal
     * @param _goalId ID of the goal to approve
     */
    function approveGoal(uint256 _goalId) external {
        require(hasRole(JUDGE_ROLE, msg.sender), "Caller is not a judge");
        Goal storage goal = goals[_goalId];
        require(!goal.completed, "Goal already completed");
        require(block.timestamp <= goal.deadline, "Goal deadline has passed");

        goal.judgeApprovals[msg.sender] = true;
        emit GoalApproved(_goalId, msg.sender);

        if (checkAllJudgesApproved(_goalId)) {
            completeGoal(_goalId);
        }
    }

    /**
     * @dev Checks if all judges have approved the goal
     * @param _goalId ID of the goal to check
     * @return bool True if all judges have approved, false otherwise
     */
    function checkAllJudgesApproved(uint256 _goalId) internal view returns (bool) {
        Goal storage goal = goals[_goalId];
        for (uint256 i = 0; i < goal.judges.length; i++) {
            if (!goal.judgeApprovals[goal.judges[i]]) {
                return false;
            }
        }
        return true;
    }

    /**
     * @dev Completes a goal and releases funds to the user
     * @param _goalId ID of the goal to complete
     */
    function completeGoal(uint256 _goalId) internal {
        Goal storage goal = goals[_goalId];
        require(!goal.completed, "Goal already completed");
        require(!goal.fundsReleased, "Funds already released");

        goal.completed = true;
        goal.fundsReleased = true;

        emit GoalCompleted(_goalId);
        emit FundsReleased(_goalId, goal.user, goal.stake);

        payable(goal.user).transfer(goal.stake);
    }

    /**
     * @dev Allows the contract owner to withdraw any remaining funds
     * @param _amount Amount to withdraw
     */
    function withdrawFunds(uint256 _amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_amount <= address(this).balance, "Insufficient contract balance");
        payable(msg.sender).transfer(_amount);
    }
}
