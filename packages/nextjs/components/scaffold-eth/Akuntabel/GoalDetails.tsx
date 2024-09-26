"use client";

import { GoalOverview } from "./GoalOverview";
import { Hex } from "viem";
import { GoalMilestones } from "~~/components/scaffold-eth/Akuntabel/GoalMilestones";
import { GoalStake } from "~~/components/scaffold-eth/Akuntabel/GoalStake";
import { JudgesAndApprovals } from "~~/components/scaffold-eth/Akuntabel/JudgesAndApprovals";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export function GoalDetails({ goalId }: { goalId: Hex }) {
  const { data: goalDetails } = useScaffoldReadContract({
    contractName: "Akuntabel",
    functionName: "getGoalDetails",
    args: [goalId],
  });

  if (!goalDetails) return <p>Loading goal details...</p>;

  const {
    user,
    description,
    stake,
    judges,
    requiredApprovals,
    currentApprovals,
    completed,
    fundsReleased,
    milestones,
  } = goalDetails;

  return (
    <div className="bg-base-200 p-4 rounded-lg border border-base-content grid grid-cols-[max-content_max-content_1fr] divide-x-2 items-start gap-4">
      <div>
        <h4 className="text-md font-semibold underline">Goal Overview</h4>
        <GoalOverview description={description} completed={completed} fundsReleased={fundsReleased} />
        <GoalStake user={user} stake={stake} />
      </div>
      <JudgesAndApprovals
        judges={judges as string[]}
        requiredApprovals={requiredApprovals}
        currentApprovals={currentApprovals}
      />
      <GoalMilestones
        goalDescription={description}
        milestones={milestones as { description: string; achieved: boolean }[]}
        goalId={goalId}
      />
    </div>
  );
}
