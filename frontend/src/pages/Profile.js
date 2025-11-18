import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { mockOrders } from "../data/mockData";

const Profile = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const orders = mockOrders.filter(
    (order) => order.customerEmail === user.email
  );

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
        {orders.length === 0 ? (
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
                  <td>{order.id}</td>
                  <td>{order.createdAt}</td>
                  <td>{order.total.toLocaleString("uk-UA")} ₴</td>
                  <td>
                    <span className={`status status--${order.status}`}>
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

