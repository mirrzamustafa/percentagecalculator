"use client";

import { useEffect, useRef, useState } from "react";

interface AdSlotProps {
  adClient: string;   // e.g. "ca-pub-XXXXXXXXXXXXXXXX"
  adSlot: string;     // e.g. "1234567890"
  adFormat?: "auto" | "rectangle" | "horizontal" | "vertical";
  fullWidthResponsive?: boolean;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
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
    if (pushed.current) return;
    
    // Initialize AdSense
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (e) {
      console.error("AdSense push error", e);
    }

    // Observe the 'ins' tag for status changes
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "data-ad-status") {
          const status = adRef.current?.getAttribute("data-ad-status");
          if (status === "filled") {
            // Delay showing the ad by 3 seconds even if filled
            timeoutId = setTimeout(() => {
              setIsFilled(true);
            }, 3000);
          } else if (status === "unfilled") {
            if (timeoutId) clearTimeout(timeoutId);
            setIsFilled(false);
          }
        }
      });
    });

    if (adRef.current) {
      observer.observe(adRef.current, { attributes: true });
    }

    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div
      className={`ad-slot-wrapper transition-all duration-500 ease-in-out ${
        isFilled 
          ? `my-6 p-2 bg-slate-100/60 ring-1 ring-slate-200 rounded-2xl ${className}` 
          : "h-0 opacity-0 overflow-hidden"
      }`}
      aria-label="Advertisement"
    >
      <ins
        ref={adRef}
        className="adsbygoogle block w-full"
        style={{ display: "block" }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      />
    </div>
  );
}
