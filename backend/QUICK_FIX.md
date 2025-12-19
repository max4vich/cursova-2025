# Швидке вирішення проблеми з підключенням до Aiven MySQL

## ⚠️ НАЙВАЖЛИВІШЕ: Перевірте Firewall в Aiven ПЕРШИМ!

Якщо `.env` правильний, але все ще отримуєте "Can't reach database server", **найчастіша причина - це Firewall в Aiven блокує з'єднання!**

### Як виправити Firewall:

1. Відкрийте [Aiven Console](https://console.aiven.io/)
2. Оберіть ваш проект → MySQL сервіс
3. Перейдіть до **Settings** → **IP whitelist** (або **Security** → **IP whitelist**)
4. **Додайте правило: `0.0.0.0/0`** (дозволить з'єднання з будь-яких IP)
5. Збережіть зміни

**БЕЗ ЦЬОГО КРОКУ з'єднання НЕ ПРАЦЮВАТИМУТЬ, навіть з правильним `.env`!**

---

## Крок 2: Оновіть DATABASE_URL на Vercel

Перейдіть до **Vercel Dashboard** → **Settings** → **Environment Variables** та оновіть `DATABASE_URL`:

### Варіант 1 (рекомендований для Prisma):
```
mysql://avnadmin:ВАШ_ПАРОЛЬ@el3ctric-max777george-4f8c.l.aivencloud.com:16733/defaultdb?sslaccept=strict
```

### Варіант 2 (якщо варіант 1 не працює):
```
mysql://avnadmin:ВАШ_ПАРОЛЬ@el3ctric-max777george-4f8c.l.aivencloud.com:16733/defaultdb?sslmode=REQUIRED&connect_timeout=60
```

### Варіант 3 (якщо обидва вище не працюють):
```
mysql://avnadmin:ВАШ_ПАРОЛЬ@el3ctric-max777george-4f8c.l.aivencloud.com:16733/defaultdb?sslaccept=accept_invalid_certs
```

## Крок 3: Переконайтеся, що база даних активна

Aiven може переводити бази даних у режим сну. Перевірте статус бази даних в Aiven dashboard.

## Крок 4: Перевірте через health endpoint

Після deployment, відкрийте:
```
https://ваш-домен.vercel.app/health/db
```

Це покаже статус підключення до бази даних та деталі помилки (якщо є).

## Крок 5: Зробіть новий deployment

Після змін у змінних оточення, обов'язково зробіть новий deployment на Vercel.

## Крок 6: Перевірте логи

Після deployment перевірте логи на Vercel для деталей помилки.

---

## Якщо нічого не допомагає

Перевірте правильність connection string:
1. Відкрийте Aiven dashboard
2. Перейдіть до MySQL сервісу → **Overview**
3. Скопіюйте **Connection URI** або **Connection string**
4. Переконайтеся, що ви використовуєте правильні:
   - Username (зазвичай `avnadmin`)
   - Password
   - Host (повний хост, включаючи `.l.aivencloud.com`)
   - Port
   - Database name (зазвичай `defaultdb`)

