import PropTypes from "prop-types";

const AdminTabs = ({ tabs, active, onChange, className = "" }) => {
  return (
    <div className={`admin-tabs admin-tabs--pills ${className}`.trim()}>
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            className={`admin-tabs__item ${isActive ? "admin-tabs__item--active" : ""}`}
            onClick={() => onChange(tab.id)}
          >
            {tab.icon && <span className="admin-tabs__icon">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && <span className="admin-tabs__badge">{tab.badge}</span>}
          </button>
        );
      })}
    </div>
  );
};

AdminTabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
      badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
  active: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default AdminTabs;

