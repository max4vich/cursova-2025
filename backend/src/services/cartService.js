const { prisma } = require("../libs/prisma");
const promotionService = require("./promotionService");

const includeConfig = {
  items: {
    include: {
      product: {
        select: { id: true, name: true, price: true, imageUrl: true, stock: true },
      },
    },
  },
  promotion: true,
};

const mapCart = (cart) => {
  if (!cart) return null;
  const items = cart.items.map((item) => ({
    id: item.id,
    cartId: item.cartId,
    productId: item.productId,
    quantity: item.quantity,
    price: Number(item.price),
    product: item.product,
  }));
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const promotion =
    cart.promotion
      ? {
          ...cart.promotion,
          value: Number(cart.promotion.value),
          minSubtotal: cart.promotion.minSubtotal
            ? Number(cart.promotion.minSubtotal)
            : null,
        }
      : null;

  let discount = 0;
  if (promotion) {
    try {
      discount = promotionService.calculateDiscount({ subtotal, items }, promotion);
    } catch (error) {
      console.warn("Failed to calculate promotion discount", error);
      discount = 0;
    }
  }

  return {
    id: cart.id,
    userId: cart.userId,
    promotion,
    items,
    subtotal,
    discount,
    total: Math.max(subtotal - discount, 0),
    updatedAt: cart.updatedAt,
  };
};

const getOrCreateCart = async (userId) => {
  const cart = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
    include: includeConfig,
  });
  return mapCart(cart);
};

const addItem = async (userId, productId, quantity = 1) => {
  const product = await prisma.product.findUnique({
    where: { id: Number(productId) },
  });
  if (!product || !product.isActive) {
    const error = new Error("Товар недоступний");
    error.status = 400;
    throw error;
  }
  if (product.stock < quantity) {
    const error = new Error("Недостатньо товару на складі");
    error.status = 400;
    throw error;
  }

  const cart = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });

  const existing = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId: product.id },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: {
        quantity: Math.min(existing.quantity + quantity, product.stock),
      },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: product.id,
        quantity,
        price: product.price,
      },
    });
  }

  return getOrCreateCart(userId);
};

const updateItemQuantity = async (userId, itemId, quantity) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw new Error("Cart not found");

  const cartItem = await prisma.cartItem.findUnique({
    where: { id: Number(itemId) },
    include: { product: true },
  });

  if (!cartItem) {
    const error = new Error("Cart item not found");
    error.status = 404;
    throw error;
  }

  await prisma.cartItem.update({
    where: { id: Number(itemId) },
    data: { quantity: Math.max(1, Math.min(quantity, cartItem.product.stock)) },
  });

  return getOrCreateCart(userId);
};

const removeItem = async (userId, itemId) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw new Error("Cart not found");

  await prisma.cartItem.delete({
    where: { id: Number(itemId) },
  });

  return getOrCreateCart(userId);
};

const clearCart = async (userId) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return null;
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  await prisma.cart.update({
    where: { id: cart.id },
    data: { promotionId: null },
  });
  return getOrCreateCart(userId);
};

const applyPromotion = async (userId, code) => {
  const cart = await getOrCreateCart(userId);
  const promotion = await promotionService.validatePromotion(code);
  await prisma.cart.update({
    where: { id: cart.id },
    data: { promotionId: promotion.id },
  });
  return getOrCreateCart(userId);
};

const removePromotion = async (userId) => {
  const cart = await getOrCreateCart(userId);
  await prisma.cart.update({
    where: { id: cart.id },
    data: { promotionId: null },
  });
  return getOrCreateCart(userId);
};

module.exports = {
  getOrCreateCart,
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart,
  applyPromotion,
  removePromotion,
};

