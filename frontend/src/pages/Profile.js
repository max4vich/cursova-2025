import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { request } from "../api/client";

const defaultAddressForm = {
  label: "",
  city: "",
  street: "",
  postalCode: "",
  branch: "",
};

const Profile = () => {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  const [profileForm, setProfileForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [profileSaving, setProfileSaving] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [addressForm, setAddressForm] = useState(defaultAddressForm);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressSaving, setAddressSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    let isMounted = true;
    const loadOrders = async () => {
      try {
        setOrdersLoading(true);
        const data = await request("/orders");
        if (isMounted) {
          setOrders(data || []);
        }
      } catch (err) {
        if (isMounted) {
          setOrdersError(err.message || "Не вдалося завантажити замовлення");
        }
      } finally {
        if (isMounted) {
          setOrdersLoading(false);
        }
      }
    };
    loadOrders();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    setProfileForm({ name: user?.name || "", phone: user?.phone || "" });
  }, [user]);

  const loadAddresses = async () => {
    if (!isAuthenticated) return;
    setAddressesLoading(true);
    try {
      const data = await request("/auth/addresses");
      setAddresses(data || []);
    } catch (error) {
      toast.error(error.message || "Не вдалося завантажити адреси");
    } finally {
      setAddressesLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setProfileSaving(true);
    try {
      await updateProfile(profileForm);
      toast.success("Профіль оновлено");
    } catch (error) {
      toast.error(error.message || "Не вдалося оновити профіль");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleAddressSubmit = async (event) => {
    event.preventDefault();
    setAddressSaving(true);
    try {
      const payload = {
        label: addressForm.label || undefined,
        city: addressForm.city,
        street: addressForm.street,
        postalCode: addressForm.postalCode,
        metadata: addressForm.branch ? { branch: addressForm.branch } : undefined,
      };
      if (editingAddressId) {
        await request(`/auth/addresses/${editingAddressId}`, {
          method: "PUT",
          body: payload,
        });
        toast.success("Адресу оновлено");
      } else {
        await request("/auth/addresses", {
          method: "POST",
          body: payload,
        });
        toast.success("Адресу додано");
      }
      setAddressForm(defaultAddressForm);
      setEditingAddressId(null);
      await loadAddresses();
    } catch (error) {
      toast.error(error.message || "Не вдалося зберегти адресу");
    } finally {
      setAddressSaving(false);
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddressId(address.id);
    setAddressForm({
      label: address.label || "",
      city: address.city,
      street: address.street,
      postalCode: address.postalCode,
      branch: address.metadata?.branch || "",
    });
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Видалити адресу?")) return;
    try {
      await request(`/auth/addresses/${id}`, { method: "DELETE" });
      toast.success("Адресу видалено");
      if (editingAddressId === id) {
        setEditingAddressId(null);
        setAddressForm(defaultAddressForm);
      }
      await loadAddresses();
    } catch (error) {
      toast.error(error.message || "Не вдалося видалити адресу");
    }
  };

  const formattedOrders = useMemo(
    () =>
      orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber || order.id,
        placedAt: new Date(order.placedAt).toLocaleDateString("uk-UA", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        total: Number(order.total).toLocaleString("uk-UA"),
        status: order.status,
        items: order.items || [],
        deliveryAddress: order.deliveryAddress,
        deliveryCity: order.deliveryCity,
        deliveryMethod: order.deliveryMethod,
        payment: order.payment,
        shipment: order.shipment,
      })),
    [orders]
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="page profile-page">
      <h1>Профіль</h1>

      <section className="card">
        <h3>Особисті дані</h3>
        <form className="form-grid" onSubmit={handleProfileSubmit}>
          <label>
            <span className="muted small">Ім'я</span>
            <input
              value={profileForm.name}
              onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })}
              required
            />
          </label>
          <label>
            <span className="muted small">Телефон</span>
            <input
              value={profileForm.phone}
              onChange={(event) => setProfileForm({ ...profileForm, phone: event.target.value })}
              placeholder="+38 (0XX) XXX XX XX"
              required
            />
          </label>
          <label>
            <span className="muted small">Email</span>
            <input value={user.email} disabled />
          </label>
          <div className="form-actions">
            <button className="pill-button" type="submit" disabled={profileSaving}>
              {profileSaving ? "Збереження..." : "Зберегти зміни"}
            </button>
          </div>
        </form>
      </section>

      <section className="card">
        <div className="section-header">
          <div>
            <h3>Адреси доставки</h3>
            <p className="muted small">Використовуйте їх під час оформлення замовлення</p>
          </div>
        </div>
        {addressesLoading ? (
          <p className="muted">Завантаження адрес...</p>
        ) : addresses.length === 0 ? (
          <p className="muted">Адрес поки немає</p>
        ) : (
          <ul className="profile-address-list">
            {addresses.map((address) => (
              <li key={address.id}>
                <div>
                  <strong>{address.label || "Основна адреса"}</strong>
                  <p className="muted small">
                    {address.city}, {address.street}, {address.postalCode}
                  </p>
                  {address.metadata?.branch && (
                    <p className="muted small">Відділення: {address.metadata.branch}</p>
                  )}
                </div>
                <div className="profile-address-actions">
                  <button type="button" className="link-button" onClick={() => handleEditAddress(address)}>
                    Редагувати
                  </button>
                  <button type="button" className="link-button link-button--danger" onClick={() => handleDeleteAddress(address.id)}>
                    Видалити
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <form className="form-grid" onSubmit={handleAddressSubmit}>
          <h4>{editingAddressId ? "Редагувати адресу" : "Нова адреса"}</h4>
          <input
            placeholder="Назва (наприклад, Дім)"
            value={addressForm.label}
            onChange={(event) => setAddressForm({ ...addressForm, label: event.target.value })}
          />
          <input
            placeholder="Місто"
            value={addressForm.city}
            onChange={(event) => setAddressForm({ ...addressForm, city: event.target.value })}
            required
          />
          <input
            placeholder="Вулиця / Відділення"
            value={addressForm.street}
            onChange={(event) => setAddressForm({ ...addressForm, street: event.target.value })}
            required
          />
          <input
            placeholder="Поштовий індекс"
            value={addressForm.postalCode}
            onChange={(event) => setAddressForm({ ...addressForm, postalCode: event.target.value })}
            required
          />
          <input
            placeholder="Відділення Нової Пошти (опційно)"
            value={addressForm.branch}
            onChange={(event) => setAddressForm({ ...addressForm, branch: event.target.value })}
          />
          <div className="form-actions">
            {editingAddressId && (
              <button
                type="button"
                className="pill-button pill-button--ghost"
                onClick={() => {
                  setEditingAddressId(null);
                  setAddressForm(defaultAddressForm);
                }}
              >
                Скасувати
              </button>
            )}
            <button className="pill-button" type="submit" disabled={addressSaving}>
              {addressSaving ? "Збереження..." : editingAddressId ? "Оновити" : "Додати"}
            </button>
          </div>
        </form>
      </section>

      <section className="card">
        <h3>Замовлення</h3>
        {ordersLoading ? (
          <p className="muted">Завантаження…</p>
        ) : formattedOrders.length === 0 ? (
          <p className="muted">Замовлень ще немає</p>
        ) : (
          <div className="profile-orders-list">
            {formattedOrders.map((order) => (
              <div key={order.id} className="profile-order-card">
                <div className="profile-order-card__header">
                  <div>
                    <div className="profile-order-card__title-row">
                      <strong>Замовлення #{order.orderNumber}</strong>
                      <span className={`status status--${order.status?.toLowerCase()}`}>{order.status}</span>
                    </div>
                    <p className="muted small">Оформлено: {order.placedAt}</p>
                  </div>
                  <div className="profile-order-card__total">
                    <strong>{order.total} ₴</strong>
                  </div>
                </div>

                <div className="profile-order-card__body">
                  {order.items && order.items.length > 0 && (
                    <div className="profile-order-card__section">
                      <p className="profile-order-card__section-title">Товари:</p>
                      <ul className="profile-order-items">
                        {order.items.map((item, index) => (
                          <li key={index}>
                            <span>
                              {item.product?.name || "Товар"} × {item.quantity}
                            </span>
                            <span className="muted">
                              {Number(item.price).toLocaleString("uk-UA")} ₴
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="profile-order-card__details">
                    {order.deliveryMethod && (
                      <div className="profile-order-card__detail-row">
                        <span className="muted small">Доставка:</span>
                        <span>
                          {order.deliveryMethod === "pickup" ? "Самовивіз" : "Нова Пошта"}
                          {order.deliveryCity && order.deliveryAddress && (
                            <> — {order.deliveryCity}, {order.deliveryAddress}</>
                          )}
                        </span>
                      </div>
                    )}

                    {order.payment && (
                      <div className="profile-order-card__detail-row">
                        <span className="muted small">Оплата:</span>
                        <span>
                          {order.payment.provider === "card" ? "Карта онлайн" : order.payment.provider === "cash" ? "Готівка" : order.payment.provider}
                          {order.payment.status === "PAID" && (
                            <span className="muted small"> (Оплачено)</span>
                          )}
                        </span>
                      </div>
                    )}

                    {order.shipment?.trackingNumber && (
                      <div className="profile-order-card__detail-row">
                        <span className="muted small">Відстеження:</span>
                        <span>{order.shipment.trackingNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;

