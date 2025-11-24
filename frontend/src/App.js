import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import Users from "./pages/admin/Users";
import Categories from "./pages/admin/Categories";
import Promotions from "./pages/admin/Promotions";
import { Header } from "./components/Header";

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className={`app ${isAdminRoute ? "app--admin" : ""}`}>
      {!isAdminRoute && <Header onSearchChange={setSearchQuery} />}
      <main className="main">
        <Routes>
          <Route path="/" element={<Home globalSearch={searchQuery} />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<Categories />} />
            <Route path="promotions" element={<Promotions />} />
            <Route path="orders" element={<Orders />} />
            <Route path="users" element={<Users />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
