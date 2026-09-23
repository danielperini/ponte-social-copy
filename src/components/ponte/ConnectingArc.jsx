import React from "react";
import { motion } from "framer-motion";

/**
 * ConnectingArc — the signature terracotta SVG arc that "draws" itself on scroll.
 * Positioned as a decorative threading element behind content.
 */
export default function ConnectingArc({ className = "", height = 220, flip = false }) {
  return (
    <div className={`pointer-events-none absolute inset-x-0 ${className}`} style={{ height }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        className={flip ? "rotate-180" : ""}
        fill="none"
      >
        <motion.path
          d="M0 180 C 360 20, 1080 20, 1440 180"
          stroke="#A8B7A0"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.9 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 2.8, ease: [0.4, 0, 0.2, 1] }}
        />
        <motion.circle
          cx="720"
          cy="36"
          r="5"
          fill="#A8B7A0"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ delay: 2.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
    </div>
  );
}