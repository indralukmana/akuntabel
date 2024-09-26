"use client";

import { useRef } from "react";
import { Hex } from "viem";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

type MilestoneModalProps = {
  goalDescription: string;
  milestoneDescription: string;
  handleFinishMilestone: () => Promise<void>;
};

const MilestoneModal = ({ goalDescription, milestoneDescription, handleFinishMilestone }: MilestoneModalProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const openModal = () => {
    modalRef.current?.showModal();
  };

  console.log({ goalDescription, milestoneDescription });
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
            <button className="btn btn-primary" onClick={handleFinishMilestone}>
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
  milestones: { description: string; achieved: boolean }[];
  goalId: Hex;
}

export function GoalMilestones({ goalDescription, milestones, goalId }: GoalMilestonesProps) {
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
        {milestones.map((milestone, index) => {
          const { description, achieved } = milestone;
          console.log({ milestone });
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
                    handleFinishMilestone={async () => await handleFinishMilestone(index)}
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
