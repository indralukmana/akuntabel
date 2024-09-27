"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { GoalForm } from "~~/components/scaffold-eth/Akuntabel/GoalForm";
import { GoalsList } from "~~/components/scaffold-eth/Akuntabel/GoalsList";

const Home: NextPage = () => {
  const { address, isConnecting, isReconnecting } = useAccount();

  const isLoadingAddress = isConnecting || isReconnecting;

  return (
    <div className="container mx-auto p-4">
      {!address && <p>Connect your wallet to start</p>}
      {!isLoadingAddress && address && (
        <>
          <GoalForm address={address} />
          <GoalsList address={address} />
        </>
      )}
    </div>
  );
};

export default Home;
