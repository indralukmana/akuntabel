"use client";

import { useRef, useState } from "react";
import { Hex } from "viem";
import { RocketLaunchIcon } from "@heroicons/react/20/solid";
import { BoltIcon, ChevronDoubleDownIcon, ChevronDoubleUpIcon } from "@heroicons/react/24/outline";
import { useGoalDetails } from "~~/hooks/akuntabel/useGoalDetails";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

type MilestoneModalProps = {
  goalDescription: string;
  milestoneDescription: string;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
};

const MilestoneModal = ({ goalDescription, milestoneDescription, onConfirm, isLoading }: MilestoneModalProps) => {
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
        <div className="modal-box flex flex-col gap-4 items-center">
          <RocketLaunchIcon width={48} height={48} />
          <h3 className="font-bold text-3xl">Milestone Completed?</h3>
          <p className="font-semibold text-2xl">{goalDescription}</p>
          <p className="text-xl">{milestoneDescription}</p>
          <p className="">Are you sure you want to mark this milestone as finished?</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-outline mr-2">Cancel</button>
            </form>
            <button className="btn btn-primary" onClick={() => handleConfirm()} disabled={isLoading}>
              {isLoading ? "Finishing..." : "Confirm"}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button disabled={isLoading}>close</button>
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
  goalHash: Hex;
}

export function GoalMilestones({
  goalDescription,
  milestonesDescriptions,
  milestonesAchieved,
  goalHash,
}: GoalMilestonesProps) {
  const { writeContractAsync: finishMilestone, isMining } = useScaffoldWriteContract("Akuntabel");
  const { refetchGoalDetails, isLoadingData } = useGoalDetails(goalHash);

  const handleFinishMilestone = async (index: number) => {
    try {
      await finishMilestone({
        args: [goalHash, BigInt(index)],
        functionName: "achieveMilestone",
      });
      await refetchGoalDetails();
      notification.success("Milestone finished 🚀!");
    } catch (error) {
      notification.error("Error finishing milestone. Check console for details.");
      console.error(error);
    }
  };

  const milestonesCompleted = milestonesAchieved?.filter(Boolean).length ?? 0;
  const milestonesCount = milestonesDescriptions?.length ?? 0;

  const isCompleted = milestonesCompleted === milestonesCount;

  console.log({ milestonesCompleted, milestonesCount });

  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="card card-body bg-base-100">
      <div className="grid grid-cols-[max-content_1fr] items-center gap-6 mb-8">
        <h3 className="flex items-center gap-2 text-lg font-semibold m-0">
          <BoltIcon width={24} height={24} /> Goal Milestones
        </h3>
        <progress
          className={`progress p-0 m-0 w-full ${isCompleted ? "progress-success" : "progress-warning"}`}
          value={milestonesCompleted}
          max={milestonesCount}
        >
          {milestonesCompleted} / {milestonesCount}
        </progress>
      </div>
      <div className="collapse">
        <input type="checkbox" checked={isOpen} onChange={() => setIsOpen(!isOpen)} />
        <div className="collapse-title font-medium flex justify-center gap-2 w-full">
          {isOpen ? <ChevronDoubleUpIcon width={24} height={24} /> : <ChevronDoubleDownIcon width={24} height={24} />}
        </div>
        <div className="collapse-content">
          <ol className="space-y-4">
            {milestonesDescriptions?.map((description, index) => {
              const isAchieved = milestonesAchieved?.[index];
              return (
                <li
                  key={index + description}
                  className={`card ${isAchieved ? "bg-green-500 text-success-content" : "bg-base-200"}`}
                >
                  <div className="flex justify-between card-body flex-col items-center gap-4 p-4 md:flex-row">
                    <span
                      className={`badge badge-lg  rounded-full h-10 w-10 ${
                        isAchieved ? "bg-success text-success-content" : "bg-base-200"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <p className="flex items-center gap-2 m-0">{description}</p>
                    {!isAchieved && (
                      <>
                        <MilestoneModal
                          goalDescription={goalDescription}
                          milestoneDescription={description}
                          onConfirm={async () => await handleFinishMilestone(index)}
                          isLoading={isMining || isLoadingData}
                        />
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
