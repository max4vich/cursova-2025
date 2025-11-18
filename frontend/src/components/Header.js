import { Link, NavLink, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { ShoppingCart, User, LayoutDashboard, LogOut } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

const navItems = [
  { to: "/", label: "Каталог" },
  { to: "/cart", label: "Кошик" },
  { to: "/checkout", label: "Оформлення" },
];

export const Header = ({ onSearchChange }) => {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const initials = useMemo(() => {
    if (!user) return "";
    return user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header__brand">
        <Link to="/" className="logo">
          <span className="logo__dot" />
          <div>
            <p className="logo__title">EL3CTRO</p>
            <p className="logo__subtitle">м. Львів, вул. С. Бандери, 6</p>
          </div>
        </Link>
        <div className="header__search">
          <div className="header__search-wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="18"
              height="18"
            >
              <path
                fill="currentColor"
                d="m21 20.29-4.17-4.17a7.5 7.5 0 1 0-1.41 1.41L19.59 22zm-6.5-3.79a6 6 0 1 1 0-12 6 6 0 0 1 0 12"
              />
            </svg>
            <input
              type="search"
              placeholder="Пошук товарів..."
              onChange={(event) => onSearchChange?.(event.target.value)}
            />
          </div>
        </div>
      </div>

      <nav className="header__nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `nav-link ${isActive ? "nav-link--active" : ""}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="header__actions">
        <button className="icon-button" onClick={() => navigate("/cart")}>
          <ShoppingCart size={20} />
          {itemCount > 0 && <span className="badge">{itemCount}</span>}
        </button>

        {isAuthenticated ? (
          <div className="header__user">
            <button className="avatar" onClick={() => navigate("/profile")}>
              {initials || <User size={16} />}
            </button>
            {isAdmin && (
              <button
                className="pill-button"
                onClick={() => navigate("/admin")}
              >
                <LayoutDashboard size={16} />
                <span>Адмін</span>
              </button>
            )}
            <button className="pill-button pill-button--ghost" onClick={handleLogout}>
              <LogOut size={16} />
              <span>Вийти</span>
            </button>
          </div>
        ) : (
          <div className="header__auth">
            <button
              className="pill-button pill-button--ghost"
              onClick={() => navigate("/login")}
            >
              Увійти
            </button>
            <button
              className="pill-button"
              onClick={() => navigate("/register")}
            >
              Реєстрація
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

