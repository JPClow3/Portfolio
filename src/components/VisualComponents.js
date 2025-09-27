import React, {
    Children,
    cloneElement,
    forwardRef,
    isValidElement,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import {useEffects, useLibs, useTheme} from '../context/AppContext';

// --- Card foi movido para cá e exportado diretamente ---
export const Card = forwardRef(({ customClass, ...rest }, ref) => (
    <div ref={ref} {...rest} className={`card-swap-card ${customClass ?? ""} ${rest.className ?? ""}`.trim()} />
));
Card.displayName = "Card";


// --- O restante dos seus componentes visuais ---

export const GradientText = ({ children, className = "", colors = ["#40ffaa", "#4079ff", "#40ffaa"], animationSpeed = 8 }) => {
    const gradientStyle = {
        backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
        animationDuration: `${animationSpeed}s`,
    };
    return <div className={`animated-gradient-text ${className}`}><div className="text-content" style={gradientStyle}>{children}</div></div>;
};

export const TypingAnimation = ({ text, className, gradientColors, animationSpeed }) => {
    const [typedText, setTypedText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const textRef = useRef(text);
    textRef.current = text;

    useEffect(() => {
        const typingSpeed = 150;
        const deletingSpeed = 100;
        const delay = 3000;
        let ticker;

        const handleTyping = () => {
            const fullText = textRef.current;
            const updatedText = isDeleting
                ? fullText.substring(0, typedText.length - 1)
                : fullText.substring(0, typedText.length + 1);

            setTypedText(updatedText);

            if (!isDeleting && updatedText === fullText) {
                ticker = setTimeout(() => setIsDeleting(true), delay);
            } else if (isDeleting && updatedText === '') {
                setIsDeleting(false);
            } else {
                ticker = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);
            }
        };

        ticker = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);
        return () => clearTimeout(ticker);
    }, [typedText, isDeleting]);

    return (
        <h1 className={className}>
            <GradientText colors={gradientColors} animationSpeed={animationSpeed}>
                {typedText}<span className="typing-cursor">|</span>
            </GradientText>
        </h1>
    );
};

export const StarBorder = ({ as: Component = "div", className = "", speed = "6s", thickness = 1, children, ...rest }) => {
    const { theme } = useTheme();
    const starColor = theme === 'dark' ? 'rgba(59, 130, 246, 0.9)' : 'rgba(37, 99, 235, 0.9)';
    return (
        <Component className={`star-border-container ${className}`} style={{ ...rest.style }} {...rest}>
            <div className="border-gradient-bottom" style={{ background: `radial-gradient(circle, ${starColor}, transparent 40%)`, animationDuration: speed, height: `${thickness}px` }}></div>
            <div className="border-gradient-top" style={{ background: `radial-gradient(circle, ${starColor}, transparent 40%)`, animationDuration: speed, height: `${thickness}px` }}></div>
            <div className="inner-content">{children}</div>
        </Component>
    );
};

export const SpotlightCard = ({ children, className = "", spotlightColor }) => {
    const divRef = useRef(null);
    const { theme } = useTheme();

    const handleMouseMove = (e) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        divRef.current.style.setProperty("--mouse-x", `${x}px`);
        divRef.current.style.setProperty("--mouse-y", `${y}px`);
    };

    const color = useMemo(() => spotlightColor || (theme === 'dark' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(37, 99, 235, 0.2)'), [spotlightColor, theme]);

    return (
        <div ref={divRef} onMouseMove={handleMouseMove} className={`card-spotlight ${className}`} style={{ '--spotlight-color': color }}>
            {children}
        </div>
    );
};

export const FadeInOnScroll = ({ children, delay = 0, triggerOnce = true }) => {
    const domRef = useRef();
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    if (triggerOnce) { observer.unobserve(entry.target); }
                }
            });
        }, { threshold: 0.1 });
        const currentRef = domRef.current;
        if (currentRef) { observer.observe(currentRef); }
        return () => { if (currentRef) { observer.unobserve(currentRef); } };
    }, [triggerOnce]);
    return (<div ref={domRef} className="fade-in-section" style={{ transitionDelay: `${delay}ms` }}> {children} </div>);
};

