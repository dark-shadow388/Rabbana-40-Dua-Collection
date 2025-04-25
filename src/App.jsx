import React, { useState, useEffect } from 'react';
import './App.css';
import Card from './Card.jsx';
import appData from './appData.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faShuffle } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [shuffledData, setShuffledData] = useState(appData);

  // Initialize darkMode from localStorage or default to false
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // Save darkMode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleMode = () => {
    setDarkMode(!darkMode);
  };

  const shuffleCards = () => {
    const shuffled = [...shuffledData]
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
    setShuffledData(shuffled);
  };

  // Add scroll detection
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`app ${darkMode ? 'dark-mode' : ''} ${
        isScrolled ? 'scrolled' : ''
      }`}
      style={{
        backgroundColor: darkMode ? '#202420' : '#e0eee0',
        minHeight: '100vh',
      }}
    >
      <h1 className="app-title">Dua App</h1>
      <div className="app-header">
        <button onClick={shuffleCards} className="shuffle-button">
          <FontAwesomeIcon icon={faShuffle} className="shuffle-icon" />
        </button>
        <h2 className="header-title">Dua App</h2>
        <button
          onClick={toggleMode}
          className="theme-toggle"
          title="Toggle theme"
        >
          <div className="sun-moon-container">
            <FontAwesomeIcon icon={faSun} className="sun" />
            <FontAwesomeIcon icon={faMoon} className="moon" />
          </div>
        </button>
      </div>
      <div className="card-container">
        {shuffledData.map((app, index) => (
          <Card
            key={index}
            heading={app.heading}
            title={app.title}
            subTitle={app.subTitle}
            content={app.content}
            subcontent={app.subcontent}
            audioUrl={app.audioUrl}
            currentlyPlaying={currentlyPlaying}
            setCurrentlyPlaying={setCurrentlyPlaying}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
