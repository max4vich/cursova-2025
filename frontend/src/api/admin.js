import { request } from "./client";

const buildQuery = (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.append(key, value);
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

export const adminApi = {
  getDashboardMetrics: () => request("/reports/revenue"),

  getSalesByCategory: () => request("/reports/sales-by-category"),
  getTopProducts: (limit = 5) => request(`/reports/top-products?limit=${limit}`),

  getProducts: (params) => request(`/admin/products${buildQuery(params)}`),
  createProduct: (payload) =>
    request("/admin/products", {
      method: "POST",
      body: payload,
    }),
  updateProduct: (id, payload) =>
    request(`/admin/products/${id}`, {
      method: "PUT",
      body: payload,
    }),
  deleteProduct: (id) =>
    request(`/admin/products/${id}`, {
      method: "DELETE",
    }),

  getCategories: () => request("/admin/categories"),
  createCategory: (payload) =>
    request("/admin/categories", {
      method: "POST",
      body: payload,
    }),
  updateCategory: (id, payload) =>
    request(`/admin/categories/${id}`, {
      method: "PUT",
      body: payload,
    }),
  deleteCategory: (id) =>
    request(`/admin/categories/${id}`, {
      method: "DELETE",
    }),

  getPromotions: () => request("/admin/promotions"),
  upsertPromotion: (payload) =>
    request(`/admin/promotions${payload.id ? `/${payload.id}` : ""}`, {
      method: payload.id ? "PUT" : "POST",
      body: payload,
    }),
  deletePromotion: (id) =>
    request(`/admin/promotions/${id}`, {
      method: "DELETE",
    }),

  getOrders: (params) => request(`/admin/orders${buildQuery(params)}`),
  updateOrderStatus: (id, status) =>
    request(`/admin/orders/${id}/status`, {
      method: "PATCH",
      body: { status },
    }),

  getUsers: () => request("/admin/users"),
  updateUserRole: (id, role) =>
    request(`/admin/users/${id}/role`, {
      method: "PATCH",
      body: { role },
    }),

  uploadProductImage: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return request("/admin/uploads", {
      method: "POST",
      headers: {},
      body: formData,
    });
  },
};

