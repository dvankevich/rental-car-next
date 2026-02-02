"use client"; // Тепер це Client Component для роботи з хуками

import { useFavorites } from "@/store/useFavoritesStore";
import { ICar } from "@/types/car";

export default function Home() {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  // Фейкове авто для тесту
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

  const active = isFavorite(testCar.id);

  return (
    <main className="p-10 font-manrope">
      <h1 className="text-3xl font-bold mb-6">Крок 3: Тест Favorites</h1>

      <div className="border p-6 rounded-lg max-w-sm">
        <h2 className="text-xl font-semibold">
          {testCar.make} {testCar.model}
        </h2>
        <p className="text-gray-default mb-4 italic">
          Натисніть кнопку, щоб додати в обране
        </p>

        <button
          onClick={() => toggleFavorite(testCar)}
          className={`px-4 py-2 rounded-md transition-colors ${
            active
              ? "bg-red-500 text-white"
              : "bg-blue-primary text-white hover:bg-blue-hover"
          }`}
        >
          {active ? "❤️ Видалити з обраного" : "🤍 Додати в обране"}
        </button>
      </div>

      <div className="mt-6">
        <p>
          Кількість у списку: <strong>{favorites.length}</strong>
        </p>
      </div>

      <p className="mt-4 text-sm text-gray-default">
        💡 Спробуй додати авто і оновити сторінку (F5). Дані мають зберегтися!
      </p>
    </main>
  );
}
