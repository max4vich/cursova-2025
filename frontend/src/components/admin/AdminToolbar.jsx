import PropTypes from "prop-types";

const AdminToolbar = ({ children, right }) => (
  <div className="admin-toolbar">
    <div className="admin-toolbar__left">{children}</div>
    <div className="admin-toolbar__right">{right}</div>
  </div>
);

AdminToolbar.propTypes = {
  children: PropTypes.node,
  right: PropTypes.node,
};

export default AdminToolbar;

