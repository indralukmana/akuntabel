"use client";

import { useRef } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

type MilestoneModalProps = {
  goalDescription: string;
  milestoneDescription: string;
  onConfirm: () => Promise<void>;
};

const MilestoneModal = ({ goalDescription, milestoneDescription, onConfirm }: MilestoneModalProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const openModal = () => {
    modalRef.current?.showModal();
  };

  const handleConfirm = async () => {
    await onConfirm();
    modalRef.current?.close();
  };

  return (
    <>
      <dialog id="finish_milestone_modal" className="modal" ref={modalRef}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Milestone Completion</h3>
          <p className="py-2">
            <strong>Goal:</strong> {goalDescription}
          </p>
          <p className="py-2">
            <strong>Milestone:</strong> {milestoneDescription}
          </p>
          <p className="py-4">Are you sure you want to mark this milestone as finished?</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-outline mr-2">Cancel</button>
            </form>
            <button className="btn btn-primary" onClick={() => handleConfirm()}>
              Confirm
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <button className="btn btn-sm w-fit btn-primary" onClick={() => openModal()}>
        Finish
      </button>
    </>
  );
};

interface GoalMilestonesProps {
  goalDescription: string;
  milestonesDescriptions: readonly string[] | undefined;
  milestonesAchieved: readonly boolean[] | undefined;
  goalId: bigint;
}

export function GoalMilestones({
  goalDescription,
  milestonesDescriptions,
  milestonesAchieved,
  goalId,
}: GoalMilestonesProps) {
  const { writeContractAsync: finishMilestone } = useScaffoldWriteContract("Akuntabel");

  const handleFinishMilestone = async (index: number) => {
    try {
      await finishMilestone({
        args: [goalId, BigInt(index)],
        functionName: "achieveMilestone",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="h-full pl-4">
      <h4 className="text-md font-semibold underline">Milestones</h4>
      <ol className="list-decimal">
        {milestonesDescriptions?.map((description, index) => {
          const achieved = milestonesAchieved?.[index];
          return (
            <li key={index + description} className="flex flex-col gap-2">
              <span>
                {description} - {achieved ? "Achieved" : "Not Achieved"}
              </span>
              {!achieved && (
                <>
                  <MilestoneModal
                    goalDescription={goalDescription}
                    milestoneDescription={description}
                    onConfirm={async () => await handleFinishMilestone(index)}
                  />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
