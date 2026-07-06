import { useState, useEffect, createContext, useContext, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 3500) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const remove = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  const COLORS = {
    success: { bg: "var(--success-light)", border: "rgba(16,185,129,.25)", color: "var(--success)", icon: "✓" },
    error:   { bg: "var(--danger-light)",  border: "rgba(239,68,68,.25)",  color: "var(--danger)",  icon: "✕" },
    warning: { bg: "var(--warning-light)", border: "rgba(245,158,11,.25)", color: "var(--warning)", icon: "⚠" },
    info:    { bg: "var(--acc-light)",     border: "rgba(108,99,255,.25)", color: "var(--acc)",     icon: "i" },
  };

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div style={{
        position: "fixed", bottom: 24, right: 24,
        display: "flex", flexDirection: "column", gap: 10,
        zIndex: 9999, maxWidth: 360,
      }}>
        {toasts.map(t => {
          const c = COLORS[t.type] || COLORS.info;
          return (
            <div key={t.id} style={{
              display: "flex", alignItems: "flex-start", gap: 12,
              background: "var(--surface)", border: `1px solid ${c.border}`,
              borderLeft: `3px solid ${c.color}`,
              borderRadius: "var(--radius)", padding: "14px 16px",
              boxShadow: "0 4px 24px rgba(0,0,0,.3)",
              animation: "slideIn .2s ease",
              cursor: "pointer",
            }} onClick={() => remove(t.id)}>
              <span style={{
                width: 20, height: 20, borderRadius: "50%",
                background: c.bg, color: c.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: ".72rem", fontWeight: 700, flexShrink: 0,
              }}>
                {c.icon}
              </span>
              <p style={{ fontSize: ".85rem", color: "var(--text)", lineHeight: 1.5, flex: 1 }}>
                {t.message}
              </p>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);