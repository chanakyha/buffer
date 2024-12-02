import { AccessToken } from "livekit-server-sdk";

export const createViewerToken = async (user: Streamer, account: any) => {
  const token = new AccessToken(
    process.env.NEXT_PUBLIC_LIVEKIT_API_KEY,
    process.env.NEXT_PUBLIC_LIVEKIT_API_SECRET,
    {
      identity: `host-${user.id}`,
      name: user?.label,
    }
  );

  token.addGrant({
    room: user.id,
    roomJoin: true,
    canPublish: false,
    canPublishData: true,
  });

  return await Promise.resolve(token.toJwt());
};
