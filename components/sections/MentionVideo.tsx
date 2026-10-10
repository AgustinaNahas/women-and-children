"use client";

import { useEffect, useRef, useState } from "react";
import { publicPath } from "@/lib/site";

export function MentionVideo({
  label,
  mute,
  unmute,
  pause,
  play,
}: {
  label: string;
  mute: string;
  unmute: string;
  pause: string;
  play: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const userStarted = useRef(false);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onScreen = () => {
      const rect = video.getBoundingClientRect();
      const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      const span = Math.min(rect.height, window.innerHeight);
      return span > 0 && visible / span >= 0.5;
    };

    const sync = () => {
      const hold = !onScreen() || userPaused.current || (motion.matches && !userStarted.current);
      if (hold) {
        video.pause();
        setPaused(true);
        return;
      }
      void video.play().then(() => {
        const stillHold = !onScreen() || userPaused.current || (motion.matches && !userStarted.current);
        if (stillHold) {
          video.pause();
          setPaused(true);
          return;
        }
        setPaused(false);
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

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const next = !video.muted;
    video.muted = next;
    setMuted(next);
  };

  const togglePause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      userStarted.current = true;
      void video.play().then(() => setPaused(false)).catch(() => {});
      return;
    }
    userPaused.current = true;
    video.pause();
    setPaused(true);
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
        preload="metadata"
        aria-label={label}
      />
      <div className="absolute top-3 right-3 flex gap-2">
        <button
          type="button"
          onClick={togglePause}
          aria-pressed={!paused}
          aria-label={paused ? play : pause}
          className="inline-flex size-11 items-center justify-center text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]"
        >
          {paused ? <PlayIcon /> : <PauseIcon />}
        </button>
        <button
          type="button"
          onClick={toggleMute}
          aria-pressed={!muted}
          aria-label={muted ? unmute : mute}
          className="inline-flex size-11 items-center justify-center text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]"
        >
          {muted ? <MutedIcon /> : <SoundIcon />}
        </button>
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path fill="currentColor" d="M8 6.2v11.6L18 12 8 6.2Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path fill="currentColor" d="M7 5.5h3.2v13H7v-13Zm6.8 0H17v13h-3.2v-13Z" />
    </svg>
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
