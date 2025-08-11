import { create } from "zustand";
import { devtools } from "zustand/middleware";

type PresentceState = {
  members: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  set: (ids: string[]) => void;
}

const usePresenceStore = create<PresentceState>()(devtools((set) => ({
  members: [],
  add: (id) => set((state) => ({ members: [...state.members, id] })),
  remove: (id) => set((state) => ({ members: state.members.filter(member => member !== id) })),
  set: (ids) => set({ members: ids }),
}), {name: "PresenceStore"}));

export default usePresenceStore;