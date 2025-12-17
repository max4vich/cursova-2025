const app = require("../src/app");

// ❗ Vercel автоматично обгортає Express‑додаток у serverless‑функцію.
// ❗ Prisma ініціалізується як singleton у `src/libs/prisma.js`, тому
//    тут додаткових підключень не робимо.
// ❗ Жодної custom cold‑start логіки у handler не потрібно.

// Експортуємо сам `app` — Vercel Node Runtime створить handler сам.
module.exports = app;


