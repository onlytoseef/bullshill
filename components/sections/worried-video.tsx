"use client";

import { useState } from "react";

const VIDEO_ID = "eVqW5T5TQUU";

export function WorriedVideo() {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        className="worried-video-iframe"
        src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0`}
        title="Project marketing video"
        allow="autoplay; encrypted-media; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      aria-label="Play project video"
      className="worried-video-poster"
      onClick={() => setPlaying(true)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`}
        alt=""
        className="worried-video-thumb"
        loading="lazy"
      />
      <span aria-hidden className="worried-play-button">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.3 5.9a1 1 0 0 1 1.55-.83l7.7 5.1a1 1 0 0 1 0 1.66l-7.7 5.1a1 1 0 0 1-1.55-.83V5.9Z" />
        </svg>
      </span>
    </button>
  );
}
