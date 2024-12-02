"use client";

import { db } from "@/firebase";
import { formatAddress } from "@/lib/utils";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import Image from "next/image";
import Vector from "../assets/vector.png";

const ShowStreamers = () => {
  const collectionRef = collection(db, "users");
  const [users, setUsers] = useState<Streamer[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collectionRef, (result) => {
      setUsers(
        result.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          } as Streamer;
        })
      );
    });
  }, [collectionRef]);
  return (
    <div className="flex flex-col gap-y-8 h-56 bg-[#1E1E1E] rounded-lg p-4">
      <div className="flex flex-row mx-4 gap-x-2">
        <Image src={Vector} alt="logoimg" className="h-8 w-7" />
        <h1 className="text-3xl font-semibold text-blue-700">Popular</h1>
      </div>
      <div className="flex flex-row mx-16 gap-x-16">
        {users.map((user, index) => {
          return (
            <div
              key={index}
              className="relative flex flex-col items-center gap-y-2 group"
            >
              <div className="items-center w-full h-full">
                {user.id && (
                  <Image
                    src={`https://robohash.org/${user.id}?set=set2`}
                    width={1920}
                    height={1080}
                    alt="PROFILE IMAGE"
                    className="w-24 h-24 border-2 rounded-full border-slate-500 hover:border-4 hover:border-blue-700 border-foreground/20 hover:shadow-xl hover:shadow-blue-700/25"
                  />
                )}
              </div>
              <div className="absolute transition-all duration-300 transform translate-y-2 opacity-0 -bottom-8 group-hover:opacity-100 group-hover:translate-y-0">
                <h1>
                  {user.username ? user.username : formatAddress(user.id)}
                </h1>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShowStreamers;
