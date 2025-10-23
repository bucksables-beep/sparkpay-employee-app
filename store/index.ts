import { create } from 'zustand';

interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
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
