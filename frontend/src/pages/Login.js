import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      login(email);
      toast.success("Вітаємо!", { description: "Вхід виконано успішно" });
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Вхід</h1>
        <input
          type="email"
          value={email}
          required
          placeholder="Email"
          onChange={(event) => setEmail(event.target.value)}
        />
        <input type="password" placeholder="Пароль" required />
        <button className="pill-button pill-button--block" disabled={isLoading}>
          {isLoading ? "Вхід..." : "Увійти"}
        </button>
        <p className="muted">
          Немає акаунта? <Link to="/register">Створити</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

