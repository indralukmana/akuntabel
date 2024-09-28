"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Hero } from "~~/components/akuntabel/Hero";
import { HomeDashboard } from "~~/components/akuntabel/HomeDashboard";

const Home: NextPage = () => {
  const { address, isConnecting, isReconnecting } = useAccount();

  const isLoadingAddress = isConnecting || isReconnecting;

  return (
    <div className="container mx-auto p-4 flex-1">
      {!address && <Hero />}
      {!isLoadingAddress && address && (
        <>
          <HomeDashboard />
        </>
      )}
    </div>
  );
};

export default Home;
