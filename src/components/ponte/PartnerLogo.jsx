import React, { useEffect, useRef, useState } from "react";

// Renders partner logos. For logos supplied on a white/near-white background,
// the white is removed on a canvas (alpha 0) so the mark sits cleanly on the
// cream section. Transparent PNGs render directly. Sizing is controlled by the
// parent via the passed className (height-driven, object-contain).
export default function PartnerLogo({ src, alt, removeWhite = false, className = "" }) {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!removeWhite) return;
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
        if (d[i] > 238 && d[i + 1] > 238 && d[i + 2] > 238) d[i + 3] = 0;
      }
      ctx.putImageData(data, 0, 0);
      setReady(true);
    };
    img.src = src;
  }, [src, removeWhite]);

  if (removeWhite) {
    return (
      <canvas
        ref={canvasRef}
        aria-label={alt}
        role="img"
        className={`object-contain transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"} ${className}`}
      />
    );
  }
  return <img src={src} alt={alt} loading="lazy" className={`object-contain ${className}`} />;
}