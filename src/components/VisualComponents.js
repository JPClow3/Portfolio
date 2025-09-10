import React, { useState, useEffect, useRef, useMemo, forwardRef, Children, isValidElement, cloneElement } from 'react';
import { useTheme, useLibs } from '../context/AppContext';

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
    const wrapperRef = useRef(null);
    const canvasRef = useRef(null);
    const pointerRef = useRef({ x: -9999, y: -9999 });

    const baseColor = useMemo(() => (theme === 'dark' ? '#1e293b' : '#e0e7ff'), [theme]);
    const activeColor = useMemo(() => (theme === 'dark' ? '#38bdf8' : '#4f46e5'), [theme]);

    const baseRgb = useMemo(() => {
        const m = baseColor.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
        return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : { r: 148, g: 163, b: 184 };
    }, [baseColor]);
    const activeRgb = useMemo(() => {
        const m = activeColor.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
        return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : { r: 37, g: 99, b: 235 };
    }, [activeColor]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const wrap = wrapperRef.current;
        if (!canvas || !wrap) return;

        let dots = [];
        const buildGrid = () => {
            const { width, height } = wrap.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            const ctx = canvas.getContext("2d");
            ctx.scale(dpr, dpr);
            const cols = Math.floor((width + gap) / (dotSize + gap));
            const rows = Math.floor((height + gap) / (dotSize + gap));
            const cell = dotSize + gap;
            const gridW = cell * cols - gap;
            const gridH = cell * rows - gap;
            const startX = (width - gridW) / 2;
            const startY = (height - gridH) / 2;
            dots = [];
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    dots.push({ cx: startX + x * cell, cy: startY + y * cell });
                }
            }
        };
        buildGrid();

        const onMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            pointerRef.current.x = e.clientX - rect.left;
            pointerRef.current.y = e.clientY - rect.top;
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("resize", buildGrid);

        let rafId;
        const proximity = 150;
        const proxSq = proximity * proximity;
        const draw = () => {
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const { x: px, y: py } = pointerRef.current;
            for (const dot of dots) {
                const dx = dot.cx - px;
                const dy = dot.cy - py;
                const dsq = dx * dx + dy * dy;
                let t = 0;
                if (dsq <= proxSq) { t = 1 - (dsq / proxSq); }
                const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
                const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
                const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
                ctx.fillStyle = `rgb(${r},${g},${b})`;
                ctx.beginPath();
                ctx.arc(dot.cx, dot.cy, dotSize / 2, 0, Math.PI * 2);
                ctx.fill();
            }
            rafId = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("resize", buildGrid);
        };
    }, [dotSize, gap, baseRgb, activeRgb]);

    return <div ref={wrapperRef} className="dot-grid-background"><canvas ref={canvasRef} /></div>;
};

