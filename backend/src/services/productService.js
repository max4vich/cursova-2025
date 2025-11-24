const { prisma } = require("../libs/prisma");
const { generateSlugFor } = require("../utils/slugify");

const listProducts = async ({ search, category, minPrice, maxPrice, inStock, page = 1, pageSize = 20 }) => {
  const where = { isActive: true };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (category) {
    if (!Number.isNaN(Number(category))) {
      where.categoryId = Number(category);
    } else {
      where.category = { slug: category };
    }
  }
  if (minPrice) {
    where.price = { ...(where.price || {}), gte: Number(minPrice) };
  }
  if (maxPrice) {
    where.price = { ...(where.price || {}), lte: Number(maxPrice) };
  }
  if (inStock) {
    where.stock = { gt: 0 };
  }

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize) || 1,
  };
};

const getProduct = (id) =>
  prisma.product.findUnique({
    where: { id: Number(id) },
    include: { category: true },
  });

const listCategories = () =>
  prisma.category.findMany({
    orderBy: { name: "asc" },
  });

const createProduct = async (payload) => {
  const {
    name,
    description,
    price,
    stock,
    categoryId,
    sku,
    imageUrl,
    compareAt,
    slug: slugInput,
    isActive = true,
  } = payload;

  const slug = await generateSlugFor(prisma.product, slugInput || name, null, "product");

  return prisma.product.create({
    data: {
      name,
      description,
      price,
      stock,
      categoryId,
      sku,
      imageUrl,
      compareAt,
      slug,
      isActive,
    },
  });
};

const updateProduct = async (id, payload) => {
  const data = { ...payload };
  if (payload.slug || payload.name) {
    data.slug = await generateSlugFor(
      prisma.product,
      payload.slug || payload.name,
      Number(id),
      "product"
    );
  }

  return prisma.product.update({
    where: { id: Number(id) },
    data,
  });
};

const deleteProduct = async (id) => {
  const productId = Number(id);
  
  // Перевіряємо, чи є замовлення з цим продуктом
  const orderItems = await prisma.orderItem.findMany({
    where: { productId },
    select: { id: true },
  });
  
  if (orderItems.length > 0) {
    const error = new Error(
      `Неможливо видалити товар: він використовується в ${orderItems.length} замовленнях. Спочатку видаліть або скасуйте замовлення.`
    );
    error.status = 400;
    throw error;
  }
  
  // Видаляємо товар (CartItem видаляться автоматично через Cascade)
  return prisma.product.delete({
    where: { id: productId },
  });
};

module.exports = {
  listProducts,
  getProduct,
  listCategories,
  createProduct,
  updateProduct,
  deleteProduct,
};

