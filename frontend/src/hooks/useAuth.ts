import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMeAPI, loginAPI } from "../api/auth.api";
import toast from "react-hot-toast";

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginAPI,
    onSuccess: (res) => {
      queryClient.setQueryData(["me"], res.data);
    },
    onError: (err) => {
      toast.error(err?.message || "Login failed");
    },
  });
};

export const useFetchMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await fetchMeAPI();
      return res.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};