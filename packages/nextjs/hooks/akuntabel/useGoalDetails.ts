import { useScaffoldReadContract, useScaffoldWatchContractEvent } from "~~/hooks/scaffold-eth";

export const useGoalDetails = (goalId: bigint) => {
  const {
    data: goalDetailsData,
    isLoading,
    refetch,
  } = useScaffoldReadContract({
    contractName: "Akuntabel",
    functionName: "getGoalDetails",
    args: [goalId],
  });

  useScaffoldWatchContractEvent({
    contractName: "Akuntabel",
    eventName: "MilestoneAchieved",
    onLogs: logs => {
      logs.forEach(log => {
        if (log.args.goalId === goalId) {
          refetch();
        }
      });
    },
  });

  useScaffoldWatchContractEvent({
    contractName: "Akuntabel",
    eventName: "GoalApproved",
    onLogs: logs => {
      logs.forEach(log => {
        if (log.args.goalId === goalId) {
          refetch();
        }
      });
    },
  });

  const goalDetails = {
    user: goalDetailsData?.[0],
    description: goalDetailsData?.[1],
    stake: goalDetailsData?.[2],
    judges: goalDetailsData?.[3],
    requiredApprovals: goalDetailsData?.[4],
    currentApprovals: goalDetailsData?.[5],
    verifiedApprovals: goalDetailsData?.[6],
    milestoneDescriptions: goalDetailsData?.[7],
    milestoneAchieved: goalDetailsData?.[8],
    completed: goalDetailsData?.[9],
    fundsReleased: goalDetailsData?.[10],
  };

  return { goalDetails, isLoading };
};
