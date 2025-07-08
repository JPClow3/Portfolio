import { useState, useMemo, useCallback, useEffect } from 'react';

export const useKonamiCode = (callback) => {
    const konamiCode = useMemo(() => ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'], []);
    const [keys, setKeys] = useState([]);

    const onKeyDown = useCallback((e) => {
        setKeys(prevKeys => {
            const newKeys = [...prevKeys, e.key].slice(-konamiCode.length);
            if (JSON.stringify(newKeys) === JSON.stringify(konamiCode)) {
                callback();
                return [];
            }
            return newKeys;
        });
    }, [callback, konamiCode]);

    useEffect(() => {
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [onKeyDown]);
};
