import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

const Register = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      await register(form);
      toast.success("Акаунт створено");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Реєстрація</h1>
        <input
          name="name"
          placeholder="Ім'я"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Телефон"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль (мін. 6 символів)"
          value={form.password}
          onChange={handleChange}
          required
          minLength={6}
        />
        <input
          name="address"
          placeholder="Адреса"
          value={form.address}
          onChange={handleChange}
          required
        />
        <button className="pill-button pill-button--block" disabled={isSubmitting}>
          {isSubmitting ? "Створення..." : "Зареєструватись"}
        </button>
        <p className="muted">
          Вже маєте акаунт? <Link to="/login">Увійти</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;

