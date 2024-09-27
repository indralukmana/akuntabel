import { Address, Hex, encodePacked, keccak256 } from "viem";

export const getGoalHash = (userAddress: Address, nonce: number): Hex => {
  const encodedData = encodePacked(["address", "uint256"], [userAddress, BigInt(nonce)]);
  return keccak256(encodedData);
};
