import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useUiStore } from "../store/uiStore";

export function Toasts() {
    const { toasts, dismissToast } = useUiStore();
    if (toasts.length === 0) return null;

    return (
        <div className="toast-container" role="status" aria-live="polite">
            {toasts.map((t) => (
                <div key={t.id} className={`toast ${t.kind}`}>
                    {t.kind === "success" && <CheckCircle2 size={16} color="var(--success)" />}
                    {t.kind === "error" && <XCircle size={16} color="var(--danger)" />}
                    {t.kind === "info" && <Info size={16} color="var(--accent)" />}
                    {t.message}
                    <button className="icon-btn" onClick={() => dismissToast(t.id)} style={{ width: 24, height: 24 }}>
                        <X size={14} />
                    </button>
                </div>
            ))}
        </div>
    );
}
