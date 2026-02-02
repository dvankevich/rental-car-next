import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ICar } from "@/types/car";
import { useState, useEffect } from "react";

interface FavoritesState {
  favorites: ICar[];
  // Метод для додавання/видалення (toggle)
  toggleFavorite: (car: ICar) => void;
  // Метод для швидкої перевірки, чи є авто в списку
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
          // Видаляємо
          set({
            favorites: favorites.filter((item) => item.id !== car.id),
          });
        } else {
          // Додаємо
          set({
            favorites: [...favorites, car],
          });
        }
      },

      isFavorite: (carId) => {
        return get().favorites.some((item) => item.id === carId);
      },
    }),
    {
      name: "favorites-storage", // Ключ у LocalStorage
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const useFavorites = () => {
  // 1. Отримуємо стан зі стору
  const result = useFavoritesStore();

  // 2. Створюємо стан для відстеження гідрації
  const [hydrated, setHydrated] = useState(false);

  // 3. Використовуємо useEffect, щоб перемкнути стан після монтажу
  useEffect(() => {
    // Використання requestAnimationFrame або простого setHydrated
    // допомагає рознести рендери в часі
    const timeout = setTimeout(() => {
      setHydrated(true);
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  // 4. Поки не гідровано — повертаємо безпечні значення (заглушки)
  if (!hydrated) {
    return {
      favorites: [],
      toggleFavorite: () => {},
      isFavorite: () => false,
    };
  }

  // 5. Після гідрації повертаємо реальний стор
  return result;
};
