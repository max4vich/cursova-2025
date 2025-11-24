/* eslint-disable no-console */
const { PrismaClient } = require("@prisma/client");
const { hashPassword } = require("../src/utils/password");

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
    description: "Преміальні навушники з активним шумозаглушенням.",
    price: 12999,
    stock: 45,
    sku: "SONY-XM5",
    categorySlug: "electronics",
    imageUrl: "https://placehold.co/600x400/1a1a20/ffffff?text=Sony+XM5",
  },
  {
    name: "MacBook Pro 14 M3 Pro",
    description: "Потужний ноутбук з чіпом Apple M3 Pro.",
    price: 89999,
    stock: 12,
    sku: "MBP-14-M3",
    categorySlug: "electronics",
    imageUrl: "https://placehold.co/600x400/1a1a20/ffffff?text=MacBook+Pro",
  },
  {
    name: "Чоловіча куртка Columbia Omni-Heat",
    description: "Тепла зимова куртка з технологією Omni-Heat.",
    price: 4599,
    stock: 67,
    sku: "COL-OMNI",
    categorySlug: "clothing",
    imageUrl: "https://placehold.co/600x400/1a1a20/ffffff?text=Columbia",
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
];

const seed = async () => {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  for (const product of products) {
    const category = await prisma.category.findUnique({
      where: { slug: product.categorySlug },
    });
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl,
      },
      create: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        sku: product.sku,
        categoryId: category.id,
        imageUrl: product.imageUrl,
      },
    });
  }

  const now = new Date();
  for (const promo of promotions) {
    await prisma.promotion.upsert({
      where: { code: promo.code },
      update: {
        description: promo.description,
        value: promo.value,
        minSubtotal: promo.minSubtotal,
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
      },
    });
  }

  const password = await hashPassword("customer123");
  await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      name: "Demo Customer",
      password,
      role: "CUSTOMER",
      cart: { create: {} },
    },
  });
};

seed()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Database seeded");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

