import { db } from "@/firebase";
import { clsx, type ClassValue } from "clsx";
import { doc, getDoc } from "firebase/firestore";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getUserDataUsingWalletAddress = async (walletAddress: string) => {
  const docRef = doc(db, "users", walletAddress);

  const result = await getDoc(docRef);

  if (result.exists()) {
    return {
      id: result.id,
      ...result.data(),
    };
  } else {
    return null;
  }
};

export const formatAddress = (walletAddress: string) => {
  return `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
};
