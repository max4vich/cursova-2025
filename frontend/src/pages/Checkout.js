import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { request } from "../api/client";

const deliveryOptions = [
  {
    id: "nova-poshta",
    title: "Нова Пошта",
    description: "Доставка до відділення або кур'єром",
  },
  {
    id: "pickup",
    title: "Самовивіз",
    description: "Заберіть замовлення у шоурумі",
  },
];

const pickupLocations = [
  { id: "store-kyiv", title: "Київ, вул. Хрещатик, 1" },
  { id: "store-lviv", title: "Львів, пл. Ринок, 15" },
  { id: "store-dnipro", title: "Дніпро, пр. Дмитра Яворницького, 25" },
];

const initialDelivery = {
  method: "nova-poshta",
  city: "",
  department: "",
  pickupLocation: pickupLocations[0].title,
};

const paymentOptions = [
  { id: "card", title: "Карта онлайн", description: "Оплата зараз на сайті" },
  { id: "cash", title: "Післяплата", description: "Оплата при отриманні" },
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
  const [confirmation, setConfirmation] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    setContact({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
    });
  }, [user]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (items.length === 0 && !confirmation) {
    return <Navigate to="/cart" replace />;
  }

  const validateDelivery = () => {
    if (delivery.method === "nova-poshta") {
      if (!delivery.city || !delivery.department) {
        throw new Error("Вкажіть місто та відділення Нової Пошти");
      }
    }
    if (delivery.method === "pickup" && !delivery.pickupLocation) {
      throw new Error("Оберіть точку самовивозу");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      validateDelivery();
    } catch (validationError) {
      toast.error(validationError.message);
      return;
    }
    setIsSubmitting(true);
    try {
      const order = await request("/orders/checkout", {
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
      setConfirmation(order);
      setPaymentStatus("success");
      toast.success("Оплата успішна");
    } catch (error) {
      toast.error(error.message || "Не вдалося оформити замовлення");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (paymentStatus === "success" && confirmation) {
    return (
      <div className="page checkout-page">
        <section className="card checkout-confirmation">
          <p className="checkout-confirmation__eyebrow">Оплата успішна</p>
          <h1>Дякуємо за замовлення!</h1>
          <p className="muted">
            Номер замовлення {confirmation.orderNumber || `#${confirmation.id}`}. Ми вже готуємо його до
            відправлення та повідомимо про зміну статусу.
          </p>
          <div className="checkout-confirmation__details">
            <div>
              <p className="muted small">Контакти</p>
              <strong>{confirmation.contactName}</strong>
              <p className="muted small">{confirmation.contactEmail}</p>
              <p className="muted small">{confirmation.contactPhone}</p>
            </div>
            <div>
              <p className="muted small">Доставка</p>
              <strong>{confirmation.deliveryMethod === "pickup" ? "Самовивіз" : "Нова Пошта"}</strong>
              {confirmation.deliveryCity && (
                <p className="muted small">{confirmation.deliveryCity}</p>
              )}
              {confirmation.deliveryAddress && (
                <p className="muted small">{confirmation.deliveryAddress}</p>
              )}
            </div>
          </div>
          <div className="checkout-confirmation__actions">
            <button className="pill-button" onClick={() => navigate("/")}>
              Повернутись до каталогу
            </button>
            <button className="pill-button pill-button--ghost" onClick={() => navigate("/profile")}>
              Переглянути замовлення
            </button>
          </div>
        </section>
      </div>
    );
  }

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
            {delivery.method === "nova-poshta" ? (
              <div className="form-grid">
                <input
                  placeholder="Місто"
                  value={delivery.city}
                  onChange={(event) => setDelivery({ ...delivery, city: event.target.value })}
                  required
                />
                <input
                  placeholder="Відділення або адреса"
                  value={delivery.department}
                  onChange={(event) => setDelivery({ ...delivery, department: event.target.value })}
                  required
                />
              </div>
            ) : (
              <div className="form-grid">
                <select
                  value={delivery.pickupLocation}
                  onChange={(event) => setDelivery({ ...delivery, pickupLocation: event.target.value })}
                >
                  {pickupLocations.map((location) => (
                    <option key={location.id} value={location.title}>
                      {location.title}
                    </option>
                  ))}
                </select>
                <p className="muted small">
                  Оберіть шоурум, де вам зручно отримати замовлення. Зберігаємо його протягом 5 днів.
                </p>
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
            {payment === "card" && (
              <div className="checkout-payment-note">
                <p className="muted small">
                  Ми використовуємо захищений шлюз для імітації онлайн-оплати. Після натискання кнопки отримаєте
                  підтвердження успіху.
                </p>
              </div>
            )}
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
            {isSubmitting ? "Оплата..." : "Підтвердити замовлення"}
          </button>
        </aside>
      </form>
    </div>
  );
};

export default Checkout;

