import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "../contexts/CartContext";
import { request } from "../api/client";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, items } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await request(`/catalog/products/${id}`);
        setProduct(data);
      } catch (error) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const productId = product?.id ?? null;
  const isInCart = useMemo(
    () => (productId ? items.some((item) => item.productId === productId) : false),
    [items, productId]
  );

  if (notFound) {
    return <Navigate to="/" replace />;
  }

  if (loading || !product) {
    return (
      <div className="page product-page">
        <p>Завантаження товару...</p>
      </div>
    );
  }

  const price = Number(product.price);
  const compareAt = product.compareAt ? Number(product.compareAt) : null;
  const oldPrice =
    compareAt && compareAt > price
      ? compareAt
      : product.discount
      ? price
      : null;
  const priceWithDiscount =
    product.discount && !compareAt
      ? Math.round(price * (1 - product.discount / 100))
      : price;
  const savings =
    oldPrice && oldPrice > priceWithDiscount ? oldPrice - priceWithDiscount : 0;

  const handleAdd = async () => {
    if (isInCart) {
      navigate("/cart");
      return;
    }
    try {
      await addItem(product.id, quantity);
      toast.success("Товар у кошику");
      navigate("/cart");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleQuantityChange = (step) => {
    setQuantity((prev) => {
      const next = Math.min(product.stock, Math.max(1, prev + step));
      return next;
    });
  };

  return (
    <div className="page product-page">
      <button className="link-button" onClick={() => navigate(-1)}>
        ← Назад до каталогу
      </button>

      <div className="product-focus">
        <div className="product-focus__media">
          <div className="product-focus__image">
            <img src={product.imageUrl || product.image} alt={product.name} />
            {oldPrice && (
              <span className="product-card__badge">
                -{Math.round(((oldPrice - price) / oldPrice) * 100)}%
              </span>
            )}
          </div>

          <div className="product-focus__stats">
            <div>
              <p className="muted">Категорія</p>
              <strong>{product.category?.name ?? "Категорія"}</strong>
            </div>
            <div>
              <p className="muted">Рейтинг</p>
              <strong>{product.rating} / 5</strong>
              <span className="muted small">({product.reviews} відгуків)</span>
            </div>
            <div>
              <p className="muted">Наявність</p>
              <strong>{product.stock > 0 ? "В наявності" : "Немає"}</strong>
              <span className="muted small">Залишок: {product.stock} шт</span>
            </div>
          </div>
        </div>

        <div className="product-focus__info">
          <header>
            <p className="muted">{product.category?.name}</p>
            <h1>{product.name}</h1>
            <p className="product-focus__description">{product.description}</p>
          </header>

          <div className="product-focus__price-card">
            <div>
              <p className="muted">Ціна</p>
              <div className="product-detail__price">
                <strong>{priceWithDiscount.toLocaleString("uk-UA")} ₴</strong>
                {oldPrice && (
                  <span className="struck">{oldPrice.toLocaleString("uk-UA")} ₴</span>
                )}
              </div>
            </div>
            {savings > 0 && (
              <div className="price-benefit">
                Економія {savings.toLocaleString("uk-UA")} ₴
              </div>
            )}
          </div>

          <div className="product-quantity">
            <span>Кількість</span>
            <div className="quantity quantity--large" role="group" aria-label="Кількість">
              <button
                type="button"
                className="quantity__button"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="quantity__value">{quantity}</span>
              <button
                type="button"
                className="quantity__button"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>

          <div className="product-focus__cta">
            <button
              className="pill-button pill-button--block"
              onClick={handleAdd}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? "Немає в наявності" : isInCart ? "В кошику" : "Додати до кошика"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

