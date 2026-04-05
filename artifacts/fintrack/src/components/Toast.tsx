import { useEffect, useRef } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | null;
  onHide: () => void;
}

export default function Toast({ message, type, onHide }: ToastProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (type) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(onHide, 3000);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [message, type]);

  return (
    <div className={`toast${type ? ' show ' + type : ''}`}>
      <span className="toast-icon">
        <i className={`fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
      </span>
      <span>{message}</span>
    </div>
  );
}
