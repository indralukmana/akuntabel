import React from "react";
import { Controller, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { Address, parseEther } from "viem";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import { AddressInput, EtherInput, InputBase } from "~~/components/scaffold-eth";
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

  const onSubmit: SubmitHandler<FormValues> = async data => {
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
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-4 space-y-6 border border-base-content rounded-xl p-4">
      <h2 className="text-xl font-semibold mb-2">Create New Goal</h2>

      <div className="space-y-4">
        <Controller
          name="description"
          control={control}
          rules={{ required: "Goal description is required" }}
          render={({ field }) => (
            <InputBase
              {...field}
              label="Goal Description"
              placeholder="Write your goal here"
              error={!!errors.description}
              errorMessage={errors.description?.message}
            />
          )}
        />

        <Controller
          name="stake"
          control={control}
          rules={{ required: "Stake is required" }}
          render={({ field }) => (
            <EtherInput {...field} label="Stake (in ETH)" error={!!errors.stake} errorMessage={errors.stake?.message} />
          )}
        />

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Judges</h3>
          {judgeFields.map((field, index) => (
            <div key={field.id} className="flex items-end space-x-2">
              <Controller
                name={`judges.${index}.address`}
                control={control}
                rules={{ required: "Judge address is required" }}
                render={({ field }) => (
                  <AddressInput
                    {...field}
                    label={`Judge Address ${index + 1}`}
                    placeholder="Enter judge address"
                    error={!!errors.judges?.[index]?.address}
                    errorMessage={errors.judges?.[index]?.address?.message}
                  />
                )}
              />
              {judgeFields.length > 1 && (
                <button type="button" onClick={() => removeJudge(index)} className="btn btn-error btn-sm mb-1">
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => appendJudge({ address: "" })} className="btn btn-secondary btn-sm">
            Add Judge
          </button>
        </div>

        <div className="grid grid-cols-[200px_70px_70px] items-end gap-2">
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
                label="Required Approvals"
                error={!!errors.requiredApprovals}
                errorMessage={errors.requiredApprovals?.message}
                onChange={newValue => onChange(Number(newValue))}
                value={value.toString()}
              />
            )}
          />
          <button
            type="button"
            className="btn btn-xs btn-primary mb-2"
            onClick={() => setValue("requiredApprovals", Math.max(1, requiredApprovals - 1))}
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="btn btn-xs btn-primary mb-2"
            onClick={() => setValue("requiredApprovals", Math.min(judgeFields.length, requiredApprovals + 1))}
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Milestones</h3>
          {milestoneFields.map((field, index) => (
            <div key={field.id} className="flex items-end space-x-2">
              <Controller
                name={`milestones.${index}.description`}
                control={control}
                rules={{ required: "Milestone description is required" }}
                render={({ field }) => (
                  <InputBase
                    {...field}
                    label={`Milestone ${index + 1}`}
                    placeholder="Enter milestone"
                    error={!!errors.milestones?.[index]?.description}
                    errorMessage={errors.milestones?.[index]?.description?.message}
                  />
                )}
              />
              {milestoneFields.length > 1 && (
                <button type="button" onClick={() => removeMilestone(index)} className="btn btn-error btn-sm mb-1">
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendMilestone({ description: "" })}
            className="btn btn-secondary btn-sm"
          >
            Add Milestone
          </button>
        </div>
      </div>
      <button type="submit" className="btn btn-primary" disabled={isCreatingGoal}>
        {isCreatingGoal ? "Creating Goal..." : "Create Goal"}
      </button>
    </form>
  );
};
