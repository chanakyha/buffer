import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import {
  IngressAudioEncodingPreset,
  IngressInput,
  IngressClient,
  IngressVideoEncodingPreset,
  RoomServiceClient,
  type CreateIngressOptions,
} from "livekit-server-sdk";
import { TrackSource } from "livekit-server-sdk";
import toast from "react-hot-toast";

const roomService = new RoomServiceClient(
  process.env.NEXT_PUBLIC_LIVEKIT_API_URL!,
  process.env.NEXT_PUBLIC_LIVEKIT_API_KEY,
  process.env.NEXT_PUBLIC_LIVEKIT_API_SECRET
);

const ingressClient = new IngressClient(
  process.env.NEXT_PUBLIC_LIVEKIT_API_URL!,
  process.env.NEXT_PUBLIC_LIVEKIT_API_KEY,
  process.env.NEXT_PUBLIC_LIVEKIT_API_SECRET
);

export const resetIngresses = async (hostId: string) => {
  const ingresses = await ingressClient.listIngress({
    roomName: hostId,
  });

  const rooms = await roomService.listRooms([hostId]);

  for (const room of rooms) {
    await roomService.deleteRoom(room.name);
  }

  for (const ingress of ingresses) {
    if (ingress.ingressId) {
      await ingressClient.deleteIngress(ingress.ingressId);
    }
  }
};

export const createIngress = async (
  ingressType: IngressInput,
  account: any
) => {
  console.log("Wallet = >", account.address);
  toast.loading("Creating new stream URL and Stream key", {
    id: "ingress",
  });
  await resetIngresses(account?.address);

  const options: CreateIngressOptions = {
    name: account?.label,
    roomName: account?.address,
    participantName: account?.label,
    participantIdentity: account?.address,
  };

  if (ingressType === IngressInput.WHIP_INPUT) {
    options.bypassTranscoding = true;
  } else {
    options.video = {
      source: TrackSource.CAMERA,
      //   @ts-ignore
      preset: IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS,
    };
    options.audio = {
      source: TrackSource.MICROPHONE,
      //   @ts-ignore
      preset: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS,
    };
  }

  const ingress = await ingressClient.createIngress(ingressType, options);
  console.log(ingress);

  if (!ingress || !ingress.url || !ingress.streamKey) {
    throw new Error("Failed to create ingress");
  }

  const docRef = doc(db, "users", account?.address!);

  await updateDoc(docRef, {
    streamKey: ingress.streamKey,
    streamUrl: ingress.url,
    IngressId: ingress.ingressId,
    isLive: false,
  })
    .then(() => {
      console.log("DB INgress Updated");

      toast.success("New Stream Key Created Successfully", {
        id: "ingress",
      });
    })
    .catch((err) => {
      console.error("Error Occured for ingress DB");
      toast.error("Failed To Create New Key", {
        id: "ingress",
      });
    });

  return ingress;
};
