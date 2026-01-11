import axios, { AxiosError, AxiosHeaders } from "axios";

export interface ApiError {
  status?: number;
  message: string;
  code?: string;
  raw?: unknown;
  details?: string[];
  requestId?: string;
  retryAfter?: string;
  isCanceled?: boolean;
}

type BackendErrorShape = {
  
    message?: unknown;
    details?: unknown;
 
};

// type FieldErrorsShape = Record<string, unknown>;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

function stringifyUnknown(v: unknown): string | undefined {
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return undefined;
}

function flattenFieldErrors(v: unknown): string[] | undefined {
  // supports: { email: ["required"], password: ["too short"] }
  if (!isRecord(v)) return undefined;

  const out: string[] = [];
  for (const [field, val] of Object.entries(v)) {
    if (isStringArray(val)) {
      for (const msg of val) out.push(`${field}: ${msg}`);
    } else if (typeof val === "string") {
      out.push(`${field}: ${val}`);
    }
  }
  return out.length ? out : undefined;
}

function getHeader(headers: unknown, key: string): string | undefined {
  if (headers instanceof AxiosHeaders) {
    const v = headers.get(key);
    if (typeof v === "string") return v;
    if (Array.isArray(v)) return v.join(",");
    return undefined;
  }
  if (isRecord(headers)) {
    const v = headers[key.toLowerCase()] ?? headers[key];
    return typeof v === "string" ? v : undefined;
  }
  return undefined;
}

function isRequestCanceled(error: unknown): boolean {
  // axios built-in cancel (legacy)
  if (typeof (axios as unknown as { isCancel?: (e: unknown) => boolean }).isCancel === "function") {
    const isCancel = (axios as unknown as { isCancel: (e: unknown) => boolean }).isCancel;
    if (isCancel(error)) return true;
  }

  if (axios.isAxiosError(error)) {
    if (error.code === "ERR_CANCELED") return true;
    const msg = typeof error.message === "string" ? error.message.toLowerCase() : "";
    if (msg.includes("canceled") || msg.includes("cancelled")) return true;
  }
  return false;
}

function sanitizeRawAxiosError(error: AxiosError): unknown {
  return {
    name: error.name,
    message: error.message,
    code: error.code,
    status: error.response?.status,
    url: error.config?.url,
    method: error.config?.method,
  };
}

/**
 * Custom API Error class
 */
export class ApiErrorClass extends Error implements ApiError {
  status?: number;
  code?: string;
  raw?: unknown;
  details?: string[];
  requestId?: string;
  retryAfter?: string;
  isCanceled?: boolean;
  isApiError = true as const;

  constructor(error: ApiError) {
    super(error.message);
    this.name = "ApiError";
    this.status = error.status;
    this.code = error.code;
    this.raw = error.raw;
    this.details = error.details;
    this.requestId = error.requestId;
    this.retryAfter = error.retryAfter;
    this.isCanceled = error.isCanceled;
    Object.setPrototypeOf(this, ApiErrorClass.prototype);
  }
}

/**
 * Normalizes any error (axios or other) to a consistent ApiError shape
 */
export function normalizeApiError(error: unknown): ApiError {
  // Canceled requests (UX: often ignore)
  if (isRequestCanceled(error)) {
    return {
      message: "Request canceled.",
      code: "ERR_CANCELED",
      isCanceled: true,
      raw: error,
    };
  }

  // Non-axios errors
  if (!axios.isAxiosError(error)) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "An error occurred. Please try again.",
      raw: error,
    };
  }

  const axiosError: AxiosError<BackendErrorShape> = error;
  const status = axiosError.response?.status;
  const data = axiosError.response?.data;
  const url = axiosError.config?.url ?? "";

  // No response => network/CORS/timeout
  if (!axiosError.response) {
    const msg = typeof axiosError.message === "string" ? axiosError.message : "";
    const isTimeout =
      axiosError.code === "ECONNABORTED" || msg.toLowerCase().includes("timeout");

    return {
      message: isTimeout
        ? "Request timed out. Please try again."
        : "Network error, please try again.",
      code: axiosError.code,
      raw: sanitizeRawAxiosError(axiosError),
    };
  }

  // Extract message from your known shape: data.error.message
  const extractedMessage =
    typeof data?.message === "string" ? data.message : undefined;

  // Details extraction - supports multiple shapes
  const detailsRaw = data?.details;
  const details =
    isStringArray(detailsRaw)
      ? detailsRaw
      : flattenFieldErrors(detailsRaw);

  const requestId =
    getHeader(axiosError.response?.headers, "x-request-id") ||
    getHeader(axiosError.response?.headers, "x-correlation-id");

  const retryAfter = getHeader(axiosError.response?.headers, "retry-after");

  const base: Omit<ApiError, "message" | "status"> = {
    code: axiosError.code,
    raw: sanitizeRawAxiosError(axiosError),
    details,
    requestId,
    retryAfter,
  };

  // Status-specific
  if (status === 401) {
    const isLogin = url.includes("/login")
    return {
      status,
      message: isLogin
        ? "Invalid credentials. Please check your email/phone and password."
        : extractedMessage || "Session expired. Please sign in again.",
      ...base,
    };
  }

  if (status === 403) {
    return {
      status,
      message: extractedMessage || "You don't have permission to perform this action.",
      ...base,
    };
  }

  if (status === 404) {
    return {
      status,
      message: extractedMessage || "Resource not found.",
      ...base,
    };
  }

  if (status === 429) {
    return {
      status,
      message: extractedMessage || "Too many requests. Please try again shortly.",
      ...base,
    };
  }

  if (status  && status >= 500) {
    return {
      status,
      message: extractedMessage || "Server error. Please try again later.",
      ...base,
    };
  }

  // 422/400 validation default
  if (status === 422 || status === 400) {
    return {
      status,
      message: extractedMessage || "Please check your input and try again.",
      ...base,
    };
  }

  return {
    status,
    message: extractedMessage || "An error occurred. Please try again.",
    ...base,
  };
}

/**
 * Extract message for UI
 */
type ApiErrorLike = { isApiError: true; message?: unknown };

function isApiErrorLike(v: unknown): v is ApiErrorLike {
  return isRecord(v) && v.isApiError === true;
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiErrorClass) return error.message;

  if (isApiErrorLike(error)) {
    const msg = stringifyUnknown(error.message);
    return msg ?? "An error occurred. Please try again.";
  }

  return normalizeApiError(error).message;
}
