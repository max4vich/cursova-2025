/**
 * @GofPattern:FactoryMethod
 * @GofPattern:Strategy
 * 
 * GoF Патерни: Factory Method (Породжуючий) + Strategy (Поведінковий)
 * 
 * Призначення:
 * 
 * Factory Method (createPromotionStrategy):
 * Створює об'єкти стратегій розрахунку знижок без вказівки точних класів об'єктів.
 * Дозволяє підкласам вирішувати, який саме клас стратегії створювати на основі типу промокоду.
 * 
 * Strategy (BasePromotionStrategy та похідні):
 * Визначає сімейство алгоритмів розрахунку знижок, інкапсулює кожен з них і робить їх
 * взаємозамінними. Стратегії дозволяють змінювати алгоритм незалежно від клієнтів, що його використовують.
 * 
 * Реалізовані стратегії:
 * - PercentagePromotionStrategy: відсоткова знижка від суми замовлення
 * - FixedPromotionStrategy: фіксована сума знижки
 * - ShippingPromotionStrategy: знижка на доставку
 * 
 * Переваги:
 * - Легке додавання нових типів промокодів (нові стратегії)
 * - Відокремлення логіки розрахунку знижок від бізнес-логіки
 * - Взаємозамінність алгоритмів під час виконання
 * 
 * Використання:
 * PromotionFactory використовується в promotionService.calculateDiscount() для
 * створення відповідної стратегії на основі типу промокоду та розрахунку знижки.
 */
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

