import { formatDriveLink } from "../lib/utils";

interface ResponsiveImageProps {
  key?: any;
  desktopUrl?: string;
  desktopUrl2x?: string;
  tabletUrl?: string;
  tabletUrl2x?: string;
  mobileUrl?: string;
  mobileUrl2x?: string;
  alt: string;
  className?: string;
  onClick?: (e: any) => void;
}

export default function ResponsiveImage({ 
  desktopUrl, desktopUrl2x, 
  tabletUrl, tabletUrl2x, 
  mobileUrl, mobileUrl2x, 
  alt, className = "", onClick 
}: ResponsiveImageProps) {
  // Helper to build a srcSet with optional 1x and 2x versions
  const buildSrcSet = (url1x?: string, url2x?: string) => {
    const parts = [];
    const clean1x = url1x ? url1x.trim() : "";
    const clean2x = url2x ? url2x.trim() : "";
    
    if (clean1x) parts.push(`${formatDriveLink(clean1x)} 1x`);
    if (clean2x) parts.push(`${formatDriveLink(clean2x)} 2x`);
    
    return parts.length > 0 ? parts.join(", ") : undefined;
  };

  const mSrcSet = buildSrcSet(mobileUrl, mobileUrl2x);
  const tSrcSet = buildSrcSet(tabletUrl, tabletUrl2x);
  const dSrcSet = buildSrcSet(desktopUrl, desktopUrl2x);

  // If absolutely no image is provided, return null
  if (!mSrcSet && !tSrcSet && !dSrcSet) {
    return null;
  }

  // Fallbacks if some sizes are missing (used for the base <img> src)
  const fallbackUrl = (desktopUrl || desktopUrl2x || tabletUrl || tabletUrl2x || mobileUrl || mobileUrl2x || "").trim();

  return (
    <picture className={`block ${className} ${onClick ? "cursor-pointer" : ""}`} onClick={onClick}>
      {/* Mobile devices (max-width: 640px) */}
      {mSrcSet && <source media="(max-width: 640px)" srcSet={mSrcSet} />}
      
      {/* Tablet devices (max-width: 1024px) */}
      {tSrcSet && <source media="(max-width: 1024px)" srcSet={tSrcSet} />}
      
      {/* Default (Desktop) */}
      {dSrcSet && <source media="(min-width: 1025px)" srcSet={dSrcSet} />}

      <img 
        src={fallbackUrl ? formatDriveLink(fallbackUrl) : ""} 
        alt={alt} 
        className={`w-full h-full object-cover ${className}`} 
      />
    </picture>
  );
}
