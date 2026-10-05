"use client";

import { useEffect, useRef, useState } from "react";
import { publicPath } from "@/lib/site";

export function MentionVideo({
  label,
  mute,
  unmute,
}: {
  label: string;
  mute: string;
  unmute: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onScreen = () => {
      const rect = video.getBoundingClientRect();
      const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      const span = Math.min(rect.height, window.innerHeight);
      return span > 0 && visible / span >= 0.5 && !motion.matches;
    };

    const sync = () => {
      if (!onScreen()) {
        video.pause();
        return;
      }
      void video.play().then(() => {
        if (!onScreen()) video.pause();
      }).catch(() => {});
    };

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        sync();
      });
    };

    const observer = new IntersectionObserver(sync, { threshold: [0, 0.5, 1] });
    observer.observe(video);
    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    motion.addEventListener("change", sync);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      motion.removeEventListener("change", sync);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    const next = !video.muted;
    video.muted = next;
    setMuted(next);
    if (!next) void video.play().catch(() => {});
  };

  return (
    <div className="relative w-full">
      <video
        ref={videoRef}
        className="block h-auto w-full"
        src={publicPath("/mentions.mp4")}
        muted
        loop
        playsInline
        preload="auto"
        aria-label={label}
      />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={!muted}
        aria-label={muted ? unmute : mute}
        className="absolute top-3 right-3 inline-flex size-11 items-center justify-center text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]"
      >
        {muted ? <MutedIcon /> : <SoundIcon />}
      </button>
    </div>
  );
}

function SoundIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
        d="M4 9.5h3.2L12 5.5v13l-4.8-4H4v-5Z"
      />
      <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" d="M15.5 9.2a3.6 3.6 0 0 1 0 5.6M17.8 7a6.2 6.2 0 0 1 0 10" />
    </svg>
  );
}

function MutedIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
        d="M4 9.5h3.2L12 5.5v13l-4.8-4H4v-5Z"
      />
      <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" d="m16 10 4 4m0-4-4 4" />
    </svg>
  );
}
