import PropTypes from "prop-types";

const StatusBadge = ({ status }) => (
  <span className={`status-badge status-badge--${status?.toLowerCase() || "default"}`}>
    {status}
  </span>
);

StatusBadge.propTypes = {
  status: PropTypes.string,
};

export default StatusBadge;

