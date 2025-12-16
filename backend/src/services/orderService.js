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

      const orderData = {
        orderNumber: `ORD-${Date.now()}`,
        userId: userId ? Number(userId) : null,
        promotionId: result.promotion?.id ? Number(result.promotion.id) : null,
        contactName: result.contactInfo.name,
        contactEmail: result.contactInfo.email,
        contactPhone: result.contactInfo.phone,
        deliveryMethod: result.deliveryInfo.method,
        deliveryCity: result.deliveryInfo.city || null,
        deliveryAddress: result.deliveryInfo.address || null,
        deliveryNotes: result.notes || null,
        notes: result.notes || null,
        status: result.paymentResult.status === "PAID" ? "PAID" : "PENDING",
        subtotal: Number(result.orderDraft.subtotal),
        discount: Number(result.orderDraft.discount || 0),
        shipping: Number(result.orderDraft.shipping || 0),
        tax: Number(result.orderDraft.tax || 0),
        total: Number(result.orderDraft.total),
        items: {
          create: result.orderDraft.items.map((item) => ({
            productId: Number(item.productId),
            quantity: Number(item.quantity),
            price: Number(item.price),
          })),
        },
        payment: {
          create: {
            provider: payload.paymentProvider || "mock",
            status: result.paymentResult.status || "PENDING",
            transactionId: result.paymentResult.transactionId || null,
            paidAt: result.paymentResult.paidAt || null,
            amount: Number(result.orderDraft.total),
          },
        },
        shipment: {
          create: {
            provider: result.shipment?.provider || "nova-poshta",
            trackingNumber: result.shipment?.trackingNumber || null,
            status: "PENDING",
            cost: Number(result.shipment?.cost || 0),
            estimatedAt: result.shipment?.estimatedAt || null,
          },
        },
      };

      const created = await tx.order.create({
        data: orderData,
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

