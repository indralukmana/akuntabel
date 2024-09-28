import * as React from "react";
import { useNetworkColor } from "~~/hooks/scaffold-eth/useNetworkColor";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

export const NetworkInfo = () => {
  const { targetNetwork } = useTargetNetwork();
  const networkColor = useNetworkColor();
  return <span style={{ color: networkColor }}>{targetNetwork.name}</span>;
};
