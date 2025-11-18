import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

const initialDelivery = {
  method: "courier",
  city: "",
  address: "",
};

const Checkout = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [delivery, setDelivery] = useState(initialDelivery);
  const [payment, setPayment] = useState("card");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    clearCart();
    toast.success("Замовлення оформлено!", {
      description: "Ми надішлемо лист із підтвердженням",
    });
    navigate("/");
  };

  return (
    <div className="page checkout-page">
      <h1>Оформлення замовлення</h1>
      <form className="checkout-grid" onSubmit={handleSubmit}>
        <section className="card">
          <h3>Контактні дані</h3>
          <label>
            Ім'я
            <input defaultValue={user.name} required />
          </label>
          <label>
            Email
            <input type="email" defaultValue={user.email} required />
          </label>
          <label>
            Телефон
            <input type="tel" defaultValue={user.phone} required />
          </label>
        </section>

        <section className="card">
          <h3>Доставка</h3>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="delivery"
                value="courier"
                checked={delivery.method === "courier"}
                onChange={(event) =>
                  setDelivery({ ...delivery, method: event.target.value })
                }
              />
              Кур'єрська доставка
            </label>
            <label>
              <input
                type="radio"
                name="delivery"
                value="pickup"
                checked={delivery.method === "pickup"}
                onChange={(event) =>
                  setDelivery({ ...delivery, method: event.target.value })
                }
              />
              Самовивіз
            </label>
          </div>

          {delivery.method !== "pickup" && (
            <>
              <label>
                Місто
                <input
                  required
                  value={delivery.city}
                  onChange={(event) =>
                    setDelivery({ ...delivery, city: event.target.value })
                  }
                />
              </label>
              <label>
                Адреса
                <input
                  required
                  value={delivery.address}
                  onChange={(event) =>
                    setDelivery({ ...delivery, address: event.target.value })
                  }
                />
              </label>
            </>
          )}
        </section>

        <section className="card">
          <h3>Оплата</h3>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="payment"
                value="card"
                checked={payment === "card"}
                onChange={(event) => setPayment(event.target.value)}
              />
              Картою онлайн
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={payment === "cash"}
                onChange={(event) => setPayment(event.target.value)}
              />
              Накладений платіж
            </label>
          </div>
        </section>

        <aside className="card summary-card">
          <h3>Ваше замовлення</h3>
          <ul className="summary-list">
            {items.map((item) => (
              <li key={item.id}>
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>
                  {(
                    item.price *
                    (item.discount ? 1 - item.discount / 100 : 1) *
                    item.quantity
                  ).toLocaleString("uk-UA")}{" "}
                  ₴
                </span>
              </li>
            ))}
          </ul>
          <div className="summary-total">
            <span>Сума</span>
            <strong>{total.toLocaleString("uk-UA")} ₴</strong>
          </div>
          <button
            className="pill-button pill-button--block"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Обробка..." : "Підтвердити замовлення"}
          </button>
        </aside>
      </form>
    </div>
  );
};

export default Checkout;

