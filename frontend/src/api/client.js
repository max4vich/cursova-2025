/**
 * @GofPattern:Facade
 * 
 * GoF Патерн: Facade (Структурний патерн)
 * 
 * Призначення:
 * Надає спрощений уніфікований інтерфейс для роботи з HTTP-запитами до REST API.
 * Приховує складність формування запитів: додавання заголовків, обробка токенів авторизації,
 * серіалізація/десеріалізація JSON, обробка помилок, управління токенами в localStorage.
 * 
 * Переваги:
 * - Спрощує використання API для компонентів (один метод request() замість fetch з усіма деталями)
 * - Інкапсулює логіку управління авторизаційними токенами
 * - Централізована обробка помилок та форматування запитів
 * - Легке змінення реалізації (наприклад, заміна fetch на axios) без змін у компонентах
 * - Забезпечує консистентність у форматі запитів по всьому додатку
 * 
 * Як працює Facade:
 * Компоненти викликають request(path, options) замість прямого використання fetch(),
 * що дозволяє не знати про деталі: URL базового шляху, формат заголовків, обробку токенів,
 * обробку FormData тощо. Вся ця складність інкапсульована в функції request().
 * 
 * Використання:
 * Використовується у всіх API модулях (admin.js) та компонентах, що роблять HTTP-запити.
 * Наприклад: request("/cart"), request("/products", { method: "POST", body: {...} })
 */
const API_BASE_URL = process.env.API_BASE_URL || "https://your-app.vercel.app/api";
const TOKEN_KEY = "techshop:token";

const getToken = () => localStorage.getItem(TOKEN_KEY);

const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

const request = async (path, options = {}) => {
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const init = {
    ...options,
    headers,
    body: isFormData ? options.body : options.body ? JSON.stringify(options.body) : undefined,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, init);

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = payload?.message || "Request failed";
    throw new Error(message);
  }

  return payload.data ?? payload;
};

export { API_BASE_URL, getToken, setToken, request };

