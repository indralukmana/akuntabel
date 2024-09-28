import Link from "next/link";
import type { NextPage } from "next";
import { Hex, isHex } from "viem";
import { GoalDetails } from "~~/components/akuntabel/GoalDetails";

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
      {/* <GoalApproval goalHash={goalHash} /> */}
      <GoalDetails goalHash={goalHash} />
    </div>
  );
};

export default GoalPage;
