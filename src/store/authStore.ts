import { create } from "zustand";

interface User {
    id: string;
    name: string;
    email: string;
    role: 'Production Planner' | 'Quality Inspector' | 'Administrator';
}

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
