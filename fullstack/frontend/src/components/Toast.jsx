import React, { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const icons = { success: CheckCircle, error: AlertCircle, info: Info };

export default function Toast({ message, type = "info", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const Icon = icons[type] || Info;
  return (
    <div className={`toast toast-${type}`}>
      <Icon size={18} />
      <span>{message}</span>
      <button className="toast-close" type="button" onClick={onClose}><X size={16} /></button>
    </div>
  );
}
