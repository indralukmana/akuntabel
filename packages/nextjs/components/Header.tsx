"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, ListBulletIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
    icon: <HomeIcon className="w-4 h-4" />,
  },
  {
    label: "Goals",
    href: "/goals",
    icon: <ListBulletIcon className="w-4 h-4" />,
  },
  {
    label: "Create Goal",
    href: "/goals/create",
    icon: <PlusCircleIcon className="w-4 h-4" />,
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "bg-secondary shadow-md" : "bg-accent"
              } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  return (
    <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 justify-between z-20 shadow-md shadow-secondary px-2 flex w-full">
      <div className="">
        <Link href="/" passHref className="flex items-center gap-2 ml-4 mr-6 shrink-0">
          <div className="flex relative w-10 h-10">
            <Image alt="Akuntabel logo" className="cursor-pointer" fill src="/logo.svg" />
          </div>
          <h1 className="flex flex-col m-0 p-0">
            <span className="font-bold leading-tight">Akuntabel</span>
            <span className="text-xs">Web3 Goal App</span>
          </h1>
        </Link>
      </div>
      <ul className="menu menu-horizontal flex-1 md:space-x-4">
        <HeaderMenuLinks />
      </ul>
      <div className="flex flex-col-reverse md:flex-row gap-2">
        <RainbowKitCustomConnectButton />
        <FaucetButton />
      </div>
    </div>
  );
};
