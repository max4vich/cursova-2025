import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, PackageCheck, Plus, ShieldCheck, Trash2, Truck } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "../contexts/CartContext";
import { ProductCard } from "../components/ProductCard";
import { request } from "../api/client";

const Cart = () => {
  const navigate = useNavigate();
  const {
    items,
    subtotal,
    discount,
    total,
    promotion,
    updateQuantity,
    removeItem,
    applyPromoCode,
    removePromoCode,
    loading,
    itemCount,
  } = useCart();
  const [promoInput, setPromoInput] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [recommendationsError, setRecommendationsError] = useState(false);

  const benefitCards = useMemo(
    () => [
      {
        icon: (props) => <Truck {...props} color="white" />,
        title: "Швидка доставка",
        description: "Нова Пошта або кур'єр вже за 1–2 дні",
      },
      {
        icon: (props) => <ShieldCheck {...props} color="white" />,
        title: "Безпечні платежі",
        description: "Підтримуємо Apple Pay, Google Pay та LiqPay",
      },
      {
        icon: (props) => <PackageCheck {...props} color="white" />,
        title: "14 днів на повернення",
        description: "Якщо товар не підійшов або має дефекти",
      },
    ],
    []
  );

  const quickLinks = useMemo(
    () => [
      { label: "Смартфони", slug: "smartphones" },
      { label: "Ноутбуки", slug: "laptops" },
      { label: "Аксесуари", slug: "accessories" },
      { label: "Розумний дім", slug: "smart-home" },
    ],
    []
  );

  const shippingHighlights = useMemo(
    () => [
      {
        title: "Нова Пошта",
        description: "Доставка до відділення або вашої адреси по всій Україні",
      },
      {
        title: "Самовивіз із шоуруму",
        description: "Київ, Львів чи Дніпро — заберіть у зручному місці безкоштовно",
      },
    ],
    []
  );

  useEffect(() => {
    if (items.length > 0 || loading) {
      return;
    }

    let isCancelled = false;

    const fetchRecommendations = async () => {
      setRecommendationsLoading(true);
      setRecommendationsError(false);
      try {
        const data = await request("/catalog/products?pageSize=4&sort=popular");
        if (!isCancelled) {
          setRecommendations(data.items ?? []);
        }
      } catch (error) {
        console.error("Не вдалося завантажити рекомендації", error);
        if (!isCancelled) {
          setRecommendations([]);
          setRecommendationsError(true);
        }
      } finally {
        if (!isCancelled) {
          setRecommendationsLoading(false);
        }
      }
    };

    fetchRecommendations();

    return () => {
      isCancelled = true;
    };
  }, [items.length, loading]);

  const handleApply = async () => {
    const result = await applyPromoCode(promoInput);
    if (result.success) {
      toast.success("Промокод застосовано");
      setPromoInput("");
    } else {
      toast.error(result.error);
    }
  };

  const handleBrowseCategory = (slug) => {
    const params = slug ? `/?category=${encodeURIComponent(slug)}` : "/";
    navigate(params);
  };

  const itemWord =
    itemCount === 1 ? "товар" : itemCount >= 2 && itemCount <= 4 ? "товари" : "товарів";

  if (!loading && items.length === 0) {
    return (
      <div className="page cart-page">
        <div className="empty-state empty-state--accent">
          <p className="cart-page__eyebrow">Готові до покупки?</p>
          <h2>Кошик порожній</h2>
          <p>Додайте товари до кошика, щоб оформити замовлення</p>
          <div className="cart-empty__actions">
            <button className="pill-button" onClick={() => navigate("/")}>
              До каталогу
            </button>
          </div>
        </div>

        <section className="cart-empty__suggestions">
          <div className="cart-empty__recommendations">
            <div className="cart-empty__recommendations-header">
              <div>
                <p className="cart-page__eyebrow">Підбірка для старту</p>
                <h3>Популярні зараз</h3>
                <p className="muted small">
                  Ці товари найчастіше опиняються у кошику першими
                </p>
              </div>
              <button className="pill-button pill-button--ghost" onClick={() => navigate("/")}>
                Переглянути все
              </button>
            </div>

            {recommendationsLoading ? (
              <div className="empty-state">
                <p>Підбираємо товари...</p>
              </div>
            ) : recommendations.length > 0 ? (
              <div className="cart-empty__grid">
                {recommendations.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="muted small">
                {recommendationsError
                  ? "Не вдалося завантажити рекомендації. Спробуйте оновити сторінку."
                  : "Список рекомендацій з'явиться найближчим часом."}
              </p>
            )}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page cart-page">
      <section className="cart-page__intro">
        <div>
          <p className="cart-page__eyebrow">Крок 1 з 2</p>
          <h1>Кошик</h1>
          <p className="muted">
            {itemCount} {itemWord} на суму {subtotal.toLocaleString("uk-UA")} ₴
          </p>
        </div>

        <div className="cart-page__actions">
          <button className="pill-button pill-button--ghost" onClick={() => navigate("/")}>
            Продовжити покупки
          </button>
        </div>
      </section>

      <section className="cart-benefits">
        {benefitCards.map((benefit) => {
          const Icon = benefit.icon;
          return (
            <article key={benefit.title} className="cart-benefit">
              <div className="cart-benefit__icon">
                <Icon size={20} />
              </div>
              <div>
                <p className="cart-benefit__title">{benefit.title}</p>
                <p className="muted small">{benefit.description}</p>
              </div>
            </article>
          );
        })}
      </section>

      <section className="cart-shipping-options card">
        <header className="cart-shipping-options__header">
          <div>
            <p className="cart-page__eyebrow">Вибір доставки</p>
            <h2>Нова Пошта або самовивіз</h2>
            <p className="muted small">Оберете конкретний спосіб на кроці оформлення</p>
          </div>
          <button className="pill-button pill-button--ghost" onClick={() => navigate("/checkout")}>
            До оформлення
          </button>
        </header>
        <div className="cart-shipping-options__grid">
          {shippingHighlights.map((option) => (
            <article key={option.title} className="cart-shipping-card">
              <h3>{option.title}</h3>
              <p className="muted small">{option.description}</p>
              <button className="link-button" onClick={() => navigate("/checkout")}>
                Обрати доставку
              </button>
            </article>
          ))}
        </div>
      </section>

      <div className="cart-layout">
        <div className="cart-items">
          {loading ? (
            <div className="empty-state">
              <p>Оновлюємо кошик...</p>
            </div>
          ) : (
            items.map((item) => {
              const price = Number(item.price);
              const product = item.product ?? {};
              return (
                <article key={item.id} className="cart-item">
                  <img
                    src={product.imageUrl || product.image || "https://placehold.co/120"}
                    alt={product.name}
                  />
                  <div className="cart-item__info">
                    <h3>{product.name}</h3>
                    <p className="muted">Категорія: {product.category?.name ?? "—"}</p>
                    <div className="cart-item__price">
                      <strong>{price.toLocaleString("uk-UA")} ₴</strong>
                    </div>
                    <div className="cart-item__controls">
                      <div className="quantity" role="group" aria-label="Кількість">
                        <button
                          type="button"
                          className="quantity__button"
                          onClick={() =>
                            updateQuantity(item.id, Math.max(1, item.quantity - 1))
                          }
                        >
                          <Minus size={16} color="white" />
                        </button>
                        <span className="quantity__value">{item.quantity}</span>
                        <button
                          type="button"
                          className="quantity__button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              Math.min(product.stock ?? item.quantity + 1, item.quantity + 1)
                            )
                          }
                        >
                          <Plus size={16} color="white" />
                        </button>
                      </div>
                      <button
                        className="icon-button"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 size={16} color="white" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        <aside className="summary-card">
          <h3>Разом</h3>
          <div className="summary-card__rows">
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
          </div>

          <div className="summary-note">
            <p className="muted small">
              Спосіб доставки та оплати обираєте на наступному кроці. Доступні Нова Пошта та самовивіз.
            </p>
          </div>

          <div className="summary-card__promo">
            {promotion ? (
              <div className="promo-active">
                <div>
                  <p>{promotion.code}</p>
                  <span className="muted">{promotion.description}</span>
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

