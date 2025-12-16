/**
 * @GofPattern:Builder
 * 
 * GoF Патерн: Builder (Породжуючий патерн)
 * 
 * Призначення:
 * Покрокова побудова складних об'єктів замовлень. Дозволяє створювати різні представлення
 * замовлення використовуючи той самий процес побудови. Забезпечує гнучкість у конструюванні
 * об'єктів з великою кількістю параметрів (subtotal, discount, shipping, tax, items тощо).
 * 
 * Переваги:
 * - Покрокова побудова складних об'єктів
 * - Відокремлення процесу створення від представлення
 * - Гнучкість у комбінуванні параметрів (опціональні поля, різні порядки додавання)
 * - Підтримка методу reset() для повторного використання будівника
 * 
 * Використання:
 * OrderBuilder використовується в CheckoutFacade.checkout() для побудови orderDraft
 * перед створенням замовлення в базі даних. Метод build() повертає фінальний об'єкт замовлення.
 */
class OrderBuilder {
  constructor() {
    this.reset();
  }

  reset() {
    this.order = {
      subtotal: 0,
      discount: 0,
      shipping: 0,
      tax: 0,
      total: 0,
      promotionId: null,
      items: [],
    };
    this.cart = null;
    return this;
  }

  withCart(cart) {
    this.cart = cart;
    this.order.subtotal = cart.subtotal;
    this.order.items = cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));
    return this;
  }

  withCustomer(userId) {
    this.order.userId = userId;
    return this;
  }

  withPromotion(promotion, discount) {
    if (promotion) {
      this.order.promotionId = promotion.id;
      this.order.discount = discount;
    }
    return this;
  }

  withShipping(shippingCost, provider) {
    this.order.shipping = shippingCost;
    this.order.shipmentProvider = provider;
    return this;
  }

  withTax(rate = 0.02) {
    this.order.tax = Math.round((this.order.subtotal - this.order.discount) * rate);
    return this;
  }

  finalizeTotals() {
    this.order.total =
      this.order.subtotal - this.order.discount + this.order.shipping + this.order.tax;
    return this;
  }

  build() {
    const result = { ...this.order };
    this.reset();
    return result;
  }
}

module.exports = OrderBuilder;

