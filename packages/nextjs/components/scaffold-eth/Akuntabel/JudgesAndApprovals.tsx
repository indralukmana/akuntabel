import { Address } from "~~/components/scaffold-eth/Address";

export function JudgesAndApprovals({
  judges,
  requiredApprovals,
  currentApprovals,
}: {
  judges: string[];
  requiredApprovals: bigint;
  currentApprovals: bigint;
}) {
  return (
    <section className="h-full pl-4">
      <h4 className="text-md font-semibold underline">Judges and Approvals</h4>
      <div>
        <p>
          <strong>Required Approvals:</strong> {requiredApprovals.toString()}
        </p>
        <p>
          <strong>Current Approvals:</strong> {currentApprovals.toString()}
        </p>
      </div>
      <strong>Judges:</strong>{" "}
      {judges.map((judge, index) => (
        <Address key={index} address={judge} />
      ))}
    </section>
  );
}
