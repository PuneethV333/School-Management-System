import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changePasswordAPI,
  fetchMeAPI,
  loginAPI,
  logoutAPI,
} from "../api/auth.api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutAPI,

    onSuccess: () => {
      queryClient.setQueryData(["me"], null);
      queryClient.clear();
      navigate("/login", { replace: true });
    },

    onError: () => {
      toast.error("Logout failed");
    },
  });
};

type useChangePasswordProps = {
  oldPass: string;
  newPass: string;
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ oldPass, newPass }: useChangePasswordProps) =>
      changePasswordAPI(oldPass, newPass),

    onSuccess: (res) => {
      toast.success(res.msg || "Password changed successfully");
    },

    onError: (err) => {
      toast.error(err?.message || "Failed to change password");
    },
  });
};
