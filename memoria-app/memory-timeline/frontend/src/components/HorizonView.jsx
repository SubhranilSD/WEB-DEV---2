import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import EventCard from './EventCard';
import './HorizonView.css';

export default function HorizonView({ events, onEdit, onDelete, onClickMedia }) {
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { scrollXProgress } = useScroll({
    container: containerRef,
  });

  // Smooth scroll progress
  const smoothProgress = useSpring(scrollXProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <div className={`horizon-container ${isFullscreen ? 'is-fullscreen' : ''}`} ref={containerRef}>
      <div className="horizon-controls">
        <div className="horizon-info">
          <h2 className="font-display">Cinematic Horizon</h2>
          <p>{events.length} Moments across time</p>
        </div>
        <button className="horizon-fs-btn" onClick={toggleFullscreen}>
          {isFullscreen ? '退出全屏 ⤫' : 'Fullscreen ⤢'}
        </button>
      </div>

      <div className="horizon-track">
        {events.map((event, index) => (
          <HorizonItem 
            key={event._id} 
            event={event} 
            index={index} 
            onEdit={onEdit} 
            onDelete={onDelete} 
            onClickMedia={onClickMedia}
          />
        ))}
      </div>

      {/* Progress Line */}
      <div className="horizon-progress-wrap">
        <motion.div 
          className="horizon-progress-bar" 
          style={{ scaleX: smoothProgress }} 
        />
      </div>
    </div>
  );
}

function HorizonItem({ event, index, onEdit, onDelete, onClickMedia }) {
  const ref = useRef(null);
  
  return (
    <motion.div 
      ref={ref}
      className="horizon-item"
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "0px -100px" }}
    >
      <div className="horizon-card-spacer">
        <EventCard 
          event={event} 
          view="timeline" 
          onEdit={onEdit} 
          onDelete={onDelete} 
          onClickMedia={onClickMedia}
        />
      </div>
      <div className="horizon-date-label">
        <div className="horizon-node" style={{ background: event.color || 'var(--accent-indigo)' }} />
        <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
      </div>
    </motion.div>
  );
}
