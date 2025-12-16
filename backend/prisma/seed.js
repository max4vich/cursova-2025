/* eslint-disable no-console */
const { PrismaClient } = require("@prisma/client");
const { hashPassword } = require("../src/utils/password");
const { generateSlugFor } = require("../src/utils/slugify");

const prisma = new PrismaClient();

const categories = [
  { name: "Електроніка", slug: "electronics" },
  { name: "Одяг", slug: "clothing" },
  { name: "Взуття", slug: "shoes" },
  { name: "Аксесуари", slug: "accessories" },
  { name: "Дім та сад", slug: "home-garden" },
];

const products = [
  {
    name: "Бездротові навушники Sony WH-1000XM5",
    description: "Преміальні навушники з активним шумозаглушенням, бездротовим підключенням і тривалістю роботи до 30 годин.",
    price: 12999,
    compareAt: 14999,
    stock: 45,
    sku: "SONY-XM5",
    categorySlug: "electronics",
    imageUrl: "https://placehold.co/600x400/1a1a20/ffffff?text=Sony+XM5",
    rating: 4.8,
  },
  {
    name: "MacBook Pro 14 M3 Pro",
    description: "Потужний ноутбук з чіпом Apple M3 Pro, 18GB RAM, 512GB SSD. Ідеальний для розробки та дизайну.",
    price: 89999,
    stock: 12,
    sku: "MBP-14-M3",
    categorySlug: "electronics",
    imageUrl: "https://placehold.co/600x400/1a1a20/ffffff?text=MacBook+Pro",
    rating: 4.9,
  },
  {
    name: "iPhone 15 Pro Max 256GB",
    description: "Флагманський смартфон Apple з титановим корпусом, чіпом A17 Pro та революційною камерою 48MP.",
    price: 54999,
    compareAt: 57999,
    stock: 28,
    sku: "IPHONE-15PM-256",
    categorySlug: "electronics",
    imageUrl: "https://placehold.co/600x400/1a1a20/ffffff?text=iPhone+15+Pro+Max",
    rating: 4.9,
  },
  {
    name: "Чоловіча куртка Columbia Omni-Heat",
    description: "Тепла зимова куртка з технологією Omni-Heat для максимального збереження тепла.",
    price: 4599,
    stock: 67,
    sku: "COL-OMNI-JKT",
    categorySlug: "clothing",
    imageUrl: "https://placehold.co/600x400/1a1a20/ffffff?text=Columbia",
    rating: 4.6,
  },
  {
    name: "Жіноче плаття Zara Elegant Evening",
    description: "Елегантне вечірнє плаття з якісної тканини для особливих подій.",
    price: 2899,
    compareAt: 3599,
    stock: 34,
    sku: "ZARA-EVE-DRESS",
    categorySlug: "clothing",
    imageUrl: "https://placehold.co/600x400/1a1a20/ffffff?text=Zara+Dress",
    rating: 4.7,
  },
  {
    name: "Кросівки Nike Air Max 270",
    description: "Стильні та комфортні кросівки з технологією Air для максимальної амортизації.",
    price: 3999,
    stock: 156,
    sku: "NIKE-AIRMAX-270",
    categorySlug: "shoes",
    imageUrl: "https://placehold.co/600x400/1a1a20/ffffff?text=Nike+Air+Max+270",
    rating: 4.8,
  },
  {
    name: "Жіночі черевики Timberland Classic",
    description: "Класичні черевики Timberland з натуральної шкіри. Водонепроникні та надзвичайно міцні.",
    price: 5699,
    stock: 78,
    sku: "TIMB-CLASSIC-BOOT",
    categorySlug: "shoes",
    imageUrl: "https://placehold.co/600x400/1a1a20/ffffff?text=Timberland",
    rating: 4.7,
  },
  {
    name: "Розумний годинник Apple Watch Series 9",
    description: "Останнє покоління Apple Watch з яскравим дисплеєм, датчиками здоров'я та підтримкою watchOS 10.",
    price: 18999,
    compareAt: 20999,
    stock: 92,
    sku: "AW-SERIES-9",
    categorySlug: "accessories",
    imageUrl: "https://placehold.co/600x400/1a1a20/ffffff?text=Apple+Watch",
    rating: 4.9,
  },
  {
    name: "Шкіряний гаманець Tommy Hilfiger",
    description: "Класичний чоловічий гаманець з натуральної шкіри з логотипом Tommy Hilfiger.",
    price: 1899,
    stock: 234,
    sku: "TH-WALLET-CLASSIC",
    categorySlug: "accessories",
    imageUrl: "https://placehold.co/600x400/1a1a20/ffffff?text=Wallet",
    rating: 4.5,
  },
  {
    name: "Рюкзак для ноутбука SwissGear",
    description: "Міцний рюкзак з відділенням для ноутбука до 17 дюймів. Ергономічний дизайн і багато кишень.",
    price: 2499,
    stock: 187,
    sku: "SWISS-BACKPACK-17",
    categorySlug: "accessories",
    imageUrl: "https://placehold.co/600x400/1a1a20/ffffff?text=Backpack",
    rating: 4.6,
  },
  {
    name: "Кавоварка De'Longhi Magnifica",
    description: "Автоматична кавоварка для еспресо, капучино та латте з вбудованою кавомолкою.",
    price: 15999,
    stock: 23,
    sku: "DELONGHI-MAGNIFICA",
    categorySlug: "home-garden",
    imageUrl: "https://placehold.co/600x400/1a1a20/ffffff?text=Delonghi",
    rating: 4.8,
  },
  {
    name: "Робот-пилосос Xiaomi Roborock S7",
    description: "Розумний робот-пилосос з функцією вологого прибирання й навігацією LiDAR.",
    price: 14999,
    compareAt: 17999,
    stock: 45,
    sku: "XIAOMI-ROBOROCK-S7",
    categorySlug: "home-garden",
    imageUrl: "https://placehold.co/600x400/1a1a20/ffffff?text=Roborock+S7",
    rating: 4.7,
  },
  {
    name: "Samsung Galaxy S24 Ultra 512GB",
    description: "Флагманський смартфон Samsung з S Pen, камерою 200MP та дисплеєм Dynamic AMOLED 2X.",
    price: 49999,
    compareAt: 54999,
    stock: 35,
    sku: "SAMSUNG-S24U-512",
    categorySlug: "electronics",
    imageUrl: "https://placehold.co/600x400/1a1a20/ffffff?text=Galaxy+S24+Ultra",
    rating: 4.8,
  },
  {
    name: "Чоловічі джинси Levis 501 Original",
    description: "Класичні джинси Levis 501 з оригінальним кроєм та якісним деноміном.",
    price: 3299,
    stock: 89,
    sku: "LEVIS-501-ORIG",
    categorySlug: "clothing",
    imageUrl: "https://placehold.co/600x400/1a1a20/ffffff?text=Levis+501",
    rating: 4.6,
  },
  {
    name: "Жіночі кеди Converse Chuck Taylor All Star",
    description: "Класичні кеди Converse з культовим дизайном та міцною гумовою підошвою.",
    price: 2299,
    stock: 143,
    sku: "CONVERSE-ALLSTAR",
    categorySlug: "shoes",
    imageUrl: "https://placehold.co/600x400/1a1a20/ffffff?text=Converse",
    rating: 4.7,
  },
  {
    name: "Сонячні окуляри Ray-Ban Aviator Classic",
    description: "Класичні льотницькі окуляри Ray-Ban з поляризованими лінзами та металевою оправою.",
    price: 3499,
    stock: 112,
    sku: "RAYBAN-AVIATOR",
    categorySlug: "accessories",
    imageUrl: "https://placehold.co/600x400/1a1a20/ffffff?text=Ray-Ban",
    rating: 4.8,
  },
  {
    name: "Планшет iPad Air M2 256GB",
    description: "Потужний планшет Apple з чіпом M2, дисплеєм Liquid Retina та підтримкою Apple Pencil.",
    price: 34999,
    stock: 18,
    sku: "IPAD-AIR-M2-256",
    categorySlug: "electronics",
    imageUrl: "https://placehold.co/600x400/1a1a20/ffffff?text=iPad+Air",
    rating: 4.9,
  },
  {
    name: "Чоловіча сорочка Calvin Klein Classic Fit",
    description: "Класична біла сорочка з бавовни з перламутровими ґудзиками та добре сидить.",
    price: 1899,
    stock: 156,
    sku: "CK-SHIRT-CLASSIC",
    categorySlug: "clothing",
    imageUrl: "https://placehold.co/600x400/1a1a20/ffffff?text=CK+Shirt",
    rating: 4.5,
  },
  {
    name: "Чоловічі туфлі ECCO Soft 7",
    description: "Комфортні чоловічі туфлі з натуральної шкіри з технологією FLUIDFORM для максимального комфорту.",
    price: 4299,
    stock: 67,
    sku: "ECCO-SOFT-7",
    categorySlug: "shoes",
    imageUrl: "https://placehold.co/600x400/1a1a20/ffffff?text=ECCO",
    rating: 4.7,
  },
  {
    name: "Блендер Vitamix Professional 750",
    description: "Професійний блендер з потужністю 2.2 кВт для приготування смузі, супів та багатьох інших страв.",
    price: 32999,
    stock: 15,
    sku: "VITAMIX-PRO-750",
    categorySlug: "home-garden",
    imageUrl: "https://placehold.co/600x400/1a1a20/ffffff?text=Vitamix",
    rating: 4.9,
  },
];

