import { useMemo, useState } from "react";
import { products } from "../data/mockData";
import { ProductCard } from "../components/ProductCard";
import { ProductFilters } from "../components/ProductFilters";

const defaultFilters = {
  categories: [],
  maxPrice: 100000,
  inStock: false,
};

const heroHighlights = [
  { label: "Швидка доставка", value: "по всій Україні" },
  { label: "Гарантія", value: "12 місяців" },
  { label: "Повернення", value: "до 14 днів" },
];

const Home = ({ globalSearch }) => {
  const [filters, setFilters] = useState(defaultFilters);
  const [sort, setSort] = useState("default");

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      if (
        globalSearch &&
        !product.name.toLowerCase().includes(globalSearch.toLowerCase())
      ) {
        return false;
      }

      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(product.category)
      ) {
        return false;
      }

      const effectivePrice = product.discount
        ? product.price * (1 - product.discount / 100)
        : product.price;

      if (effectivePrice > filters.maxPrice) {
        return false;
      }

      if (filters.inStock && product.stock === 0) {
        return false;
      }

      return true;
    });

    const sorted = [...result];
    if (sort === "price-desc") {
      return sorted.sort((a, b) => b.price - a.price);
    }
    if (sort === "price-asc") {
      return sorted.sort((a, b) => a.price - b.price);
    }
    if (sort === "rating") {
      return sorted.sort((a, b) => b.rating - a.rating);
    }
    return sorted;
  }, [filters, globalSearch, sort]);

  const handleReset = () => setFilters(defaultFilters);

  return (
    <div className="page home-page">
      <section className="hero">
        <div className="hero__content">
          <p className="hero__eyebrow">Новинка</p>
          <h1>iPhone 15 Pro Max</h1>
          <p>
            Максимальна продуктивність, нова камера і титановий корпус. Дизайн,
            що задає тон всій індустрії.
          </p>
          <div className="hero__cta">
            <button className="pill-button">Дізнатись більше</button>
            <button
              className="pill-button pill-button--ghost"
              type="button"
              onClick={() =>
                document.getElementById("catalog")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              До каталогу
            </button>
          </div>
          <div className="hero__highlights">
            {heroHighlights.map((highlight) => (
              <div key={highlight.label}>
                <p>{highlight.label}</p>
                <strong>{highlight.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__phone">
            <div className="hero__screen" />
            <div className="hero__notch" />
          </div>
        </div>
      </section>

      <section className="catalog" id="catalog">
        <div className="catalog__sidebar">
          <ProductFilters
            filters={filters}
            onFilterChange={setFilters}
            onClearFilters={handleReset}
          />
        </div>

        <div className="catalog__grid">
          <header className="catalog__header">
            <div>
              <h2>Каталог товарів</h2>
              <p className="muted">
                Знайдено {filteredProducts.length} товарів
              </p>
            </div>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="default">За замовчуванням</option>
              <option value="price-desc">Найдорожчі</option>
              <option value="price-asc">Найдешевші</option>
              <option value="rating">Найкращі відгуки</option>
            </select>
          </header>

          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <p>Нічого не знайдено. Спробуйте змінити фільтри.</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

