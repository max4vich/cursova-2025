import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "../contexts/CartContext";

const formatPrice = (value) =>
  new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
    maximumFractionDigits: 0,
  }).format(value);

export const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const priceWithDiscount = product.discount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-card__image">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.discount && (
          <span className="product-card__badge">-{product.discount}%</span>
        )}
      </Link>

      <div className="product-card__body">
        <Link to={`/product/${product.id}`} className="product-card__title">
          {product.name}
        </Link>
        <div className="product-card__rating">
          <Star size={16} />
          <span>{product.rating}</span>
          <span className="muted">({product.reviews})</span>
        </div>

        <div className="product-card__price">
          <p>{formatPrice(priceWithDiscount)}</p>
          {product.discount && (
            <span className="muted struck">{formatPrice(product.price)}</span>
          )}
        </div>

        <button
          className="pill-button pill-button--block"
          onClick={() => addItem(product.id, 1)}
          disabled={product.stock === 0}
        >
          <ShoppingCart size={16} />
          {product.stock === 0 ? "Немає в наявності" : "До кошика"}
        </button>
      </div>
    </article>
  );
};

