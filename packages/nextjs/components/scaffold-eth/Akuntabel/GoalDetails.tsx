import { Address as AddressType } from "viem";
import { Address } from "~~/components/scaffold-eth/Address";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { generateGoalId } from "~~/utils/akuntabel/generateGoalId";

export const GoalDetails = ({ goalNonce, address }: { goalNonce: bigint; address: AddressType }) => {
  const goalId = generateGoalId(address, goalNonce);

  const { data: goalDetails } = useScaffoldReadContract({
    contractName: "Akuntabel",
    functionName: "getGoalDetails",
    args: [goalId],
  });

  const { data: goalMilestones } = useScaffoldReadContract({
    contractName: "Akuntabel",
    functionName: "getGoalMilestones",
    args: [goalId],
  });

  if (!goalDetails) return <p>Loading goal details...</p>;

  const [user, description, stake, judges, requiredApprovals, currentApprovals, completed, fundsReleased] = goalDetails;

  return (
    <div className="bg-base-200 p-4 rounded-lg border border-base-content">
      <h3 className="text-lg font-semibold mb-2">Goal Details</h3>
      <p>
        <strong>Description:</strong> {description}
      </p>
      <p>
        <strong>User:</strong> <Address address={user} />
      </p>
      <p>
        <strong>Stake:</strong> {stake.toString()} wei
      </p>
      <p>
        <strong>Judges:</strong>{" "}
        {judges.map((judge, index) => (
          <Address key={index} address={judge} />
        ))}
      </p>
      <p>
        <strong>Required Approvals:</strong> {requiredApprovals.toString()}
      </p>
      <p>
        <strong>Current Approvals:</strong> {currentApprovals.toString()}
      </p>
      <p>
        <strong>Completed:</strong> {completed ? "Yes" : "No"}
      </p>
      <p>
        <strong>Funds Released:</strong> {fundsReleased ? "Yes" : "No"}
      </p>
      {goalMilestones && (
        <div>
          <h4 className="text-md font-semibold mt-2">Milestones</h4>
          <ul>
            {goalMilestones[0].map((description, index) => (
              <li key={index}>
                {description} - {goalMilestones[1][index] ? "Achieved" : "Not Achieved"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
