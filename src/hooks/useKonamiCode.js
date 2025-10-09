import {useCallback, useEffect, useMemo, useRef} from 'react';

export const useKonamiCode = (callback) => {
    const konamiCode = useMemo(() => ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'], []);
    const currentIndex = useRef(0);

    const onKeyDown = useCallback((e) => {
        const expectedKey = konamiCode[currentIndex.current];

        if (e.key === expectedKey) {
            currentIndex.current += 1;

            if (currentIndex.current === konamiCode.length) {
                callback();
                currentIndex.current = 0;
            }
        } else {
            currentIndex.current = 0;
        }
    }, [callback, konamiCode]);

    useEffect(() => {
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [onKeyDown]);
};
