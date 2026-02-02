"use client";

import { useFavoritesStore } from "@/store/useFavoritesStore";
import { useStore } from "@/store/useStore";
import { ICar } from "@/types/car";

export default function Home() {
  // favorites буде undefined, поки не відбудеться гідрація
  const favorites = useStore(useFavoritesStore, (state) => state.favorites);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  // Прапорець готовності: якщо favorites не undefined, значить дані з localStorage вже тут
  const isHydrated = favorites !== undefined;

  const testCar: ICar = {
    id: "1",
    make: "Tesla",
    model: "Model 3",
    year: 2023,
    rentalPrice: "$50",
    address: "Kyiv, Ukraine",
    img: "",
    type: "Sedan",
    description: "",
    fuelConsumption: "",
    engineSize: "",
    accessories: [],
    functionalities: [],
    rentalConditions: "",
    rentalCompany: "",
    mileage: 1000,
  };

  // Перевіряємо статус, тільки якщо ми вже "гідровані"
  const active = isHydrated
    ? favorites.some((car) => car.id === testCar.id)
    : false;

  return (
    <main className="p-10 font-manrope">
      <h1 className="text-3xl font-bold mb-6 text-main">
        Крок 3: Фінальний тест
      </h1>

      <div className="border border-gray-light p-6 rounded-2xl max-w-sm bg-white shadow-sm">
        <h2 className="text-xl font-semibold text-main mb-1">
          {testCar.make} {testCar.model}
        </h2>
        <p className="text-gray-default mb-6 text-sm">
          Перевірка стану обраного
        </p>

        {/* Контейнер для кнопки з фіксованою висотою, щоб уникнути стрибків контенту */}
        <div className="h-11">
          {!isHydrated ? (
            // СКЕЛЕТОН: показуємо нейтральну задизайнену заглушку
            <div className="w-full h-full bg-gray-100 animate-pulse rounded-xl border border-gray-light" />
          ) : (
            // РЕАЛЬНА КНОПКА: з'являється плавно
            <button
              onClick={() => toggleFavorite(testCar)}
              className={`w-full h-full px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                active
                  ? "bg-red-500 text-white shadow-md shadow-red-200"
                  : "bg-blue-primary text-white hover:bg-blue-hover"
              }`}
            >
              {active ? "❤️ Видалити з обраного" : "🤍 Додати в обране"}
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 p-4 bg-accent rounded-xl inline-block border border-gray-light">
        <p className="text-main">
          У списку обраних:
          <span className="ml-2 font-bold inline-block min-w-5">
            {isHydrated ? favorites.length : "..."}
          </span>
        </p>
      </div>
    </main>
  );
}
