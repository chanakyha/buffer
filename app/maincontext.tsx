"use client";

import React, { useContext } from "react";
import { useEffect } from "react";
import { createContext } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useCurrentAccount, useCurrentWallet } from "@mysten/dapp-kit";

const MainContext = createContext({});

const MainProvider = ({ children }: { children: React.ReactNode }) => {
  const { connectionStatus } = useCurrentWallet();
  const account = useCurrentAccount();

  useEffect(() => {
    if (connectionStatus === "connected") {
      const docRef = doc(db, "users", account?.address!);

      (async () => {
        const docExits = await getDoc(docRef);
        if (docExits.exists()) return;
        setDoc(
          docRef,
          {
            walletAddress: account?.address,
            label: account?.label,
          },
          { merge: true }
        )
          .then(() => {
            console.log("Added to db");
          })
          .catch((err) => {
            console.error("Adding to Database Error", err);
          });
      })();
    }
  }, [account, connectionStatus]);

  return <MainContext.Provider value={{}}>{children}</MainContext.Provider>;
};

export default MainProvider;

export function useAuth() {
  return useContext(MainContext);
}
