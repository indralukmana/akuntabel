"use client";

import React from "react";
import Link from "next/link";
import { Address as AddressType, Hex, formatEther } from "viem";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { Address } from "~~/components/scaffold-eth";
import { useGoalDetails } from "~~/hooks/akuntabel/useGoalDetails";
import { useGoalNonce } from "~~/hooks/akuntabel/useGoalNonce";
import { getGoalHash } from "~~/utils/akutabel/getGoalHash";

const GoalSummary = ({ goalHash }: { goalHash: Hex }) => {
  const { goalDetails } = useGoalDetails(goalHash);

  console.log("goalDetails", goalDetails);

  if (!goalDetails) return null;

  const { description, stake, requiredApprovals, currentApprovals, completed, fundsReleased } = goalDetails;

  return (
    <div className="grid grid-rows-4 md:grid-rows-1 grid-cols-1 md:grid-cols-4 border border-base-content p-4 rounded-lg items-center">
      <div>
        <p>Description: {description}</p>
        <p>Stake: {stake ? formatEther(stake) : ""} ETH</p>
      </div>
      <div>
        <p>Required Approvals: {Number(requiredApprovals)}</p>
        <p>Current Approvals: {Number(currentApprovals)}</p>
      </div>
      <div className="flex items-center gap-2">
        Completed:
        {completed ? (
          <CheckCircleIcon className="w-4 h-4 text-green-500" />
        ) : (
          <XCircleIcon className="w-4 h-4 text-red-500" />
        )}
      </div>
      <p>
        Funds Released: <strong>{fundsReleased ? "Released" : "Not Released"}</strong>
      </p>
    </div>
  );
};

export const GoalsList = ({ address }: { address: AddressType }) => {
  const { goalNonce } = useGoalNonce(address);

  return (
    <>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Your Account</h2>
        <div className="flex items-center gap-2">
          <p>Address:</p>
          <Address address={address} format="long" />
        </div>
        <p>Goal Nonce: {Number(goalNonce)}</p>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">All Goals</h2>
        <ul className="space-y-4">
          {Array.from({ length: Number(goalNonce) }).map((_, index) => {
            const goalHash = getGoalHash(address, index);
            return (
              <li key={index}>
                {address && (
                  <Link href={`/goals/${goalHash}`}>
                    <GoalSummary goalHash={goalHash} />
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};
