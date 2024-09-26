import { formatEther } from "viem";
import { Address } from "~~/components/scaffold-eth/Address";

export function GoalStake({ user, stake }: { user: string; stake: bigint }) {
  const stakeInEth = formatEther(stake);

  return (
    <section>
      <p>
        <strong>User:</strong> <Address address={user} />
      </p>
      <p>
        <strong>Stake:</strong> {stakeInEth} ETH
      </p>
    </section>
  );
}
