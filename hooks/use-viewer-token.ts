import { toast } from "sonner";
import { useEffect, useState } from "react";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { createViewerToken } from "@/lib/token";
import { useCurrentAccount } from "@mysten/dapp-kit";

export const useViewerToken = (user: Streamer) => {
  const [token, setToken] = useState("");
  const [name, setName] = useState("");
  const [identity, setIdentity] = useState("");

  const account = useCurrentAccount();

  useEffect(() => {
    const createToken = async () => {
      try {
        const viewerToken = await createViewerToken(user, account);
        setToken(viewerToken);

        const decodedToken = jwtDecode(viewerToken) as JwtPayload & {
          name?: string;
        };

        console.log(decodedToken);

        const name = decodedToken?.name;
        const identity = decodedToken.jti;

        if (identity) {
          setIdentity(identity);
        }

        if (name) {
          setName(name);
        }
      } catch (error) {
        toast.error("Something went wrong! Error creating token");
      }
    };

    createToken();
  }, [account]);

  return {
    token,
    name,
    identity,
  };
};