export const DotGrid = ({ dotSize = 2, gap = 25 }) => {
    const { theme } = useTheme();
    const {enableDotGrid, enableHighContrastGrid, gridAnimate, performanceMode} = useEffects();
    const wrapperRef = useRef(null);
    const canvasRef = useRef(null);
    const pointerRef = useRef({ x: -9999, y: -9999 });
    const lastPointerRef = useRef({x: -9999, y: -9999});
    const prefersReducedMotion = useMemo(() => (typeof window !== 'undefined') && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);

    const baseColor = useMemo(() => (theme === 'dark' ? '#334155' : '#cbd5e1'), [theme]);
    const activeColor = useMemo(() => (theme === 'dark' ? '#38bdf8' : '#2563eb'), [theme]);
    const highContrastMultiplier = enableHighContrastGrid ? 1.8 : 1;

    const baseRgb = useMemo(() => {
        const m = baseColor.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
        return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : { r: 148, g: 163, b: 184 };
    }, [baseColor]);
    const activeRgb = useMemo(() => {
        const m = activeColor.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
        return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : { r: 37, g: 99, b: 235 };
    }, [activeColor]);

    useEffect(() => {
        if (!enableDotGrid) return;
        const canvas = canvasRef.current;
        const wrap = wrapperRef.current;
        if (!canvas || !wrap) return;
        let dots = [];
        let needsRedraw = true;
        let time = 0;
        const buildGrid = () => {
            const { width, height } = wrap.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            const ctx = canvas.getContext('2d');
            ctx.scale(dpr, dpr);
            const effectiveGap = performanceMode ? gap * 1.6 : gap;
            const cols = Math.min(Math.floor((width + effectiveGap) / (dotSize + effectiveGap)), performanceMode ? 70 : 90);
            const rows = Math.min(Math.floor((height + effectiveGap) / (dotSize + effectiveGap)), performanceMode ? 45 : 60);
            const cell = dotSize + effectiveGap;
            const gridW = cell * cols - effectiveGap;
            const gridH = cell * rows - effectiveGap;
            const startX = (width - gridW) / 2;
            const startY = (height - gridH) / 2;
            dots = [];
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    dots.push({ cx: startX + x * cell, cy: startY + y * cell });
                }
            }
            needsRedraw = true;
        };
        buildGrid();
        const onMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            pointerRef.current.x = e.clientX - rect.left;
            pointerRef.current.y = e.clientY - rect.top;
            if (pointerRef.current.x !== lastPointerRef.current.x || pointerRef.current.y !== lastPointerRef.current.y) {
                needsRedraw = true;
            }
        };
        window.addEventListener('mousemove', onMove, {passive: true});
        window.addEventListener('resize', buildGrid);
        let rafId;
        const proximity = (performanceMode ? 160 : 210) * (enableHighContrastGrid ? 1.8 : 1);
        const proxSq = proximity * proximity;
        const draw = () => {
            if (!enableDotGrid) return;
            if (gridAnimate) time += performanceMode ? 0.01 : 0.016;
            rafId = requestAnimationFrame(draw);
            if (prefersReducedMotion && !gridAnimate) {
                if (!needsRedraw) return;
            }
            if (!gridAnimate && !needsRedraw) return;
            needsRedraw = false;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const { x: px, y: py } = pointerRef.current;
            lastPointerRef.current.x = px;
            lastPointerRef.current.y = py;
            const wave = gridAnimate ? Math.sin(time * 0.6) * 0.12 : 0;
            for (const dot of dots) {
                const dx = dot.cx - px;
                const dy = dot.cy - py;
                const dsq = dx * dx + dy * dy;
                let t = 0;
                if (dsq <= proxSq) t = 1 - (dsq / proxSq);
                if (gridAnimate) t += wave * 0.12;
                t = Math.max(0, Math.min(1, t));
                const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
                const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
                const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
                const radius = (dotSize * (enableHighContrastGrid ? 1.6 : 1.35)) / 2 + (t * (enableHighContrastGrid ? 1.4 : 0.9));
                const baseAlpha = enableHighContrastGrid ? 0.75 : 0.55;
                const highlightGain = enableHighContrastGrid ? 0.55 : 0.40;
                ctx.fillStyle = `rgba(${r},${g},${b},${(baseAlpha + t * highlightGain).toFixed(3)})`;
                ctx.beginPath();
                ctx.arc(dot.cx, dot.cy, radius, 0, Math.PI * 2);
                ctx.fill();
            }
        };
        rafId = requestAnimationFrame(draw);
        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('resize', buildGrid);
        };
    }, [prefersReducedMotion, dotSize, gap, baseRgb, activeRgb, enableDotGrid, enableHighContrastGrid, gridAnimate, performanceMode]);

    // Dynamic dimming (CSS variable) based on hover inside content areas
    useEffect(() => {
        if (!enableDotGrid) return;
        const root = document.documentElement;
        const normalOpacity = enableHighContrastGrid ? '0.85' : '0.55';
        const dimOpacity = enableHighContrastGrid ? '0.55' : '0.3';
        const setNormal = () => root.style.setProperty('--dot-grid-opacity', normalOpacity);
        const setDim = () => root.style.setProperty('--dot-grid-opacity', dimOpacity);
        setNormal();
        const targets = document.querySelectorAll('main, header, footer, .app-section');
        targets.forEach(t => {
            t.addEventListener('pointerenter', setDim);
            t.addEventListener('pointerleave', setNormal);
        });
        return () => {
            targets.forEach(t => {
                t.removeEventListener('pointerenter', setDim);
                t.removeEventListener('pointerleave', setNormal);
            });
        };
    }, [enableDotGrid, enableHighContrastGrid]);

    if (!enableDotGrid) return null;
    return <div ref={wrapperRef} className="dot-grid-background"
                data-contrast={enableHighContrastGrid ? 'high' : 'normal'}>
        <canvas ref={canvasRef}/>
    </div>;
};

