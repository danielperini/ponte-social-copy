import React from "react";

const LOGO_URL = "/images/fa3ce29c6_ChatGPTImage14desetde202617_48_09.png";

export default function Logo({ theme = "brand", className = "" }) {
  return (
    <img
      src={LOGO_URL}
      alt="Ponte Social Consultoria"
      className={`object-contain h-[100px] w-[100px] lg:h-[135px] lg:w-[135px] shrink-0 ${className}`}
    />
  );
}