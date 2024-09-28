"use client";

import React from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { GoalsList } from "~~/components/akuntabel/GoalsList";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

const GoalsPage: NextPage = () => {
  const { address, isConnecting, isReconnecting } = useAccount();

  const isLoadingAddress = isConnecting || isReconnecting;

  if (isLoadingAddress) {
    return (
      <div className="w-full h-full grid place-items-center">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <p>Connect your wallet to view your ✨ epic goals ✨</p>
        <RainbowKitCustomConnectButton
          buttonContent={<div className="flex items-center">Start 🚀</div>}
          buttonClassName="btn btn-primary btn-lg"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 flex-1 grid items-start">
      <GoalsList address={address} />
    </div>
  );
};

export default GoalsPage;
