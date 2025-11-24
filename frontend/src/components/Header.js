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

export const Header = ({ onSearchChange }) => {
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
          {initials || <User size={16} />}
        </button>
        {isAdmin && (
          <button
            className="pill-button"
            onClick={() => {
              onAction?.();
              navigate("/admin");
            }}
          >
            <LayoutDashboard size={16} />
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
          <LogOut size={16} />
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

        <nav className="header__nav">{renderNavLinks()}</nav>

        <div className="header__actions">
          <button
            className="icon-button"
            onClick={() => {
              navigate("/cart");
              setMobileMenuOpen(false);
            }}
          >
            <ShoppingCart size={20} />
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
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
            <ShoppingCart size={20} />
            {itemCount > 0 && <span className="badge">{itemCount}</span>}
          </button>
          {renderActions(closeMobileMenu)}
        </div>
      </div>
    </header>
  );
};

