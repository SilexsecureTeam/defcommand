import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { axiosClient } from "../services/axios-client";
import { useQuery } from "@tanstack/react-query";

const useCall = () => {
  const { authDetails } = useContext<any>(AuthContext);
  const token = authDetails?.access_token;
  const client = axiosClient(token);

  const getCallLogs = () =>
    useQuery({
      queryKey: ["callLogs"],
      queryFn: async () => {
        const { data } = await client.get(`/user/chat/callLog`);
        return data?.data || [];
      },
      enabled: !!authDetails,
      staleTime: 0,
    });
  return {
    getCallLogs,
  };
};

export default useCall;
