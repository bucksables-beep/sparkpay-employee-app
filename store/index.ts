import { create } from "zustand";

export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  avatar?: string;
  phonenumber?: string;
  bankId?: string;
  bank?: {
    id: string;
    name: string;
  };
  accountNumber?: string;
  country: {
    currency: string;
    id: string;
  };
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
