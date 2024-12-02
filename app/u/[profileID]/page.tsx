import { StreamPlayer } from "@/components/stream-player";
import { getUserDataUsingWalletAddress } from "@/lib/utils";

const StreamerPage = async ({
  params: { profileID },
}: {
  params: {
    profileID: string;
  };
}) => {
  const streamerInfo = (await getUserDataUsingWalletAddress(
    profileID
  )) as Streamer;

  return (
    <div>
      <StreamPlayer user={streamerInfo} />
    </div>
  );
};

export default StreamerPage;
