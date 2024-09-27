import { Hex } from "viem";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export const useGoalDetails = (goalHash: Hex) => {
  const {
    data: goalDetails,
    isLoading,
    isRefetching,
    refetch: refetchGoalDetails,
  } = useScaffoldReadContract({
    contractName: "Akuntabel",
    functionName: "getGoalDetails",
    args: [goalHash],
  });

  const isLoadingData = isLoading || isRefetching;

  return { goalDetails, isLoadingData, refetchGoalDetails };
};
