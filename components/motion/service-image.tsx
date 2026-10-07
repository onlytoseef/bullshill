"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function ServiceImage({ children }: Props) {
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0, y: 16, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.06, filter: "brightness(1.08)" }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{
        opacity: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        y: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
        scale: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
        filter: { duration: 0.35, ease: "easeOut" },
      }}
    >
      {children}
    </motion.div>
  );
}
