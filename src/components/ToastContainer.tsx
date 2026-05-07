import { useToast } from '../hooks/useToast';

export default function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div className="toast-container" id="toastContainer">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
