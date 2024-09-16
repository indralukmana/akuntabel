"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { Address, AddressInput, InputBase } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const GoalDetails = ({ goalId }: { goalId: number }) => {
  const { data: goalDetails } = useScaffoldReadContract({
    contractName: "Akuntabel",
    functionName: "getGoalDetails",
    args: [BigInt(goalId)],
  });

  const { data: goalMilestones } = useScaffoldReadContract({
    contractName: "Akuntabel",
    functionName: "getGoalMilestones",
    args: [BigInt(goalId)],
  });

  if (!goalDetails) return <p>Loading goal details...</p>;

  const [user, description, stake, judges, requiredApprovals, currentApprovals, completed, fundsReleased] = goalDetails;

  return (
    <div className="bg-base-200 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Goal {goalId} Details</h3>
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

const Home: NextPage = () => {
  const [description, setDescription] = useState<string>("");
  const [judges, setJudges] = useState<string[]>([]);
  const [milestones, setMilestones] = useState<string[]>([]);
  const [requiredApprovals, setRequiredApprovals] = useState<number>(1);
  const [stake, setStake] = useState<string>("");
  const [viewGoalId, setViewGoalId] = useState<number>(0);

  const { address } = useAccount();

  const { data: nextGoalId } = useScaffoldReadContract({
    contractName: "Akuntabel",
    functionName: "nextGoalId",
  });

  const { writeContractAsync } = useScaffoldWriteContract("Akuntabel");

  const handleCreateGoal = async () => {
    if (!description || judges.length === 0 || milestones.length === 0 || !stake) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await writeContractAsync({
        functionName: "createGoal",
        args: [description, judges, milestones, BigInt(requiredApprovals)],
        value: parseEther(stake),
      });
      alert("Goal created successfully!");
    } catch (error) {
      console.error("Error creating goal:", error);
      alert("Error creating goal. Check console for details.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Akuntabel - Goal Accountability</h1>

      <div className="mb-4 space-y-2">
        <h2 className="text-xl font-semibold mb-2">Create New Goal</h2>
        <InputBase placeholder="Goal Description" value={description} onChange={setDescription} />
        <AddressInput placeholder="Judge Address" value={judges[0] || ""} onChange={value => setJudges([value])} />
        <InputBase placeholder="Milestone" value={milestones[0] || ""} onChange={value => setMilestones([value])} />
        <InputBase
          placeholder="Required Approvals"
          value={requiredApprovals.toString()}
          onChange={value => setRequiredApprovals(parseInt(value) || 1)}
        />
        <InputBase placeholder="Stake (in ETH)" value={stake} onChange={setStake} />
        <button onClick={handleCreateGoal} className="btn btn-primary ">
          Create Goal
        </button>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">View Goal Details</h2>
        <InputBase
          placeholder="Goal ID"
          value={viewGoalId.toString()}
          onChange={value => setViewGoalId(parseInt(value) || 0)}
        />
        <GoalDetails goalId={viewGoalId} />
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Your Address</h2>
        <Address address={address} />
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Next Goal ID</h2>
        <p>{nextGoalId?.toString() || "Loading..."}</p>
      </div>
    </div>
  );
};

export default Home;
