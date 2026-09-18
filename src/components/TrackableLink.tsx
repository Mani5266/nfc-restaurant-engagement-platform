"use client";

import React, { useCallback } from "react";

interface TrackableLinkProps {
  href: string;
  restaurantId: string;
  eventType: string;
  source?: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
  ariaLabel?: string;
}

export default function TrackableLink({
  href,
  restaurantId,
  eventType,
  source = "unknown",
  children,
  className,
  id,
  ariaLabel,
}: TrackableLinkProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Use sendBeacon for reliable tracking even when navigating away
      const data = JSON.stringify({ restaurantId, eventType, source });

      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/track", new Blob([data], { type: "application/json" }));
      } else {
        // Fallback: fire-and-forget fetch
        fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: data,
          keepalive: true,
        }).catch(() => {
          // Silently fail — don't block navigation
        });
      }

      // Don't prevent default — let the link navigate normally
      // The beacon is already sent before navigation happens
    },
    [restaurantId, eventType, source]
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
      id={id}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
