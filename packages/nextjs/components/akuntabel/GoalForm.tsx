import React from "react";
import Link from "next/link";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Address as AddressType, parseEther } from "viem";
import { TrashIcon } from "@heroicons/react/20/solid";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import { RandomMotivation } from "~~/components/akuntabel/RandomMotivation";
import { UserEthereum } from "~~/components/akuntabel/UserEthereum";
import { Bow } from "~~/components/icons/Bow";
import { Target2 } from "~~/components/icons/Target2";
import { AddressInput, InputBase } from "~~/components/scaffold-eth";
import { useGoalNonce } from "~~/hooks/akuntabel/useGoalNonce";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { getGoalHash } from "~~/utils/akutabel/getGoalHash";
import { notification } from "~~/utils/scaffold-eth";

interface FormValues {
  description: string;
  judges: { address: string }[];
  milestones: { description: string }[];
  requiredApprovals: number;
  stake: string;
}

export const GoalForm = ({ address }: { address: AddressType }) => {
  const { writeContractAsync, isMining } = useScaffoldWriteContract("Akuntabel");
  const { isLoadingGoalNonce, refetchGoalNonce } = useGoalNonce(address);

  const isCreatingGoal = isMining || isLoadingGoalNonce;

  const {
    control,
    trigger,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      description: "",
      judges: [{ address: "" }],
      milestones: [{ description: "" }],
      requiredApprovals: 1,
      stake: "0.01",
    },
  });

  const {
    fields: judgeFields,
    append: appendJudge,
    remove: removeJudge,
  } = useFieldArray({
    control,
    name: "judges",
  });

  // Add this function to check for duplicate addresses
  const isDuplicateAddress = (judgeAddress: string, index: number) => {
    return judgeFields.some(
      (field, idx) => idx !== index && field.address.toLowerCase() === judgeAddress.toLowerCase(),
    );
  };

  const {
    fields: milestoneFields,
    append: appendMilestone,
    remove: removeMilestone,
  } = useFieldArray({
    control,
    name: "milestones",
  });

  const requiredApprovals = watch("requiredApprovals");

  const onSubmit = handleSubmit(async data => {
    try {
      await writeContractAsync({
        functionName: "createGoal",
        args: [
          data.description,
          data.judges.map(judge => judge.address),
          data.milestones.map(milestone => milestone.description),
          data.requiredApprovals,
        ],
        value: parseEther(data.stake),
      });
      const { data: goalNonce } = await refetchGoalNonce();
      const goalHash = getGoalHash(address, Number(goalNonce) - 1);
      const successToast = notification.success(
        <div className="grid grid-cols-[max-content_max-content] gap-2 w-full items-center">
          <p>Goal Created 🚀</p>
          <Link
            href={`/goals/${goalHash}`}
            onClick={() => notification.remove(successToast)}
            className="btn btn-primary btn-sm"
          >
            View Goal
          </Link>
        </div>,
        { duration: 10000 },
      );
      reset();
    } catch (error) {
      console.error("Error creating goal:", error);
      notification.error("Error creating goal. Check console for details.");
    }
  });

  return (
    <form onSubmit={onSubmit} className="card w-full bg-base-100 shadow-xl overflow-hidden min-h-[770px]">
      <h2 className="m-0 card-title justify-center md:text-2xl p-6 font-bold flex items-center bg-blue-400 dark:bg-primary text-primary-content flex-col md:flex-row gap-2">
        <Bow width={32} height={32} />
        <span>Create Your</span> <span>Ambitious Goal</span>
        <Target2 width={32} height={32} />
      </h2>

      <div className="card-body flex flex-col md:flex-row w-full ">
        <div className="flex-1 flex flex-col space-y-4">
          <UserEthereum address={address} />
          <div className="flex-1">
            <RandomMotivation />
          </div>
          <Controller
            name="description"
            control={control}
            rules={{ required: "Goal description is required" }}
            render={({ field }) => (
              <div className="form-control">
                <label className="label" htmlFor={field.name}>
                  <span className="label-text font-semibold text-lg">What is your ambitious goal?</span>
                </label>
                <InputBase
                  {...field}
                  placeholder="e.g. I want to run every day for 100 days"
                  error={!!errors.description}
                  errorMessage={errors.description?.message}
                />
              </div>
            )}
          />
          <Controller
            name="stake"
            control={control}
            rules={{ required: "Stake is required" }}
            render={({ field }) => (
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-lg">Stake Amount</span>
                </label>
                <div className=" items-center justify-end grid grid-cols-[1fr_max-content] gap-2">
                  <input
                    type="range"
                    min={0.01}
                    max="1"
                    step="0.01"
                    className="range [--range-shdw:#627EEA]"
                    {...field}
                  />
                  <div className="badge badge-primary badge-lg w-24 grid grid-cols-[max-content_1fr] items-center text-center">
                    <span>ETH</span>
                    {field.value}
                  </div>
                </div>
              </div>
            )}
          />
          <div>
            <label className="label font-semibold text-lg">Required Approvals</label>
            <div className="flex items-center justify-center space-x-4 bg-accent p-4 rounded-lg">
              <button
                type="button"
                className="btn rounded-lg btn-square btn-sm"
                onClick={() => setValue("requiredApprovals", Math.max(1, requiredApprovals - 1))}
              >
                <MinusIcon className="h-4 w-4" />
              </button>
              <Controller
                name="requiredApprovals"
                control={control}
                rules={{
                  required: "Required approvals is required",
                  min: { value: 1, message: "Minimum required approvals is 1" },
                  max: { value: judgeFields.length, message: `Maximum required approvals is ${judgeFields.length}` },
                }}
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <InputBase
                    {...fieldProps}
                    error={!!errors.requiredApprovals}
                    errorMessage={errors.requiredApprovals?.message}
                    onChange={newValue => onChange(Number(newValue))}
                    value={value.toString()}
                    wrapperClassName="!w-20"
                    inputClassName="text-center"
                  />
                )}
              />

              <button
                type="button"
                className="btn rounded-lg btn-square btn-sm"
                onClick={() => setValue("requiredApprovals", Math.min(judgeFields.length, requiredApprovals + 1))}
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="divider md:divider-horizontal" />

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="label-text font-semibold text-lg">Judges</h3>
            <ul className="space-y-2 list-none max-h-[420px] overflow-y-auto overflow-x-hidden">
              {judgeFields.map((field, index) => (
                <li key={field.id}>
                  <div className="w-full flex flex-col items-center">
                    <Controller
                      name={`judges.${index}.address`}
                      control={control}
                      rules={{
                        required: "Judge address is required",
                        validate: value => !isDuplicateAddress(value, index) || "Duplicate judge address",
                      }}
                      render={({ field }) => (
                        <div className="flex flex-col items-center w-full">
                          <label className="sr-only" htmlFor={field.name}>
                            Judge Address {index + 1}
                          </label>
                          <div className="flex items-center space-x-2 w-full">
                            <AddressInput
                              {...field}
                              placeholder={`Judge ${index + 1} Address `}
                              error={!!errors.judges?.[index]?.address}
                            />
                            {judgeFields.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  removeJudge(index);
                                  trigger("judges");
                                }}
                                className="btn btn-error btn-sm"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    />
                    {errors.judges?.[index]?.address?.message && (
                      <p className="text-warning text-sm">{errors.judges?.[index]?.address?.message}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            onClick={() => appendJudge({ address: "" })}
            className="btn btn-secondary w-full rounded-full text-lg mt-2 md:mt-0"
          >
            Add Another Judge
          </button>
        </div>

        <div className="divider md:divider-horizontal" />
        <section className="flex-1 flex flex-col justify-between">
          <div className="flex flex-col space-y-2">
            <h3 className="label font-semibold text-lg p-0 m-0">Milestones</h3>
            <ol className="space-y-2 list-none max-h-[420px] overflow-y-auto overflow-x-hidden">
              {milestoneFields.map((field, index) => (
                <li key={field.id} className="flex items-end space-x-2">
                  <div className="w-full flex flex-col items-center">
                    <Controller
                      name={`milestones.${index}.description`}
                      control={control}
                      rules={{ required: "Milestone description is required" }}
                      render={({ field }) => (
                        <div className="flex items-center space-x-2 w-full">
                          <div className="badge badge-accent badge-lg">{index + 1}</div>
                          <label className="sr-only" htmlFor={field.name}>
                            Milestone {index + 1}
                          </label>
                          <InputBase
                            {...field}
                            placeholder={`Enter milestone ${index + 1}`}
                            error={!!errors.milestones?.[index]?.description}
                          />
                          {milestoneFields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                removeMilestone(index);
                                trigger("milestones");
                              }}
                              className="btn btn-error btn-sm"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      )}
                    />
                    {errors.milestones?.[index]?.description?.message && (
                      <p className="text-warning text-sm">{errors.milestones?.[index]?.description?.message}</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <button
            type="button"
            onClick={() => appendMilestone({ description: "" })}
            className="btn btn-secondary w-full rounded-full text-lg mt-2 md:mt-0"
          >
            Add Milestone
          </button>
        </section>
      </div>
      <div className="card-actions p-8 flex justify-center w-full">
        <button type="submit" className="btn btn-primary w-full text-xl" disabled={isCreatingGoal}>
          {isCreatingGoal ? "Creating Goal..." : "✨ Create Goal ✨"}
        </button>
      </div>
    </form>
  );
};
