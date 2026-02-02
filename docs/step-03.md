Ось повна, відшліфована інструкція для **Кроку 3**. Вона враховує всі нюанси з гідрацією та специфіку роботи Zustand у Next.js.

---

# Крок 3: Zustand Store для Обраного (Favorites)

На цьому етапі ми створюємо сховище для "Обраного", яке автоматично зберігає дані в `localStorage`. Оскільки Next.js використовує Server-Side Rendering (SSR), ми також реалізуємо захист від помилок гідрації.

## 1. Створення стору та захищеного хука

Створи файл у папці `store/`. Ми об'єднаємо опис стору та допоміжний хук для безпечного доступу.

**Файл:** `store/useFavoritesStore.ts`

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useState, useEffect } from 'react';
import { ICar } from '@/types/car';

// 1. Опис стану та методів
interface FavoritesState {
  favorites: ICar[];
  toggleFavorite: (car: ICar) => void;
  isFavorite: (carId: string) => boolean;
}

// 2. Створення стору з Persistence
const useFavoritesStore = create<FavoritesState>()(
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
      name: 'favorites-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/**
 * Custom Hook: useFavorites
 * Використовується для безпечного доступу до стору в Next.js.
 * Запобігає помилці Hydration Mismatch.
 */
export const useFavorites = () => {
  const store = useFavoritesStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Використовуємо requestAnimationFrame для м'якого оновлення після рендеру
    const frame = requestAnimationFrame(() => {
      setHydrated(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!hydrated) {
    return {
      favorites: [],
      toggleFavorite: () => {},
      isFavorite: () => false,
    };
  }

  return store;
};

```

## 2. Навіщо ми створили хук `useFavorites`?

Next.js спочатку рендерить сторінку на **сервері** (SSR). У цей момент:

1. Сервер не знає про ваш `localStorage`.
2. Стан `favorites` на сервері завжди порожній `[]`.
3. Коли сторінка потрапляє в **браузер**, Zustand читає `localStorage` і "підставляє" справжні дані.
4. Якщо в обраному вже щось було, виникає конфлікт: сервер каже "тут пуста кнопка", а клієнт каже "тут кнопка з сердечком". Це викликає помилку **Hydration Mismatch**.

**Хук `useFavorites` вирішує це так:**

* Поки компонент не змонтувався (`hydrated === false`), він повертає порожній стан, що збігається з сервером.
* Як тільки браузер готовий, хук перемикає стан, і React безпечно оновлює інтерфейс уже з реальними даними.

## 3. Тестування на головній сторінці

Онови `app/page.tsx`, щоб перевірити роботу стору без помилок у консолі.

**Файл:** `app/page.tsx`

```tsx
'use client';

import { useFavorites } from '@/store/useFavoritesStore';
import { ICar } from '@/types/car';

export default function Home() {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  // Фейковий об'єкт для тесту
  const testCar = {
    id: 'test-1',
    make: 'BMW',
    model: 'X5',
  } as ICar;

  const active = isFavorite(testCar.id);

  return (
    <main className="p-10 font-manrope">
      <h1 className="text-2xl font-bold text-main mb-6">Крок 3: Перевірка Favorites</h1>

      <div className="p-6 border border-gray-light rounded-xl bg-accent max-w-xs text-center">
        <h2 className="text-xl font-bold mb-4">{testCar.make} {testCar.model}</h2>

        <button
          onClick={() => toggleFavorite(testCar)}
          className={`w-full py-3 rounded-lg font-semibold transition-all ${
            active
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-blue-primary text-white hover:bg-blue-hover'
          }`}
        >
          {active ? '❤️ В обраному' : '🤍 Додати в обране'}
        </button>
      </div>

      <p className="mt-6 text-gray-default">
        Машин в обраному: <span className="text-main font-bold">{favorites.length}</span>
      </p>
    </main>
  );
}

```

---

### Що ми отримали:

* **Стейт-менеджмент:** Працює набагато швидше за Redux.
* **Стійкість:** Дані зберігаються між оновленнями сторінок.
* **Чиста консоль:** Жодних помилок гідрації або каскадних рендерів.

перейдемо до **Кроку 4: useCarsStore**. Там ми реалізуємо запити до API для отримання списку машин, логіку "Load More" та фільтрацію.

