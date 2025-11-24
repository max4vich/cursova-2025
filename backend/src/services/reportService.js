const { prisma } = require("../libs/prisma");

const salesByCategory = async () => {
  const items = await prisma.orderItem.findMany({
    include: { product: { include: { category: true } } },
  });
  const summary = {};
  items.forEach((item) => {
    const category = item.product.category;
    if (!summary[category.id]) {
      summary[category.id] = {
        categoryId: category.id,
        category: category.name,
        quantity: 0,
        sales: 0,
      };
    }
    summary[category.id].quantity += item.quantity;
    summary[category.id].sales += Number(item.price) * item.quantity;
  });
  return Object.values(summary);
};

const revenueByPeriod = async ({ from, to }) => {
  const where = {};
  if (from || to) {
    where.placedAt = {};
    if (from) where.placedAt.gte = new Date(from);
    if (to) where.placedAt.lte = new Date(to);
  }
  const summary = await prisma.order.aggregate({
    where,
    _sum: { total: true },
  });
  return {
    revenue: Number(summary._sum.total || 0),
    from,
    to,
  };
};

const topProducts = async (limit = 5) => {
  const items = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: limit,
  });
  const productIds = items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true, imageUrl: true },
  });
  const lookup = Object.fromEntries(products.map((p) => [p.id, p]));
  return items.map((item) => ({
    product: lookup[item.productId],
    quantity: item._sum.quantity,
  }));
};

module.exports = {
  salesByCategory,
  revenueByPeriod,
  topProducts,
};

