import { useMemo, useState } from "react";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import useAdminData from "../../hooks/useAdminData";
import { adminApi } from "../../api/admin";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminToolbar from "../../components/admin/AdminToolbar";
import AdminTable from "../../components/admin/AdminTable";
import StatusBadge from "../../components/admin/StatusBadge";

const orderStatuses = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

const Orders = () => {
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: orders = [], loading, reload } = useAdminData(
    () => adminApi.getOrders(),
    [],
    { initialData: [] }
  );

  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") return orders;
    return orders.filter((order) => order.status === statusFilter);
  }, [orders, statusFilter]);

  const handleStatusChange = async (orderId, status) => {
    try {
      await adminApi.updateOrderStatus(orderId, status);
      toast.success("Статус оновлено");
      await reload();
    } catch (error) {
      toast.error(error.message || "Не вдалося оновити статус");
    }
  };

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Замовлення"
        description="Актуальні платежі та відвантаження"
        actions={
          <button type="button" className="pill-button pill-button--ghost" onClick={reload}>
            <RefreshCw size={16} />
            Оновити
          </button>
        }
      />

      <AdminToolbar>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="all">Усі статуси</option>
          {orderStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </AdminToolbar>

      <section className="card">
        {loading ? (
          <p className="muted">Завантаження…</p>
        ) : (
          <AdminTable
            data={filteredOrders}
            columns={[
              {
                header: "Номер",
                render: (order) => order.orderNumber || `#${order.id}`,
              },
              {
                header: "Клієнт",
                render: (order) => (
                  <div>
                    <strong>{order.user?.name || "Гість"}</strong>
                    <p className="muted small">{order.user?.email}</p>
                  </div>
                ),
              },
              {
                header: "Сума",
                render: (order) => `${Number(order.total).toLocaleString("uk-UA")} ₴`,
              },
              {
                header: "Оплата",
                render: (order) => <StatusBadge status={order.payment?.status || "N/A"} />,
              },
              {
                header: "Доставка",
                render: (order) => <StatusBadge status={order.shipment?.status || "N/A"} />,
              },
              {
                header: "Статус",
                render: (order) => (
                  <select value={order.status} onChange={(event) => handleStatusChange(order.id, event.target.value)}>
                    {orderStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                ),
              },
            ]}
            emptyLabel="Замовлень ще немає"
          />
        )}
      </section>
    </div>
  );
};

export default Orders;

