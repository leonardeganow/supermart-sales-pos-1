// import { create } from "zustand";

// const userStore = create((set) => ({
//   id: "",
//   setUserId: () =>
//     set((userId: string) => {
//       id: userId;
//     }),
// }));

// export default userStore;

import { create } from "zustand";

const userStore = create((set) => ({
  id: "",
  setUserId: (userId: string) => set({ id: userId }),
}));

export default userStore;
