import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "../contexts/CartContext";

const formatPrice = (value) =>
  new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
    maximumFractionDigits: 0,
  }).format(value);

export const ProductCard = ({ product }) => {
  const { addItem, items } = useCart();
  const image = product.imageUrl || product.image || "https://placehold.co/600x400";
  const hasCompare =
    product.compareAt && Number(product.compareAt) > Number(product.price);
  const priceWithDiscount = Number(product.price);
  const discountPercent = hasCompare
    ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
    : null;
  const isInCart = items.some((item) => item.productId === product.id);

  const handleAdd = async () => {
    if (isInCart) return;
    try {
      await addItem(product.id, 1);
      toast.success("Товар додано до кошика");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-card__image">
        <img src={image} alt={product.name} loading="lazy" />
        {discountPercent && (
          <span className="product-card__badge">-{discountPercent}%</span>
        )}
      </Link>

      <div className="product-card__body">
        <Link to={`/product/${product.id}`} className="product-card__title">
          {product.name}
        </Link>
        <div className="product-card__rating">
          <Star size={16} />
          <span>{product.rating ?? 4.8}</span>
          <span className="muted">({product.reviews ?? 0})</span>
        </div>

        <div className="product-card__footer">
          <div className="product-card__price">
            <p>{formatPrice(priceWithDiscount)}</p>
            {hasCompare && (
              <span className="muted struck">{formatPrice(product.compareAt)}</span>
            )}
          </div>

          <button
            className="pill-button pill-button--block"
            onClick={handleAdd}
            disabled={product.stock === 0 || isInCart}
          >
            <ShoppingCart size={16} />
            {product.stock === 0 ? "Немає в наявності" : isInCart ? "В кошику" : "До кошика"}
          </button>
        </div>
      </div>
    </article>
  );
};

