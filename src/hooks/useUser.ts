import useAuthStore from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export function useUser() {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const logout = useCallback(() => {
    clearAuth();
    navigate("/");
  }, [clearAuth, navigate]);
  return { user, logout };
}
