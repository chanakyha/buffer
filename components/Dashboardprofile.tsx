"use client";
import { formatAddress } from "@/lib/utils";
import {
  useCurrentAccount,
  useCurrentWallet,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";

import Image from "next/image";
import { Button } from "./ui/button";
import { Transaction } from "@mysten/sui/transactions";

const Dashboardprofile = () => {
  const account = useCurrentAccount();
  const { connectionStatus } = useCurrentWallet();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const riskMan = async () => {
    try {
      const tx = new Transaction();

      tx.moveCall({
        target:
          "0x236d6624fb9125cda7e8ddbf6e7b428932ebd142ac72140301f773b2427e4119::donation_manager::get_streamer_balance",

        arguments: [
          tx.object(
            "0x5d36a552995ce40065e9f476c24ad6a7e6a1c24109b283370c00985cdff94421"
          ),
          tx.object(account?.address!),
        ],
      });

      const response = await signAndExecuteTransaction(
        {
          // @ts-ignore
          transaction: tx,
          chain: "sui:devnet",
        },

        {
          onSuccess: (result) => {
            console.log("executed transaction", result);
          },
          onError: (error) => {
            console.log("error", error);
          },
        }
      );
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="bg-[#191919] w-1/3 gap-5 items-center p-4 flex flex-col">
      <div className="flex items-center justify-center">
        {connectionStatus === "connected" && (
          <div className="flex flex-col items-center gap-5">
            <Image
              src={`https://robohash.org/${account?.address}?set=set2`}
              width={1920}
              height={1080}
              alt="PROFILE IMAGE"
              className="w-64 h-64 bg-yellow-300 rounded-full hover:border-4 hover:border-blue-700 border-foreground/20 hover:shadow-xl hover:shadow-blue-700/25"
            />
            <h1>{formatAddress(account?.address!)}</h1>
          </div>
        )}
      </div>

      <div className="bg-[#121212] p-3 w-full flex flex-col items-stretch gap-5">
        <h1 className="text-lg text-center">
          Payout Balance Left: {"   "}
          <span className="w-4 h-4 px-2 py-1 text-sm font-bold bg-blue-500 rounded-xl">
            5 SUI
          </span>
        </h1>
        <Button
          onClick={riskMan}
          className="border-transparent"
          variant={"destructive"}
        >
          Payout
        </Button>
      </div>
    </div>
  );
};

export default Dashboardprofile;
