"use client";

import React from "react";
import { Address as AddressType, formatEther } from "viem";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { generateGoalId } from "~~/utils/akuntabel/generateGoalId";

type GoalsListProps = {
  address: AddressType | undefined;
};

const GoalSummary = ({ goalNonce, address }: { goalNonce: bigint; address: AddressType }) => {
  const goalId = generateGoalId(address, goalNonce);
  const { data: goalDetails } = useScaffoldReadContract({
    contractName: "Akuntabel",
    functionName: "getGoalDetails",
    args: [goalId],
  });

  if (!goalDetails) return null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_user, description, stake, _judges, requiredApprovals, currentApprovals, completed, fundsReleased] =
    goalDetails;

  return (
    <div className="grid grid-rows-4 md:grid-rows-1 grid-cols-1 md:grid-cols-4 border border-base-content p-4 rounded-lg items-center">
      <div>
        <p>Description: {description}</p>
        <p>Stake: {formatEther(stake)} ETH</p>
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

export const GoalsList = ({ address }: GoalsListProps) => {
  const { data: goalNonce } = useScaffoldReadContract({
    contractName: "Akuntabel",
    functionName: "goalNonce",
    args: [address],
  });
  return (
    <>
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Your Account</h2>
        <div className="flex items-center gap-2">
          <p>Address:</p>
          <Address address={address} format="long" />
        </div>
        <p>Goal Nonce: {Number(goalNonce)}</p>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">All Goals</h2>
        <ul className="space-y-4">
          {Array.from({ length: Number(goalNonce) }).map((_, index) => (
            <li key={index}>{address && <GoalSummary goalNonce={BigInt(index)} address={address} />}</li>
          ))}
        </ul>
      </div>
    </>
  );
};
