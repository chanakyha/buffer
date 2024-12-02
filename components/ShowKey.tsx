"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Copy } from "lucide-react";
import { Transaction } from "@mysten/sui/transactions";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { DialogTitle } from "@radix-ui/react-dialog";
import { createIngress } from "@/lib/ingress";
import { IngressInput } from "livekit-server-sdk";
import toast from "react-hot-toast";
import {
  useCurrentAccount,
  useCurrentWallet,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";

const ShowKey = () => {
  const { connectionStatus } = useCurrentWallet();
  const [streamURL, setStreamURL] = useState<string>();
  const [secretKey, setSecretKey] = useState<string>();
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const RTMP = String(IngressInput.RTMP_INPUT);

  useEffect(() => {
    if (connectionStatus === "disconnected") {
      setStreamURL("");
      setSecretKey("");
    }
    if (connectionStatus == "disconnected" || connectionStatus == "connecting")
      return;

    const docRef = doc(db, "users", account?.address!);

    const unsub = onSnapshot(docRef, (result) => {
      if (result.exists()) {
        const data = result.data();

        setStreamURL(data?.streamUrl);
        setSecretKey(data?.streamKey);
      }
    });
  }, [account, connectionStatus]);

  const createDonationPoll = async () => {
    toast.loading(<b>Creating new Donation Poll</b>, {
      id: "donation-poll",
    });
    try {
      const tx = new Transaction();

      tx.moveCall({
        target:
          "0x236d6624fb9125cda7e8ddbf6e7b428932ebd142ac72140301f773b2427e4119::donation_manager::create_donation_pool",

        arguments: [
          tx.object(
            "0x20e15cda46ba30b9d4446a51120c173a649e68cc1c32f8687c0977fad2fefd4d"
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
            toast.success(<b>Donation Poll Created</b>, {
              id: "donation-poll",
            });
          },
          onError: (error) => {
            console.log("error", error);
            toast.error(<b>Error Creating Donation poll</b>, {
              id: "donation-poll",
            });
          },
        }
      );
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {connectionStatus === "connecting" ? (
          <Button disabled variant={"secondary"}>
            Loading
          </Button>
        ) : (
          <Button variant={"secondary"}>Show Stream Key</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
          <Card className="pt-8 border-0">
            <CardContent>
              <div className="grid items-center w-full gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Stream URL</Label>
                  <div className="flex items-center gap-4">
                    <Input id="name" value={streamURL} readOnly />
                    <Button
                      className="w-0 duration-200 border-0 outline-none active:scale-90"
                      variant="ghost"
                      onClick={(e) => {
                        e.preventDefault();
                        navigator.clipboard.writeText(streamURL!);
                        toast.success(<b>Stream URL Copied to Clipboard</b>, {
                          id: "clipboard-url",
                        });
                      }}
                    >
                      <Copy />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Stream Secret Key</Label>
                  <div className="flex items-center gap-4">
                    <Input id="name" value={secretKey} readOnly />
                    <Button
                      className="w-0 duration-200 border-0 outline-none active:scale-90"
                      variant="ghost"
                      onClick={(e) => {
                        e.preventDefault();
                        navigator.clipboard.writeText(secretKey!);
                        toast.success(<b>Stream Key Copied to Clipboard</b>, {
                          id: "clipboard-key",
                        });
                      }}
                    >
                      <Copy />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant={"secondary"}
            onClick={() => {
              createIngress(parseInt(typeof RTMP), account);
              createDonationPoll();
            }}
          >
            Create Key
          </Button>
          <Button onClick={createDonationPoll}>Create Donation POLL</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShowKey;
