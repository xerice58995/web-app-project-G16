import "./index.css";
import { X } from "lucide-react";

export default function Modal({ onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close button inside the modal */}
        <button className="modal-close" onClick={onClose}>
          <X size={20} color="green" />
        </button>
        {children}
      </div>
    </div>
  );
}
