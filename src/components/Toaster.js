import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from 'react';

const ToastContext = createContext(null);
export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
};

let idCounter = 0;

export const ToastProvider = ({children, max = 5, duration = 4000}) => {
    const [toasts, setToasts] = useState([]);
    const timers = useRef(new Map());

    const remove = useCallback((id) => {
        setToasts(t => t.filter(x => x.id !== id));
        const tm = timers.current.get(id);
        if (tm) {
            clearTimeout(tm);
            timers.current.delete(id);
        }
    }, []);

    const push = useCallback((msg, opts = {}) => {
        setToasts(t => {
            const toast = {
                id: ++idCounter,
                msg,
                type: opts.type || 'info',
                actionLabel: opts.actionLabel,
                onAction: opts.onAction
            };
            const next = [...t, toast];
            return next.slice(-max);
        });
    }, [max]);

    const pushSuccess = useCallback((msg, opts = {}) => push(msg, {...opts, type: 'success'}), [push]);
    const pushError = useCallback((msg, opts = {}) => push(msg, {...opts, type: 'error'}), [push]);

    useEffect(() => {
        toasts.forEach(t => {
            if (!timers.current.has(t.id)) {
                const tm = setTimeout(() => remove(t.id), duration + (t.type === 'error' ? 2000 : 0));
                timers.current.set(t.id, tm);
            }
        });
    }, [toasts, remove, duration]);

    return (
        <ToastContext.Provider value={{push, pushSuccess, pushError, remove}}>
            {children}
            <div className="toast-container" role="status" aria-live="polite">
                {toasts.map(t => (
                    <div key={t.id} className={`toast-item toast-${t.type}`}>
                        <span>{t.msg}</span>
                        <div style={{display: 'flex', gap: 4, alignItems: 'center'}}>
                            {t.actionLabel && t.onAction && (
                                <button onClick={() => {
                                    t.onAction();
                                    remove(t.id);
                                }} style={{fontSize: '0.7rem'}}>{t.actionLabel}</button>
                            )}
                            <button aria-label="Dismiss" onClick={() => remove(t.id)}>×</button>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
