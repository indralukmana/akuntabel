import { formatEther } from "viem";
import { Address } from "~~/components/scaffold-eth/Address";

export function GoalStake({ user, stake }: { user: string; stake: bigint }) {
  const stakeInEth = formatEther(stake);

  return (
    <section>
      <span>
        <strong>User:</strong> <Address address={user} />
      </span>
      <span>
        <strong>Stake:</strong> {stakeInEth} ETH
      </span>
    </section>
  );
}
