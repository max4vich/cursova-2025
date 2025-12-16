const { prisma } = require("../libs/prisma");
const { generateSlugFor } = require("../utils/slugify");
const path = require("path");

const buildCategoryTree = (items) =>
  items.map((category) => ({
    ...category,
    children: category.children || [],
  }));

const listCategories = async () => {
  const parents = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { name: "asc" },
    include: {
      children: {
        orderBy: { name: "asc" },
      },
    },
  });
  return buildCategoryTree(parents);
};

const ensureValidParentId = async ({ parentId, categoryId }) => {
  if (parentId === undefined || parentId === null || parentId === "") {
    return null;
  }

  const normalized = Number(parentId);
  if (Number.isNaN(normalized)) {
    const error = new Error("Некоректна батьківська категорія");
    error.status = 400;
    throw error;
  }

  if (categoryId && normalized === Number(categoryId)) {
    const error = new Error("Категорія не може бути батьківською для себе");
    error.status = 400;
    throw error;
  }

  const parent = await prisma.category.findUnique({
    where: { id: normalized },
  });

  if (!parent) {
    const error = new Error("Батьківську категорію не знайдено");
    error.status = 404;
    throw error;
  }

  if (parent.parentId) {
    const error = new Error("Неможливо обрати дочірню категорію як батьківську");
    error.status = 400;
    throw error;
  }

  if (categoryId) {
    const childrenCount = await prisma.category.count({
      where: { parentId: Number(categoryId) },
    });
    if (childrenCount > 0) {
      const error = new Error("Категорія має підкатегорії та не може стати дочірньою");
      error.status = 400;
      throw error;
    }
  }

  return normalized;
};

const createCategory = async (payload) => {
  const parentId = await ensureValidParentId({ parentId: payload.parentId });
  const slug = await generateSlugFor(prisma.category, payload.slug || payload.name, null, "category");
  return prisma.category.create({
    data: {
      ...payload,
      parentId,
      slug,
    },
  });
};

const updateCategory = async (id, payload) => {
  const data = { ...payload };
  if (payload.parentId !== undefined) {
    data.parentId = await ensureValidParentId({ parentId: payload.parentId, categoryId: id });
  }
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

