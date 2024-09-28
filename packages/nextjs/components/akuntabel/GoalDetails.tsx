"use client";

import { GoalOverview } from "./GoalOverview";
import { Hex } from "viem";
import { GoalMilestones } from "~~/components/akuntabel/GoalMilestones";
import { JudgesAndApprovals } from "~~/components/akuntabel/JudgesAndApprovals";
import { Target2 } from "~~/components/icons/Target2";
import { useGoalDetails } from "~~/hooks/akuntabel/useGoalDetails";

export function GoalDetails({ goalHash }: { goalHash: Hex }) {
  const { goalDetails } = useGoalDetails(goalHash);

  const {
    user,
    description,
    stake,
    judges,
    requiredApprovals,
    currentApprovals,
    verifiedApprovals,
    completed,
    fundsReleased,
    milestoneDescriptions,
    milestoneAchieved,
  } = goalDetails ?? {};

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="ext-5xl font-semibold mb-2 flex items-center justify-center gap-2 text-center p-4">
        <Target2 width={40} height={40} /> {description}
      </h2>
      <div className="grid grid-rows-[max-content_max-content_max-content] gap-4">
        <GoalOverview
          completed={completed ?? false}
          fundsReleased={fundsReleased ?? false}
          stake={BigInt(stake ?? 0)}
          user={user ?? ""}
        />

        <JudgesAndApprovals
          judges={judges}
          requiredApprovals={BigInt(requiredApprovals ?? 0)}
          currentApprovals={BigInt(currentApprovals ?? 0)}
          verifiedApprovals={verifiedApprovals ?? []}
          goalHash={goalHash}
        />

        <GoalMilestones
          goalDescription={description ?? ""}
          milestonesDescriptions={milestoneDescriptions}
          milestonesAchieved={milestoneAchieved}
          goalHash={goalHash}
        />
      </div>
    </div>
  );
}
