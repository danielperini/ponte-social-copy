import React from "react";

export default function PeriniLogo({ className = "" }) {
  return (
    <svg
      viewBox="0 0 240 110"
      className={`scale-[0.75] origin-center ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Perini Projetos Culturais e Sociais"
    >
      <defs>
        <mask id="perini-f-mask">
          <rect x="8" y="18" width="74" height="74" fill="white" />
          <path d="M24 24 H58 V34 H36 V50 H52 V60 H36 V86 H24 Z" fill="black" />
        </mask>
      </defs>
      <g mask="url(#perini-f-mask)">
        <rect x="8" y="18" width="74" height="74" fill="#F7941E" />
      </g>
      <path d="M72 18 L82 18 L82 28 Z" fill="#A7A9AC" />
      <text x="94" y="38" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="20" letterSpacing="1.5" fill="#173A6B">PERINI</text>
      <text x="94" y="56" fontFamily="Arial, Helvetica, sans-serif" fontSize="13" fill="#173A6B">projetos</text>
      <text x="94" y="72" fontFamily="Arial, Helvetica, sans-serif" fontSize="13" fill="#173A6B">culturais</text>
      <text x="94" y="88" fontFamily="Arial, Helvetica, sans-serif" fontSize="13" fill="#173A6B">e sociais</text>
    </svg>
  );
}