import React from "react";
import site from "./Site.module.css";

// The product name in brand colours: ASSET in burgundy, KOUNT in black.
export function Brand() {
  return <span className={site.brandName}><span className={site.brandAsset}>ASSET</span><span className={site.brandKount}>KOUNT</span></span>;
}

// Renders plain copy with every "ASSETKOUNT" shown as <Brand />.
export function withBrand(text) {
  if (typeof text !== "string" || !text.includes("ASSETKOUNT")) return text;
  return text.split("ASSETKOUNT").flatMap((part, index) => (index ? [<Brand key={index} />, part] : [part]));
}
