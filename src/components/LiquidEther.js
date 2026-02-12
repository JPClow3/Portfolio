import React, {useEffect, useRef} from 'react';
// NOTE: Using non-cryptographic random for visual effects only (animation)
import {random, randomRange} from '../utils/random';

const LiquidEther = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let points = [];
        let hue = 0;

        const config = {
            pointCount: 10,
            pointSpeed: 0.1,
            pointRadius: 4,
            lineDistance: 100,
            backgroundColor: 'rgba(25, 25, 25, 1)'
        };

        class Point {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.vx = (random() - 0.5) * config.pointSpeed;
                this.vy = (random() - 0.5) * config.pointSpeed;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, config.pointRadius, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${hue}, 100%, 50%, 0.5)`;
                ctx.fill();
            }
        }

        const init = () => {
            points = [];
            for (let i = 0; i < config.pointCount; i++) {
                points.push(new Point(randomRange(0, width), randomRange(0, height)));
            }
        };

        const animate = () => {
            ctx.fillStyle = config.backgroundColor;
            ctx.fillRect(0, 0, width, height);

            hue++;

            points.forEach(point => {
                point.update();
                point.draw();
            });

            for (let i = 0; i < points.length; i++) {
                for (let j = i + 1; j < points.length; j++) {
                    const distance = Math.sqrt(Math.pow(points[i].x - points[j].x, 2) + Math.pow(points[i].y - points[j].y, 2));
                    if (distance < config.lineDistance) {
                        ctx.beginPath();
                        ctx.moveTo(points[i].x, points[i].y);
                        ctx.lineTo(points[j].x, points[j].y);
                        ctx.strokeStyle = `hsla(${hue}, 100%, 50%, ${1 - distance / config.lineDistance})`;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        };

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            init();
        };

        window.addEventListener('resize', handleResize);

        init();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full"/>;
};

export default LiquidEther;