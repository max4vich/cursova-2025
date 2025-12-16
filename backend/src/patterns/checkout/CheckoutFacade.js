/**
 * @GofPattern:Facade
 * 
 * GoF Патерн: Facade (Структурний патерн)
 * 
 * Призначення:
 * Надає спрощений уніфікований інтерфейс до складної підсистеми оформлення замовлення.
 * Приховує складність взаємодії з множиною сервісів: cartService, promotionService,
 * paymentGateway, shippingProvider, OrderBuilder та ShippingStrategy.
 * 
 * Переваги:
 * - Спрощує використання складної системи оформлення замовлень
 * - Ізолює клієнтський код від деталей реалізації підсистеми
 * - Сприяє слабкій зв'язаності (low coupling) компонентів
 * 
 * Використання:
 * CheckoutFacade використовується в orderService.js для спрощення процесу checkout.
 * Метод checkout() координує роботу всіх необхідних сервісів та повертає готовий результат.
 */
const OrderBuilder = require("../order/OrderBuilder");
const { getShippingStrategy } = require("../shipping/ShippingStrategy");
const promotionService = require("../../services/promotionService");

const normalizeContact = (customer = {}) => {
  const name = customer.name?.trim();
  const email = customer.email?.trim();
  const phone = customer.phone?.trim();
  if (!name || !email || !phone) {
    const error = new Error("Заповніть контактні дані");
    error.status = 400;
    throw error;
  }
  return { name, email, phone };
};

const normalizeDelivery = (delivery = {}) => {
  const method = delivery.method || "nova-poshta";
  if (method === "pickup") {
    const pickupLocation = delivery.pickupLocation?.trim();
    if (!pickupLocation) {
      const error = new Error("Оберіть точку самовивозу");
      error.status = 400;
      throw error;
    }
    return {
      method,
      pickupLocation,
      city: null,
      address: pickupLocation,
    };
  }

  const city = delivery.city?.trim();
  const department = delivery.department?.trim() || delivery.address?.trim();
  if (!city || !department) {
    const error = new Error("Вкажіть місто та відділення Нової Пошти");
    error.status = 400;
    throw error;
  }

  return {
    method: "nova-poshta",
    city,
    address: department,
    pickupLocation: null,
  };
};

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

    const contactInfo = normalizeContact(payload.customer || {});
    const deliveryInfo = normalizeDelivery(payload.delivery || {});

    let promotion = null;
    let discount = 0;
    if (payload.promoCode) {
      promotion = await promotionService.validatePromotion(payload.promoCode);
      discount = promotionService.calculateDiscount(cart, promotion);
    } else if (cart.promotion) {
      promotion = cart.promotion;
      discount = promotionService.calculateDiscount(cart, promotion);
    }

    const shippingMethod = payload.shippingMethod || deliveryInfo.method;
    const shippingStrategy = getShippingStrategy(shippingMethod);
    const shippingCost = shippingStrategy.calculate({
      ...cart,
      shippingCost: payload.shippingCost,
    });

    const builder = new OrderBuilder()
      .withCart(cart)
      .withCustomer(userId)
      .withPromotion(promotion, discount)
      .withShipping(shippingCost, payload.shippingProvider || shippingMethod)
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
      contactInfo,
      deliveryInfo,
      notes: payload.notes || null,
    };
  }
}

module.exports = CheckoutFacade;

