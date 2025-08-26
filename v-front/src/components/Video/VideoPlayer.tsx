"use client";
import "video.js/dist/video-js.css";
import videojs from "video.js";
import { useRef, useEffect } from "react";

export default function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const player = videojs(videoRef.current, {
      controls: true,
      autoplay: false,
      preload: "auto",
      fluid: true, // responsive
      controlBar: {
        fullscreenToggle: true, // explicitly ensure fullscreen button
        volumePanel: { inline: false }, // slider + button
      },
    });

    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, []);
  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered"
        controls
        playsInline
      >
        <source
          src="https"
          type="application/x-mpegURL"
        />
      </video>
    </div>
  );
}
