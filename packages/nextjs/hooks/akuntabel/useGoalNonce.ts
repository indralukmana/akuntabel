import { Address } from "viem";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export const useGoalNonce = (address: Address) => {
  const {
    data: goalNonce,
    refetch: refetchGoalNonce,
    isLoading: isLoadingGoalNonce,
  } = useScaffoldReadContract({
    contractName: "Akuntabel",
    functionName: "userGoalNonce",
    args: [address],
  });

  return { goalNonce, refetchGoalNonce, isLoadingGoalNonce };
};
