"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { GoalForm } from "~~/components/akuntabel/GoalForm";
import { GoalsList } from "~~/components/akuntabel/GoalsList";
import { Hero } from "~~/components/akuntabel/Hero";

const Home: NextPage = () => {
  const { address, isConnecting, isReconnecting } = useAccount();

  const isLoadingAddress = isConnecting || isReconnecting;

  return (
    <div className="container mx-auto p-4 flex-1">
      {!address && <Hero />}
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
