import React, { useState, useEffect } from 'react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    let timeoutId = null;

    const toggleVisibility = () => {
      // Clear any pending timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Debounced scroll handler
      timeoutId = setTimeout(() => {
        if (window.pageYOffset > 300) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }, 100);
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const scrollToTop = () => {
    // Add click animation
    setIsClicked(true);

    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Reset click animation after 300ms
    setTimeout(() => {
      setIsClicked(false);
    }, 300);
  };

  return (
    <button
      onClick={scrollToTop}
      className={`scroll-to-top-btn ${isVisible ? 'visible' : ''} ${isClicked ? 'clicked' : ''}`}
      aria-label="Scroll to top"
      title="Back to top"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>

      {/* Ripple effect container */}
      <span className="ripple"></span>
    </button>
  );
};

export default ScrollToTop;
