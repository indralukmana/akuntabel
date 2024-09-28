import React from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Address, parseEther } from "viem";
import { TrashIcon } from "@heroicons/react/20/solid";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import { Bow } from "~~/components/icons/Bow";
import { Target2 } from "~~/components/icons/Target2";
import { AddressInput, InputBase } from "~~/components/scaffold-eth";
import { useGoalNonce } from "~~/hooks/akuntabel/useGoalNonce";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

interface FormValues {
  description: string;
  judges: { address: string }[];
  milestones: { description: string }[];
  requiredApprovals: number;
  stake: string;
}

export const GoalForm = ({ address }: { address: Address }) => {
  const { writeContractAsync, isMining } = useScaffoldWriteContract("Akuntabel");
  const { isLoadingGoalNonce, refetchGoalNonce } = useGoalNonce(address);

  const isCreatingGoal = isMining || isLoadingGoalNonce;

  const {
    control,
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
      stake: "",
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
      await refetchGoalNonce();
      notification.success("Goal created successfully!");
      reset();
    } catch (error) {
      console.error("Error creating goal:", error);
      notification.error("Error creating goal. Check console for details.");
    }
  });

  return (
    <form onSubmit={onSubmit} className="card w-full bg-base-100 shadow-xl overflow-hidden">
      <h2 className="card-title justify-center text-2xl p-6 font-bold flex items-center bg-blue-400 dark:bg-primary text-primary-content">
        <Bow width={32} height={32} />
        Create Your Ambitious Goal
        <Target2 width={32} height={32} />
      </h2>

      <div className="card-body">
        <div className="space-y-6">
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

          <section className="space-y-4 w-full">
            <h3 className="label-text font-semibold text-lg">Judges</h3>
            <ul className="space-y-2 list-none">
              {judgeFields.map((field, index) => (
                <li key={field.id}>
                  <div className="w-full flex flex-col items-center">
                    <Controller
                      name={`judges.${index}.address`}
                      control={control}
                      rules={{ required: "Judge address is required" }}
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
                              <button type="button" onClick={() => removeJudge(index)} className="btn btn-error btn-sm">
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
            <button
              type="button"
              onClick={() => appendJudge({ address: "" })}
              className="btn btn-secondary btn-square w-full rounded-full"
            >
              Add Another Judge
            </button>
          </section>

          <div className="form-control">
            <label className="label font-semibold text-lg">Required Approvals</label>
            <div className="flex items-center justify-center space-x-4 bg-blue-400 dark:bg-neutral-400 p-4 rounded-lg">
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

          <div className="space-y-4">
            <h3 className="label font-semibold text-lg">Milestones</h3>
            <ol className="space-y-2">
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
                              onClick={() => removeMilestone(index)}
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
            <button
              type="button"
              onClick={() => appendMilestone({ description: "" })}
              className="btn btn-secondary btn-sm"
            >
              Add Milestone
            </button>
          </div>
        </div>

        <div className="card-actions justify-end mt-6">
          <button type="submit" className="btn btn-primary" disabled={isCreatingGoal}>
            {isCreatingGoal ? "Creating Goal..." : "Create Goal"}
          </button>
        </div>
      </div>
    </form>
  );
};
