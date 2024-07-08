import { create } from "zustand";

const userStore = create((set) => ({
  id: "",
  setUserId: (userId: string) => set({ id: userId }),
}));

export default userStore;
