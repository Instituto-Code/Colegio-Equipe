import { motion, useScroll } from "motion/react";

// Progresso de scroll no topo
export const ScrollLinked = () => {
    const { scrollYProgress } = useScroll()


    return(
        <>
            <motion.div
                id="scroll-indicator"
                style={{
                    scaleX: scrollYProgress,
                    pointerEvents: "none",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 5,
                    originX: 0,
                    backgroundColor: "red",
                    zIndex: 60
                }}
            />
            
        </>
    )
}