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
    default:
      return new BaseShippingStrategy(method);
  }
};

module.exports = {
  getShippingStrategy,
};

