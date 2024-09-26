"use client";

import { useRef } from "react";
import { Hex } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

type ApprovalModalProps = {
  description: string;
  handleApproveGoal: () => void;
  modalRef: React.RefObject<HTMLDialogElement>;
};

const ApprovalModal = ({ description, handleApproveGoal, modalRef }: ApprovalModalProps) => {
  return (
    <dialog id="approve_goal_modal" className="modal" ref={modalRef}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Confirm Goal Approval</h3>
        <p className="py-2">
          <strong>Goal:</strong> {description}
        </p>
        <p className="py-4">Are you sure you want to approve this goal?</p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-outline mr-2">Cancel</button>
          </form>
          <button className="btn btn-primary" onClick={handleApproveGoal}>
            Confirm
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

type GoalApprovalProps = {
  goalId: Hex;
};

const GoalApproval = ({ goalId }: GoalApprovalProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const { address } = useAccount();
  const { writeContractAsync: approveGoal } = useScaffoldWriteContract("Akuntabel");

  const { data: goalDetails } = useScaffoldReadContract({
    contractName: "Akuntabel",
    functionName: "getGoalDetails",
    args: [goalId],
  });

  if (!goalDetails) return null;

  const { description, judges, approvals, completed } = goalDetails;

  if (!address) return <p>Loading address...</p>;

  const judgeIndex = judges.findIndex(judge => judge === address);
  const isJudge = judgeIndex !== -1;
  const alreadyApproved = approvals.includes(address);

  if (!isJudge) return null;

  const openModal = () => {
    modalRef.current?.showModal();
  };

  const handleApproveGoal = async () => {
    try {
      await approveGoal({
        args: [goalId],
        functionName: "approveGoal",
      });
    } catch (error) {
      console.error(error);
    } finally {
      modalRef.current?.close();
    }
  };

  if (alreadyApproved) return null;

  return (
    <section className="rounded-lg border border-base-content p-4">
      <h2 className="text-xl font-semibold mb-4">Goal Approval</h2>
      <p className="mb-4">
        You are requested to verify the goal. Please review the goal and approve it if it is valid. The fund will be
        released after the goal is completed and approved by the judges.
      </p>
      {!completed && (
        <p className="text-warning font-semibold">
          The goal milestones has not been achieved yet so approval is not activated
        </p>
      )}
      <button className="btn btn-primary" onClick={openModal} disabled={!completed}>
        Approve Goal
      </button>
      <ApprovalModal description={description} handleApproveGoal={handleApproveGoal} modalRef={modalRef} />
    </section>
  );
};

export default GoalApproval;
