import { Hex } from "viem";
import { CheckBadgeIcon, ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import GoalApproval from "~~/components/akuntabel/GoalApproval";
import { Address } from "~~/components/scaffold-eth/Address";

export function JudgesAndApprovals({
  judges,
  requiredApprovals,
  currentApprovals,
  verifiedApprovals,
  goalHash,
}: {
  judges: readonly string[] | undefined;
  requiredApprovals: bigint;
  currentApprovals: bigint;
  verifiedApprovals: readonly boolean[];
  goalHash: Hex;
}) {
  console.log({ verifiedApprovals });
  return (
    <section className="card card-body bg-base-100">
      <h3 className="flex items-center gap-2 text-lg font-semibold">
        <UserGroupIcon width={24} height={24} /> Approvals
      </h3>
      <GoalApproval goalHash={goalHash} />
      <p className="flex gap-2 items-center ">
        <strong className="text-lg font-semibold">Approvals:</strong> {Number(currentApprovals)} /{" "}
        {Number(requiredApprovals)} Needed
      </p>
      <div className="flex gap-2">
        <h4 className="text-lg font-semibold my-1">Judges:</h4>
        <div className="flex flex-wrap gap-2">
          {judges?.map((judge, index) => {
            const hasApproved = verifiedApprovals[index];
            const approvedText = hasApproved ? "Has Approved" : "Has Not Approved";
            return (
              <div
                key={index}
                className={`border border-accent rounded-xl p-2 flex items-center gap-2 ${
                  hasApproved ? "bg-green-500 text-neutral-950" : ""
                }`}
                title={approvedText}
              >
                <Address address={judge} />
                {hasApproved ? (
                  <CheckBadgeIcon width={24} height={24} className="text-success" />
                ) : (
                  <ExclamationTriangleIcon width={24} height={24} className="text-warning" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
