import React from 'react';
import { motion } from 'framer-motion';

export default function AboutMaker() {
  return (
    <div style={{
      padding: '60px 40px',
      maxWidth: '800px',
      margin: '0 auto',
      color: 'var(--text-primary)',
      fontFamily: '"DM Sans", sans-serif'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          background: 'var(--bg-card)',
          borderRadius: '24px',
          padding: '60px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
          border: '1px solid var(--border-color)',
          textAlign: 'center'
        }}
      >
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-rose))',
          margin: '0 auto 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px',
          color: 'white',
          boxShadow: '0 10px 20px rgba(91, 114, 196, 0.3)'
        }}>
          SD
        </div>
        
        <h1 style={{ 
          fontFamily: '"Playfair Display", serif', 
          fontSize: '42px', 
          margin: '0 0 16px',
          background: 'linear-gradient(to right, var(--text-primary), var(--text-muted))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Subhranil Dutta
        </h1>
        
        <h2 style={{ 
          fontFamily: '"DM Mono", monospace', 
          fontSize: '14px', 
          color: 'var(--accent-indigo)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          margin: '0 0 32px'
        }}>
          Creator & Lead Developer
        </h2>

        <p style={{
          fontSize: '18px',
          lineHeight: '1.8',
          color: 'var(--text-secondary)',
          maxWidth: '600px',
          margin: '0 auto 40px'
        }}>
          Memoria was built with a singular vision: to create a digital sanctuary where memories aren't just stored, but celebrated. 
          Every animation, every gradient, and every interaction was carefully crafted to ensure that looking back at your past feels just as magical as living it.
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px'
        }}>
          <button className="btn btn-primary" style={{ padding: '12px 24px' }}>
            View GitHub
          </button>
          <button className="btn btn-ghost" style={{ padding: '12px 24px' }}>
            Contact Maker
          </button>
        </div>
      </motion.div>
    </div>
  );
}
