import type { NextPage } from "next";
import { Hex } from "viem";
import { GoalDetails } from "~~/components/scaffold-eth/Akuntabel/GoalDetails";

type GoalPageProps = {
  params: { goalId: Hex };
};

const GoalPage: NextPage<GoalPageProps> = ({ params }) => {
  const { goalId } = params;
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Goal Details</h1>
      <GoalDetails goalId={goalId} />
    </div>
  );
};

export default GoalPage;
