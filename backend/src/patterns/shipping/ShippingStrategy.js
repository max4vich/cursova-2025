/**
 * @GofPattern:Strategy
 * 
 * GoF Патерн: Strategy (Поведінковий патерн)
 * 
 * Призначення:
 * Визначає сімейство алгоритмів розрахунку вартості доставки, інкапсулює кожен з них
 * і робить їх взаємозамінними. Дозволяє вибирати алгоритм розрахунку доставки динамічно
 * залежно від обраного користувачем методу доставки.
 * 
 * Реалізовані стратегії:
 * - ExpressShippingStrategy: швидка доставка (макс 120 грн або 4% від суми)
 * - EconomyShippingStrategy: економ доставка (фіксовано 80 грн)
 * - NovaPoshtaShippingStrategy: доставка Новою Поштою (макс 110 грн або 3% від суми)
 * - PickupShippingStrategy: самовивіз (безкоштовно - 0 грн)
 * - BaseShippingStrategy: стандартна доставка (2% від суми)
 * 
 * Переваги:
 * - Легке додавання нових методів доставки
 * - Відокремлення алгоритмів розрахунку від бізнес-логіки
 * - Можливість зміни стратегії під час виконання
 * - Усунення множинних умовних операторів (if/switch)
 * 
 * Використання:
 * ShippingStrategy використовується в CheckoutFacade.checkout() через getShippingStrategy()
 * для отримання відповідної стратегії на основі обраного методу доставки та розрахунку вартості.
 */
class BaseShippingStrategy {
  constructor(method = "standard") {
    this.method = method;
  }

  calculate(cart) {
    return Math.max(0, cart.subtotal * 0.02);
  }
}

class ExpressShippingStrategy extends BaseShippingStrategy {
  calculate(cart) {
    return Math.max(120, cart.subtotal * 0.04);
  }
}

class EconomyShippingStrategy extends BaseShippingStrategy {
  calculate() {
    return 80;
  }
}

class NovaPoshtaShippingStrategy extends BaseShippingStrategy {
  calculate(cart) {
    return Math.max(110, cart.subtotal * 0.03);
  }
}

class PickupShippingStrategy extends BaseShippingStrategy {
  calculate() {
    return 0;
  }
}

const getShippingStrategy = (method) => {
  switch (method) {
    case "express":
      return new ExpressShippingStrategy(method);
    case "pickup":
      return new PickupShippingStrategy(method);
    case "economy":
      return new EconomyShippingStrategy(method);
    case "nova-poshta":
      return new NovaPoshtaShippingStrategy(method);
    default:
      return new BaseShippingStrategy(method);
  }
};

module.exports = {
  getShippingStrategy,
};

