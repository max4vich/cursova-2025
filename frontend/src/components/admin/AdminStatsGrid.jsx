import PropTypes from "prop-types";

const AdminStatsGrid = ({ items }) => {
  if (!items?.length) return null;

  return (
    <section className="admin-stats-grid">
      {items.map((item) => (
        <article key={item.label} className="admin-stat-card">
          <div className="admin-stat-card__icon">{item.icon}</div>
          <div className="admin-stat-card__meta">
            <p className="admin-stat-card__label">{item.label}</p>
            <strong>{item.value}</strong>
            {item.trend && (
              <span className={`admin-trend admin-trend--${item.trend.type}`}>
                {item.trend.value}
              </span>
            )}
          </div>
        </article>
      ))}
    </section>
  );
};

AdminStatsGrid.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      icon: PropTypes.node,
      trend: PropTypes.shape({
        value: PropTypes.string.isRequired,
        type: PropTypes.oneOf(["up", "down", "neutral"]),
      }),
    })
  ),
};

export default AdminStatsGrid;

