# Інструкції з розгортання

## Налаштування змінних оточення на Vercel

### Обов'язкові змінні для продакшн

Для правильної роботи додатку на Vercel потрібно налаштувати наступні змінні оточення:

#### 1. DATABASE_URL

**Важливо:** Для Aiven MySQL потрібно додати SSL параметри до connection string!

**Правильний формат для Aiven MySQL:**
```
mysql://avnadmin:ВАШ_ПАРОЛЬ@el3ctric-max777george-4f8c.l.aivencloud.com:16733/НАЗВА_БД?ssl-mode=REQUIRED&connect_timeout=60
```

**Важливо:** Використовуйте `ssl-mode=REQUIRED` (з дефісом), не `sslmode`!

**Як знайти правильний connection string в Aiven:**
1. Відкрийте ваш Aiven проект
2. Перейдіть до вашого MySQL сервісу
3. Відкрийте вкладку "Overview" або "Connection information"
4. Скопіюйте "Connection string" або "Connection URI"
5. **Обов'язково додайте `?ssl-mode=REQUIRED&connect_timeout=60` до кінця URL**, якщо його там немає

**Приклад:**
- ❌ Неправильно: `mysql://avnadmin:pass@host:16733/defaultdb`
- ❌ Неправильно: `mysql://avnadmin:pass@host:16733/defaultdb?sslmode=REQUIRED`
- ✅ Правильно: `mysql://avnadmin:pass@host:16733/defaultdb?ssl-mode=REQUIRED&connect_timeout=60`

#### 2. Інші обов'язкові змінні

```
JWT_SECRET=<випадковий-секретний-ключ>
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@shop.com
ADMIN_PASSWORD=<безпечний-пароль>
PORT=5000 (опціонально, Vercel використовує свої порти)
```

### Як додати змінні оточення на Vercel

1. Відкрийте ваш проект на [vercel.com](https://vercel.com)
2. Перейдіть до **Settings** → **Environment Variables**
3. Додайте кожну змінну:
   - **Key**: `DATABASE_URL`
   - **Value**: ваш connection string з `?sslmode=REQUIRED`
   - Оберіть **Production**, **Preview**, та **Development** (якщо потрібно)
4. Повторіть для інших змінних (`JWT_SECRET`, `ADMIN_EMAIL`, тощо)
5. **Важливо:** Після додавання змінних, зробіть новий deployment!

### Перевірка підключення до бази даних

Після налаштування змінних:

1. Зробіть новий deployment на Vercel
2. Перевірте логи deployment для помилок підключення
3. Якщо помилка все ще є, перевірте:
   - Чи правильний формат `DATABASE_URL` (з `?sslmode=REQUIRED`)
   - Чи доступна база даних з IP адрес Vercel (перевірте firewall правила в Aiven)
   - Чи правильний пароль та username

### Додаткові параметри для MySQL (опціонально)

Якщо у вас виникають проблеми з таймаутами в serverless середовищі, можете додати:

```
DATABASE_URL="mysql://user:pass@host:port/db?sslmode=REQUIRED&connect_timeout=60"
```

### Troubleshooting

**Помилка: "Can't reach database server"**

1. Перевірте, чи `DATABASE_URL` містить `?ssl-mode=REQUIRED&connect_timeout=60` (з дефісом!)
2. Перевірте firewall правила в Aiven:
   - Відкрийте ваш MySQL сервіс в Aiven
   - Перейдіть до "Settings" → "IP whitelist" або "Allow connections from"
   - Додайте `0.0.0.0/0` для дозволу з'єднань з будь-яких IP (або конкретні IP Vercel)
3. Перевірте, чи база даних активна (не в sleep режимі) - Aiven може "засинати" неактивні бази
4. Перевірте логи на Vercel для деталей помилки
5. Переконайтеся, що ви використовуєте правильну назву бази даних (зазвичай `defaultdb` для Aiven)

**Помилка: "SSL connection required"**

- Додайте `?ssl-mode=REQUIRED` (з дефісом!) до `DATABASE_URL`

