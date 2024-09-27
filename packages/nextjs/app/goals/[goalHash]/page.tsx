import Link from "next/link";
import type { NextPage } from "next";
import { Hex, isHex } from "viem";
import GoalApproval from "~~/components/scaffold-eth/Akuntabel/GoalApproval";
import { GoalDetails } from "~~/components/scaffold-eth/Akuntabel/GoalDetails";

type GoalPageProps = {
  params: { goalHash: Hex };
};

const GoalPage: NextPage<GoalPageProps> = ({ params }) => {
  const { goalHash } = params;
  if (!isHex(goalHash)) {
    return (
      <div>
        <p>Invalid goal hash</p>
        <Link href="/">Go back to home</Link>
      </div>
    );
  }
  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold ">Goal Details</h1>
      <GoalApproval goalHash={goalHash} />
      <GoalDetails goalHash={goalHash} />
    </div>
  );
};

export default GoalPage;
