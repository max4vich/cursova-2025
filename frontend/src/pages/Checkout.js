import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { request } from "../api/client";

const initialDelivery = {
  method: "courier",
  city: "",
  address: "",
};

const deliveryOptions = [
  {
    id: "courier",
    title: "Кур'єрська доставка",
    description: "Привеземо замовлення за вказаною адресою",
  },
  {
    id: "pickup",
    title: "Самовивіз",
    description: "Заберіть замовлення з нашого магазину",
  },
];

const paymentOptions = [
  { id: "card", title: "Карта онлайн", description: "Безпечна оплата прямо на сайті" },
  { id: "cash", title: "Післяплата", description: "Оплата під час отримання" },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { items, total, clearCart, refresh } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [delivery, setDelivery] = useState(initialDelivery);
  const [payment, setPayment] = useState("card");
  const [contact, setContact] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
  });
  const [note, setNote] = useState("");
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
    try {
      await request("/orders/checkout", {
        method: "POST",
        body: {
          shippingMethod: delivery.method,
          shippingProvider: delivery.method === "pickup" ? "pickup" : "nova-poshta",
          paymentProvider: payment,
          customer: contact,
          delivery,
          notes: note,
        },
      });
      await clearCart();
      await refresh();
      toast.success("Замовлення оформлено!");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page checkout-page">
      <h1>Оформлення замовлення</h1>
      <form className="checkout-layout" onSubmit={handleSubmit}>
        <section className="checkout-panel card">
          <div className="checkout-section">
            <h3>1. Контакти</h3>
            <div className="form-grid">
              <input
                placeholder="Ім'я"
                value={contact.name}
                onChange={(event) => setContact({ ...contact, name: event.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={contact.email}
                onChange={(event) => setContact({ ...contact, email: event.target.value })}
                required
              />
              <input
                type="tel"
                placeholder="Телефон"
                value={contact.phone}
                onChange={(event) => setContact({ ...contact, phone: event.target.value })}
                required
              />
            </div>
          </div>

          <div className="checkout-section">
            <h3>2. Доставка</h3>
            <div className="option-cards">
              {deliveryOptions.map((option) => (
                <button
                  type="button"
                  key={option.id}
                  className={`option-card ${delivery.method === option.id ? "option-card--active" : ""}`}
                  onClick={() => setDelivery({ ...delivery, method: option.id })}
                >
                  <h4>{option.title}</h4>
                  <p className="muted small">{option.description}</p>
                </button>
              ))}
            </div>
            {delivery.method !== "pickup" && (
              <div className="form-grid">
                <input
                  placeholder="Місто"
                  required
                  value={delivery.city}
                  onChange={(event) => setDelivery({ ...delivery, city: event.target.value })}
                />
                <input
                  placeholder="Адреса"
                  required
                  value={delivery.address}
                  onChange={(event) => setDelivery({ ...delivery, address: event.target.value })}
                />
              </div>
            )}
          </div>

          <div className="checkout-section">
            <h3>3. Оплата</h3>
            <div className="option-cards option-cards--compact">
              {paymentOptions.map((option) => (
                <button
                  type="button"
                  key={option.id}
                  className={`option-card ${payment === option.id ? "option-card--active" : ""}`}
                  onClick={() => setPayment(option.id)}
                >
                  <h4>{option.title}</h4>
                  <p className="muted small">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="checkout-section">
            <h3>4. Коментар</h3>
            <textarea
              placeholder="Якщо маєте побажання або додаткову інформацію"
              rows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </div>
        </section>

        <aside className="checkout-summary card">
          <h3>Ваше замовлення</h3>
          <ul className="summary-list">
            {items.map((item) => (
              <li key={item.id}>
                <div>
                  <strong>{item.product?.name || item.name}</strong>
                  <p className="muted small">× {item.quantity}</p>
                </div>
                <span>
                  {(item.price * item.quantity).toLocaleString("uk-UA")} ₴
                </span>
              </li>
            ))}
          </ul>
          <div className="summary-total">
            <span>Загальна сума</span>
            <strong>{total.toLocaleString("uk-UA")} ₴</strong>
          </div>
          <button className="pill-button pill-button--block" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Обробка..." : "Підтвердити замовлення"}
          </button>
        </aside>
      </form>
    </div>
  );
};

export default Checkout;

