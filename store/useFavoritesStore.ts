import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ICar } from "@/types/car";

interface FavoritesState {
  favorites: ICar[];
  toggleFavorite: (car: ICar) => void;
  isFavorite: (carId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      toggleFavorite: (car) => {
        const { favorites } = get();
        const isAlreadyFavorite = favorites.some((item) => item.id === car.id);
        if (isAlreadyFavorite) {
          set({ favorites: favorites.filter((item) => item.id !== car.id) });
        } else {
          set({ favorites: [...favorites, car] });
        }
      },

      isFavorite: (carId) => get().favorites.some((item) => item.id === carId),
    }),
    {
      name: "favorites-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
