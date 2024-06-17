import {
  loginUserAction,
  logoutUserAction,
  updateUserAction,
} from "@/actions/auth";
import { loginSuccess, logoutSuccess, updateSuccess } from "@/slices/auth";
import { useDispatch, useSelector } from "@/store";
import { useState } from "react";
import toast from "react-hot-toast";

export default function useAuth() {
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  function login({ email, password }: { email: string; password: string }) {
    setIsLoading(true);

    loginUserAction({ email, password })
      .then((res) => {
        if (res?.error) {
          setError(res.error);
          toast.error(res.error);
          return;
        }
        dispatch(loginSuccess(res.user));
      })
      .finally(() => setIsLoading(false));
  }

  function logout() {
    setIsLoading(true);

    logoutUserAction()
      .then((res) => {
        if (res?.error) {
          setError(res.error);
          toast.error(res.error);
          return;
        }
        dispatch(logoutSuccess());
      })
      .catch((error) => {
        if (error instanceof Error) {
          toast.error(error.message);
          return;
        }
        toast.error("Logout failed");
      })
      .finally(() => setIsLoading(false));
  }

  function update(userId: number, update: any) {
    setIsLoading(true);

    updateUserAction(userId, update)
      .then((res) => {
        if (res?.error) {
          setError(res.error);
          toast.error(res.error);
          return;
        }
        toast.success(res?.success!);
        dispatch(updateSuccess(res.user));
      })
      .catch((error) => {
        if (error instanceof Error) {
          toast.error(error.message);
          return;
        }
        toast.error("Update failed");
      })
      .finally(() => setIsLoading(false));
  }

  return { isLoading, user, error, login, logout, update };
}
