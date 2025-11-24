const { prisma } = require("../libs/prisma");
const cartService = require("./cartService");
const promotionService = require("./promotionService");
const CheckoutFacade = require("../patterns/checkout/CheckoutFacade");
const { getPaymentGateway } = require("../integrations/payment/MockPaymentGateway");
const { getShippingProvider } = require("../integrations/shipping/MockShippingProvider");

const checkoutFacade = new CheckoutFacade({
  cartService,
  paymentGateway: getPaymentGateway(),
  shippingProvider: getShippingProvider(),
});

const ensureProductAvailability = async (tx, items) => {
  for (const item of items) {
    const product = await tx.product.findUnique({
      where: { id: item.productId },
      select: { id: true, name: true, stock: true },
    });

    if (!product || product.stock < item.quantity) {
      const error = new Error(
        `Недостатньо залишку для товару «${product?.name || item.productId}»`
      );
      error.status = 400;
      throw error;
    }

    await tx.product.update({
      where: { id: product.id },
      data: { stock: { decrement: item.quantity } },
    });
  }
};

const checkout = async (userId, payload) => {
  const result = await checkoutFacade.checkout({ userId, payload });

  const order = await prisma.$transaction(
    async (tx) => {
      await ensureProductAvailability(tx, result.orderDraft.items);

      const created = await tx.order.create({
        data: {
          orderNumber: `ORD-${Date.now()}`,
          userId,
          promotionId: result.promotion?.id || null,
          status: result.paymentResult.status === "PAID" ? "PAID" : "PENDING",
          subtotal: result.orderDraft.subtotal,
          discount: result.orderDraft.discount,
          shipping: result.orderDraft.shipping,
          tax: result.orderDraft.tax,
          total: result.orderDraft.total,
          items: {
            create: result.orderDraft.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
          payment: {
            create: {
              provider: payload.paymentProvider || "mock",
              status: result.paymentResult.status,
              transactionId: result.paymentResult.transactionId,
              paidAt: result.paymentResult.paidAt,
              amount: result.orderDraft.total,
            },
          },
          shipment: {
            create: {
              provider: result.shipment.provider,
              trackingNumber: result.shipment.trackingNumber,
              status: "PENDING",
              cost: result.shipment.cost,
              estimatedAt: result.shipment.estimatedAt,
            },
          },
        },
        include: { items: true, payment: true, shipment: true },
      });

      if (result.promotion) {
        await promotionService.incrementUsage(tx, result.promotion.id);
      }

      const cartRecord = await tx.cart.findUnique({ where: { userId } });
      if (cartRecord) {
        await tx.cartItem.deleteMany({ where: { cartId: cartRecord.id } });
        await tx.cart.update({
          where: { id: cartRecord.id },
          data: { promotionId: null },
        });
      }

      return created;
    },
    { timeout: 15000 }
  );

  return order;
};

const listOrders = (userId) =>
  prisma.order.findMany({
    where: { userId },
    include: { items: { include: { product: true } }, payment: true, shipment: true },
    orderBy: { placedAt: "desc" },
  });

const listAllOrders = () =>
  prisma.order.findMany({
    include: { user: true, items: true, payment: true, shipment: true },
    orderBy: { placedAt: "desc" },
  });

const getOrder = async (orderId, userId, isAdmin = false) => {
  const where = { id: Number(orderId) };
  if (!isAdmin) {
    where.userId = userId;
  }
  return prisma.order.findFirst({
    where,
    include: { items: { include: { product: true } }, payment: true, shipment: true },
  });
};

const updateOrderStatus = (orderId, status) =>
  prisma.order.update({
    where: { id: Number(orderId) },
    data: { status },
    include: { items: true, payment: true, shipment: true },
  });

module.exports = {
  checkout,
  listOrders,
  listAllOrders,
  getOrder,
  updateOrderStatus,
};

