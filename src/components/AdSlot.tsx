"use client";

import { useEffect, useRef, useState } from "react";

interface AdSlotProps {
  adClient: string;
  adSlot: string;
  adFormat?: "auto" | "rectangle" | "horizontal" | "vertical";
  fullWidthResponsive?: boolean;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function AdSlot({
  adClient,
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  className = "",
}: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);
  const [isFilled, setIsFilled] = useState(false);
  const pushed = useRef(false);

  useEffect(() => {
    // Only push if the ref is available and we haven't pushed yet
    if (adRef.current && !pushed.current) {
      const status = adRef.current.getAttribute("data-adsbygoogle-status");
      if (!status) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          pushed.current = true;
        } catch (e) {
          console.error("AdSense push error", e);
        }
      }
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "data-ad-status") {
          const status = adRef.current?.getAttribute("data-ad-status");
          if (status === "filled") {
            setIsFilled(true);
          }
        }
      });
    });

    if (adRef.current) {
      observer.observe(adRef.current, { attributes: true });
    }

    return () => observer.disconnect();
  }, []);

  return (
    /* 1. We remove h-0. We use min-h to reserve space for SEO/CLS */
    <div
      className={`ad-slot-wrapper w-full mx-auto transition-all duration-500 ${
        isFilled 
          ? "relative opacity-100 py-8 my-4 h-auto" 
          : "absolute opacity-0 h-[1px] w-full overflow-hidden pointer-events-none"
      } ${className}`}
      aria-label="Advertisement"
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block", minWidth: "250px" }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      />
    </div>
  );
}