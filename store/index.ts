import { create } from "zustand";

export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  avatar?: string;
}

interface StoreState {
  user: User | null;
  setUser: (user: User | null) => void;
}

const useStore = create<StoreState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export default useStore;
