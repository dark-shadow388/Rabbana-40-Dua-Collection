import React, { useRef, useState, useEffect } from 'react';
import './Card.css';

function Card({
  heading,
  title,
  subTitle,
  content,
  subcontent,
  audioUrl,
  currentlyPlaying,
  setCurrentlyPlaying,
}) {
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const handlePlay = () => {
    if (currentlyPlaying && currentlyPlaying !== audioRef.current) {
      currentlyPlaying.pause();
      currentlyPlaying.currentTime = 0; // Reset the previous audio
    }
    setCurrentlyPlaying(audioRef.current);
    audioRef.current.play();
  };

  const handlePause = () => {
    if (currentlyPlaying === audioRef.current) {
      setCurrentlyPlaying(null);
    }
  };

  const updateProgress = () => {
    if (audioRef.current) {
      const progressPercentage =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(progressPercentage);
    }
  };

  const handleTimelineClick = (e) => {
    if (audioRef.current) {
      const timelineWidth = e.target.offsetWidth;
      const clickX = e.nativeEvent.offsetX;
      const newTime = (clickX / timelineWidth) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('timeupdate', updateProgress);
      return () => {
        audio.removeEventListener('timeupdate', updateProgress);
      };
    }
  }, []);

  return (
    <div className="card">
      <div className="card-content-wrapper">
        {heading && <h2 className="card-heading">{heading}</h2>}
        {title && <div className="arabic-text">{title}</div>}
        {subTitle && <h4 className="card-subtitle">{subTitle}</h4>}
        {content && <p className="card-content">{content}</p>}
        {subcontent && <p className="card-subcontent">{subcontent}</p>}
      </div>
      {audioUrl && (
        <div className="audio-player-wrapper">
          <div className="audio-player">
            <audio
              ref={audioRef}
              src={audioUrl}
              preload="metadata"
              style={{ display: 'none' }}
              onPlay={handlePlay}
              onPause={handlePause}
            />
            <button
              className="audio-button"
              onClick={() =>
                audioRef.current.paused
                  ? handlePlay()
                  : audioRef.current.pause()
              }
            >
              {currentlyPlaying === audioRef.current ? 'Pause' : 'Play'}
            </button>
            <div
              className="audio-timeline"
              onClick={handleTimelineClick}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                className="audio-timeline-progress"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Card;
