import { NavLink, Navigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  ArrowUpRight,
  Tags,
  TicketPercent,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const links = [
  { to: "/admin", label: "Дашборд", icon: <LayoutDashboard size={16} /> },
  { to: "/admin/products", label: "Товари", icon: <Package size={16} /> },
  { to: "/admin/categories", label: "Категорії", icon: <Tags size={16} /> },
  { to: "/admin/promotions", label: "Промокоди", icon: <TicketPercent size={16} /> },
  { to: "/admin/orders", label: "Замовлення", icon: <ShoppingBag size={16} /> },
  { to: "/admin/users", label: "Користувачі", icon: <Users size={16} /> },
];

const AdminLayout = () => {
  const { isAdmin, user, logout } = useAuth();

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <p className="admin-eyebrow">el3ctro</p>
          <h2>Адмін-панель</h2>
        </div>
        <nav>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/admin"}
              className={({ isActive }) =>
                `admin-link ${isActive ? "admin-link--active" : ""}`
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidecard">
          <p className="muted small">Увійшли як</p>
          <strong>{user?.name}</strong>
          <button className="pill-button pill-button--ghost" onClick={logout} type="button">
            Вийти
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <div className="admin-topbar">
          <div className="admin-topbar__user">
            <p className="muted small">Керує {user?.email}</p>
            <strong>{user?.name}</strong>
          </div>
          <div className="admin-toolbar__right">
            <NavLink to="/" className="pill-button pill-button--muted">
              <ArrowUpRight size={16} />
              На сайт
            </NavLink>
          </div>
        </div>
        <section className="admin-content">
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default AdminLayout;

