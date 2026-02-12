import {useEffect, useRef} from 'react';

/**
 * Hook to trap focus within a container (useful for modals, mobile menus, etc.)
 * @param {boolean} isActive - Whether the focus trap should be active
 * @returns {React.RefObject} Ref to attach to the container element
 */
export const useFocusTrap = (isActive) => {
    const ref = useRef(null);

    useEffect(() => {
        if (!isActive || !ref.current) return;

        const element = ref.current;
        
        // Get all focusable elements within the container
        const focusableSelectors = [
            'a[href]',
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])'
        ].join(', ');

        const focusableElements = Array.from(element.querySelectorAll(focusableSelectors))
            .filter(el => {
                // Filter out hidden elements
                const style = window.getComputedStyle(el);
                return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
            });

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleTab = (e) => {
            if (e.key !== 'Tab') return;

            // If Shift+Tab on first element, move to last
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } 
            // If Tab on last element, move to first
            else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
            // If focus escapes the container, bring it back
            else if (!element.contains(document.activeElement)) {
                e.preventDefault();
                firstElement.focus();
            }
        };

        element.addEventListener('keydown', handleTab);
        
        // Focus first element when trap becomes active
        firstElement?.focus();

        return () => {
            element.removeEventListener('keydown', handleTab);
        };
    }, [isActive]);

    return ref;
};

