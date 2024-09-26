"use client";

import { GoalOverview } from "./GoalOverview";
import { GoalMilestones } from "~~/components/scaffold-eth/Akuntabel/GoalMilestones";
import { GoalStake } from "~~/components/scaffold-eth/Akuntabel/GoalStake";
import { JudgesAndApprovals } from "~~/components/scaffold-eth/Akuntabel/JudgesAndApprovals";
import { useGoalDetails } from "~~/hooks/akuntabel/useGoalDetails";

export function GoalDetails({ goalId }: { goalId: bigint }) {
  const { goalDetails, isLoading } = useGoalDetails(goalId);

  if (isLoading) return <p>Loading goal details...</p>;

  const {
    user,
    description,
    stake,
    judges,
    requiredApprovals,
    currentApprovals,
    completed,
    fundsReleased,
    milestoneDescriptions,
    milestoneAchieved,
  } = goalDetails;

  return (
    <div className="bg-base-200 p-4 rounded-lg border border-base-content grid grid-cols-[max-content_max-content_1fr] divide-x-2 items-start gap-4">
      <div>
        <h4 className="text-md font-semibold underline">Goal Overview</h4>
        <GoalOverview
          description={description ?? ""}
          completed={completed ?? false}
          fundsReleased={fundsReleased ?? false}
        />
        <GoalStake user={user ?? ""} stake={BigInt(stake ?? 0)} />
      </div>
      <JudgesAndApprovals
        judges={judges}
        requiredApprovals={BigInt(requiredApprovals ?? 0)}
        currentApprovals={BigInt(currentApprovals ?? 0)}
      />
      <GoalMilestones
        goalDescription={description ?? ""}
        milestonesDescriptions={milestoneDescriptions}
        milestonesAchieved={milestoneAchieved}
        goalId={goalId}
      />
    </div>
  );
}