export const ProfileCardComponent = ({
                                         avatarUrl,
                                         name,
                                         title,
                                         status,
                                         contactText,
                                         onContactClick,
                                         enableTilt = true,
                                     }) => {
    const wrapRef = useRef(null);
    const cardRef = useRef(null);
    const { theme } = useTheme();
    const { gsap } = useLibs();

    useEffect(() => {
        if (!enableTilt || !gsap) return;
        const card = cardRef.current;
        const wrap = wrapRef.current;

        const onMove = (event) => {
            const { clientWidth: width, clientHeight: height } = card;
            const rect = card.getBoundingClientRect();
            const offsetX = event.clientX - rect.left;
            const offsetY = event.clientY - rect.top;
            const percentX = Math.min(Math.max(offsetX / width, 0), 1) * 100;
            const percentY = Math.min(Math.max(offsetY / height, 0), 1) * 100;
            const centerX = percentX - 50;
            const centerY = percentY - 50;

            gsap.to(card, {
                duration: 0.5,
                rotationY: centerY / 12,
                rotationX: -centerX / 15,
                ease: "power1.out"
            });
            gsap.to(wrap, {
                duration: 0.5,
                '--pointer-x': `${percentX}%`,
                '--pointer-y': `${percentY}%`,
                '--pointer-from-center': Math.min(Math.max(Math.hypot(centerY, centerX) / 50, 0), 1),
                ease: "power1.out"
            });
        };
        const onEnter = () => wrap.classList.add("active");
        const onLeave = () => {
            wrap.classList.remove("active");
            gsap.to(card, { duration: 1, rotationY: 0, rotationX: 0, ease: "elastic.out(1, 0.75)" });
            gsap.to(wrap, { duration: 1, '--pointer-from-center': 0, ease: "elastic.out(1, 0.75)" });
        };

        card.addEventListener("pointerenter", onEnter);
        card.addEventListener("pointermove", onMove);
        card.addEventListener("pointerleave", onLeave);
        return () => {
            card.removeEventListener("pointerenter", onEnter);
            card.removeEventListener("pointermove", onMove);
            card.removeEventListener("pointerleave", onLeave);
        };
    }, [enableTilt, gsap]);

    const cardStyle = useMemo(() => ({
        "--behind-gradient": theme === 'dark' ? `radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),hsla(240,100%,95%,0.1) 4%,hsla(240,50%,80%,0.075) 10%,hsla(240,25%,70%,0.05) 50%,transparent 100%)` : `radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),hsla(220,100%,90%,0.5) 4%,hsla(220,50%,80%,0.25) 10%,hsla(220,25%,70%,0.1) 50%,transparent 100%)`,
        "--inner-gradient": theme === 'dark' ? `linear-gradient(145deg,rgba(56, 66, 94, 0.55) 0%, rgba(59, 130, 246, 0.1) 100%)` : `linear-gradient(145deg,rgba(255, 255, 255, 0.6) 0%, rgba(225, 235, 255, 0.4) 100%)`,
    }), [theme]);

    return (
        <div ref={wrapRef} className="pc-card-wrapper" style={cardStyle}>
            <section ref={cardRef} className="pc-card">
                <div className="pc-inside" style={{background: cardStyle['--inner-gradient']}}>
                    <div className="pc-shine" />
                    <div className="pc-glare" />
                    <div className="pc-content pc-avatar-content"><img className="avatar" src={avatarUrl} alt={`${name} avatar`} loading="lazy" /></div>
                    <div className="pc-content pc-user-content">
                        <div className="pc-details"><h3>{name}</h3><p>{title}</p></div>
                        <div className="pc-user-info">
                            <div className="pc-user-text"><div className="pc-handle">@JPClow3</div><div className="pc-status">{status}</div></div>
                            <button className="pc-contact-btn" onClick={onContactClick} type="button" aria-label={`Contact ${name}`}>{contactText}</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
export const ProfileCard = React.memo(ProfileCardComponent);

export const CardSwap = ({
                             width = 350,
                             height = 280,
                             cardDistance = 40,
                             verticalDistance = 40,
                             delay = 2500,
                             skewAmount = 4,
                             children,
                             pauseOnHover = true,
                             randomizeOrder = true,
                             autoStart = true,
                             variant = 'fade',
                             frontTravel = 180
                         }) => {
    const { gsap } = useLibs();
    const {enableCardAnimations} = useEffects();
    const childArr = useMemo(() => Children.toArray(children), [children]);
    const prefersReducedMotion = useMemo(() => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);

    // Shared refs/state
    const [fadeIndex, setFadeIndex] = useState(0);
    const fadeTimerRef = useRef(null);
    const fadeHoverRef = useRef(false);
    const fadeOrderRef = useRef(childArr.map((_, i) => i));

    // Refs for gsap stack
    const refs = useMemo(() => childArr.map(() => React.createRef()), [childArr]);
    const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
    const container = useRef(null);
    const timerRef = useRef(null); // gsap loop timer
    const activeRef = useRef(false);
    const hoverPausedRef = useRef(false);

    // Capability flags
    const canUseGsapStack = variant === 'gsap-stack' && enableCardAnimations && !!gsap && childArr.length > 1 && !prefersReducedMotion;
    const useFade = !canUseGsapStack && enableCardAnimations && childArr.length > 1 && !prefersReducedMotion;

    // Fade (CSS cross-fade) effect
    useEffect(() => {
        if (!useFade) return; // only run in fade mode
        const advance = () => {
            if (fadeHoverRef.current) {
                schedule();
                return;
            }
            if (randomizeOrder && fadeOrderRef.current.length > 2) {
                const arr = fadeOrderRef.current.slice();
                const nextIdx = 1 + Math.floor(Math.random() * (arr.length - 1));
                [arr[0], arr[nextIdx]] = [arr[nextIdx], arr[0]];
                fadeOrderRef.current = arr;
            } else {
                fadeOrderRef.current = [...fadeOrderRef.current.slice(1), fadeOrderRef.current[0]];
            }
            setFadeIndex(fadeOrderRef.current[0]);
            schedule();
        };
        const schedule = () => {
            clearTimeout(fadeTimerRef.current);
            fadeTimerRef.current = setTimeout(advance, delay);
        };
        schedule();
        return () => {
            clearTimeout(fadeTimerRef.current);
        };
    }, [useFade, delay, randomizeOrder, childArr.length]);

    // GSAP stack effect
    useEffect(() => {
        if (!canUseGsapStack) return;
        if (childArr.length <= 1) return;
        const elContainer = container.current;
        if (!elContainer) return;
        const makeSlot = (i) => ({
            x: i * cardDistance,
            y: -i * verticalDistance,
            z: -i * cardDistance * 1.5,
            zIndex: refs.length - i
        });
        const placeNow = (el, slot) => gsap.set(el, {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            xPercent: -50,
            yPercent: -50,
            skewY: skewAmount,
            transformOrigin: 'center center',
            zIndex: slot.zIndex,
            force3D: true
        });
        refs.forEach((r, i) => {
            if (r.current) {
                placeNow(r.current, makeSlot(i));
                r.current.style.opacity = 0;
            }
        });
        gsap.to(refs.map(r => r.current).filter(Boolean), {
            opacity: 1,
            stagger: 0.06,
            duration: 0.45,
            ease: 'power2.out'
        });
        const swap = () => {
            if (!activeRef.current || hoverPausedRef.current) return;
            if (order.current.length < 2) return;
            if (randomizeOrder && order.current.length > 2) {
                const idx = 1 + Math.floor(Math.random() * (order.current.length - 1));
                const arr = order.current.slice();
                const [chosen] = arr.splice(idx, 1);
                order.current = [chosen, ...arr];
            }
            const [front, ...rest] = order.current;
            const elFront = refs[front].current;
            if (!elFront) return;
            const tl = gsap.timeline({
                onComplete: () => {
                    order.current = [...rest, front];
                }
            });
            tl.to(elFront, {y: '+=' + frontTravel, duration: 0.5, ease: 'power1.inOut'});
            rest.forEach((idx, i) => {
                const el = refs[idx].current;
                if (!el) return;
                const slot = makeSlot(i);
                tl.set(el, {zIndex: slot.zIndex}, '-=0.25');
                tl.to(el, {x: slot.x, y: slot.y, z: slot.z, duration: 0.5, ease: 'power1.inOut'}, '<');
            });
            const backSlot = makeSlot(refs.length - 1);
            tl.set(elFront, { x: backSlot.x, z: backSlot.z, zIndex: backSlot.zIndex });
            tl.to(elFront, {y: backSlot.y, duration: 0.45, ease: 'power1.inOut'}, '-=0.15');
        };
        const clearTimer = () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
        const loop = () => {
            clearTimer();
            if (!activeRef.current) return;
            swap();
            timerRef.current = setTimeout(loop, delay);
        };
        const start = () => {
            if (activeRef.current) return;
            activeRef.current = true;
            if (autoStart) {
                setTimeout(() => {
                    if (activeRef.current) swap();
                }, Math.min(600, delay * 0.35));
            }
            timerRef.current = setTimeout(loop, delay);
        };
        const stop = () => {
            activeRef.current = false;
            clearTimer();
        };
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) start(); else stop();
            });
        }, {threshold: 0.25});
        io.observe(elContainer);
        const rect = elContainer.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) start();
        const onVisibility = () => {
            if (document.hidden) stop(); else start();
        };
        document.addEventListener('visibilitychange', onVisibility);
        const onEnter = () => {
            if (pauseOnHover) hoverPausedRef.current = true;
        };
        const onLeave = () => {
            if (pauseOnHover) {
                hoverPausedRef.current = false;
                if (activeRef.current) {
                    swap();
                    clearTimer();
                    timerRef.current = setTimeout(loop, delay);
                }
            }
        };
        if (pauseOnHover) {
            elContainer.addEventListener('mouseenter', onEnter);
            elContainer.addEventListener('mouseleave', onLeave);
        }
        return () => {
            if (pauseOnHover) {
                elContainer.removeEventListener('mouseenter', onEnter);
                elContainer.removeEventListener('mouseleave', onLeave);
            }
            stop();
            io.disconnect();
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, [canUseGsapStack, childArr, cardDistance, verticalDistance, delay, skewAmount, randomizeOrder, autoStart, pauseOnHover, gsap, enableCardAnimations, frontTravel, refs]);

    // Render cases
    if (prefersReducedMotion || childArr.length <= 1 || !enableCardAnimations) {
        return <div className="card-swap-fallback" style={{width: '100%', maxWidth: width}}>{childArr[0] || null}</div>;
    }

    if (useFade) {
        const onEnter = () => {
            if (pauseOnHover) fadeHoverRef.current = true;
        };
        const onLeave = () => {
            if (pauseOnHover) fadeHoverRef.current = false;
        };
        return (
            <div className="card-swap-container" style={{width, height}} onMouseEnter={onEnter} onMouseLeave={onLeave}>
                {childArr.map((child, i) => isValidElement(child) ? cloneElement(child, {
                    key: i,
                    style: {
                        width,
                        height,
                        opacity: i === fadeIndex ? 1 : 0,
                        transition: 'opacity .6s ease',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: i === fadeIndex ? 'auto' : 'none', ...(child.props.style || {})
                    },
                    className: `${child.props.className || ''} card-swap-card`
                }) : child)}
            </div>
        );
    }

    // GSAP stack variant
    const rendered = childArr.map((child, i) => isValidElement(child) ? cloneElement(child, { key: i, ref: refs[i], style: { width, height, ...(child.props.style ?? {}) } }) : child);

    return <div ref={container} className="card-swap-container" style={{ width, height }}>{rendered}</div>;
};

