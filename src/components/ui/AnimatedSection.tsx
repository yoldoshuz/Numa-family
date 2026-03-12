"use client";

import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils/cn";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

const slideLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 },
};

const slideRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 },
};

const animations = { fadeUp, fadeIn, scaleUp, slideLeft, slideRight };

interface AnimatedSectionProps {
  animation?: keyof typeof animations;
  delay?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
  className?: string;
  children: React.ReactNode;
}

export function AnimatedSection({
  animation = "fadeUp",
  delay = 0,
  duration = 0.6,
  once = true,
  amount = 0.2,
  className,
  children,
}: AnimatedSectionProps) {
  return (
    <motion.div
      variants={animations[animation]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
