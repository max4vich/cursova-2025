const OrderBuilder = require("../order/OrderBuilder");
const { getShippingStrategy } = require("../shipping/ShippingStrategy");
const promotionService = require("../../services/promotionService");

class CheckoutFacade {
  constructor({ cartService, paymentGateway, shippingProvider }) {
    this.cartService = cartService;
    this.paymentGateway = paymentGateway;
    this.shippingProvider = shippingProvider;
  }

  async checkout({ userId, payload }) {
    const cart = await this.cartService.getOrCreateCart(userId);
    if (!cart || cart.items.length === 0) {
      const error = new Error("Кошик порожній");
      error.status = 400;
      throw error;
    }

    let promotion = null;
    let discount = 0;
    if (payload.promoCode) {
      promotion = await promotionService.validatePromotion(payload.promoCode);
      discount = promotionService.calculateDiscount(cart, promotion);
    } else if (cart.promotion) {
      promotion = cart.promotion;
      discount = promotionService.calculateDiscount(cart, promotion);
    }

    const shippingStrategy = getShippingStrategy(payload.shippingMethod);
    const shippingCost = shippingStrategy.calculate({
      ...cart,
      shippingCost: payload.shippingCost,
    });

    const builder = new OrderBuilder()
      .withCart(cart)
      .withCustomer(userId)
      .withPromotion(promotion, discount)
      .withShipping(shippingCost, payload.shippingProvider || payload.shippingMethod)
      .withTax(payload.taxRate || 0.02)
      .finalizeTotals();

    const orderDraft = builder.build();

    const paymentResult = await this.paymentGateway.charge({
      amount: orderDraft.total,
      provider: payload.paymentProvider || "mock-gateway",
      currency: payload.currency || "UAH",
    });

    const shipment = await this.shippingProvider.createShipment({
      provider: payload.shippingProvider || payload.shippingMethod || "nova-poshta",
      cost: shippingCost,
    });

    return {
      orderDraft,
      paymentResult,
      shipment,
      promotion,
    };
  }
}

module.exports = CheckoutFacade;

