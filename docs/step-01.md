Чудово. Тепер твоя інструкція повністю синхронізована з реальним процесом встановлення та структурою Next.js 15+ та Tailwind v4.

Ось фінальний варіант **Кроку 1** для твоого README.

---

# Крок 1: Ініціалізація проекту (Next.js 15, Tailwind v4, App Router)

## 1. Створення проекту

Запусти команду і обери вказані параметри:

```bash
npx create-next-app@latest rental-car-next

```

**Налаштування під час ініціалізації:**

* **Would you like to use the recommended Next.js defaults?** → `No, customize settings`
* **Would you like to use TypeScript?** → `Yes`
* **Which linter would you like to use?** → `ESLint`
* **Would you like to use React Compiler?** → `No`
* **Would you like to use Tailwind CSS?** → `Yes`
* **Would you like your code inside a src/ directory?** → `No`
* **Would you like to use App Router?** → `Yes`
* **Would you like to customize the import alias (@/* by default)?** → `Yes` (і натисніть Enter для `@/*`)

## 2. Створення структури каталогів

Виконай команду в корені проекту для створення необхідної архітектури:

```bash
mkdir -p components/ui components/shared lib store types constants

```

## 3. Встановлення додаткових пакетів

```bash
npm install axios zustand clsx tailwind-merge react-icons @tailwindcss/postcss postcss

```

## 4. Налаштування Tailwind v4 (PostCSS)

Оскільки Next.js 15 та Tailwind v4 потребують явного підключення через PostCSS:

**Створи/онови файл `postcss.config.mjs`:**

```javascript
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

```

## 5. Глобальні стилі та кольори

Онови файл `app/globals.css`. У v4 ми додаємо змінні теми прямо в CSS.

```css
@import "tailwindcss";

@theme {
  --color-main: #101828;
  --color-gray-default: #8d929a;
  --color-gray-light: #dadde1;
  --color-blue-primary: #3470ff;
  --color-blue-hover: #0b44cd;
  --color-accent: #f2f4f7;
  --font-manrope: var(--font-manrope);
}

:root {
  --background: #ffffff;
  --foreground: #101828;
}

body {
  background: var(--background);
  color: var(--foreground);
}

```

## 6. Підключення шрифту Manrope

Відредагуй `app/layout.tsx` для правильної роботи шрифтів та Tailwind:

```tsx
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ 
  subsets: ["latin"],
  variable: "--font-manrope", 
});

export const metadata: Metadata = {
  title: "Car Rental",
  description: "Find your perfect car",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${manrope.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}

```

---

Тепер Крок 1 завершено повністю. Проект має запускатися командою `npm run dev` без помилок.
