"use client";

import { useRef } from "react";
import { Hex } from "viem";
import { useAccount } from "wagmi";
import { CheckBadgeIcon } from "@heroicons/react/20/solid";
import { useGoalDetails } from "~~/hooks/akuntabel/useGoalDetails";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

type ApprovalModalProps = {
  description: string;
  handleApproveGoal: () => void;
  modalRef: React.RefObject<HTMLDialogElement>;
  isLoading: boolean;
};

const ApprovalModal = ({ description, handleApproveGoal, modalRef, isLoading }: ApprovalModalProps) => {
  return (
    <dialog id="approve_goal_modal" className="modal" ref={modalRef}>
      <div className="modal-box flex flex-col gap-4 items-center">
        <CheckBadgeIcon width={48} height={48} />

        <h3 className="font-bold text-3xl">Confirm Goal Approval</h3>
        <p className="font-semibold text-2xl py-4">{description}</p>
        <p className="">Are you sure you want to approve this goal?</p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-outline mr-2">Cancel</button>
          </form>
          <button className="btn btn-primary" onClick={handleApproveGoal} disabled={isLoading}>
            {isLoading ? "Approving..." : "Confirm"}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button disabled={isLoading}>close</button>
      </form>
    </dialog>
  );
};

type GoalApprovalProps = {
  goalHash: Hex;
};

const GoalApproval = ({ goalHash }: GoalApprovalProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const { address } = useAccount();
  const { writeContractAsync: approveGoal, isMining } = useScaffoldWriteContract("Akuntabel");

  const { goalDetails, isLoadingData, refetchGoalDetails } = useGoalDetails(goalHash);

  const { description, judges, verifiedApprovals, completed } = goalDetails ?? {};

  const judgeIndex = judges?.findIndex(judge => judge === address);
  const isJudge = judgeIndex !== undefined && judgeIndex !== -1;
  const alreadyApproved = judgeIndex !== undefined && verifiedApprovals?.[judgeIndex];

  if (!isJudge) return null;

  const openModal = () => {
    modalRef.current?.showModal();
  };

  const handleApproveGoal = async () => {
    try {
      await approveGoal({
        args: [goalHash],
        functionName: "approveGoal",
      });
      await refetchGoalDetails();
    } catch (error) {
      console.error(error);
    } finally {
      modalRef.current?.close();
    }
  };

  if (alreadyApproved) return null;

  return (
    <section className="rounded-lg border border-accent p-6 flex items-center justify-between gap-4">
      <div>
        <p className="mb-2">
          You are a judge for this goal. Please review the goal and approve it if it is valid. The fund will be released
          after the goal is completed and approved by the judges.
        </p>
        {!completed && (
          <p className="text-warning font-semibold">
            The goal milestones has not been achieved yet so approval is not activated
          </p>
        )}
      </div>
      <button className="btn btn-primary" onClick={openModal} disabled={!completed || isMining}>
        Approve Goal
      </button>
      <ApprovalModal
        description={description ?? ""}
        handleApproveGoal={handleApproveGoal}
        modalRef={modalRef}
        isLoading={isMining || isLoadingData}
      />
    </section>
  );
};

export default GoalApproval;
