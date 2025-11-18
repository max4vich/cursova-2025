import { useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { categories, products } from "../data/mockData";
import { useCart } from "../contexts/CartContext";

const getCategoryName = (slug) =>
  categories.find((category) => category.slug === slug)?.name || slug;

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((item) => item.id === Number(id));
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <Navigate to="/" replace />;
  }

  const priceWithDiscount = product.discount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;

  const handleAdd = () => {
    addItem(product.id, quantity);
    navigate("/cart");
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
            <img src={product.image} alt={product.name} />
            {product.discount && (
              <span className="product-card__badge">-{product.discount}%</span>
            )}
          </div>

          <div className="product-focus__stats">
            <div>
              <p className="muted">Категорія</p>
              <strong>{getCategoryName(product.category)}</strong>
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
            <p className="muted">{getCategoryName(product.category)}</p>
            <h1>{product.name}</h1>
            <p className="product-focus__description">{product.description}</p>
          </header>

          <div className="product-focus__price-card">
            <div>
              <p className="muted">Ціна</p>
              <div className="product-detail__price">
                <strong>{priceWithDiscount.toLocaleString("uk-UA")} ₴</strong>
                {product.discount && (
                  <span className="struck">
                    {product.price.toLocaleString("uk-UA")} ₴
                  </span>
                )}
              </div>
            </div>
            {product.discount && (
              <div className="price-benefit">
                Економія {(product.price - priceWithDiscount).toLocaleString("uk-UA")} ₴
              </div>
            )}
          </div>

          <div className="product-quantity">
            <span>Кількість</span>
            <div className="quantity quantity--large">
              <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                -
              </button>
              <span>{quantity}</span>
              <button
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
              Додати до кошика
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

