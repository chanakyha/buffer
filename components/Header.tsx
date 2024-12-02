"use client";

import ThemeToggler from "./ThemeToggler";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Buffer from "../assets/buffer.png";
import Image from "next/image";
import {
  ConnectButton,
  useAutoConnectWallet,
  useCurrentWallet,
} from "@mysten/dapp-kit";

const Header = () => {
  const { connectionStatus } = useCurrentWallet();

  const isconnected = connectionStatus === "connected";

  const navelem = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard", hidden: !isconnected },
  ];
  const pathname = usePathname();
  return (
    <div className="flex items-center justify-between w-full p-4 bg-slate-100 dark:bg-stone-900">
      <div className="flex flex-row gap-x-16">
        <div>
          <Image src={Buffer} alt="logoimg" className="w-32 h-10" />
        </div>
        <div className="flex flex-row items-center gap-x-8">
          {navelem.map((elem) => {
            return (
              <Link
                hidden={elem.hidden}
                href={elem.href}
                key={elem.href}
                className={pathname === elem.href ? "text-blue-600" : ""}
              >
                <h2>{elem.label}</h2>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="flex flex-row items-center gap-x-8">
        <ConnectButton className="w-full bg-blue-700" />

        <ThemeToggler />
      </div>
    </div>
  );
};

export default Header;
