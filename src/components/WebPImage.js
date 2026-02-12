import React, {useState} from 'react';

/**
 * WebPImage Component
 * 
 * A reusable image component that provides WebP format with fallbacks
 * and lazy loading support. Uses the <picture> element for optimal
 * browser support.
 * 
 * @param {string} webpSrc - WebP image source URL
 * @param {string} fallbackSrc - Fallback image source (jpg, png, etc.)
 * @param {string} alt - Alt text for accessibility
 * @param {string} className - Additional CSS classes
 * @param {boolean} lazy - Enable lazy loading (default: true)
 * @param {function} onError - Error handler callback
 * @param {object} style - Inline styles
 * @param {object} ...rest - Other img attributes
 */
const WebPImage = ({
    webpSrc,
    fallbackSrc,
    alt = '',
    className = '',
    lazy = true,
    onError,
    style,
    ...rest
}) => {
    const [hasError, setHasError] = useState(false);

    const handleError = (e) => {
        setHasError(true);
        if (onError) {
            onError(e);
        }
    };

    // If error occurred, show fallback or nothing
    if (hasError && !fallbackSrc) {
        return null;
    }

    // If only fallback is provided (no WebP), use regular img
    if (!webpSrc && fallbackSrc) {
        return (
            <img
                src={fallbackSrc}
                alt={alt}
                className={className}
                loading={lazy ? 'lazy' : 'eager'}
                onError={handleError}
                style={style}
                {...rest}
            />
        );
    }

    // If only WebP is provided (no fallback), use regular img
    if (webpSrc && !fallbackSrc) {
        return (
            <img
                src={webpSrc}
                alt={alt}
                className={className}
                loading={lazy ? 'lazy' : 'eager'}
                onError={handleError}
                style={style}
                {...rest}
            />
        );
    }

    // Use picture element with WebP and fallback
    return (
        <picture>
            <source srcSet={webpSrc} type="image/webp" />
            <img
                src={fallbackSrc}
                alt={alt}
                className={className}
                loading={lazy ? 'lazy' : 'eager'}
                onError={handleError}
                style={style}
                {...rest}
            />
        </picture>
    );
};

export default WebPImage;
