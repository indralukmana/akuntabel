import React, { useState } from "react";
import { parseEther } from "viem";
import { AddressInput, EtherInput, InputBase } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export const GoalForm = () => {
  const [description, setDescription] = useState<string>("");
  const [judges, setJudges] = useState<string[]>([]);
  const [milestones, setMilestones] = useState<string[]>([]);
  const [requiredApprovals, setRequiredApprovals] = useState<number>(1);
  const [stake, setStake] = useState<string>("");

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
    <div className="mb-4 space-y-6">
      <h2 className="text-xl font-semibold mb-2">Create New Goal</h2>

      <div className="grid grid-cols-[max-content_1fr] gap-4 items-center">
        <InputBase
          name="goal-description"
          label="Goal Description"
          placeholder="Write your goal here"
          value={description}
          onChange={setDescription}
        />
        <AddressInput
          name="judge-address"
          label="Judge Address"
          placeholder="Enter judge address"
          value={judges[0] || ""}
          onChange={value => setJudges([value])}
        />
        <InputBase
          name="milestone"
          label="Milestone"
          placeholder="Enter goal milestone"
          value={milestones[0] || ""}
          onChange={value => setMilestones([value])}
        />
        <InputBase
          name="required-approvals"
          label="Required Approvals"
          value={requiredApprovals.toString()}
          onChange={value => setRequiredApprovals(parseInt(value) || 1)}
        />
        <EtherInput name="stake" label="Stake (in ETH)" value={stake} onChange={setStake} />
      </div>
      <button onClick={handleCreateGoal} className="btn btn-primary ">
        Create Goal
      </button>
    </div>
  );
};
