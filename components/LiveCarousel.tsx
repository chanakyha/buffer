"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const LiveCarousel = () => {
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
    <div className="my-12">
      <Swiper
        className="border rounded-lg h-96 border-slate-50"
        modules={[
          Navigation,
          // Pagination,
          Scrollbar,
          A11y,
        ]}
        spaceBetween={50}
        slidesPerView={1}
        navigation
        //  pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
      >
        {users.map((user, index) => {
          return (
            <SwiperSlide key={index}>
              <div
                className={`h-full bg- bg-cover bg-center`}
                style={{
                  backgroundImage: `url(${user.thumbnail})`,
                }}
              >
                <div className="p-4">
                  <h1 className="text-xl font-semibold text-center bg-red-700 rounded-md w-14">
                    LIVE
                  </h1>
                </div>
                <div className="absolute z-10 flex flex-row items-center justify-between w-full px-4 top-80">
                  <h1 className="text-xl font-semibold">{user.streamTitle}</h1>

                  <Button>
                    <Link href={`/u/${user.id}`} key={index}>
                      Watch Now
                    </Link>
                  </Button>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default LiveCarousel;
