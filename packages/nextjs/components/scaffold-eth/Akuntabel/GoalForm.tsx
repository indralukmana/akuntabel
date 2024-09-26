import React, { useState } from "react";
import { parseEther } from "viem";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
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
        args: [description, judges, milestones, requiredApprovals],
        value: parseEther(stake),
      });
      alert("Goal created successfully!");
    } catch (error) {
      console.error("Error creating goal:", error);
      alert("Error creating goal. Check console for details.");
    }
  };

  const handleRequiredApprovalsChange = (value: string) => {
    const parsedValue = parseInt(value || "1");
    const newValue = Math.min(Math.max(1, parsedValue), judges.length);
    setRequiredApprovals(newValue);
  };

  function handleAddJudge() {
    setJudges([...judges, ""]);
  }

  function handleRemoveJudge(index: number) {
    const newJudges = judges.filter((_, i) => i !== index);
    setJudges(newJudges);
    if (requiredApprovals > newJudges.length) {
      setRequiredApprovals(newJudges.length);
    }
  }

  function handleJudgeChange(index: number, value: string) {
    const newJudges = [...judges];
    newJudges[index] = value;
    setJudges(newJudges);
  }

  function handleAddMilestone() {
    setMilestones([...milestones, ""]);
  }

  function handleRemoveMilestone(index: number) {
    setMilestones(milestones.filter((_, i) => i !== index));
  }

  function handleMilestoneChange(index: number, value: string) {
    const newMilestones = [...milestones];
    newMilestones[index] = value;
    setMilestones(newMilestones);
  }

  return (
    <section className="mb-4 space-y-6 border border-base-content rounded-xl p-4">
      <h2 className="text-xl font-semibold mb-2">Create New Goal</h2>

      <div className="space-y-4">
        <InputBase
          name="goal-description"
          label="Goal Description"
          placeholder="Write your goal here"
          value={description}
          onChange={setDescription}
        />
        <EtherInput name="stake" label="Stake (in ETH)" value={stake} onChange={setStake} />
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Judges</h3>
          {judges.map((judge, index) => (
            <div key={index} className="flex items-end space-x-2">
              <AddressInput
                name={`judge-address-${index}`}
                label={`Judge Address ${index + 1}`}
                placeholder="Enter judge address"
                value={judge}
                onChange={value => handleJudgeChange(index, value)}
              />
              <button onClick={() => handleRemoveJudge(index)} className="btn btn-error btn-sm mb-1">
                Remove
              </button>
            </div>
          ))}
          <button onClick={handleAddJudge} className="btn btn-secondary btn-sm">
            Add Judge
          </button>
        </div>

        <div className="grid grid-cols-[200px_70px_70px] items-end gap-2">
          <InputBase
            name="required-approvals"
            label="Required Approvals"
            value={requiredApprovals.toString()}
            onChange={handleRequiredApprovalsChange}
          />
          <button
            className="btn btn-xs btn-primary mb-2"
            onClick={() => handleRequiredApprovalsChange(Math.max(1, requiredApprovals - 1).toString())}
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          <button
            className="btn btn-xs btn-primary mb-2"
            onClick={() => handleRequiredApprovalsChange((requiredApprovals + 1).toString())}
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Milestones</h3>
          {milestones.map((milestone, index) => (
            <div key={index} className="flex items-end space-x-2">
              <InputBase
                name={`milestone-${index}`}
                label={`Milestone ${index + 1}`}
                placeholder="Enter milestone"
                value={milestone}
                onChange={value => handleMilestoneChange(index, value)}
              />
              <button onClick={() => handleRemoveMilestone(index)} className="btn btn-error btn-sm mb-1">
                Remove
              </button>
            </div>
          ))}
          <button onClick={handleAddMilestone} className="btn btn-secondary btn-sm">
            Add Milestone
          </button>
        </div>
      </div>
      <button onClick={handleCreateGoal} className="btn btn-primary ">
        Create Goal
      </button>
    </section>
  );
};
