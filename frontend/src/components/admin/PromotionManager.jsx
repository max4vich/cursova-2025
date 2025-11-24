import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "sonner";
import { Edit, Plus, RefreshCw, Trash2 } from "lucide-react";
import { adminApi } from "../../api/admin";
import AdminToolbar from "./AdminToolbar";
import AdminTable from "./AdminTable";
import AdminModal from "./AdminModal";
import StatusBadge from "./StatusBadge";

const defaultForm = {
  code: "",
  description: "",
  type: "PERCENTAGE",
  value: "",
  minSubtotal: "",
  maxUses: "",
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10),
  isActive: true,
};

const PromotionManager = ({ nested = false }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editing, setEditing] = useState(null);

  const loadPromotions = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getPromotions();
      setItems(data || []);
    } catch (error) {
      toast.error(error.message || "Не вдалося завантажити промокоди");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter(
      (promo) =>
        promo.code.toLowerCase().includes(query) ||
        promo.description?.toLowerCase().includes(query)
    );
  }, [items, search]);

  const openModal = (promo = null) => {
    if (promo) {
      setEditing(promo);
      setForm({
        code: promo.code,
        description: promo.description || "",
        type: promo.type,
        value: Number(promo.value),
        minSubtotal: promo.minSubtotal ?? "",
        maxUses: promo.maxUses ?? "",
        startDate: promo.startDate.slice(0, 10),
        endDate: promo.endDate.slice(0, 10),
        isActive: promo.isActive,
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
      value: Number(form.value),
      minSubtotal: form.minSubtotal ? Number(form.minSubtotal) : null,
      maxUses: form.maxUses ? Number(form.maxUses) : null,
    };
    try {
      await adminApi.upsertPromotion({ ...(editing ? { id: editing.id } : {}), ...payload });
      toast.success(editing ? "Промокод оновлено" : "Промокод створено");
      setModalOpen(false);
      loadPromotions();
    } catch (error) {
      toast.error(error.message || "Не вдалося зберегти промокод");
    }
  };

  const handleDelete = async (promo) => {
    if (!window.confirm(`Видалити промокод ${promo.code}?`)) return;
    try {
      await adminApi.deletePromotion(promo.id);
      toast.success("Промокод видалено");
      loadPromotions();
    } catch (error) {
      toast.error(error.message || "Не вдалося видалити промокод");
    }
  };

  return (
    <section className={`card manager-card ${nested ? "manager-card--nested" : ""}`}>
      <div className="manager-card__header">
        <div>
          <h3>Промокоди</h3>
          <p className="muted small">Керуйте акціями та знижками</p>
        </div>
        <div className="manager-card__actions">
          <button type="button" className="pill-button" onClick={() => openModal()}>
            <Plus size={16} />
            Додати промокод
          </button>
          <button type="button" className="pill-button pill-button--ghost" onClick={loadPromotions}>
            <RefreshCw size={16} />
            Оновити
          </button>
        </div>
      </div>

      <AdminToolbar>
        <input placeholder="Пошук за кодом" value={search} onChange={(event) => setSearch(event.target.value)} />
      </AdminToolbar>

      <div className="manager-card__table">
        {loading ? (
          <p className="muted">Завантаження…</p>
        ) : (
          <AdminTable
            data={filtered}
            columns={[
              { header: "Код", key: "code" },
              { header: "Опис", key: "description" },
              {
                header: "Тип",
                render: (row) => (row.type === "PERCENTAGE" ? "Відсоток" : "Фіксована / Доставка"),
              },
              {
                header: "Значення",
                render: (row) =>
                  row.type === "PERCENTAGE"
                    ? `${Number(row.value)} %`
                    : `${Number(row.value).toLocaleString("uk-UA")} ₴`,
              },
              {
                header: "Статус",
                render: (row) => <StatusBadge status={row.isActive ? "active" : "inactive"} />,
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
            emptyLabel="Промокодів ще немає"
          />
        )}
      </div>

      <AdminModal
        title={editing ? "Редагувати промокод" : "Новий промокод"}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button type="button" className="pill-button pill-button--ghost" onClick={() => setModalOpen(false)}>
              Скасувати
            </button>
            <button type="submit" form="promotion-form" className="pill-button">
              {editing ? "Оновити" : "Зберегти"}
            </button>
          </>
        }
      >
        <form id="promotion-form" className="form-grid" onSubmit={handleSubmit}>
          <label>
            Код
            <input
              name="code"
              value={form.code}
              onChange={(event) => setForm({ ...form, code: event.target.value.toUpperCase() })}
              required
            />
          </label>
          <label>
            Опис
            <input
              name="description"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
            />
          </label>
          <label>
            Тип
            <select name="type" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
              <option value="PERCENTAGE">Відсоток</option>
              <option value="FIXED">Фіксована</option>
              <option value="SHIPPING">Безкоштовна доставка</option>
            </select>
          </label>
          <label>
            Значення
            <input
              type="number"
              name="value"
              value={form.value}
              onChange={(event) => setForm({ ...form, value: event.target.value })}
              required
            />
          </label>
          <label>
            Мін. сума
            <input
              type="number"
              name="minSubtotal"
              value={form.minSubtotal}
              onChange={(event) => setForm({ ...form, minSubtotal: event.target.value })}
            />
          </label>
          <label>
            Макс. використань
            <input
              type="number"
              name="maxUses"
              value={form.maxUses}
              onChange={(event) => setForm({ ...form, maxUses: event.target.value })}
            />
          </label>
          <label>
            Дата початку
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={(event) => setForm({ ...form, startDate: event.target.value })}
            />
          </label>
          <label>
            Дата завершення
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={(event) => setForm({ ...form, endDate: event.target.value })}
            />
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => setForm({ ...form, isActive: event.target.checked })}
            />
            Активний промокод
          </label>
        </form>
      </AdminModal>
    </section>
  );
};

PromotionManager.propTypes = {
  nested: PropTypes.bool,
};

export default PromotionManager;

