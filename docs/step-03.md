Це перемога! Використання скелетонів — це ознака професійного інтерфейсу. Тепер твій проект не просто працює, він відчувається надійним.

Ось фінальна, вичерпна інструкція для **Кроку 3**, яку ти можеш додати у свій README або робочий журнал.

---

# Крок 3: Zustand Store для Обраного та Hydration Fix

На цьому етапі ми впровадили систему збереження "Обраного" автомобілів з використанням **Zustand Persistence** та розв'язали проблему розбіжності даних між сервером і клієнтом (Hydration Mismatch).

## 1. Створення стору (Logic Layer)

Ми використовуємо middleware `persist`, щоб автоматично синхронізувати стейт із `localStorage`.

**Файл:** `store/useFavoritesStore.ts`

```typescript
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
    }
  )
);

```

## 2. Створення безпечного хука (Safety Layer)

Для роботи в середовищі Next.js (App Router) нам потрібен посередник, який відкладе зчитування `localStorage` до моменту, поки React не "оживе" у браузері.

**Файл:** `store/useStore.ts`

```typescript
import { useState, useEffect } from 'react';

export const useStore = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F
) => {
  const result = store(callback) as F;
  const [data, setData] = useState<F>();

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};

```

## 3. Чому ми зробили саме так? (Deep Dive)

### Проблема: Hydration Mismatch & Flash of Content

1. **SSR (Server Side Rendering):** Сервер Next.js генерує HTML. Він не має доступу до `localStorage` вашого браузера, тому для нього "Обране" завжди порожнє.
2. **Client Hydration:** Коли браузер отримує HTML, React намагається "приклеїти" логіку до розмітки. Якщо в `localStorage` є дані, кнопка миттєво хоче стати червоною, але в HTML від сервера вона біла.
* **Результат:** Помилка в консолі та візуальне "мигтіння" тексту (з "Додати" на "Видалити").



### Рішення: Паттерн "Скелетон + Safe Hook"

* **Хук `useStore`:** Повертає `undefined` під час першого рендеру на сервері. Це дозволяє нам точно знати, коли додаток ще "не знає" про стан `localStorage`.
* **Скелетон:** Замість того, щоб показувати неправильний стан ("Додати", коли насправді авто вже в обраних), ми показуємо нейтральну пульсуючу заглушку. Це усуває візуальний шум і робить інтерфейс стабільним.

## 4. Як використовувати (UI Layer)

У будь-якому клієнтському компоненті ми тепер використовуємо такий підхід:

```tsx
const favorites = useStore(useFavoritesStore, (state) => state.favorites);
const isHydrated = favorites !== undefined;

// В рендері:
<div className="h-[44px]">
  {!isHydrated ? (
    <div className="skeleton-style" /> // Скелетон
  ) : (
    <button>...</button> // Реальна кнопка
  )}
</div>

```

---

Тепер ми маємо стабільну систему управління станом, яка не боїться перезавантаження сторінок і виглядає професійно.

**Я готовий до Кроку 4: useCarsStore (Каталог та пагінація). Починаємо?**