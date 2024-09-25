import { encodePacked, keccak256 } from "viem";

function generateGoalId(userAddress: string, nonce: bigint) {
  const packed = encodePacked(["address", "uint256"], [userAddress, nonce]);
  return keccak256(packed);
}

export { generateGoalId };
