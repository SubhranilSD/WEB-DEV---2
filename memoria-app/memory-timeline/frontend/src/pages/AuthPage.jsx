import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './AuthPage.css';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState(searchParams.get('mode') === 'register' ? 'register' : 'login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        if (!form.name) { setError('Name is required'); setLoading(false); return; }
        await register(form.name, form.email, form.password);
      }
      navigate('/timeline');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-orb auth-orb-1" />
      <div className="auth-bg-orb auth-orb-2" />

      <button className="auth-theme-toggle" onClick={toggleTheme}>
        {theme === 'dark' ? '☀' : '☾'}
      </button>

      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-brand" onClick={() => navigate('/')}>
            <span className="logo-star">✦</span>
            <span className="logo-text">Memoria</span>
          </div>
          <blockquote className="auth-quote">
            <p>"The life of every man is a diary in which he means to write one story, and writes another."</p>
            <footer>— J.M. Barrie</footer>
          </blockquote>
          <div className="auth-timeline-preview">
            {['2021','2022','2023','2024'].map((y, i) => (
              <div key={y} className="auth-timeline-dot" style={{ animationDelay: `${i * 0.2}s` }}>
                <div className="dot-circle" />
                <span>{y}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card glass-card">
          <div className="auth-tabs">
            <button className={`auth-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setError(''); }}>
              Sign In
            </button>
            <button className={`auth-tab ${mode === 'register' ? 'active' : ''}`} onClick={() => { setMode('register'); setError(''); }}>
              Create Account
            </button>
          </div>

          <h2 className="auth-title">
            {mode === 'login' ? 'Welcome back' : 'Begin your story'}
          </h2>
          <p className="auth-subtitle">
            {mode === 'login'
              ? 'Your memories are waiting for you.'
              : 'Create an account to start building your timeline.'}
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'register' && (
              <div className="form-group">
                <label className="input-label">Your Name</label>
                <input
                  className="input"
                  type="text"
                  placeholder="What should we call you?"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label className="input-label">Email</label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="input-label">Password</label>
              <input
                className="input"
                type="password"
                placeholder={mode === 'register' ? 'At least 6 characters' : '••••••••'}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="auth-error">
                <span>⚠</span> {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
              {loading ? (
                <span className="auth-spinner" />
              ) : (
                mode === 'login' ? 'Sign In to Memoria' : 'Create My Timeline'
              )}
            </button>
          </form>

          <p className="auth-switch">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
              {mode === 'login' ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
