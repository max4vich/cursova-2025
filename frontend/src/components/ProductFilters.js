import { categories } from "../data/mockData";

export const ProductFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const handleCategoryToggle = (slug) => {
    const exists = filters.categories.includes(slug);
    const updated = exists
      ? filters.categories.filter((item) => item !== slug)
      : [...filters.categories, slug];
    onFilterChange({ ...filters, categories: updated });
  };

  const handlePriceChange = (event) => {
    onFilterChange({ ...filters, maxPrice: Number(event.target.value) });
  };

  const activeFilters =
    filters.categories.length +
    (filters.maxPrice < 100000 ? 1 : 0) +
    (filters.inStock ? 1 : 0);

  return (
    <aside className="filters-card">
      <div className="filters-card__header">
        <div className="filters-card__title-row">
          <h3>Фільтри</h3>
          {activeFilters > 0 && (
            <button className="chip-button" onClick={onClearFilters}>
              Очистити ({activeFilters})
            </button>
          )}
        </div>
        <p className="muted">Знайдіть потрібний товар</p>
      </div>

      <div className="filters-card__section">
        <p className="section-title">Категорії</p>
        <div className="filters-card__list">
          {categories.map((category) => (
            <label key={category.id} className="checkbox">
              <input
                type="checkbox"
                checked={filters.categories.includes(category.slug)}
                onChange={() => handleCategoryToggle(category.slug)}
              />
              <span>{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filters-card__section">
        <p className="section-title">
          Ціна до <strong>{filters.maxPrice.toLocaleString("uk-UA")} ₴</strong>
        </p>
        <input
          type="range"
          min="1000"
          max="100000"
          step="1000"
          value={filters.maxPrice}
          onChange={handlePriceChange}
          style={{ "--value": filters.maxPrice }}
        />
        <div className="filters-card__range">
          <span>1 000 ₴</span>
          <span>100 000 ₴</span>
        </div>
      </div>

      <div className="filters-card__section">
        <label className="checkbox">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(event) =>
              onFilterChange({ ...filters, inStock: event.target.checked })
            }
          />
          <span>Тільки в наявності</span>
        </label>
      </div>
    </aside>
  );
};

