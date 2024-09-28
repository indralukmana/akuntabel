import { formatEther } from "viem";
import { Address as AddressType } from "viem";
import { StarIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

export function GoalOverview({
  completed,
  fundsReleased,
  stake,
  user,
}: {
  completed: boolean;
  fundsReleased: boolean;
  stake: bigint;
  user: AddressType;
}) {
  const stakeInEth = formatEther(stake);

  return (
    <section className="card card-body bg-base-100 ">
      <h3 className="flex items-center gap-2 text-lg font-semibold">
        <StarIcon width={24} height={24} /> Goal Overview
      </h3>
      <div className="flex flex-col md:flex-row">
        <div className="flex items-center justify-center gap-2">
          <strong className="text-lg font-semibold">User:</strong> <Address address={user} />
        </div>
        <p className="flex items-center justify-center gap-2">
          <strong className="text-lg font-semibold">Goal Status:</strong>
          {completed ? (
            <span className="badge badge-success">Completed</span>
          ) : (
            <span className="badge badge-warning">In Progress</span>
          )}
        </p>
        <p className="flex items-center justify-center gap-2">
          <strong className="text-lg font-semibold">Funds:</strong>
          <span className={`${fundsReleased ? "text-success" : "text-error"}`}>
            {fundsReleased ? "Released" : "Locked"}
          </span>
        </p>
        <p className="flex items-center justify-center gap-2">
          <strong className="text-lg font-semibold">Stake:</strong>
          <span className="badge badge-secondary">{stakeInEth} ETH</span>
        </p>
      </div>
    </section>
  );
}