const ProfileCardComponent = ({ avatarUrl, name, title, status, contactText, onContactClick, enableTilt = true, }) => {
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

export const CardSwap = ({ width = 350, height = 280, cardDistance = 40, verticalDistance = 40, delay = 4000, skewAmount = 4, children, pauseOnHover = true }) => {
    const { gsap } = useLibs();
    const childArr = useMemo(() => Children.toArray(children), [children]);
    const refs = useMemo(() => childArr.map(() => React.createRef()), [childArr]);
    const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
    const container = useRef(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (!gsap || refs.length === 0) return;

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
            transformOrigin: "center center",
            zIndex: slot.zIndex,
            force3D: true
        });

        refs.forEach((r, i) => { if (r.current) placeNow(r.current, makeSlot(i)) });

        const swap = () => {
            if (order.current.length < 2) return;
            const [front, ...rest] = order.current;
            const elFront = refs[front].current;
            if (!elFront) return;

            const tl = gsap.timeline({
                onComplete: () => {
                    order.current = [...rest, front];
                }
            });

            // Animação original, mais simples
            tl.to(elFront, {
                y: "+=300",
                duration: 0.8,
                ease: "power1.inOut"
            });

            rest.forEach((idx, i) => {
                const el = refs[idx].current;
                if (el) {
                    const slot = makeSlot(i);
                    tl.set(el, { zIndex: slot.zIndex }, "-=0.4");
                    tl.to(el, { x: slot.x, y: slot.y, z: slot.z, duration: 0.8, ease: "power1.inOut" }, "<");
                }
            });

            const backSlot = makeSlot(refs.length - 1);
            tl.set(elFront, { x: backSlot.x, z: backSlot.z, zIndex: backSlot.zIndex });
            tl.to(elFront, { y: backSlot.y, duration: 0.8, ease: "power1.inOut" }, "-=0.2");
        };

        intervalRef.current = setInterval(swap, delay);

        if (pauseOnHover) {
            const node = container.current;
            const pause = () => clearInterval(intervalRef.current);
            const resume = () => intervalRef.current = setInterval(swap, delay);
            node.addEventListener("mouseenter", pause);
            node.addEventListener("mouseleave", resume);
            return () => {
                if (node) {
                    node.removeEventListener("mouseenter", pause);
                    node.removeEventListener("mouseleave", resume);
                }
                clearInterval(intervalRef.current);
            };
        }
        return () => clearInterval(intervalRef.current);
    }, [gsap, childArr, cardDistance, verticalDistance, delay, skewAmount, refs, pauseOnHover]);

    const rendered = childArr.map((child, i) => isValidElement(child) ? cloneElement(child, { key: i, ref: refs[i], style: { width, height, ...(child.props.style ?? {}) } }) : child);

    return <div ref={container} className="card-swap-container" style={{ width, height }}>{rendered}</div>;
};

export const CustomCursor = () => {
    const { gsap } = useLibs();
    const cursorDotRef = useRef(null);
    const cursorOutlineRef = useRef(null);

    useEffect(() => {
        if (!gsap || 'ontouchstart' in window) {
            if ('ontouchstart' in window) document.body.classList.add('touch-device');
            return;
        }

        const dot = cursorDotRef.current;
        const outline = cursorOutlineRef.current;
        gsap.set([dot, outline], { xPercent: -50, yPercent: -50 });

        const onMouseMove = e => {
            gsap.to(dot, { duration: 0.2, x: e.clientX, y: e.clientY });
            gsap.to(outline, { duration: 0.6, x: e.clientX, y: e.clientY, ease: "power1.out" });
        };

        const onMouseAction = (scale) => () => gsap.to(outline, { scale, duration: 0.3 });

        window.addEventListener("mousemove", onMouseMove);

        const timer = setTimeout(() => {
            const interactiveElements = document.querySelectorAll("a, button, .pc-contact-btn");
            interactiveElements.forEach(el => {
                el.addEventListener("mouseenter", onMouseAction(1.5));
                el.addEventListener("mouseleave", onMouseAction(1));
            });
        }, 1000);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("mousemove", onMouseMove);
        };
    }, [gsap]);

    if ('ontouchstart' in window) return null;

    return (
        <>
            <div ref={cursorOutlineRef} className="cursor-outline"></div>
            <div ref={cursorDotRef} className="cursor-dot"></div>
        </>
    );
};

export const Confetti = () => {
    const confettiItems = useMemo(() => Array.from({ length: 150 }).map((_, i) => {
        const style = {
            left: `${Math.random() * 100}vw`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
            backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
        };
        return <i key={i} style={style}></i>;
    }), []);
    return <div className="confetti-container">{confettiItems}</div>;
};

export const SectionSeparator = () => {
    const { theme } = useTheme();
    const separatorColor = useMemo(() => theme === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.1)', [theme]);
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-4">
            <FadeInOnScroll>
                <div
                    className="h-px w-full"
                    style={{
                        background: `linear-gradient(to right, transparent, ${separatorColor}, transparent)`
                    }}
                ></div>
            </FadeInOnScroll>
        </div>
    );
};

export const Section = ({ id, title, children }) => (
    <section id={id} className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInOnScroll><h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-800 dark:text-white mb-12 sm:mb-16">{title}</h2></FadeInOnScroll>
            {children}
        </div>
    </section>
);
