import Cookies from "js-cookie";

import { PropsWithChildren, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ACCESS_TOKEN } from "../constants/api.constant";
import { useRefreshToken } from "../hooks/auth";

function Protected({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isAuthPage = pathname.includes("/auth");

  const { data, isSuccess, isError, isFetching } = useRefreshToken();

  useEffect(() => {
    if (isSuccess && data?.data.accessToken) {
      Cookies.set(ACCESS_TOKEN, data.data.accessToken, {
        expires: 1 / 96,
      });
    }

    if (isError && !isAuthPage) {
      Cookies.remove(ACCESS_TOKEN);
      navigate("/auth/sign-in", { replace: true });
    }
  }, [isSuccess, isError, isFetching, data, navigate, isAuthPage]);

  useEffect(() => {
    if (isFetching) return; // wait until refresh completes

    const token = Cookies.get(ACCESS_TOKEN);

    // Not logged in → force login
    if (!token && !pathname.includes("/auth")) {
      navigate("/auth/sign-in", { replace: true });
    }

    // Already logged in → block /auth pages
    if (token && pathname.includes("/auth")) {
      navigate("/", { replace: true });
    }
  }, [pathname, navigate, isFetching]);

  if (isSuccess) return <>{children}</>;
}

export default Protected;