export const SimpleCardSwap = ({
                                   width = 350,
                                   height = 280,
                                   delay = 1800,
                                   verticalOffset: verticalOffsetProp,
                                   depthOffset = 160,
                                   scaleStep = 0.09,
                                   rotateStep = 5,
                                   randomize = true,
                                   pauseOnHover: pauseOnHoverProp,
                                   controls = true,
                                   baseFrontOffset: baseFrontOffsetProp,
                                   maxVisible: maxVisibleProp,
                                   children
                               }) => {
    const {
        enableCardAnimations,
        skillSwapFast,
        skillSwapRandomOrder,
        skillSwapControls,
        skillSwapPulse,
        skillSwapRandomEasing,
        skillSwapBaseOffset,
        skillSwapVerticalOffset,
        skillSwapMaxVisible,
        skillSwapPauseOnHover,
        performanceMode
    } = useEffects();
    // Ensure we have the children array early (was previously referenced before declaration)
    const childArr = useMemo(() => Children.toArray(children), [children]);
    const baseFrontOffsetRaw = baseFrontOffsetProp ?? skillSwapBaseOffset;
    const verticalOffsetRaw = verticalOffsetProp ?? skillSwapVerticalOffset;
    const maxVisibleRaw = maxVisibleProp ?? skillSwapMaxVisible;
    const baseFrontOffset = Math.min(40, Math.max(-140, baseFrontOffsetRaw));
    const verticalOffset = Math.min(80, Math.max(16, verticalOffsetRaw));
    const maxVisible = Math.min(childArr.length, Math.max(2, maxVisibleRaw));
    const pauseOnHover = pauseOnHoverProp ?? skillSwapPauseOnHover;
    const effectiveDelay = (skillSwapFast ? Math.min(1400, delay * 0.65) : delay);
    const useRandomOrder = skillSwapRandomOrder && randomize;
    const showControls = skillSwapControls && controls;
    const prefersReducedMotion = useMemo(() => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
    const containerRef = useRef(null);
    const refs = useMemo(() => childArr.map(() => React.createRef()), [childArr]);
    const orderRef = useRef(childArr.map((_, i) => i));
    const timerRef = useRef();
    const hoverRef = useRef(false);
    const activeRef = useRef(false);
    const forceCycleRef = useRef(0);
    const firstSwapDoneRef = useRef(false);

    const applyLayout = useCallback(() => {
        orderRef.current.forEach((id, position) => {
            const el = refs[id].current;
            if (!el) return;
            const translateY = baseFrontOffset - position * verticalOffset;
            const translateZ = -position * depthOffset;
            let scale = 1 - position * scaleStep;
            if (position === 0) scale *= 1.03;
            const rotate = position * rotateStep;
            const hidden = position >= maxVisible;
            const opacity = hidden ? 0 : 1 - Math.max(0, (position - (maxVisible - 1)) * 0.25);
            if (position === 0) {
                el.setAttribute('data-front', 'true');
                if (skillSwapPulse) {
                    el.classList.remove('front-pulse');
                    void el.offsetWidth;
                    el.classList.add('front-pulse');
                } else {
                    el.classList.remove('front-pulse');
                }
            } else {
                el.removeAttribute('data-front');
                el.classList.remove('front-pulse');
            }
            let ease = 'cubic-bezier(.65,.3,.2,1)';
            if (skillSwapRandomEasing) {
                const easingVariants = ['cubic-bezier(.65,.3,.2,1)', 'cubic-bezier(.55,.25,.15,1)', 'cubic-bezier(.7,.32,.18,.98)'];
                ease = easingVariants[(forceCycleRef.current + position) % easingVariants.length];
            }
            el.dataset.order = String(position);
            el.style.transform = `translate(-50%, -50%) translate3d(0, ${translateY}px, ${translateZ}px) scale(${scale}) rotate(${rotate}deg)`;
            el.style.zIndex = String(500 - position);
            el.style.opacity = opacity;
            el.style.pointerEvents = position === 0 ? 'auto' : 'none';
            el.style.filter = 'none';
            el.style.transition = `transform ${performanceMode ? '.45s' : '.7s'} ${ease}, opacity .4s ease`;
        });
    }, [depthOffset, verticalOffset, scaleStep, rotateStep, refs, skillSwapPulse, skillSwapRandomEasing, baseFrontOffset, maxVisible, performanceMode]);

    const advanceOrder = useCallback((direction = 1, manual = false) => {
        if (childArr.length <= 1) return;
        if (direction === 1) {
            if (useRandomOrder && orderRef.current.length > 2 && !manual) {
                const arr = orderRef.current.slice();
                const idx = 1 + Math.floor(Math.random() * (arr.length - 1));
                const [picked] = arr.splice(idx, 1);
                orderRef.current = [picked, ...arr];
            } else {
                orderRef.current = [...orderRef.current.slice(1), orderRef.current[0]];
            }
        } else {
            const arr = orderRef.current.slice();
            const last = arr.pop();
            orderRef.current = [last, ...arr];
        }
        forceCycleRef.current++;
        applyLayout();
    }, [applyLayout, useRandomOrder, childArr.length]);

    const tick = useCallback(() => {
        if (!activeRef.current) return;
        if (!hoverRef.current || !firstSwapDoneRef.current) {
            advanceOrder(1);
            firstSwapDoneRef.current = true;
        }
        timerRef.current = setTimeout(tick, effectiveDelay);
    }, [advanceOrder, effectiveDelay]);

    useEffect(() => {
        if (prefersReducedMotion || !enableCardAnimations || childArr.length <= 1) return;
        const container = containerRef.current;
        activeRef.current = true;
        applyLayout();
        timerRef.current = setTimeout(tick, Math.min(600, effectiveDelay * 0.4));
        const onEnter = () => {
            if (pauseOnHover) hoverRef.current = true;
        };
        const onLeave = () => {
            if (pauseOnHover) hoverRef.current = false;
        };
        if (pauseOnHover && container) {
            container.addEventListener('mouseenter', onEnter);
            container.addEventListener('mouseleave', onLeave);
        }
        return () => {
            activeRef.current = false;
            clearTimeout(timerRef.current);
            if (pauseOnHover && container) {
                container.removeEventListener('mouseenter', onEnter);
                container.removeEventListener('mouseleave', onLeave);
            }
        };
    }, [prefersReducedMotion, enableCardAnimations, childArr, effectiveDelay, pauseOnHover, applyLayout, tick]);

    const handlePrev = () => {
        clearTimeout(timerRef.current);
        advanceOrder(-1, true);
        timerRef.current = setTimeout(tick, effectiveDelay);
    };
    const handleNext = () => {
        clearTimeout(timerRef.current);
        advanceOrder(1, true);
        timerRef.current = setTimeout(tick, effectiveDelay);
    };

    if (prefersReducedMotion || !enableCardAnimations || childArr.length <= 1) {
        return <div className="card-swap-fallback grid gap-6" style={{width: '100%', maxWidth: width}}>{childArr}</div>;
    }

    return (
        <div className="simple-card-swap-wrapper" style={{width}}>
            <div ref={containerRef} className="simple-card-swap" style={{width, height}}>
                {childArr.map((child, i) => isValidElement(child) ? cloneElement(child, {
                    key: i,
                    ref: refs[i],
                    style: {
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: '50%',
                        left: '50%', ...(child.props.style || {})
                    },
                    className: `card-swap-card simple-swap-item ${child.props.className || ''}`.trim()
                }) : child)}
            </div>
            {showControls && childArr.length > 1 && (
                <div className="simple-card-swap-controls" aria-label="Card swap controls">
                    <button type="button" onClick={handlePrev} aria-label="Previous" className="swap-btn prev">‹
                    </button>
                    <button type="button" onClick={handleNext} aria-label="Next" className="swap-btn next">›</button>
        </div>
            )}
        </div>
    );
};

export const AutoFadeSwap = ({
                                 children,
                                 width = 360,
                                 height = 300,
                                 delay = 2200,
                                 randomize = true,
                                 pauseOnHover = true,
                                 fadeDuration = 650,
                                 initialIndex = 0
                             }) => {
    const {enableCardAnimations} = useEffects();
    const childArr = useMemo(() => Children.toArray(children).filter(Boolean), [children]);
    const [active, setActive] = useState(initialIndex);
    const timerRef = useRef();
    const hoverRef = useRef(false);
    const orderRef = useRef(childArr.map((_, i) => i));
    const containerRef = useRef(null);

    const schedule = useCallback(() => {
        clearTimeout(timerRef.current);
        if (!enableCardAnimations || childArr.length <= 1) return;
        timerRef.current = setTimeout(() => {
            if (hoverRef.current) {
                schedule();
                return;
            }
            if (randomize && orderRef.current.length > 2) {
                const arr = orderRef.current.slice();
                const idx = 1 + Math.floor(Math.random() * (arr.length - 1));
                const [picked] = arr.splice(idx, 1);
                orderRef.current = [picked, ...arr];
            } else {
                orderRef.current = [...orderRef.current.slice(1), orderRef.current[0]];
            }
            setActive(orderRef.current[0]);
            schedule();
        }, delay);
    }, [delay, randomize, childArr.length, enableCardAnimations]);

    useEffect(() => {
        schedule();
        return () => clearTimeout(timerRef.current);
    }, [schedule]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const onEnter = () => {
            if (pauseOnHover) hoverRef.current = true;
        };
        const onLeave = () => {
            if (pauseOnHover) hoverRef.current = false;
        };
        if (pauseOnHover) {
            el.addEventListener('mouseenter', onEnter);
            el.addEventListener('mouseleave', onLeave);
        }
        return () => {
            if (pauseOnHover) {
                el.removeEventListener('mouseenter', onEnter);
                el.removeEventListener('mouseleave', onLeave);
            }
        };
    }, [pauseOnHover]);

    if (childArr.length === 0) return null;
    if (!enableCardAnimations || childArr.length === 1) {
        return <div style={{width, maxWidth: '100%'}}>{childArr[0]}</div>;
    }
    return (
        <div ref={containerRef} className="auto-fade-swap relative" style={{width, height}}>
            {childArr.map((child, i) => isValidElement(child) ? cloneElement(child, {
                key: i,
                style: {
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    opacity: active === i ? 1 : 0,
                    transition: `opacity ${fadeDuration}ms ease`,
                    pointerEvents: active === i ? 'auto' : 'none',
                    ...(child.props.style || {})
                },
                className: `${child.props.className || ''} card-swap-card fade-swap-item`.trim()
            }) : child)}
        </div>
    );
};

