import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RefreshCw, TrendingUp, Package, BarChart3 } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminTable from "../../components/admin/AdminTable";
import { adminApi } from "../../api/admin";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("revenue");
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState({ revenue: 0, from: null, to: null });
  const [categorySales, setCategorySales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  
  // Фільтри
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [topProductsLimit, setTopProductsLimit] = useState(5);

  const loadReports = async () => {
    try {
      setLoading(true);
      const [revenueData, categories, top] = await Promise.all([
        adminApi.getRevenueByPeriod(dateFrom || undefined, dateTo || undefined),
        adminApi.getSalesByCategory(),
        adminApi.getTopProducts(topProductsLimit),
      ]);

      setRevenue(revenueData || { revenue: 0, from: dateFrom, to: dateTo });
      setCategorySales(categories || []);
      setTopProducts(top || []);
    } catch (error) {
      toast.error(error.message || "Не вдалося завантажити звіти");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [topProductsLimit]);

  const handleApplyDateFilter = () => {
    if (dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)) {
      toast.error("Дата 'від' не може бути пізніше дати 'до'");
      return;
    }
    loadReports();
  };

  const handleResetDateFilter = () => {
    setDateFrom("");
    setDateTo("");
    setTimeout(() => {
      loadReports();
    }, 0);
  };

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Звіти"
        description="Аналітика продажів та доходів"
        actions={
          <button
            type="button"
            className="pill-button pill-button--ghost"
            onClick={loadReports}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "spin" : ""} color="white" />
            Оновити
          </button>
        }
      />

      <div className="admin-tabs admin-tabs--pills" style={{ marginBottom: "var(--space-16)" }}>
        <button
          type="button"
          className={`admin-tabs__item ${activeTab === "revenue" ? "admin-tabs__item--active" : ""}`}
          onClick={() => setActiveTab("revenue")}
        >
          <span className="admin-tabs__icon">
            <TrendingUp size={16} color="white" />
          </span>
          Доходи за період
        </button>
        <button
          type="button"
          className={`admin-tabs__item ${activeTab === "categories" ? "admin-tabs__item--active" : ""}`}
          onClick={() => setActiveTab("categories")}
        >
          <span className="admin-tabs__icon">
            <BarChart3 size={16} color="white" />
          </span>
          Продажі по категоріях
        </button>
        <button
          type="button"
          className={`admin-tabs__item ${activeTab === "products" ? "admin-tabs__item--active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          <span className="admin-tabs__icon">
            <Package size={16} color="white" />
          </span>
          Найпопулярніші товари
        </button>
      </div>

      <section className="card">
        {/* Секція: Доходи за період */}
        {activeTab === "revenue" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
              <TrendingUp size={20} color="white" />
              <h3>Доходи за період</h3>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
              <div style={{ flex: "1", minWidth: "150px" }}>
                <label className="admin-label" htmlFor="date-from">
                  Дата від
                </label>
                <input
                  id="date-from"
                  type="date"
                  className="admin-input"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div style={{ flex: "1", minWidth: "150px" }}>
                <label className="admin-label" htmlFor="date-to">
                  Дата до
                </label>
                <input
                  id="date-to"
                  type="date"
                  className="admin-input"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
                <button
                  type="button"
                  className="pill-button"
                  onClick={handleApplyDateFilter}
                  disabled={loading}
                >
                  Застосувати
                </button>
                {(dateFrom || dateTo) && (
                  <button
                    type="button"
                    className="pill-button pill-button--ghost"
                    onClick={handleResetDateFilter}
                    disabled={loading}
                  >
                    Скинути
                  </button>
                )}
              </div>
            </div>

            <div style={{ background: "var(--bg-secondary)", borderRadius: "8px" }}>
              <p className="muted small" style={{ marginBottom: "0.5rem" }}>
                Загальний дохід
                {revenue.from && revenue.to && (
                  <span>
                    {" "}
                    з {new Date(revenue.from).toLocaleDateString("uk-UA")} по{" "}
                    {new Date(revenue.to).toLocaleDateString("uk-UA")}
                  </span>
                )}
              </p>
              <h2 style={{ fontSize: "2rem", fontWeight: "600", margin: 0 }}>
                {revenue.revenue.toLocaleString("uk-UA")} ₴
              </h2>
            </div>
          </>
        )}

        {/* Секція: Продажі по категоріях */}
        {activeTab === "categories" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
              <BarChart3 size={20} color="white" />
              <h3>Продажі по категоріях</h3>
            </div>

            {loading && categorySales.length === 0 ? (
              <p className="muted">Завантаження...</p>
            ) : categorySales.length === 0 ? (
              <p className="muted">Ще не було замовлень</p>
            ) : (
              <AdminTable
                data={categorySales.map((item, index) => ({ id: index, ...item }))}
                columns={[
                  { header: "Категорія", key: "category" },
                  {
                    header: "Продажі",
                    render: (row) => `${Number(row.sales || 0).toLocaleString("uk-UA")} ₴`,
                  },
                  {
                    header: "Кількість",
                    render: (row) => `${row.quantity || 0} шт.`,
                  },
                ]}
                emptyLabel="Немає даних"
              />
            )}
          </>
        )}

        {/* Секція: Найпопулярніші товари */}
        {activeTab === "products" && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Package size={20} color="white" />
                <h3>Найпопулярніші товари</h3>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <label className="admin-label" htmlFor="top-limit" style={{ margin: 0, fontSize: "0.875rem" }}>
                  Показати:
                </label>
                <select
                  id="top-limit"
                  className="admin-input"
                  value={topProductsLimit}
                  onChange={(e) => setTopProductsLimit(Number(e.target.value))}
                  style={{ width: "auto", minWidth: "80px" }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {loading && topProducts.length === 0 ? (
              <p className="muted">Завантаження...</p>
            ) : topProducts.length === 0 ? (
              <p className="muted">Немає даних для відображення</p>
            ) : (
              <div className="admin-list">
                {topProducts.map((item, index) => (
                  <div
                    key={item.product?.id || index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "1rem",
                      borderBottom: "1px solid var(--border-color)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1 }}>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "32px",
                          height: "32px",
                          borderRadius: "6px",
                          background: "var(--bg-secondary)",
                          fontWeight: "600",
                          fontSize: "0.875rem",
                        }}
                      >
                        #{index + 1}
                      </span>
                      <div style={{ flex: 1 }}>
                        <strong style={{ display: "block", marginBottom: "0.25rem" }}>
                          {item.product?.name || "Невідомий товар"}
                        </strong>
                        <p className="muted" style={{ margin: 0, fontSize: "0.875rem" }}>
                          ID: {item.product?.id || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span className="tag" style={{ fontSize: "0.875rem" }}>
                        {item.quantity || 0} шт.
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Reports;

