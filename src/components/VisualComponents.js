import React, {forwardRef, useEffect, useMemo, useRef, useState} from 'react';
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