import type { Variants, Transition } from "framer-motion";

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export const staggerChildren: Variants = {
  hidden: { transition: { staggerChildren: 0.08, staggerDirection: -1 } },
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export const staggerSlow: Variants = {
  hidden: { transition: { staggerChildren: 0.15, staggerDirection: -1 } },
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

export const cardHover = {
  rest: {
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
  hover: {
    scale: 1.02,
    y: -4,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
};

export const springTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 20,
};

export const smoothTransition: Transition = {
  duration: 0.5,
  ease: [0.16, 1, 0.3, 1],
};
