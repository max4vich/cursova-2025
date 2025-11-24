import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { request } from "../api/client";

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    let isMounted = true;
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await request("/orders");
        if (isMounted) {
          setOrders(data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Не вдалося завантажити замовлення");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    loadOrders();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="page profile-page">
      <h1>Профіль</h1>

      <section className="card">
        <h3>Особисті дані</h3>
        <div className="profile-grid">
          <div>
            <p className="muted">Ім'я</p>
            <strong>{user.name}</strong>
          </div>
          <div>
            <p className="muted">Email</p>
            <strong>{user.email}</strong>
          </div>
          <div>
            <p className="muted">Телефон</p>
            <strong>{user.phone || "—"}</strong>
          </div>
          <div>
            <p className="muted">Адреса</p>
            <strong>{user.address || "—"}</strong>
          </div>
        </div>
      </section>

      <section className="card">
        <h3>Замовлення</h3>
        {loading ? (
          <p className="muted">Завантаження…</p>
        ) : error ? (
          <p className="muted">{error}</p>
        ) : orders.length === 0 ? (
          <p className="muted">Замовлень ще немає</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Дата</th>
                <th>Сума</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.orderNumber || order.id}</td>
                  <td>{new Date(order.placedAt).toLocaleDateString()}</td>
                  <td>{Number(order.total).toLocaleString("uk-UA")} ₴</td>
                  <td>
                    <span className={`status status--${order.status?.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default Profile;

