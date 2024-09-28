"use client";

import React from "react";
import { useEffect, useState } from "react";
import { Address } from "viem";
import { CheckCircleIcon, PencilSquareIcon, XMarkIcon } from "@heroicons/react/20/solid";

interface PersonalVisionProps {
  address: Address;
}

export const PersonalVision = ({ address }: PersonalVisionProps) => {
  const [vision, setVision] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedVision = localStorage.getItem(`vision_${address}`);
    if (storedVision) {
      setVision(storedVision);
    }
  }, [address]);

  const handleSave = () => {
    localStorage.setItem(`vision_${address}`, vision);
    setIsEditing(false);
  };

  return (
    <div className="space-y-2">
      {isEditing ? (
        <label className="flex gap-2 items-center input input-bordered">
          <input
            type="text"
            className="grow p-1 py-2 bg-transparent"
            value={vision}
            onChange={e => setVision(e.target.value)}
            placeholder="Write your vision here..."
          />
          <div className="flex justify-end space-x-2">
            <button className="btn btn-circle btn-outline btn-xs" onClick={() => setIsEditing(false)}>
              <XMarkIcon width={16} height={16} />
            </button>
            <button className="btn btn-circle btn-outline btn-xs" onClick={handleSave}>
              <CheckCircleIcon width={16} height={16} />
            </button>
          </div>
        </label>
      ) : (
        <div className="flex items-center justify-between gap-2">
          <p className="">{vision || "Write your vision here..."}</p>
          <button className="btn btn-circle btn-outline btn-xs" onClick={() => setIsEditing(true)}>
            <PencilSquareIcon width={16} height={16} />
          </button>
        </div>
      )}
    </div>
  );
};
