"use client";

import React from "react";
import Link from "next/link";
import { Address as AddressType, Hex, formatEther } from "viem";
import { RandomMotivation } from "~~/components/akuntabel/RandomMotivation";
import { UserEthereum } from "~~/components/akuntabel/UserEthereum";
import { Target2 } from "~~/components/icons/Target2";
import { useGoalDetails } from "~~/hooks/akuntabel/useGoalDetails";
import { useGoalNonce } from "~~/hooks/akuntabel/useGoalNonce";
import { getGoalHash } from "~~/utils/akutabel/getGoalHash";

const GoalSummary = ({ goalHash }: { goalHash: Hex }) => {
  const { goalDetails } = useGoalDetails(goalHash);

  if (!goalDetails) return null;

  const {
    description,
    stake,
    requiredApprovals,
    currentApprovals,
    completed,
    fundsReleased,
    milestoneDescriptions,
    milestoneAchieved,
  } = goalDetails;

  const milestonesCount = milestoneDescriptions.length;
  const milestonesCompleted = milestoneAchieved.every(achieved => achieved);

  return (
    <section className="card bg-base-100 overflow-hidden">
      <div className="p-4 flex justify-center bg-secondary">
        <h5 className="text-lg font-semibold">{description}</h5>
      </div>
      <div className="card-body grid grid-cols-4 w-full items-center">
        <p className="flex gap-2 items-center justify-center">
          <strong className="text-lg font-semibold">Stake:</strong>{" "}
          <span className="badge badge-secondary badge-lg">ETH {stake ? formatEther(stake) : ""}</span>
        </p>

        <p className="flex gap-2 items-center justify-center">
          <strong className="text-lg font-semibold">Approvals:</strong> {Number(currentApprovals)} /{" "}
          {Number(requiredApprovals)} Needed
        </p>

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
      </div>
      <div className="w-full p-6 bg-secondary">
        <progress
          className={`progress  w-full ${milestonesCompleted ? "progress-success" : "progress-warning"}`}
          value={milestonesCompleted ? milestonesCount : 0}
          max={milestonesCount}
        >
          {milestonesCompleted ? milestonesCount : 0} / {milestonesCount}
        </progress>
      </div>
    </section>
  );
};

export const GoalsList = ({ address }: { address: AddressType }) => {
  const { goalNonce } = useGoalNonce(address);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-5xl font-semibold mb-2 text-center p-4">✨ Your Awesome Goals ✨</h3>
        <div className="card card-body bg-base-100 flex md:flex-row flex-col justify-between w-full">
          <UserEthereum address={address} />
          <p className="text-right">Write Your Vision</p>
        </div>
      </div>

      <div className="h-32">
        <RandomMotivation />
      </div>

      <section className="flex-1 space-y-6">
        <h4 className="text-3xl font-semibold mb-2 flex items-center gap-2">
          <Target2 width={36} height={36} />
          Your Epic Goals
        </h4>
        <ul className="space-y-4">
          {Array.from({ length: Number(goalNonce) }).map((_, index) => {
            const goalHash = getGoalHash(address, index);
            return (
              <li key={index}>
                <Link href={`/goals/${goalHash}`}>
                  <GoalSummary goalHash={goalHash} />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
};
