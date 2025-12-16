import PropTypes from "prop-types";
import { X } from "lucide-react";

const AdminModal = ({ open, title, onClose, children, footer }) => {
  if (!open) return null;

  return (
    <div className="admin-modal">
      <div className="admin-modal__backdrop" onClick={onClose} role="presentation" />
      <div className="admin-modal__panel">
        <header className="admin-modal__header">
          <div>
            <h2>{title}</h2>
          </div>
          <button type="button" className="icon-button icon-button--ghost" onClick={onClose}>
            <X size={18} color="white" />
          </button>
        </header>
        <div className="admin-modal__body">{children}</div>
        {footer && <footer className="admin-modal__footer">{footer}</footer>}
      </div>
    </div>
  );
};

AdminModal.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
};

export default AdminModal;

