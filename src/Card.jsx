import React, { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faPause,
  faVolumeUp,
  faVolumeMute,
} from '@fortawesome/free-solid-svg-icons';
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
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const previousVolume = useRef(1);

  const handlePlayPause = () => {
    if (audioRef.current.paused) {
      if (currentlyPlaying && currentlyPlaying !== audioRef.current) {
        currentlyPlaying.pause();
        currentlyPlaying.currentTime = 0; // Reset the previous audio
      }
      setCurrentlyPlaying(audioRef.current);
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
      if (currentlyPlaying === audioRef.current) {
        setCurrentlyPlaying(null);
      }
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

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
    // Update the slider gradient
    event.target.style.setProperty(
      '--volume-percentage',
      `${newVolume * 100}%`
    );
  };

  const handleMuteToggle = () => {
    if (audioRef.current) {
      if (!isMuted) {
        previousVolume.current = volume;
        audioRef.current.volume = 0;
        setVolume(0);
      } else {
        audioRef.current.volume = previousVolume.current;
        setVolume(previousVolume.current);
      }
      setIsMuted(!isMuted);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (currentlyPlaying === audioRef.current) {
      setCurrentlyPlaying(null);
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
              onEnded={handleEnded}
            />
            <button className="audio-button" onClick={handlePlayPause}>
              <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
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
            <div className="volume-control">
              <FontAwesomeIcon
                icon={isMuted ? faVolumeMute : faVolumeUp}
                className={`volume-icon ${isMuted ? 'muted' : ''}`}
                onClick={handleMuteToggle}
              />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Card;
