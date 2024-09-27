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

    mapping(address => uint256) public userGoalNonce;
    mapping(bytes32 => Goal) public userGoalsByHash;

    event GoalCreated(bytes32 indexed goalHash, address indexed user, string description, uint256 stake);
    event MilestoneAdded(bytes32 indexed goalHash, uint256 milestoneIndex, string description);
    event MilestoneAchieved(bytes32 indexed goalHash, uint256 milestoneIndex);
    event JudgeInvited(bytes32 indexed goalHash, address indexed judge);
    event GoalApproved(bytes32 indexed goalHash, address indexed judge);
    event GoalCompleted(bytes32 indexed goalHash);
    event FundsReleased(bytes32 indexed goalHash, address indexed user, uint256 amount);
    event RequiredApprovalsSet(bytes32 indexed goalHash, uint256 requiredApprovals);

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
        require(noJudgeDuplicates(_judges), "Found duplicate judge");
        require(_milestoneDescriptions.length > 0, "At least one milestone is required");
        require(_requiredApprovals > 0 && _requiredApprovals <= _judges.length, "Invalid number of required approvals");

        uint256 senderGoalNonce = userGoalNonce[msg.sender]++;
        bytes32 goalHash = keccak256(abi.encodePacked(msg.sender, senderGoalNonce));
        Goal storage newGoal = userGoalsByHash[goalHash];
        newGoal.user = msg.sender;
        newGoal.description = _description;
        newGoal.stake = msg.value;
        newGoal.judges = _judges;
        newGoal.requiredApprovals = _requiredApprovals;

        for (uint256 i = 0; i < _judges.length; i++) {
            newGoal.verifiedApprovals.push(false);
            emit JudgeInvited(goalHash, _judges[i]);
        }

        for (uint256 i = 0; i < _milestoneDescriptions.length; i++) {
            newGoal.milestoneDescriptions.push(_milestoneDescriptions[i]);
            newGoal.milestoneAchieved.push(false);
            emit MilestoneAdded(goalHash, i, _milestoneDescriptions[i]);
        }

        emit GoalCreated(goalHash, msg.sender, _description, msg.value);
        emit RequiredApprovalsSet(goalHash, _requiredApprovals);
    }

    function noJudgeDuplicates(address[] memory _judges) internal pure returns (bool) {
        for (uint256 i = 0; i < _judges.length; i++) {
            for (uint256 j = i + 1; j < _judges.length; j++) {
                if (_judges[i] == _judges[j]) {
                    return false;
                }   
            }
        }
        return true;
    }


    function achieveMilestone(bytes32 _goalHash, uint256 _milestoneIndex) external {
        Goal storage goal = userGoalsByHash[_goalHash];
        require(msg.sender == goal.user, "Only goal creator can achieve milestones");
        require(_milestoneIndex < goal.milestoneAchieved.length, "Invalid milestone index");
        require(!goal.milestoneAchieved[_milestoneIndex], "Milestone already achieved");

        goal.milestoneAchieved[_milestoneIndex] = true;
        emit MilestoneAchieved(_goalHash, _milestoneIndex);

        if (areAllMilestonesAchieved(_goalHash)) {
            goal.completed = true;
            emit GoalCompleted(_goalHash);
        }
    }

    function approveGoal(bytes32 _goalHash) external nonReentrant {
        Goal storage goal = userGoalsByHash[_goalHash];
        uint256 judgeIndex = findJudgeIndex(_goalHash, msg.sender);

        require(judgeIndex < 256, "Judge not found");

        require(goal.completed, "All milestones must be achieved before approval");
        require(!goal.fundsReleased, "Funds already released");
        require(!goal.verifiedApprovals[judgeIndex], "Judge has already approved");

        goal.verifiedApprovals[judgeIndex] = true;
        goal.currentApprovals++;
        emit GoalApproved(_goalHash, msg.sender);

        if (goal.currentApprovals == goal.requiredApprovals) {
            releaseFunds(_goalHash);
        }
    }

    function findJudgeIndex(bytes32 _goalHash, address _judge) internal view returns (uint256) {
        Goal storage goal = userGoalsByHash[_goalHash];
        for (uint256 i = 0; i < goal.judges.length; i++) {
            if (goal.judges[i] == _judge) {
                return i;
            }
        }

        return 256;
    }

  

    function areAllMilestonesAchieved(bytes32 _goalHash) internal view returns (bool) {
        Goal storage goal = userGoalsByHash[_goalHash];
        for (uint256 i = 0; i < goal.milestoneAchieved.length; i++) {
            if (!goal.milestoneAchieved[i]) {
                return false;
            }
        }
        return true;
    }

    function releaseFunds(bytes32 _goalHash) internal {
        Goal storage goal = userGoalsByHash[_goalHash];
        require(goal.completed, "Goal not completed");
        require(!goal.fundsReleased, "Funds already released");

        goal.fundsReleased = true;
        emit FundsReleased(_goalHash, goal.user, goal.stake);
        payable(goal.user).transfer(goal.stake);
    }

    function withdrawFunds(uint256 _amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_amount <= address(this).balance, "Insufficient contract balance");
        payable(msg.sender).transfer(_amount);
    }

    function getGoalDetails(bytes32 _goalHash) external view returns (
    Goal memory goal
    ) {
        return userGoalsByHash[_goalHash];
    }
}