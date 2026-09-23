import React, { useEffect, useRef, useState } from "react";

// Renders the Societa.ai logo mark on a canvas with its near-black background
// made transparent, so it sits cleanly on the cream section.
export default function SocietaLogo({ src, alt, className = "" }) {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = data.data;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i] < 30 && d[i + 1] < 30 && d[i + 2] < 30) d[i + 3] = 0;
      }
      ctx.putImageData(data, 0, 0);
      setReady(true);
    };
    img.src = src;
  }, [src]);

  return (
    <canvas
      ref={canvasRef}
      aria-label={alt}
      role="img"
      className={`object-contain transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"} ${className}`}
    />
  );
}