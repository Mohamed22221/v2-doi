// api.ts
import axios, {
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";
import { ACCESS_TOKEN, TOKEN_TYPE } from "./constants/api.constant";
import { ApiErrorClass, normalizeApiError } from "./error";
import { API_URL, API_VERSION } from "@/configs/env";

let redirecting = false;

const api = axios.create({
  baseURL: `${API_URL}/${API_VERSION}`,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

function onRequest(config: InternalAxiosRequestConfig) {
  const token = Cookies.get(ACCESS_TOKEN);

  if (token) {
    config.headers.Authorization = `${TOKEN_TYPE}${token}`;
  } else if ("Authorization" in config.headers) {
    delete config.headers.Authorization;
  }

  const lang = localStorage.getItem("i18nextLng");
  if (lang) config.headers["lang"] = lang;

  return config;
}

function onResponse(res: AxiosResponse) {
  return res.data;
}

function isCanceled(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false;
  if (error.code === "ERR_CANCELED") return true;

  const msg = typeof error.message === "string" ? error.message.toLowerCase() : "";
  return msg.includes("canceled") || msg.includes("cancelled");
}

function onResponseError(error: unknown) {
  // 1) Ignore canceled requests (no UX error)
  if (isCanceled(error)) {
    return Promise.reject(error);
  }

  // 2) Redirect on 401 (except login)
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const url = error.config?.url ?? "";

    const isLogin = url.includes("/login");
    if (status === 401 && !isLogin && !redirecting) {
      redirecting = true;
      Cookies.remove(ACCESS_TOKEN);
      window.location.replace("/sign-in");
    }
  }

  // 3) Normalize + throw ApiErrorClass
  const normalized = normalizeApiError(error);
  return Promise.reject(new ApiErrorClass(normalized));
}

api.interceptors.request.use(onRequest);
api.interceptors.response.use(onResponse, onResponseError);

export default api;
