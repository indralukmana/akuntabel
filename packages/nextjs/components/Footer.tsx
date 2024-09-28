import React from "react";
import { hardhat } from "viem/chains";
import { SwitchTheme } from "~~/components/SwitchTheme";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={800} height={800} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" {...props}>
    <path d="M12 2.247a10 10 0 0 0-3.162 19.487c.5.088.687-.212.687-.475 0-.237-.012-1.025-.012-1.862-2.513.462-3.163-.613-3.363-1.175a3.64 3.64 0 0 0-1.025-1.413c-.35-.187-.85-.65-.013-.662a2 2 0 0 1 1.538 1.025 2.137 2.137 0 0 0 2.912.825 2.1 2.1 0 0 1 .638-1.338c-2.225-.25-4.55-1.112-4.55-4.937a3.9 3.9 0 0 1 1.025-2.688 3.6 3.6 0 0 1 .1-2.65s.837-.262 2.75 1.025a9.43 9.43 0 0 1 5 0c1.912-1.3 2.75-1.025 2.75-1.025a3.6 3.6 0 0 1 .1 2.65 3.87 3.87 0 0 1 1.025 2.688c0 3.837-2.338 4.687-4.562 4.937a2.37 2.37 0 0 1 .674 1.85c0 1.338-.012 2.413-.012 2.75 0 .263.187.575.687.475A10.005 10.005 0 0 0 12 2.247" />
  </svg>
);

/**
 * Site footer
 */
export const Footer = () => {
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  return (
    <div className="bg-base-100 shadow-md shadow-secondary sticky flex flex-col space-y-2 md:space-y-0 md:flex-row justify-between items-center w-full z-10 p-4 bottom-0 left-0 text-sm">
      <a
        href="https://github.com/indralukmana/akuntabel"
        target="_blank"
        rel="noreferrer"
        className="link flex items-center gap-2"
      >
        <Github width={16} height={16} /> Fork me
      </a>
      <div className="flex justify-center items-center gap-2  ">
        <div className="flex justify-center items-center gap-2">
          Built with 🫶 by{" "}
          <a href="https://indralukmana.com" target="_blank" rel="noreferrer" className="link">
            Indra Lukmana
          </a>
        </div>
      </div>
      <SwitchTheme className={`pointer-events-auto ${isLocalNetwork ? "self-end md:self-auto" : ""}`} />
    </div>
  );
};
