import api from "@/lib/axios";

export default async function Home() {
  let brands: string[] = [];
  let error = null;

  try {
    // Робимо запит до ендпоінту /brands
    const { data } = await api.get<string[]>("/brands");
    brands = data;
  } catch (err) {
    console.error("API Error:", err);
    error = "Не вдалося завантажити бренди";
  }

  return (
    <main className="p-10 font-manrope]">
      <h1 className="text-3xl font-bold text-main mb-6">
        Перевірка зв&apos;язку з API
      </h1>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="bg-accent p-6 rounded-lg shadow-inner">
          <p className="text-gray-default mb-4 font-medium">Отримані бренди:</p>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {brands.map((brand) => (
              <li
                key={brand}
                className="bg-white p-2 rounded border border-gray-light text-center shadow-sm text-sm hover:border-blue-primary transition-colors"
              >
                {brand}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-primary/10 text-blue-hover rounded-md text-sm">
        ✅ Якщо ти бачиш список брендів (Audi, BMW тощо), значить Axios та
        Tailwind v4 налаштовані правильно.
      </div>
    </main>
  );
}
