import { Address as AddressType } from "viem";
import { NetworkInfo } from "~~/components/NetworkInfo";
import { Address, Balance } from "~~/components/scaffold-eth";

export const UserEthereum = ({ address }: { address: AddressType }) => {
  return (
    <div className="flex items-center justify-between flex-col md:flex-row">
      <Address address={address} format="short" />
      <Balance address={address} />
      <NetworkInfo />
    </div>
  );
};
