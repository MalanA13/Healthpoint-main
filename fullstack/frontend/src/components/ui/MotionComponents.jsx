import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

// Card yang ikut bergerak saat kursor mendekat
export function HoverCard({ children, className }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

// Teks yang muncul dengan efek blur-in dari bawah
export function BlurFadeText({ children, className, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, delay, ease: "easeOut" }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

// Section yang muncul dengan slide-up
export function FadeInSection({ children, className, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

// Parallax wrapper
export function ParallaxSection({ children, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.99 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.75, ease: "easeOut" }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
