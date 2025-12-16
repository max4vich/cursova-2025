import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getChildSlugs } from "../utils/categoryTree";

export const ProductFilters = ({ filters, onFilterChange, onClearFilters, categories = [] }) => {
  const [expandedParents, setExpandedParents] = useState({});

  useEffect(() => {
    setExpandedParents((prev) => {
      const next = { ...prev };
      categories.forEach((category) => {
        if (next[category.id] === undefined) {
          next[category.id] = true;
        }
      });
      return next;
    });
  }, [categories]);

  const handlePriceChange = (event) => {
    onFilterChange({ ...filters, maxPrice: Number(event.target.value) });
  };

  const isSelected = (slug) => filters.categories.includes(slug);

  const handleChildToggle = (parent, childSlug) => {
    const selection = new Set(filters.categories);
    const childSlugs = getChildSlugs(parent);
    
    if (selection.has(childSlug)) {
      selection.delete(childSlug);
    } else {
      selection.add(childSlug);
    }

    // Якщо всі дочірні вибрані, автоматично додаємо батьківську
    // Якщо хоча б одна дочірня не вибрана, видаляємо батьківську
    const allChildrenSelected = childSlugs.length > 0 && childSlugs.every((slug) => selection.has(slug));
    if (allChildrenSelected && parent.slug) {
      selection.add(parent.slug);
    } else if (parent.slug) {
      selection.delete(parent.slug);
    }

    onFilterChange({ ...filters, categories: Array.from(selection) });
  };

  const handleParentToggle = (parent) => {
    const selection = new Set(filters.categories);
    const childSlugs = getChildSlugs(parent);
    const allSlugs = parent.slug ? [parent.slug, ...childSlugs] : childSlugs;
    const allSelected = allSlugs.length > 0 && allSlugs.every((slug) => selection.has(slug));

    if (allSelected) {
      // Видаляємо всі
      allSlugs.forEach((slug) => selection.delete(slug));
    } else {
      // Додаємо всі
      allSlugs.forEach((slug) => selection.add(slug));
    }

    onFilterChange({ ...filters, categories: Array.from(selection) });
  };

  const getParentState = (parent) => {
    const childSlugs = getChildSlugs(parent);
    const parentSelected = parent.slug && filters.categories.includes(parent.slug);
    const selectedChildren = childSlugs.filter((slug) => filters.categories.includes(slug));
    const selectedChildrenCount = selectedChildren.length;
    const totalChildren = childSlugs.length;
    
    // Якщо вибрана батьківська, вважаємо що всі дочірні вибрані
    const fullySelected = parentSelected || (totalChildren > 0 && selectedChildrenCount === totalChildren);
    const partiallySelected = !fullySelected && selectedChildrenCount > 0;
    
    return {
      selectedChildrenCount: parentSelected ? totalChildren : selectedChildrenCount,
      totalChildren,
      fullySelected,
      partiallySelected,
      parentSelected,
    };
  };

  const toggleExpand = (id) => {
    setExpandedParents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const activeFilters = useMemo(() => {
    const selectedSlugs = new Set(filters.categories);
    let categoryCount = 0;

    // Рахуємо категорії правильно: якщо вибрана батьківська, то дочірні не рахуються окремо
    categories.forEach((parent) => {
      const childSlugs = getChildSlugs(parent);
      const hasChildren = childSlugs.length > 0;
      const parentSelected = parent.slug && selectedSlugs.has(parent.slug);

      if (hasChildren) {
        if (parentSelected) {
          // Якщо вибрана батьківська, рахуємо як 1 фільтр
          categoryCount += 1;
        } else {
          // Якщо батьківська не вибрана, рахуємо тільки вибрані дочірні
          const selectedChildren = childSlugs.filter((slug) => selectedSlugs.has(slug));
          categoryCount += selectedChildren.length;
        }
      } else {
        // Категорія без дітей
        if (parent.slug && selectedSlugs.has(parent.slug)) {
          categoryCount += 1;
        }
      }
    });

    const priceFilter = filters.maxPrice < 100000 ? 1 : 0;
    const stockFilter = filters.inStock ? 1 : 0;

    return categoryCount + priceFilter + stockFilter;
  }, [filters.categories, filters.inStock, filters.maxPrice, categories]);

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
        {categories.length === 0 ? (
          <p className="muted small">Категорії завантажуються...</p>
        ) : (
          <div className="filters-category-list">
            {categories.map((parent) => {
              const state = getParentState(parent);
              const childSlugs = getChildSlugs(parent);
              const hasChildren = childSlugs.length > 0;
              const isExpanded = expandedParents[parent.id] ?? true;

              return (
                <div key={parent.id} className="filters-category-group">
                  <div className="filters-category-header-wrapper">
                    <button
                      type="button"
                      className={`filters-category-header ${state.fullySelected ? "filters-category-header--selected" : ""} ${state.partiallySelected ? "filters-category-header--partial" : ""}`}
                      onClick={() => toggleExpand(parent.id)}
                    >
                      <div className="filters-category-header-content">
                        <strong>{parent.name}</strong>
                        {hasChildren && (
                          <span className="filters-category-count">
                            {state.selectedChildrenCount > 0
                              ? `${state.selectedChildrenCount}/${state.totalChildren}`
                              : state.totalChildren}
                          </span>
                        )}
                      </div>
                      {hasChildren && (
                        <div className="filters-category-chevron">
                          {isExpanded ? <ChevronUp size={18} color="white" /> : <ChevronDown size={18} color="white" />}
                        </div>
                      )}
                    </button>
                    {hasChildren && (
                      <label className="filters-category-parent-checkbox">
                        <input
                          type="checkbox"
                          checked={state.fullySelected}
                          onChange={() => handleParentToggle(parent)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="checkbox-custom"></span>
                      </label>
                    )}
                  </div>
                  {hasChildren && isExpanded && (
                    <div className="filters-category-children">
                      {parent.children.map((child) => (
                        <label key={child.id} className="checkbox filters-category-child">
                          <input
                            type="checkbox"
                            checked={isSelected(child.slug)}
                            onChange={() => handleChildToggle(parent, child.slug)}
                          />
                          <span>{child.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {!hasChildren && (
                    <div className="filters-category-single">
                      <label className="checkbox">
                        <input
                          type="checkbox"
                          checked={isSelected(parent.slug)}
                          onChange={() => handleParentToggle(parent)}
                        />
                        <span>{parent.name}</span>
                      </label>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="filters-card__section">
        <p className="section-title">
          Ціна до <strong>{filters.maxPrice.toLocaleString("uk-UA")} ₴</strong>
        </p>
        <div className="filters-card__slider">
          <input
            type="range"
            min="1000"
            max="100000"
            step="1000"
            value={filters.maxPrice}
            onChange={handlePriceChange}
            style={{
              "--value": filters.maxPrice,
              "--min": 1000,
              "--max": 100000,
            }}
          />
        </div>
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
            onChange={(event) => onFilterChange({ ...filters, inStock: event.target.checked })}
          />
          <span>Тільки в наявності</span>
        </label>
      </div>
    </aside>
  );
};

