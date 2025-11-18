import { useState } from "react";
import { toast } from "sonner";
import { mockOrders } from "../../data/mockData";

const statuses = ["processing", "shipped", "delivered"];

const Orders = () => {
  const [orders, setOrders] = useState(mockOrders);

  const handleStatusChange = (orderId, status) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
    toast.info("Статус замовлення оновлено");
  };

  return (
    <div className="admin-page">
      <h1>Замовлення</h1>
      <section className="card">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Клієнт</th>
              <th>Сума</th>
              <th>Оплата</th>
              <th>Доставка</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>
                  <strong>{order.customerName}</strong>
                  <p className="muted">{order.customerEmail}</p>
                </td>
                <td>{order.total.toLocaleString("uk-UA")} ₴</td>
                <td>{order.paymentMethod}</td>
                <td>{order.deliveryMethod}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(event) =>
                      handleStatusChange(order.id, event.target.value)
                    }
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Orders;

