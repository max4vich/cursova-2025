import { Link, NavLink, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { ShoppingCart, User, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

const navItems = [
  { to: "/", label: "Каталог" },
  { to: "/cart", label: "Кошик" },
  { to: "/checkout", label: "Оформлення" },
];

export const Header = () => {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const renderNavLinks = (onNavigate) =>
    navItems.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        className={({ isActive }) => `nav-link ${isActive ? "nav-link--active" : ""}`}
        onClick={onNavigate}
      >
        {item.label}
      </NavLink>
    ));

  const renderActions = (onAction) =>
    isAuthenticated ? (
      <div className="header__user">
        <button
          className="avatar"
          onClick={() => {
            onAction?.();
            navigate("/profile");
          }}
        >
          {initials || <User size={16} color="white" />}
        </button>
        {isAdmin && (
          <button
            className="pill-button"
            onClick={() => {
              onAction?.();
              navigate("/admin");
            }}
          >
            <LayoutDashboard size={16} color="white" />
            <span>Адмін</span>
          </button>
        )}
        <button
          className="pill-button pill-button--ghost"
          onClick={() => {
            onAction?.();
            handleLogout();
          }}
        >
          <LogOut size={16} color="white" />
          <span>Вийти</span>
        </button>
      </div>
    ) : (
      <div className="header__auth">
        <button
          className="pill-button pill-button--ghost"
          onClick={() => {
            onAction?.();
            navigate("/login");
          }}
        >
          Увійти
        </button>
        <button
          className="pill-button"
          onClick={() => {
            onAction?.();
            navigate("/register");
          }}
        >
          Реєстрація
        </button>
      </div>
    );

  return (
    <header className={`header ${isMobileMenuOpen ? "header--mobile-open" : ""}`}>
      <div className="header__container">
        <div className="header__brand">
          <Link to="/" className="logo">
            <span className="logo__dot" />
            <div>
              <p className="logo__title">EL3CTRO</p>
              <p className="logo__subtitle">м. Львів, вул. С. Бандери, 6</p>
            </div>
          </Link>
        </div>

        <nav className="header__nav">{renderNavLinks()}</nav>

        <div className="header__actions">
          <button
            className="icon-button"
            onClick={() => {
              navigate("/cart");
              setMobileMenuOpen(false);
            }}
          >
            <ShoppingCart size={20} color="white" />
            {itemCount > 0 && <span className="badge">{itemCount}</span>}
          </button>
          {renderActions()}
        </div>

        <button
          className="header__burger"
          type="button"
          aria-label="Меню"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          {isMobileMenuOpen ? <X size={20} color="white" /> : <Menu size={20} color="white" />}
        </button>
      </div>

      <div className="header__mobile-panel">
        <nav className="header__mobile-nav">{renderNavLinks(closeMobileMenu)}</nav>
        <div className="header__actions header__actions--mobile">
          <button
            className="icon-button"
            onClick={() => {
              navigate("/cart");
              closeMobileMenu();
            }}
          >
            <ShoppingCart size={20} color="white" />
            {itemCount > 0 && <span className="badge">{itemCount}</span>}
          </button>
          {renderActions(closeMobileMenu)}
        </div>
      </div>
    </header>
  );
};

