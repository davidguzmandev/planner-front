import useAuthStore from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { User } from "@/types";
import { useState } from "react";
import { useAsync } from "@/hooks/useAsync";

//Mapa de Rol
const roleToEmailMap: Record<User["role"], string> = {
  "Production Planner": "planner@fujisemec.com",
  "Quality Inspector": "quality@fujisemec.com",
  "Administrator": "admin@fujisemec.com",
};
const roles = Object.keys(roleToEmailMap) as User["role"][];
const backendUrl = import.meta.env.VITE_BACKEND_URL;
if (!backendUrl) {
  throw new Error("Backend URL is not defined");
}

async function loginByEmail(email: string): Promise<{
  user: User;
  redirectUrl?: string;
}> {
  const res = await fetch(`${backendUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Login failed");
  }
  const data = (await res.json()) as { user: User; redirectUrl?: string };
  return data;
}

export function Login() {
  const [selectedRole, setSelectedRole] = useState<User["role"] | null>(null);
  const {
    execute: doLogin,
    loading,
    error,
  } = useAsync<[string], { user: User; redirectUrl?: string }>(loginByEmail);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!selectedRole) return;
    const email = roleToEmailMap[selectedRole];
    const result = await doLogin(email);
    if (result) {
      login(result.user);
      navigate(result.redirectUrl || "/dashboard");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-h-full">
      <h1 className="text-3xl font-semibold mb-8 text-white">Login</h1>

      <div className="space-y-4 w-full max-w-sm">
        {roles.map((role) => (
          <Button
            key={role}
            variant={selectedRole === role ? "default" : "outline"}
            className="w-full cursor-pointer"
            onClick={() => setSelectedRole(role)}>
            {role}
          </Button>
        ))}

        <Button
          onClick={handleLogin}
          className="w-full  cursor-pointer"
          disabled={!selectedRole || loading}>
          {loading ? "Logging in..." : `Login as ${selectedRole ?? "..."}`}
        </Button>

        {error && (
          <p className="text-red-600 text-sm text-center mt-2">{error}</p>
        )}
      </div>
    </div>
  );
}
