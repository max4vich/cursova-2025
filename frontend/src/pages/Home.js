import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ProductCard } from "../components/ProductCard";
import { ProductFilters } from "../components/ProductFilters";
import { request } from "../api/client";

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
  const [catalog, setCatalog] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ pageSize: 60 });
      if (globalSearch) {
        params.append("search", globalSearch);
      }
      if (filters.inStock) {
        params.append("inStock", "true");
      }
      const data = await request(`/catalog/products?${params.toString()}`);
      setCatalog(data.items);
    } catch (error) {
      toast.error("Не вдалося завантажити товари");
    } finally {
      setLoading(false);
    }
  }, [filters.inStock, globalSearch]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    request("/catalog/categories")
      .then(setCategories)
      .catch(() => toast.error("Не вдалося завантажити категорії"));
  }, []);

  const filteredProducts = useMemo(() => {
    const result = catalog.filter((product) => {
      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(product.category?.slug ?? product.category)
      ) {
        return false;
      }

      const effectivePrice = Number(product.price);
      if (filters.maxPrice && effectivePrice > filters.maxPrice) {
        return false;
      }

      if (filters.inStock && product.stock === 0) {
        return false;
      }

      return true;
    });

    const sorted = [...result];
    if (sort === "price-desc") {
      return sorted.sort((a, b) => Number(b.price) - Number(a.price));
    }
    if (sort === "price-asc") {
      return sorted.sort((a, b) => Number(a.price) - Number(b.price));
    }
    if (sort === "rating") {
      return sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }
    return sorted;
  }, [catalog, filters, sort]);

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
            categories={categories}
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

          {loading ? (
            <div className="empty-state">
              <p>Завантаження товарів...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
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

