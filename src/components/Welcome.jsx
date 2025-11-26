import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const FONT_WEIGHTS = {
    subtitle: { min: 100, max: 400, default: 100 },
    title: { min: 400, max: 900, default: 400 },
};

const renderText = (text, className, baseWeight = 400) =>
    [...text].map((char, i) => (
        <span
            key={i}
            className={className}
            style={{
                fontVariationSettings: `'wght' ${baseWeight}`,
            }}
        >
      {char}
    </span>
    ));

const setupTextHover = (container, type) => {
    if (!container) return;

    const letters = container.querySelectorAll("span");
    const { min, max, default: base } = FONT_WEIGHTS[type];

    const animateLetters = (letter, weight, duration = 0.25) => {
        return gsap.to(letter, {
            duration,
            ease: "power2.out",
            fontVariationSettings: `'wght' ${weight}`,
        });
    };

    const handleMouseMove = (event) => {
        const containerLeft = container.getBoundingClientRect().left;
        const mouseX = event.clientX - containerLeft;

        letters.forEach((letter) => {
            const { left, width } = letter.getBoundingClientRect();

            const center = left - containerLeft + width / 2;
            const distance = Math.abs(mouseX - center);

            const intensity = Math.exp(-(distance ** 2) / 20000);
            const weight = min + (max - min) * intensity;

            animateLetters(letter, weight);
        });
    };

    const handleMouseLeave = () => {
        letters.forEach((letter) => {
            animateLetters(letter, base);
        });
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
};

const Welcome = () => {
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);

    useGSAP(() => {
        setupTextHover(titleRef.current, "title");
        setupTextHover(subtitleRef.current, "subtitle");
    }, []);

    return (
        <section id="welcome">
            <p ref={subtitleRef}>
                {renderText(
                    "Hey, I'm Rutuja! Welcome to my",
                    "text-3xl font-georama",
                    100
                )}
            </p>

            <h1 ref={titleRef} className="mt-7">
                {renderText("portfolio", "text-9xl italic font-georama")}
            </h1>

            <div className="small-screen">
                <p>This Portfolio is designed for desktop/tabled screens only.</p>
            </div>
        </section>
    );
};

export default Welcome;
