import * as React from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

const TargetIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg height={800} width={800} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" xmlSpace="preserve" {...props}>
    <style>{".st4{fill:#fff}"}</style>
    <g id="Layer_1">
      <circle
        cx={32}
        cy={32}
        r={32}
        style={{
          fill: "#4f5d73",
        }}
      />
      <g
        style={{
          opacity: 0.2,
        }}
      >
        <circle
          cx={32}
          cy={34}
          r={22}
          style={{
            fill: "#231f20",
          }}
        />
      </g>
      <path
        d="M32 52c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20"
        style={{
          fill: "#c75c5c",
        }}
      />
      <path
        className="st4"
        d="M32 14c9.9 0 18 8.1 18 18s-8.1 18-18 18-18-8.1-18-18 8.1-18 18-18m0-4c-12.2 0-22 9.8-22 22s9.8 22 22 22 22-9.8 22-22-9.8-22-22-22"
      />
      <path
        className="st4"
        d="M32 22c5.5 0 10 4.5 10 10s-4.5 10-10 10-10-4.5-10-10 4.5-10 10-10m0-4c-7.7 0-14 6.3-14 14s6.3 14 14 14 14-6.3 14-14-6.3-14-14-14"
      />
      <circle className="st4" cx={32} cy={32} r={5} />
    </g>
    <g id="Layer_2" />
  </svg>
);

const ETHIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={800} height={800} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g fill="none" fillRule="evenodd">
      <circle cx={16} cy={16} r={16} fill="#627EEA" />
      <g fill="#FFF" fillRule="nonzero">
        <path fillOpacity={0.602} d="M16.498 4v8.87l7.497 3.35z" />
        <path d="M16.498 4 9 16.22l7.498-3.35z" />
        <path fillOpacity={0.602} d="M16.498 21.968v6.027L24 17.616z" />
        <path d="M16.498 27.995v-6.028L9 17.616z" />
        <path fillOpacity={0.2} d="m16.498 20.573 7.497-4.353-7.497-3.348z" />
        <path fillOpacity={0.602} d="m9 16.22 7.498 4.353v-7.701z" />
      </g>
    </g>
  </svg>
);

const SocialIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={800} height={800} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" xmlSpace="preserve" {...props}>
    <style>
      {".st0{fill:none;stroke:#FFD700;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10}"}
    </style>
    <circle className="st0" cx={16} cy={7} r={3} />
    <circle className="st0" cx={7.3} cy={22} r={3} />
    <circle className="st0" cx={24.7} cy={22} r={3} />
    <path
      className="st0"
      d="M22.8 24.3C21 26 18.6 27 16 27s-5-1-6.8-2.7M19 7.5c4.1 1.3 7 5.1 7 9.5 0 .7-.1 1.4-.2 2.1m-19.6.1c-.1-.7-.2-1.4-.2-2.2 0-4.5 2.9-8.3 7-9.5"
    />
  </svg>
);

export function Hero() {
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <div className="text-center mb-12 animate-fade-in-up">
        <h1 className="text-5xl font-extrabold text-base-content mb-4">Akuntabel</h1>
        <p className="text-3xl font-extrabold text-base-content mb-4">Achieve Your Goals with Web3</p>
        <p className="text-xl text-base-content mb-8">
          Set goals, stake your ETH, and let the blockchain help you achieve them 🎯.
        </p>
        <RainbowKitCustomConnectButton
          buttonContent={
            <div className="flex items-center">
              Get Started
              <ChevronRightIcon className="ml-2 h-5 w-5" />
            </div>
          }
          buttonClassName="btn btn-primary btn-lg"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {[
          {
            Icon: TargetIcon,
            title: "Set Clear Goals",
            description: "Define your objectives and milestones with precision.",
          },
          {
            Icon: ETHIcon,
            title: "Stake Your ETH",
            description: "Put your ETH on the line for extra motivation.",
          },
          {
            Icon: SocialIcon,
            title: "Social Accountability",
            description: "Get your Web3 frens to help you achieve your goals.",
          },
        ].map((feature, index) => (
          <div
            key={index}
            className={`card bg-base-100 shadow-xl transform transition-all duration-300 hover:scale-105 animate-fade-in-up`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="card-body flex flex-col items-center justify-center">
              <feature.Icon width={48} height={48} className="text-base-content mb-4" />
              <h2 className="card-title text-xl font-bold">{feature.title}</h2>
              <p>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
