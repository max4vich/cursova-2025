import PropTypes from "prop-types";

const AdminPageHeader = ({ title, description, actions, children }) => (
  <header className="admin-page-header">
    <div className="admin-page-header__text">
      {description && <p className="admin-eyebrow">{description}</p>}
      <h1>{title}</h1>
      {children && <div className="admin-page-header__meta">{children}</div>}
    </div>
    {actions && <div className="admin-page-header__actions">{actions}</div>}
  </header>
);

AdminPageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actions: PropTypes.node,
  children: PropTypes.node,
};

export default AdminPageHeader;

