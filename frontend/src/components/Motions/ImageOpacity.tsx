import { motion, useScroll, useTransform } from "motion/react";
import React, { useRef } from "react";

interface AnimatedImageProps {
    src?: string;
    alt?: string;
    className?: string;
}

export const AnimatedImage: React.FC<AnimatedImageProps> = ({ src, alt = "", className }) => {
    const ref = useRef(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 80%", "end 70%"],
    });

    const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
    const y = useTransform(scrollYProgress, [0, 1], [50, 0]);

    return (
        <motion.img
        ref={ref}
        src={src}
        alt={alt}
        style={{ opacity, y }}
        className={`transition-all duration-700 ${className}`}
        />
    );

}
