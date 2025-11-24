const { prisma } = require("../libs/prisma");
const { generateSlugFor } = require("../utils/slugify");
const path = require("path");

const listCategories = () =>
  prisma.category.findMany({
    orderBy: { name: "asc" },
  });

const createCategory = async (payload) => {
  const slug = await generateSlugFor(prisma.category, payload.slug || payload.name, null, "category");
  return prisma.category.create({
    data: {
      ...payload,
      slug,
    },
  });
};

const updateCategory = async (id, payload) => {
  const data = { ...payload };
  if (payload.slug || payload.name) {
    data.slug = await generateSlugFor(
      prisma.category,
      payload.slug || payload.name,
      Number(id),
      "category"
    );
  }
  return prisma.category.update({
    where: { id: Number(id) },
    data,
  });
};

const deleteCategory = async (id) => {
  const categoryId = Number(id);
  
  // Перевіряємо, чи є продукти в цій категорії
  const products = await prisma.product.findMany({
    where: { categoryId },
    select: { id: true, name: true },
  });
  
  if (products.length > 0) {
    const error = new Error(
      `Неможливо видалити категорію: в ній є ${products.length} товарів. Спочатку перемістіть або видаліть товари.`
    );
    error.status = 400;
    throw error;
  }
  
  // Перевіряємо, чи є дочірні категорії
  const children = await prisma.category.findMany({
    where: { parentId: categoryId },
    select: { id: true, name: true },
  });
  
  if (children.length > 0) {
    const error = new Error(
      `Неможливо видалити категорію: вона має ${children.length} дочірніх категорій. Спочатку видаліть або перемістіть дочірні категорії.`
    );
    error.status = 400;
    throw error;
  }
  
  return prisma.category.delete({
    where: { id: categoryId },
  });
};

const upsertPromotion = async (payload) => {
  const data = {
    code: payload.code.toUpperCase(),
    description: payload.description,
    type: payload.type,
    value: payload.value,
    minSubtotal: payload.minSubtotal,
    maxUses: payload.maxUses,
    startDate: new Date(payload.startDate),
    endDate: new Date(payload.endDate),
    isActive: payload.isActive ?? true,
  };

  const slugSource = payload.slug || payload.description || payload.code;

  if (payload.id) {
    data.slug = await generateSlugFor(
      prisma.promotion,
      slugSource,
      Number(payload.id),
      "promo"
    );
    return prisma.promotion.update({
      where: { id: Number(payload.id) },
      data,
    });
  }

  data.slug = await generateSlugFor(prisma.promotion, slugSource, null, "promo");
  return prisma.promotion.create({ data });
};

const deletePromotion = (id) =>
  prisma.promotion.delete({
    where: { id: Number(id) },
  });

const listPromotions = () =>
  prisma.promotion.findMany({
    orderBy: { createdAt: "desc" },
  });

const listUsers = () =>
  prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { orders: true } },
      cart: true,
    },
  });

const updateUserRole = (id, role) =>
  prisma.user.update({
    where: { id: Number(id) },
    data: { role },
  });

const buildPublicUploadUrl = (req, filename) => {
  const base = `${req.protocol}://${req.get("host")}`;
  const normalized = path.posix.join("/uploads", filename);
  return `${base}${normalized}`;
};

module.exports = {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  upsertPromotion,
  listPromotions,
  deletePromotion,
  listUsers,
  updateUserRole,
  buildPublicUploadUrl,
};

