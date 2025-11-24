import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "sonner";
import { Edit, Plus, RefreshCw, Trash2 } from "lucide-react";
import { adminApi } from "../../api/admin";
import AdminToolbar from "./AdminToolbar";
import AdminTable from "./AdminTable";
import AdminModal from "./AdminModal";

const defaultForm = {
  name: "",
  slug: "",
  description: "",
  parentId: "",
};

const CategoryManager = ({ nested = false }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getCategories();
      setItems(data || []);
    } catch (error) {
      toast.error(error.message || "Не вдалося завантажити категорії");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter(
      (category) =>
        category.name.toLowerCase().includes(query) ||
        category.slug?.toLowerCase().includes(query)
    );
  }, [items, search]);

  const openModal = (category = null) => {
    if (category) {
      setEditing(category);
      setForm({
        name: category.name,
        slug: category.slug || "",
        description: category.description || "",
        parentId: category.parentId ? String(category.parentId) : "",
      });
    } else {
      setEditing(null);
      setForm(defaultForm);
    }
    setModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      parentId: form.parentId ? Number(form.parentId) : null,
    };
    try {
      if (editing) {
        await adminApi.updateCategory(editing.id, payload);
        toast.success("Категорію оновлено");
      } else {
        await adminApi.createCategory(payload);
        toast.success("Категорію створено");
      }
      setModalOpen(false);
      loadCategories();
    } catch (error) {
      toast.error(error.message || "Не вдалося зберегти категорію");
    }
  };

  const handleDelete = async (category) => {
    if (!window.confirm(`Видалити категорію «${category.name}»?`)) return;
    try {
      await adminApi.deleteCategory(category.id);
      toast.success("Категорію видалено");
      loadCategories();
    } catch (error) {
      toast.error(error.message || "Не вдалося видалити категорію");
    }
  };

  return (
    <section className={`card manager-card ${nested ? "manager-card--nested" : ""}`}>
      <div className="manager-card__header">
        <div>
          <h3>Категорії</h3>
          <p className="muted small">Формуйте структуру каталогу</p>
        </div>
        <div className="manager-card__actions">
          <button type="button" className="pill-button" onClick={() => openModal()}>
            <Plus size={16} />
            Нова категорія
          </button>
          <button type="button" className="pill-button pill-button--ghost" onClick={loadCategories}>
            <RefreshCw size={16} />
            Оновити
          </button>
        </div>
      </div>

      <AdminToolbar>
        <input placeholder="Пошук…" value={search} onChange={(event) => setSearch(event.target.value)} />
      </AdminToolbar>

      <div className="manager-card__table">
        {loading ? (
          <p className="muted">Завантаження…</p>
        ) : (
          <AdminTable
            data={filtered}
            columns={[
              { header: "Назва", key: "name" },
              { header: "Slug", key: "slug" },
              {
                header: "Parent",
                render: (row) => items.find((item) => item.id === row.parentId)?.name || "—",
              },
            ]}
            renderActions={(row) => (
              <>
                <button
                  className="link-button link-button--icon"
                  type="button"
                  onClick={() => openModal(row)}
                  title="Редагувати"
                >
                  <Edit size={16} />
                </button>
                <button
                  className="link-button link-button--icon"
                  type="button"
                  onClick={() => handleDelete(row)}
                  title="Видалити"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
            emptyLabel="Категорій ще немає"
          />
        )}
      </div>

      <AdminModal
        title={editing ? "Редагувати категорію" : "Нова категорія"}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button type="button" className="pill-button pill-button--ghost" onClick={() => setModalOpen(false)}>
              Скасувати
            </button>
            <button type="submit" form="category-form" className="pill-button">
              {editing ? "Оновити" : "Зберегти"}
            </button>
          </>
        }
      >
        <form id="category-form" className="form-grid" onSubmit={handleSubmit}>
          <label>
            Назва
            <input
              name="name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
          </label>
          <label>
            Slug (необов'язково)
            <input
              name="slug"
              value={form.slug}
              onChange={(event) => setForm({ ...form, slug: event.target.value })}
            />
          </label>
          <label>
            Батьківська категорія
            <select
              name="parentId"
              value={form.parentId}
              onChange={(event) => setForm({ ...form, parentId: event.target.value })}
            >
              <option value="">Без категорії</option>
              {items
                .filter((category) => !editing || category.id !== editing.id)
                .map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </label>
          <label>
            Опис
            <textarea
              name="description"
              rows="3"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
            />
          </label>
        </form>
      </AdminModal>
    </section>
  );
};

CategoryManager.propTypes = {
  nested: PropTypes.bool,
};

export default CategoryManager;

