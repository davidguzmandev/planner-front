import { create } from "zustand";
import { User } from "@/types/user"; // Adjust the import path as necessary


interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    user: null,
    login: (userData: User) => set({ isAuthenticated: true, user: userData }),
    logout: () => set({ isAuthenticated: false, user: null }),
}));

export default useAuthStore;
