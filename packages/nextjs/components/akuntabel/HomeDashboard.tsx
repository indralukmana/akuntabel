import React from "react";
import Link from "next/link";
import { ListBulletIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

export const HomeDashboard = () => {
  return (
    <div className="mt-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold  mb-2">Akuntabel</h1>
        <p className="text-xl text-primary-focus">Start your epic journeys accelerated with Web3 🚀</p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link href="/goals/create" className="btn btn-primary btn-lg h-40 text-2xl font-bold rounded-2xl w-full">
          <PlusCircleIcon className="w-8 h-8 mr-4" />
          Create Goal
        </Link>

        <Link href="/goals" className="btn btn-primary btn-lg h-40 text-2xl font-bold rounded-2xl">
          <ListBulletIcon className="w-8 h-8 mr-4" />
          Goals
        </Link>
      </div>
    </div>
  );
};
