import { create } from "zustand";
interface UserPlacesState {
  places: Place[];

  initPlace: (pArr: Place[]) => void;
  addPlace: (p: Place) => void;
  delPlace: (p: Place) => void;
  isAlreadyExist: (p: Place) => boolean;
}

export const useUserPlacesStore = create<UserPlacesState>((set, get) => ({
  places: [],
  initPlace: (pArr) => set(() => ({ places: [...pArr] })),
  addPlace: (p) => set((state) => ({ places: [...state.places, p] })),
  delPlace: (p) =>
    set((state) => ({ places: state.places.filter((el) => el.id !== p.id) })),
  isAlreadyExist: (p) => get().places.some((el) => el.id === p.id),
}));
