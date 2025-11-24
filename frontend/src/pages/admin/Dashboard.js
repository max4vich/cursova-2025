import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { BarChart2, Package, ShoppingBag, Users as UsersIcon } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminStatsGrid from "../../components/admin/AdminStatsGrid";
import AdminTable from "../../components/admin/AdminTable";
import { adminApi } from "../../api/admin";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0,
    products: 0,
    orders: 0,
    customers: 0,
  });
  const [categorySales, setCategorySales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [revenueSummary, productsResponse, orders, users, categories, top] = await Promise.all([
          adminApi.getDashboardMetrics(),
          adminApi.getProducts({ pageSize: 1 }),
          adminApi.getOrders(),
          adminApi.getUsers(),
          adminApi.getSalesByCategory(),
          adminApi.getTopProducts(5),
        ]);

        setStats({
          revenue: revenueSummary?.revenue || 0,
          products: productsResponse?.total || 0,
          orders: orders?.length || 0,
          customers: users?.length || 0,
        });
        setCategorySales(categories || []);
        setTopProducts(top || []);
      } catch (error) {
        toast.error(error.message || "Не вдалося завантажити статистику");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const statCards = useMemo(
    () => [
      {
        label: "Виторг",
        value: `${stats.revenue.toLocaleString("uk-UA")} ₴`,
        icon: <BarChart2 size={18} />,
      },
      {
        label: "Активні товари",
        value: stats.products,
        icon: <Package size={18} />,
      },
      {
        label: "Замовлення",
        value: stats.orders,
        icon: <ShoppingBag size={18} />,
      },
      {
        label: "Користувачі",
        value: stats.customers,
        icon: <UsersIcon size={18} />,
      },
    ],
    [stats]
  );

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Панель керування"
        description="Метрики магазину"
        actions={
          loading && (
            <span className="tag" aria-live="polite">
              Оновлення...
            </span>
          )
        }
      />

      <AdminStatsGrid items={statCards} />

      <div className="admin-grid">
        <section className="card">
          <h3>Продажі по категоріях</h3>
          <AdminTable
            data={categorySales.map((item, index) => ({ id: index, ...item }))}
            columns={[
              { header: "Категорія", key: "category" },
              {
                header: "Продажі",
                render: (row) => `${row.sales.toLocaleString("uk-UA")} ₴`,
              },
              { header: "Кількість", key: "quantity" },
            ]}
            emptyLabel="Ще не було замовлень"
          />
        </section>

        <section className="card">
          <h3>Найпопулярніші товари</h3>
          {topProducts.length === 0 ? (
            <p className="muted">Немає даних для відображення.</p>
          ) : (
            <ul className="admin-list">
              {topProducts.map((item) => (
                <li key={item.product?.id}>
                  <div>
                    <strong>{item.product?.name}</strong>
                    <p className="muted">Продано: {item.quantity}</p>
                  </div>
                  <span className="tag">#{item.product?.id}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;

