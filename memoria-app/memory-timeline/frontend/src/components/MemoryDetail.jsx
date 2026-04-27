import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import './MemoryDetail.css';

export default function MemoryDetail({ event, onClose }) {
  if (!event) return null;

  return (
    <motion.div 
      className="detail-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="detail-backdrop" onClick={onClose} />
      
      <motion.div 
        className="detail-sheet"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        <button className="detail-close" onClick={onClose}>✕</button>

        <div className="detail-content">
          {/* Hero Section */}
          <div className="detail-hero">
            <div className="detail-media-wrap">
              <img src={event.media[0]?.url} alt="" className="detail-main-img" />
              <div className="detail-img-glare" />
            </div>
            
            <div className="detail-header-info">
              <div className="detail-date-vibe">
                <span className="detail-date">{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span className={`detail-mood-chip mood-${event.mood}`}>{event.mood}</span>
              </div>
              <h1 className="detail-title font-display">{event.title}</h1>
              {event.location && <div className="detail-loc-badge">📍 {event.location}</div>}
            </div>
          </div>

          <div className="detail-grid">
            {/* Story Column */}
            <div className="detail-col main-story">
              <h3 className="detail-section-label">The Story</h3>
              <div className="detail-markdown markdown-body">
                <ReactMarkdown>{event.description || "_No description provided for this moment._"}</ReactMarkdown>
              </div>
              
              {event.media.length > 1 && (
                <div className="detail-gallery">
                  {event.media.slice(1).map((m, i) => (
                    <img key={i} src={m.url} alt="" className="gallery-thumb" />
                  ))}
                </div>
              )}
            </div>

            {/* Nuances Column */}
            <div className="detail-col sidebar-nuances">
              <div className="nuance-group">
                <h3 className="detail-section-label">Atmosphere</h3>
                <div className="nuance-item">
                  <span className="nuance-key">Dominant Mood</span>
                  <span className="nuance-val">{event.mood.toUpperCase()}</span>
                </div>
                {event.color && (
                  <div className="nuance-item">
                    <span className="nuance-key">Memory Hue</span>
                    <div className="nuance-color-preview" style={{ background: event.color }}>
                      {event.color}
                    </div>
                  </div>
                )}
              </div>

              <div className="nuance-group">
                <h3 className="detail-section-label">Entities</h3>
                {event.people?.length > 0 ? (
                  <div className="nuance-people-list">
                    {event.people.map(p => (
                      <div key={p} className="nuance-person-chip">👤 {p}</div>
                    ))}
                  </div>
                ) : <span className="nuance-empty">No people tagged.</span>}
              </div>

              <div className="nuance-group">
                <h3 className="detail-section-label">Context</h3>
                <div className="nuance-tags">
                  {event.tags?.map(t => <span key={t} className="nuance-tag">#{t}</span>)}
                </div>
                <div className="nuance-meta-item">
                  Captured via Memoria Web
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
