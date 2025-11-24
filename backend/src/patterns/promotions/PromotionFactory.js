class BasePromotionStrategy {
  constructor(promotion) {
    this.promotion = promotion;
  }

  calculate(_cart) {
    return 0;
  }
}

class PercentagePromotionStrategy extends BasePromotionStrategy {
  calculate(cart) {
    return (cart.subtotal * Number(this.promotion.value)) / 100;
  }
}

class FixedPromotionStrategy extends BasePromotionStrategy {
  calculate() {
    return Number(this.promotion.value);
  }
}

class ShippingPromotionStrategy extends BasePromotionStrategy {
  calculate(cart) {
    return Math.min(cart.shippingCost || 0, Number(this.promotion.value));
  }
}

const createPromotionStrategy = (promotion) => {
  switch (promotion.type) {
    case "PERCENTAGE":
      return new PercentagePromotionStrategy(promotion);
    case "FIXED":
      return new FixedPromotionStrategy(promotion);
    case "SHIPPING":
      return new ShippingPromotionStrategy(promotion);
    default:
      return new BasePromotionStrategy(promotion);
  }
};

module.exports = { createPromotionStrategy };

