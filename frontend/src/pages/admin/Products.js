import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, RefreshCw, Edit, Trash2, Upload, Package, Tag, Gift } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminToolbar from "../../components/admin/AdminToolbar";
import AdminTable from "../../components/admin/AdminTable";
import AdminModal from "../../components/admin/AdminModal";
import AdminStatsGrid from "../../components/admin/AdminStatsGrid";
import AdminTabs from "../../components/admin/AdminTabs";
import CategoryManager from "../../components/admin/CategoryManager";
import PromotionManager from "../../components/admin/PromotionManager";
import { adminApi } from "../../api/admin";

const createDefaultProduct = () => ({
  name: "",
  description: "",
  sku: "",
  price: "",
  compareAt: "",
  stock: "",
  imageUrl: "",
  categoryId: "",
});

const Products = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, total: 0 });
  const [filters, setFilters] = useState({ search: "", category: "", stock: "all" });
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState(() => createDefaultProduct());
  const [categories, setCategories] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [activePanel, setActivePanel] = useState("catalog");

  const loadProducts = useCallback(
    async (page = pagination.page) => {
      try {
        setLoading(true);
        const response = await adminApi.getProducts({
          page,
          pageSize: pagination.pageSize,
          search: filters.search,
          category: filters.category,
          inStock: filters.stock === "inStock" ? true : undefined,
        });
        setProducts(response.items || []);
        setPagination((prev) => ({
          ...prev,
          page,
          total: response.total || 0,
        }));
      } catch (error) {
        toast.error(error.message || "Не вдалося завантажити товари");
      } finally {
        setLoading(false);
      }
    },
    [filters.category, filters.search, filters.stock, pagination.pageSize]
  );

  const loadMeta = useCallback(async () => {
    try {
      const categoryList = await adminApi.getCategories();
      setCategories(categoryList || []);
      if (!productForm.categoryId && categoryList?.length) {
        setProductForm((prev) => ({ ...prev, categoryId: String(categoryList[0].id) }));
      }
    } catch (error) {
      toast.error(error.message || "Не вдалося завантажити категорії");
    }
  }, [productForm.categoryId]);

  useEffect(() => {
    loadProducts(1);
  }, [loadProducts]);

  useEffect(() => {
    loadMeta();
  }, [loadMeta]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setProductForm({
      ...createDefaultProduct(),
      categoryId: categories[0] ? String(categories[0].id) : "",
    });
    setDrawerOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || "",
      sku: product.sku || "",
      price: product.price,
      compareAt: product.compareAt || "",
      stock: product.stock,
      imageUrl: product.imageUrl || "",
      categoryId: product.categoryId ? String(product.categoryId) : "",
    });
    setDrawerOpen(true);
  };

  const handleSaveProduct = async (event) => {
    event.preventDefault();
    const payload = {
      ...productForm,
      price: Number(productForm.price),
      compareAt: productForm.compareAt ? Number(productForm.compareAt) : null,
      stock: Number(productForm.stock),
      categoryId: Number(productForm.categoryId),
    };
    try {
      if (editingProduct) {
        await adminApi.updateProduct(editingProduct.id, payload);
        toast.success("Товар оновлено");
      } else {
        await adminApi.createProduct(payload);
        toast.success("Товар створено");
      }
      setDrawerOpen(false);
      await loadProducts();
    } catch (error) {
      toast.error(error.message || "Сталася помилка під час збереження");
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const data = await adminApi.uploadProductImage(file);
      setProductForm((prev) => ({ ...prev, imageUrl: data.url }));
      toast.success("Зображення завантажено");
    } catch (error) {
      toast.error(error.message || "Не вдалося завантажити зображення");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Видалити товар?")) return;
    try {
      await adminApi.deleteProduct(productId);
      toast.success("Товар видалено");
      await loadProducts();
    } catch (error) {
      toast.error(error.message || "Не вдалося видалити товар");
    }
  };

  const productStats = useMemo(
    () => [
      {
        label: "У каталозі",
        value: pagination.total,
        icon: <RefreshCw size={16} />,
      },
      {
        label: "Доступно в наявності",
        value: products.filter((item) => item.stock > 0).length,
        icon: <Plus size={16} />,
      },
    ],
    [pagination.total, products]
  );

  const managementTabs = useMemo(
    () => [
      { id: "catalog", label: "Каталог", icon: <Package size={16} /> },
      { id: "categories", label: "Категорії", icon: <Tag size={16} />, badge: categories.length },
      { id: "promotions", label: "Промокоди", icon: <Gift size={16} /> },
    ],
    [categories.length]
  );

  const renderProductActions = (row) => (
    <>
      <button type="button" className="link-button link-button--icon" onClick={() => handleEdit(row)}>
        <Edit size={16} />
      </button>
      <button type="button" className="link-button link-button--icon" onClick={() => handleDelete(row.id)}>
        <Trash2 size={16} />
      </button>
    </>
  );

  const productTable = (
    <>
      <AdminTable
        data={products}
        columns={[
          { header: "Назва", key: "name" },
          {
            header: "Категорія",
            render: (row) => row.category?.name || "—",
          },
          {
            header: "Ціна",
            render: (row) => `${Number(row.price).toLocaleString("uk-UA")} ₴`,
          },
          {
            header: "Наявність",
            render: (row) => `${row.stock} шт`,
          },
        ]}
        renderActions={renderProductActions}
      />
      <div className="admin-toolbar__right">
        <span className="muted small">
          Сторінка {pagination.page} з {Math.max(1, Math.ceil(pagination.total / pagination.pageSize))}
        </span>
        <div className="admin-tabs">
          <button
            type="button"
            disabled={pagination.page === 1}
            onClick={() => loadProducts(Math.max(1, pagination.page - 1))}
          >
            Назад
          </button>
          <button
            type="button"
            disabled={pagination.page * pagination.pageSize >= pagination.total}
            onClick={() => loadProducts(pagination.page + 1)}
          >
            Далі
          </button>
        </div>
      </div>
    </>
  );

  const productCards = (
    <div className="admin-product-cards">
      {products.map((product) => (
        <article key={product.id} className="admin-product-card">
          <div className="admin-product-card__media">
            <img src={product.imageUrl || product.image || "https://placehold.co/600x400"} alt={product.name} />
          </div>
          <div className="admin-product-card__body">
            <div className="admin-product-card__header">
              <h4>{product.name}</h4>
              <span className="muted small">SKU: {product.sku}</span>
            </div>
            <p className="muted small">{product.category?.name || "Без категорії"}</p>
            <strong>{Number(product.price).toLocaleString("uk-UA")} ₴</strong>
            <span className="muted small">Залишок: {product.stock} шт</span>
          </div>
          <div className="admin-table__actions">{renderProductActions(product)}</div>
        </article>
      ))}
    </div>
  );

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Каталог товарів"
        description="Додавайте, редагуйте та публікуйте позиції"
        actions={
          <div className="admin-header-actions">
            <button
              type="button"
              className="pill-button pill-button--ghost"
              onClick={() => setActivePanel("categories")}
            >
              <Tag size={16} />
              Категорії
            </button>
            <button
              type="button"
              className="pill-button pill-button--ghost"
              onClick={() => setActivePanel("promotions")}
            >
              <Gift size={16} />
              Промокоди
            </button>
            <button type="button" className="pill-button" onClick={openCreateModal}>
              <Plus size={16} />
              Додати товар
            </button>
          </div>
        }
      />

      <AdminTabs tabs={managementTabs} active={activePanel} onChange={setActivePanel} />

      {activePanel === "catalog" && (
        <>
          <AdminStatsGrid items={productStats} />

          <AdminToolbar
            right={
              <>
                <div className="admin-tabs admin-tabs--ghost">
                  <button
                    type="button"
                    className={viewMode === "table" ? "admin-tabs__active" : ""}
                    onClick={() => setViewMode("table")}
                  >
                    Таблиця
                  </button>
                  <button
                    type="button"
                    className={viewMode === "cards" ? "admin-tabs__active" : ""}
                    onClick={() => setViewMode("cards")}
                  >
                    Картки
                  </button>
                </div>
                <button type="button" className="pill-button pill-button--ghost" onClick={() => loadProducts()}>
                  <RefreshCw size={16} />
                  Оновити
                </button>
              </>
            }
          >
            <input
              placeholder="Пошук…"
              value={filters.search}
              onChange={(event) => setFilters({ ...filters, search: event.target.value })}
            />
            <select
              value={filters.category}
              onChange={(event) => setFilters({ ...filters, category: event.target.value })}
            >
              <option value="">Усі категорії</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              value={filters.stock}
              onChange={(event) => setFilters({ ...filters, stock: event.target.value })}
            >
              <option value="all">Будь-який залишок</option>
              <option value="inStock">В наявності</option>
            </select>
          </AdminToolbar>

          <section className="card">
            <h3>Каталог</h3>
            {loading ? <p className="muted">Завантаження...</p> : viewMode === "table" ? productTable : productCards}
          </section>
        </>
      )}

      {activePanel === "categories" && <CategoryManager nested />}
      {activePanel === "promotions" && <PromotionManager nested />}

      <AdminModal
        open={drawerOpen}
        title={editingProduct ? "Редагувати товар" : "Створити товар"}
        onClose={() => setDrawerOpen(false)}
        footer={
          <>
            <button type="button" className="pill-button pill-button--ghost" onClick={() => setDrawerOpen(false)}>
              Скасувати
            </button>
            <button type="submit" form="product-form" className="pill-button">
              Зберегти
            </button>
          </>
        }
      >
        <form id="product-form" className="form-grid" onSubmit={handleSaveProduct}>
          <input
            name="name"
            placeholder="Назва"
            value={productForm.name}
            onChange={(event) => setProductForm({ ...productForm, name: event.target.value })}
            required
          />
          <input
            name="sku"
            placeholder="Артикул (SKU)"
            value={productForm.sku}
            onChange={(event) => setProductForm({ ...productForm, sku: event.target.value })}
            required
          />
          <select
            name="categoryId"
            value={productForm.categoryId}
            onChange={(event) => setProductForm({ ...productForm, categoryId: event.target.value })}
            required
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="price"
            placeholder="Ціна"
            value={productForm.price}
            onChange={(event) => setProductForm({ ...productForm, price: event.target.value })}
            required
          />
          <input
            type="number"
            name="compareAt"
            placeholder="Стара ціна"
            value={productForm.compareAt}
            onChange={(event) => setProductForm({ ...productForm, compareAt: event.target.value })}
          />
          <input
            type="number"
            name="stock"
            placeholder="Кількість"
            value={productForm.stock}
            onChange={(event) => setProductForm({ ...productForm, stock: event.target.value })}
            required
          />
          <div className="admin-upload">
            {productForm.imageUrl ? (
              <img
                src={productForm.imageUrl}
                alt="Попередній перегляд товару"
                className="admin-upload__preview"
              />
            ) : (
              <p className="muted small">Зображення ще не завантажено</p>
            )}
            <label className="pill-button pill-button--muted admin-upload__button">
              <Upload size={16} />
              {uploadingImage ? "Завантаження..." : "Завантажити фото"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                hidden
              />
            </label>
          </div>
          <input
            name="imageUrl"
            placeholder="Зображення (URL)"
            value={productForm.imageUrl}
            onChange={(event) => setProductForm({ ...productForm, imageUrl: event.target.value })}
          />
          <textarea
            name="description"
            placeholder="Опис"
            rows={4}
            value={productForm.description}
            onChange={(event) => setProductForm({ ...productForm, description: event.target.value })}
            style={{ gridColumn: "1 / -1" }}
          />
        </form>
      </AdminModal>
    </div>
  );
};

export default Products;

