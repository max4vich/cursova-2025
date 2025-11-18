import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "../contexts/CartContext";

const Cart = () => {
  const navigate = useNavigate();
  const {
    items,
    subtotal,
    discount,
    total,
    promoCode,
    updateQuantity,
    removeItem,
    applyPromoCode,
    removePromoCode,
  } = useCart();
  const [promoInput, setPromoInput] = useState("");

  const handleApply = () => {
    const result = applyPromoCode(promoInput);
    if (result.success) {
      toast.success("Промокод застосовано");
      setPromoInput("");
    } else {
      toast.error(result.error);
    }
  };

  if (items.length === 0) {
    return (
      <div className="page cart-page">
        <div className="empty-state">
          <h2>Кошик порожній</h2>
          <p>Додайте товари до кошика, щоб оформити замовлення</p>
          <button className="pill-button" onClick={() => navigate("/")}>
            До каталогу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page cart-page">
      <h1>Кошик</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => {
            const effectivePrice = item.discount
              ? Math.round(item.price * (1 - item.discount / 100))
              : item.price;
            return (
              <article key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="cart-item__info">
                  <h3>{item.name}</h3>
                  <p className="muted">Категорія: {item.category}</p>
                  <div className="cart-item__price">
                    <strong>{effectivePrice.toLocaleString("uk-UA")} ₴</strong>
                    {item.discount && (
                      <span className="struck">
                        {item.price.toLocaleString("uk-UA")} ₴
                      </span>
                    )}
                  </div>
                  <div className="cart-item__controls">
                    <div className="quantity">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, Math.max(1, item.quantity - 1))
                        }
                      >
                        <Minus size={16} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            Math.min(item.stock, item.quantity + 1)
                          )
                        }
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button className="icon-button" onClick={() => removeItem(item.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="summary-card">
          <h3>Разом</h3>
          <div className="summary-row">
            <span>Сума</span>
            <span>{subtotal.toLocaleString("uk-UA")} ₴</span>
          </div>
          <div className="summary-row">
            <span>Знижка</span>
            <span className={discount > 0 ? "text-success" : undefined}>
              -{discount.toLocaleString("uk-UA")} ₴
            </span>
          </div>
          <div className="summary-total">
            <span>До сплати</span>
            <strong>{total.toLocaleString("uk-UA")} ₴</strong>
          </div>

          <div className="summary-card__promo">
            {promoCode ? (
              <div className="promo-active">
                <div>
                  <p>{promoCode.code}</p>
                  <span className="muted">{promoCode.description}</span>
                </div>
                <button className="link-button" onClick={removePromoCode}>
                  Видалити
                </button>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Промокод"
                  value={promoInput}
                  onChange={(event) => setPromoInput(event.target.value.toUpperCase())}
                />
                <button
                  className="pill-button pill-button--block"
                  onClick={handleApply}
                >
                  Застосувати
                </button>
              </>
            )}
          </div>

          <button
            className="pill-button pill-button--block"
            onClick={() => navigate("/checkout")}
          >
            Оформити замовлення
          </button>
        </aside>
      </div>
    </div>
  );
};

export default Cart;