export const Section = ({id, title, children, className = ''}) => (
    <section id={id} className={`app-section py-24 relative ${className}`.trim()}>
        <div className="mx-auto w-full max-w-6xl px-4">
            {title &&
                <h2 className="section-title text-3xl sm:text-4xl font-bold tracking-tight text-center mb-12 bg-gradient-to-r from-blue-500 via-sky-400 to-blue-600 bg-clip-text text-transparent">{title}</h2>}
            {children}
        </div>
    </section>
);

export const SectionSeparator = ({className = ''}) => (
    <div className={`section-separator w-full flex justify-center my-8 ${className}`.trim()} aria-hidden="true">
        <div className="h-px w-3/4 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent"/>
    </div>
);

export const Confetti = React.memo(() => {
    const [pieces] = useState(() => Array.from({length: 50}, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.25,
        duration: 3.5 + Math.random() * 1.5,
        size: 5 + Math.random() * 5,
        hue: Math.floor(Math.random() * 360)
    })));
    return (
        <div className="confetti-wrapper pointer-events-none fixed inset-0 overflow-hidden z-[9999]" aria-hidden="true">
            {pieces.map(p => (
                <span
                    key={p.id}
                    className="confetti-piece"
                    style={{
                        left: p.left + '%',
                        animationDelay: p.delay + 's',
                        animationDuration: p.duration + 's',
                        width: p.size + 'px',
                        height: p.size * 0.4 + 'px',
                        background: `hsl(${p.hue} 90% 55%)`
                    }}
                />
            ))}
        </div>
    );
});
Confetti.displayName = 'Confetti';

export const CustomCursor = () => {
    const cursorRef = useRef(null);
    const {enableCustomCursor} = useEffects();
    useEffect(() => {
        if (!enableCustomCursor) return; // respect toggle
        const el = cursorRef.current;
        if (!el) return;
        const move = (e) => {
            el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        };
        window.addEventListener('pointermove', move, {passive: true});
        return () => window.removeEventListener('pointermove', move);
    }, [enableCustomCursor]);
    if (!enableCustomCursor) return null;
    return <div ref={cursorRef} className="custom-cursor" aria-hidden="true"/>;
};
