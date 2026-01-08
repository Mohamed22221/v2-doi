
import AuthServices from "../services/auth";
import ReactQueryKeys from "../constants/apikeys.constant";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {ACCESS_TOKEN } from "../constants/api.constant";
import { useMutation, useQuery } from "@tanstack/react-query";

const refetchTokenInterval = 12 * 60 * 1000; // 12 min

export const useSignIn = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: AuthServices.signIn,
    mutationKey: [ReactQueryKeys.SIGN_IN],
    onSuccess: (data) => {
      const {
        access_token,
        user: { role },
      } = data.data;
      if (access_token) {
        Cookies.set(ACCESS_TOKEN, access_token, {
          expires: 1 / 96,
        });
        navigate("/", { replace: true });
      }
      if (role) Cookies.set("role", role);
    },
  });
};

export const useRefreshToken = () => {
  return useQuery({
    queryKey: [ReactQueryKeys.REFRESH_TOKEN],
    queryFn: AuthServices.refreshToken,
    refetchInterval: refetchTokenInterval,
    retry: 0,
  });
};

