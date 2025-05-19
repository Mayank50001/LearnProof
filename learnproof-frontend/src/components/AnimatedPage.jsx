import { motion } from "framer-motion";

function AnimatedPage({ children }) {
  const animations = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -40 },
    transition: { duration: 0.4 }
  };

  return (
    <motion.div
      initial={animations.initial}
      animate={animations.animate}
      exit={animations.exit}
      transition={animations.transition}
    >
      {children}
    </motion.div>
  );
}

export default AnimatedPage;
