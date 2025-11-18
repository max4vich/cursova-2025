import { NavLink, Navigate, Outlet } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const links = [
  { to: "/admin", label: "Дашборд", icon: <LayoutDashboard size={16} /> },
  { to: "/admin/products", label: "Товари", icon: <Package size={16} /> },
  { to: "/admin/orders", label: "Замовлення", icon: <ShoppingBag size={16} /> },
];

const AdminLayout = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Admin</h2>
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
      </aside>

      <section className="admin-content">
        <Outlet />
      </section>
    </div>
  );
};

export default AdminLayout;

