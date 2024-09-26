import type { NextPage } from "next";
import GoalApproval from "~~/components/scaffold-eth/Akuntabel/GoalApproval";
import { GoalDetails } from "~~/components/scaffold-eth/Akuntabel/GoalDetails";

type GoalPageProps = {
  params: { goalId: bigint };
};

const GoalPage: NextPage<GoalPageProps> = ({ params }) => {
  const { goalId } = params;
  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold ">Goal Details</h1>
      <GoalApproval goalId={goalId} />
      <GoalDetails goalId={goalId} />
    </div>
  );
};

export default GoalPage;
