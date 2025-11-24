const { prisma } = require("../libs/prisma");
const { createPromotionStrategy } = require("../patterns/promotions/PromotionFactory");

const validatePromotion = async (code) => {
  const promotion = await prisma.promotion.findUnique({
    where: { code: code.toUpperCase() },
  });
  if (!promotion || !promotion.isActive) {
    const error = new Error("Промокод не дійсний");
    error.status = 400;
    throw error;
  }
  const now = new Date();
  if (promotion.startDate > now || promotion.endDate < now) {
    const error = new Error("Промокод не активний");
    error.status = 400;
    throw error;
  }
  if (promotion.maxUses && promotion.usedCount >= promotion.maxUses) {
    const error = new Error("Досягнуто ліміт використань промокоду");
    error.status = 400;
    throw error;
  }
  return promotion;
};

const calculateDiscount = (cart, promotion) => {
  if (!promotion) return 0;
  if (promotion.minSubtotal && cart.subtotal < Number(promotion.minSubtotal)) {
    const error = new Error(
      `Сума замовлення має бути щонайменше ${promotion.minSubtotal}`
    );
    error.status = 400;
    throw error;
  }
  const strategy = createPromotionStrategy(promotion);
  const discount = strategy.calculate(cart);
  return Math.min(discount, cart.subtotal);
};

const incrementUsage = (client = prisma, promotionId) =>
  client.promotion.update({
    where: { id: promotionId },
    data: { usedCount: { increment: 1 } },
  });

module.exports = {
  validatePromotion,
  calculateDiscount,
  incrementUsage,
};

