"use client";
import Dashboardprofile from "@/components/Dashboardprofile";
import ShowKey from "@/components/ShowKey";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db, storage } from "@/firebase";
import { useCurrentAccount, useCurrentWallet } from "@mysten/dapp-kit";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Dashboard = () => {
  const account = useCurrentAccount();
  const { connectionStatus } = useCurrentWallet();
  const [username, setUsername] = useState("");
  const [streamTitle, setStreamTitle] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [dbURL, setDBUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<any>();

  useEffect(() => {
    if (connectionStatus !== "connected") return;
    onSnapshot(doc(db, "users", account?.address!), (doc) => {
      setUsername(doc.data()?.username);
      setStreamTitle(doc.data()?.streamTitle);
      setDBUrl(doc.data()?.thumbnail);
    });
  }, [connectionStatus, account]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(file?.name);
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setImageFile(file);
    }
  };

  const uploadImage = async () => {
    const storageRef = ref(storage, account?.address);

    toast.loading(<b>Uploading Image...</b>, {
      id: "thumbnail",
    });

    if (imageFile) {
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Progress function ...
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          // Handle unsuccessful uploads
          toast.error(<b>Error Uploading image</b>, {
            id: "thumbnail",
          });
          console.error("Error uploading file:", error);
        },
        () => {
          // Handle successful uploads on complete
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setDoc(
              doc(db, "users", account?.address!),
              {
                thumbnail: downloadURL,
              },
              {
                merge: true,
              }
            )
              .then(() => {
                toast.success(<b>ImageUploaded...</b>, {
                  id: "thumbnail",
                });
              })
              .catch((err) => {
                toast.loading(<b>Error Uploading Image</b>, {
                  id: "thumbnail",
                });
              });

            setImageUrl(downloadURL);
          });
        }
      );
    }
  };

  const changeUsername = async () => {
    toast.loading("Updating Username", {
      id: "username",
    });
    const docRef = doc(db, "users", account?.address!);

    setDoc(
      docRef,
      {
        username,
      },
      {
        merge: true,
      }
    )
      .then((result) => {
        toast.success(<b>Username Added Successfully</b>, {
          id: "username",
        });
      })
      .catch((err) => {
        toast.error(<b>Error adding username</b>, {
          id: "username",
        });
      });
  };

  const changeStreamTitle = async () => {
    toast.loading("Updating Stream Title", {
      id: "stream-title",
    });
    const docRef = doc(db, "users", account?.address!);

    setDoc(
      docRef,
      {
        streamTitle,
      },
      {
        merge: true,
      }
    )
      .then((result) => {
        toast.success(<b>Stream Title Updated Successfully</b>, {
          id: "stream-title",
        });
      })
      .catch((err) => {
        toast.error(<b>Error adding Stream Title</b>, {
          id: "stream-title",
        });
      });
  };

  return (
    <div className="flex flex-row w-full">
      <Dashboardprofile />
      {/* {dbURL} */}
      <div className="flex flex-col items-start justify-center w-full h-full">
        <div className="flex flex-col w-full max-w-lg gap-3 mx-auto">
          <div className="flex items-center gap-3">
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Edit Username"
              className="p-2 border"
            />
            <Button onClick={changeUsername}>Update Username</Button>
          </div>
          <div className="flex items-center gap-3">
            <Input
              type="text"
              value={streamTitle}
              onChange={(e) => setStreamTitle(e.target.value)}
              placeholder="Edit Stream Title"
              className="p-2 border"
            />
            <Button onClick={changeStreamTitle}>Update Stream Title</Button>
          </div>
          <div className="flex items-center gap-3">
            <Input
              type="file"
              onChange={handleImageChange}
              className="p-2 border"
            />
            <Button onClick={uploadImage}>Update Stream Thumbnail</Button>
          </div>

          {!dbURL && imageUrl && (
            <Image
              width={1920}
              height={1080}
              src={imageUrl!}
              alt="Uploaded Thumbnail"
              className="mt-4"
            />
          )}

          {dbURL && !imageUrl && (
            <Image
              width={1920}
              height={1080}
              src={dbURL!}
              alt="Uploaded Thumbnail"
              className="mt-4"
            />
          )}

          {connectionStatus === "connected" && <ShowKey />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
