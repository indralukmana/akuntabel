"use client";

import { useRef } from "react";
import { Hex } from "viem";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

type MilestoneModalProps = {
  description: string;
  milestone: string;
  selectedMilestoneRef: React.RefObject<number | null>;
  handleFinishMilestone: () => void;
  modalRef: React.RefObject<HTMLDialogElement>;
};

const MilestoneModal = ({
  description,
  milestone,
  selectedMilestoneRef,
  handleFinishMilestone,
  modalRef,
}: MilestoneModalProps) => {
  return (
    <dialog id="finish_milestone_modal" className="modal" ref={modalRef}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Confirm Milestone Completion</h3>
        <p className="py-2">
          <strong>Goal:</strong> {description}
        </p>
        {selectedMilestoneRef.current !== null && (
          <p className="py-2">
            <strong>Milestone:</strong> {milestone}
          </p>
        )}
        <p className="py-4">Are you sure you want to mark this milestone as finished?</p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-outline mr-2">Cancel</button>
          </form>
          <button className="btn btn-primary" onClick={handleFinishMilestone}>
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

interface GoalMilestonesProps {
  description: string;
  milestones: [string[], boolean[]];
  goalId: Hex;
}

export function GoalMilestones({ description, milestones, goalId }: GoalMilestonesProps) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const selectedMilestoneRef = useRef<number | null>(null);
  const { writeContractAsync: finishMilestone } = useScaffoldWriteContract("Akuntabel");

  const openModal = (index: number) => {
    selectedMilestoneRef.current = index;
    modalRef.current?.showModal();
  };

  const handleFinishMilestone = async (index: number) => {
    if (selectedMilestoneRef.current !== null) {
      try {
        await finishMilestone({
          args: [goalId, BigInt(index)],
          functionName: "achieveMilestone",
        });
        modalRef.current?.close();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <section className="h-full pl-4">
      <h4 className="text-md font-semibold underline">Milestones</h4>
      <ol className="list-decimal">
        {milestones[0].map((milestoneDescription, index) => {
          const isAchieved = milestones[1][index];
          return (
            <li key={index} className="flex flex-col gap-2">
              <span>
                {milestoneDescription} - {isAchieved ? "Achieved" : "Not Achieved"}
              </span>
              {!isAchieved && (
                <>
                  <button className="btn btn-sm w-fit btn-primary" onClick={() => openModal(index)}>
                    Finish
                  </button>
                  <MilestoneModal
                    description={description}
                    milestone={milestoneDescription}
                    selectedMilestoneRef={selectedMilestoneRef}
                    handleFinishMilestone={() => handleFinishMilestone(index)}
                    modalRef={modalRef}
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
