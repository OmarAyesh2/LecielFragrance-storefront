'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext({});

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div 
        className="toast-container"
        style={{
          position: 'fixed',
          top: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-3)',
          pointerEvents: 'none',
          maxWidth: '90vw'
        }}
      >
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className="toast-pill"
            style={{
              pointerEvents: 'auto',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-4) var(--space-8)',
              backgroundColor: 'var(--color-text-primary)',
              color: '#ffffff',
              border: `1px solid ${toast.type === 'error' ? 'var(--color-error)' : 'var(--color-accent)'}`,
              borderRadius: '999px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
              fontSize: '1.1rem',
              fontWeight: '600',
              letterSpacing: '0.01em',
              whiteSpace: 'nowrap',
              animation: 'toastSlideDown 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}
          >
            <span style={{ color: toast.type === 'error' ? 'var(--color-error)' : 'var(--color-accent)', fontWeight: 700 }}>
              {toast.type === 'error' ? '✕ ' : '✓ '}
            </span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