const promotions = [
  {
    code: "WELCOME10",
    description: "10% знижка для нових клієнтів",
    type: "PERCENTAGE",
    value: 10,
    minSubtotal: 1000,
  },
  {
    code: "SAVE500",
    description: "Знижка 500 грн при замовленні від 5000",
    type: "FIXED",
    value: 500,
    minSubtotal: 5000,
  },
  {
    code: "SUMMER25",
    description: "25% літня знижка при замовленні від 3000 грн",
    type: "PERCENTAGE",
    value: 25,
    minSubtotal: 3000,
  },
  {
    code: "FREESHIP",
    description: "Безкоштовна доставка на будь-яке замовлення",
    type: "SHIPPING",
    value: 0,
    minSubtotal: 0,
  },
  {
    code: "BLACKFRIDAY",
    description: "Мега знижка 30% на все від 5000 грн",
    type: "PERCENTAGE",
    value: 30,
    minSubtotal: 5000,
  },
];

const users = [
  {
    email: "ivan@example.com",
    password: "customer123",
    name: "Іван Петренко",
    phone: "+380501234567",
    role: "CUSTOMER",
    addresses: [
      {
        label: "Дім",
        city: "Київ",
        street: "вул. Хрещатик, 1",
        postalCode: "01001",
      },
      {
        label: "Робота",
        city: "Київ",
        street: "вул. Банкова, 10",
        postalCode: "01008",
      },
    ],
  },
  {
    email: "maria@example.com",
    password: "customer123",
    name: "Марія Коваленко",
    phone: "+380502345678",
    role: "CUSTOMER",
    addresses: [
      {
        label: "Дім",
        city: "Львів",
        street: "вул. Шевченка, 45",
        postalCode: "79000",
      },
    ],
  },
  {
    email: "petro@example.com",
    password: "customer123",
    name: "Петро Сидоренко",
    phone: "+380503456789",
    role: "CUSTOMER",
    addresses: [
      {
        label: "Дім",
        city: "Одеса",
        street: "вул. Дерибасівська, 25",
        postalCode: "65000",
      },
    ],
  },
  {
    email: "olena@example.com",
    password: "customer123",
    name: "Олена Мельник",
    phone: "+380504567890",
    role: "CUSTOMER",
    addresses: [
      {
        label: "Дім",
        city: "Харків",
        street: "пр. Науки, 15",
        postalCode: "61000",
      },
    ],
  },
  {
    email: "andriy@example.com",
    password: "customer123",
    name: "Андрій Шевченко",
    phone: "+380505678901",
    role: "CUSTOMER",
    addresses: [
      {
        label: "Дім",
        city: "Дніпро",
        street: "вул. Набережна Перемоги, 30",
        postalCode: "49000",
      },
    ],
  },
  {
    email: "nadia@example.com",
    password: "customer123",
    name: "Надія Кравченко",
    phone: "+380506789012",
    role: "CUSTOMER",
    addresses: [
      {
        label: "Дім",
        city: "Запоріжжя",
        street: "пр. Соборний, 120",
        postalCode: "69000",
      },
    ],
  },
  {
    email: "serhiy@example.com",
    password: "customer123",
    name: "Сергій Бондаренко",
    phone: "+380507890123",
    role: "CUSTOMER",
    addresses: [
      {
        label: "Дім",
        city: "Вінниця",
        street: "вул. Соборна, 55",
        postalCode: "21000",
      },
    ],
  },
  {
    email: "tetyana@example.com",
    password: "customer123",
    name: "Тетяна Ткаченко",
    phone: "+380508901234",
    role: "CUSTOMER",
    addresses: [
      {
        label: "Дім",
        city: "Полтава",
        street: "вул. Європейська, 8",
        postalCode: "36000",
      },
    ],
  },
  {
    email: "vladyslav@example.com",
    password: "customer123",
    name: "Владислав Морозенко",
    phone: "+380509012345",
    role: "CUSTOMER",
    addresses: [
      {
        label: "Дім",
        city: "Чернігів",
        street: "пр. Перемоги, 95",
        postalCode: "14000",
      },
    ],
  },
  {
    email: "customer@example.com",
    password: "customer123",
    name: "Demo Customer",
    phone: "+380501111111",
    role: "CUSTOMER",
    addresses: [
      {
        label: "Дім",
        city: "Київ",
        street: "вул. Тестова, 1",
        postalCode: "01000",
      },
    ],
  },
];

const generateOrderNumber = (index) => {
  const timestamp = Date.now() - (1000 * 60 * 60 * 24 * 30) + (index * 1000 * 60 * 60); // Розподіляємо замовлення за останній місяць
  return `ORD-${timestamp}`;
};

const seed = async () => {
  console.log("🌱 Початок seed...");

  // Створюємо категорії
  console.log("📁 Створення категорій...");
  const categoryMap = {};
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
    categoryMap[category.slug] = created.id;
  }

  // Створюємо продукти
  console.log("📦 Створення продуктів...");
  const productMap = {};
  for (const product of products) {
    const categoryId = categoryMap[product.categorySlug];
    const slug = await generateSlugFor(prisma.product, product.name);

    const created = await prisma.product.upsert({
      where: { sku: product.sku },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        compareAt: product.compareAt,
        stock: product.stock,
        imageUrl: product.imageUrl,
        rating: product.rating,
        slug,
        categoryId,
      },
      create: {
        name: product.name,
        description: product.description,
        price: product.price,
        compareAt: product.compareAt,
        stock: product.stock,
        sku: product.sku,
        categoryId,
        imageUrl: product.imageUrl,
        rating: product.rating,
        slug,
      },
    });
    productMap[product.sku] = created;
  }

  // Створюємо промокоди
  console.log("🎟️ Створення промокодів...");
  const promotionMap = {};
  const now = new Date();
  for (const promo of promotions) {
    const slug = await generateSlugFor(prisma.promotion, promo.code);
    const created = await prisma.promotion.upsert({
      where: { code: promo.code },
      update: {
        description: promo.description,
        value: promo.value,
        minSubtotal: promo.minSubtotal,
        slug,
      },
      create: {
        code: promo.code,
        description: promo.description,
        type: promo.type,
        value: promo.value,
        minSubtotal: promo.minSubtotal,
        startDate: now,
        endDate: new Date(now.getFullYear(), now.getMonth() + 3, now.getDate()),
        isActive: true,
        slug,
      },
    });
    promotionMap[promo.code] = created;
  }

  // Створюємо користувачів з адресами та кошиками
  console.log("👥 Створення користувачів...");
  const userMap = {};
  for (const userData of users) {
    const hashedPassword = await hashPassword(userData.password);
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        name: userData.name,
        phone: userData.phone,
      },
      create: {
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        password: hashedPassword,
        role: userData.role,
        cart: { create: {} },
        addresses: {
          create: userData.addresses,
        },
      },
    });

    // Якщо користувач вже існував, додаємо адреси якщо їх немає
    const existingAddresses = await prisma.address.findMany({
      where: { userId: user.id },
    });
    if (existingAddresses.length === 0) {
      await prisma.address.createMany({
        data: userData.addresses.map(addr => ({
          ...addr,
          userId: user.id,
        })),
        skipDuplicates: true,
      });
    }

    // Створюємо кошик якщо його немає
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
    });
    if (!cart) {
      await prisma.cart.create({
        data: { userId: user.id },
      });
    }

    userMap[userData.email] = user;
  }

  // Додаємо товари в кошики деяких користувачів
  console.log("🛒 Додавання товарів до кошиків...");
  const sampleUsers = Object.values(userMap).slice(0, 5);
  const sampleProducts = Object.values(productMap).slice(0, 10);

  for (let i = 0; i < sampleUsers.length; i++) {
    const user = sampleUsers[i];
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { items: true },
    });

    // Видаляємо старі товари з кошика
    if (cart.items.length > 0) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    // Додаємо 1-3 випадкових товари
    const itemsToAdd = sampleProducts.slice(i * 2, (i * 2) + Math.floor(Math.random() * 3) + 1);
    for (const product of itemsToAdd) {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: product.id,
          quantity: Math.floor(Math.random() * 3) + 1,
          price: product.price,
        },
      });
    }
  }

  // Створюємо замовлення
  console.log("📋 Створення замовлень...");
  const productArray = Object.values(productMap);
  const promotionArray = Object.values(promotionMap);
  const userArray = Object.values(userMap);
  const orderStatuses = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
  const paymentStatuses = ["PENDING", "PAID", "FAILED", "REFUNDED"];
  const shipmentStatuses = ["PENDING", "PREPARING", "SHIPPED", "DELIVERED", "RETURNED"];

  const orders = [];

  // Створюємо 18 замовлень
  for (let i = 0; i < 18; i++) {
    const user = userArray[i % userArray.length];
    const orderNumber = generateOrderNumber(i);
    const statusIndex = Math.floor(Math.random() * orderStatuses.length);
    const status = orderStatuses[statusIndex];
    const usePromotion = Math.random() > 0.5 && promotionArray.length > 0;
    const promotion = usePromotion ? promotionArray[Math.floor(Math.random() * promotionArray.length)] : null;

    // Вибираємо 1-4 випадкові товари
    const itemsCount = Math.floor(Math.random() * 4) + 1;
    const selectedProducts = [];
    for (let j = 0; j < itemsCount; j++) {
      const product = productArray[Math.floor(Math.random() * productArray.length)];
      if (!selectedProducts.find(p => p.sku === product.sku)) {
        selectedProducts.push(product);
      }
    }

    // Розраховуємо суми
    let subtotal = 0;
    const orderItems = [];
    for (const product of selectedProducts) {
      const quantity = Math.floor(Math.random() * 3) + 1;
      const itemTotal = Number(product.price) * quantity;
      subtotal += itemTotal;
      orderItems.push({
        productId: product.id,
        quantity,
        price: product.price,
      });
    }

    // Розраховуємо знижку
    let discount = 0;
    if (promotion && subtotal >= Number(promotion.minSubtotal || 0)) {
      if (promotion.type === "PERCENTAGE") {
        discount = subtotal * (Number(promotion.value) / 100);
      } else if (promotion.type === "FIXED") {
        discount = Number(promotion.value);
      }
      discount = Math.min(discount, subtotal); // Не більше subtotal
    }

    const shipping = promotion && promotion.type === "SHIPPING" ? 0 : 150;
    const tax = (subtotal - discount) * 0.2; // ПДВ 20%
    const total = subtotal - discount + shipping + tax;

    // Визначаємо дату замовлення (в межах останніх 30 днів)
    const daysAgo = Math.floor(Math.random() * 30);
    const placedAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

    const address = await prisma.address.findFirst({
      where: { userId: user.id },
    });

    const order = await prisma.order.upsert({
      where: { orderNumber },
      update: {
        status,
        subtotal,
        discount,
        shipping,
        tax,
        total,
      },
      create: {
        orderNumber,
        user: { connect: { id: user.id } },
        ...(promotion && { promotion: { connect: { id: promotion.id } } }),
        contactName: user.name,
        contactEmail: user.email,
        contactPhone: user.phone,
        deliveryMethod: Math.random() > 0.5 ? "courier" : "post",
        deliveryCity: address?.city || "Київ",
        deliveryAddress: address ? `${address.street}, ${address.postalCode}` : "Адреса не вказана",
        deliveryNotes: Math.random() > 0.7 ? "Будь ласка, зателефонуйте перед доставкою" : null,
        status,
        subtotal,
        discount,
        shipping,
        tax,
        total,
        notes: status === "CANCELLED" ? "Замовлення скасовано клієнтом" : null,
        placedAt,
        items: {
          create: orderItems,
        },
      },
    });

    orders.push({ order, status, placedAt });
  }

  // Створюємо платежі та доставки для замовлень
  console.log("💳 Створення платежів та доставок...");
  for (let i = 0; i < orders.length; i++) {
    const { order, status } = orders[i];
    
    // Створюємо платіж для замовлень що не в статусі PENDING або CANCELLED
    if (status !== "PENDING" && status !== "CANCELLED") {
      const paymentStatus = status === "FAILED" ? "FAILED" : (Math.random() > 0.1 ? "PAID" : "PENDING");
      await prisma.payment.upsert({
        where: { orderId: order.id },
        update: {
          status: paymentStatus,
          amount: order.total,
          paidAt: paymentStatus === "PAID" ? order.placedAt : null,
          transactionId: paymentStatus === "PAID" ? `TXN-${Date.now()}-${order.id}` : null,
        },
        create: {
          orderId: order.id,
          provider: Math.random() > 0.5 ? "card" : "paypal",
          status: paymentStatus,
          amount: order.total,
          paidAt: paymentStatus === "PAID" ? order.placedAt : null,
          transactionId: paymentStatus === "PAID" ? `TXN-${Date.now()}-${order.id}` : null,
        },
      });
    }

    // Створюємо доставку для замовлень що в процесі доставки або доставлені
    if (["PROCESSING", "SHIPPED", "DELIVERED"].includes(status)) {
      let shipmentStatus = "PENDING";
      if (status === "SHIPPED") shipmentStatus = "SHIPPED";
      else if (status === "DELIVERED") shipmentStatus = "DELIVERED";
      else if (status === "PROCESSING") shipmentStatus = Math.random() > 0.5 ? "PREPARING" : "PENDING";

      await prisma.shipment.upsert({
        where: { orderId: order.id },
        update: {
          status: shipmentStatus,
          cost: order.shipping,
          trackingNumber: shipmentStatus !== "PENDING" ? `TRACK-${order.id}-${Date.now()}` : null,
          estimatedAt: shipmentStatus !== "DELIVERED" ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) : null,
        },
        create: {
          orderId: order.id,
          provider: Math.random() > 0.5 ? "nova-poshta" : "ukr-post",
          status: shipmentStatus,
          cost: order.shipping,
          trackingNumber: shipmentStatus !== "PENDING" ? `TRACK-${order.id}-${Date.now()}` : null,
          estimatedAt: shipmentStatus !== "DELIVERED" ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) : null,
        },
      });
    }
  }

  console.log("✅ Seed завершено успішно!");
  console.log(`📊 Створено:`);
  console.log(`   - ${categories.length} категорій`);
  console.log(`   - ${products.length} продуктів`);
  console.log(`   - ${promotions.length} промокодів`);
  console.log(`   - ${users.length} користувачів`);
  console.log(`   - ${orders.length} замовлень`);
};

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("❌ Помилка при seed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
