import { useState, useRef } from 'react';
import * as exifr from 'exifr';
import api from '../utils/api';
import { sentimentScore, sentimentToMood } from '../utils/memoryUtils';
import { pipeline, env } from '@xenova/transformers';
import './EventModal.css';

// Disable local models to force CDN
env.allowLocalModels = false;
env.useBrowserCache = true;

const MOODS = [
  { value: 'joyful',      emoji: '😄', label: 'Joyful' },
  { value: 'nostalgic',   emoji: '🌙', label: 'Nostalgic' },
  { value: 'proud',       emoji: '🏆', label: 'Proud' },
  { value: 'sad',         emoji: '💧', label: 'Sad' },
  { value: 'excited',     emoji: '⚡', label: 'Excited' },
  { value: 'peaceful',    emoji: '🕊', label: 'Peaceful' },
  { value: 'grateful',    emoji: '🌸', label: 'Grateful' },
  { value: 'adventurous', emoji: '🗺', label: 'Adventurous' },
];

const COLORS = ['#c4813a','#c46080','#5b72c4','#6b8f71','#e8a85a','#8b5cf6','#06b6d4','#ef4444'];

const today = () => new Date().toISOString().split('T')[0];

/* ── Random autofill pools (fallback when no EXIF) ── */
const AUTOFILL_TITLES = [
  'The morning everything changed', 'Last light at the lake',
  'Found myself in a stranger\'s kindness', 'The road that had no name',
  'Dancing until the city woke up', 'A quiet victory nobody saw',
  'Letters I never sent', 'The day the sky turned amber',
  'Coffee and a conversation I\'ll keep forever', 'Seventeen stops on the wrong train',
  'The night the stars felt close', 'Arriving somewhere I\'d only dreamed about',
  'Learning to let go in slow motion', 'First attempt, first failure, first laugh',
  'A photograph I didn\'t take', 'The celebration that crept up on me',
  'Two a.m. and a revelation', 'That summer between everything',
  'Saying yes when I almost said no', 'The long way home turned into the best way',
  'A moment I want to live inside forever', 'Reunited after all that time',
  'The project that kept me up for weeks', 'When the music made everything make sense',
  'Cooking grandma\'s recipe for the first time', 'Watching the storm roll in from the porch',
  'New city, no plan, wide open', 'The kindest argument I\'ve ever had',
  'Building something with my hands', 'A weekend that felt like a whole season',
  'Finishing what I started a year ago', 'The book that rewired my brain',
  'Rain on the roof and nowhere to be', 'Meeting someone who saw me clearly',
  'Sunrise after a sleepless night', 'Learning the language of a new place',
  'An ordinary Tuesday that wasn\'t', 'Milestone reached in silence',
  'The last summer together',
];

const AUTOFILL_LOCATIONS = [
  'Rooftop, unknown city', 'Back garden', 'Train window seat', 'Lakeside trail',
  'Old café on the corner', 'Airport gate 14', 'Hilltop at dusk', 'Home, finally',
  'Grandmother\'s kitchen', 'Hotel balcony', '', '', '', '',
];

const AUTOFILL_TAGS = [
  ['travel', 'adventure'], ['milestone', 'growth'], ['family', 'warmth'],
  ['friendship', 'joy'], ['solitude', 'reflection'], ['music', 'feeling'],
  ['food', 'memory'], ['nature', 'peace'], ['city', 'night'], ['work', 'proud'],
];

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

/* ── EXIF helpers ── */

/** Parse DateTimeOriginal (e.g. "2023:07:14 18:32:00") → "2023-07-14" */
function exifDateToInputDate(raw) {
  if (!raw) return null;
  if (raw instanceof Date) return raw.toISOString().split('T')[0];
  const str = String(raw).replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');
  const d = new Date(str);
  return isNaN(d) ? null : d.toISOString().split('T')[0];
}

/** Infer a vibe from hour of day & camera model hints */
function inferMoodFromExif(exif) {
  const dt = exif.DateTimeOriginal || exif.DateTime;
  if (!dt) return null;
  const d = dt instanceof Date ? dt : new Date(String(dt).replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3'));
  if (isNaN(d)) return null;
  const hour = d.getHours();
  if (hour >= 5  && hour < 8)  return 'peaceful';
  if (hour >= 8  && hour < 12) return 'joyful';
  if (hour >= 12 && hour < 16) return 'excited';
  if (hour >= 16 && hour < 19) return 'adventurous';
  if (hour >= 19 && hour < 22) return 'nostalgic';
  return 'grateful';
}

/** Build a poetic title from EXIF data */
function buildTitleFromExif(exif, location) {
  const dt = exif.DateTimeOriginal || exif.DateTime;
  let d = null;
  if (dt) {
    d = dt instanceof Date ? dt : new Date(String(dt).replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3'));
    if (isNaN(d)) d = null;
  }

  const hour = d ? d.getHours() : null;
  const month = d ? d.toLocaleDateString('en-US', { month: 'long' }) : null;

  const timeOfDay = hour == null ? null
    : hour < 6  ? 'before dawn'
    : hour < 10 ? 'morning'
    : hour < 13 ? 'midday'
    : hour < 17 ? 'afternoon'
    : hour < 20 ? 'evening'
    : 'night';

  if (location && timeOfDay && month) return `${month} ${timeOfDay} in ${location}`;
  if (location && timeOfDay)          return `A ${timeOfDay} in ${location}`;
  if (location && month)              return `${month} in ${location}`;
  if (timeOfDay && month)             return `${month} ${timeOfDay}`;
  if (location)                       return `A moment in ${location}`;
  return pickRandom(AUTOFILL_TITLES);
}

/** Reverse-geocode GPS coords via OpenStreetMap Nominatim (free, no API key) */
async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10`,
      { headers: { 'Accept-Language': 'en' } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const a = data.address || {};
    // Build a readable place name from most specific to least
    return (
      a.village || a.town || a.city_district || a.suburb ||
      a.city || a.county || a.state || a.country || null
    );
  } catch {
    return null;
  }
}

/** Full EXIF read for a single File object → returns extracted fields */
async function extractExifFromFile(file) {
  try {
    const exif = await exifr.parse(file, {
      tiff: true,
      exif: true,
      gps: true,
      iptc: true,
      xmp: false,
      icc: false,
      jfif: false,
      ihdr: false,
      translateValues: true,
      reviveValues: true,
    });
    if (!exif) return null;

    const result = { raw: exif, found: [] };

    // Date
    const dateStr = exifDateToInputDate(exif.DateTimeOriginal || exif.DateTime);
    if (dateStr) { result.date = dateStr; result.found.push('date'); }

    // GPS → reverse geocode
    if (exif.latitude != null && exif.longitude != null) {
      result.gps = { lat: exif.latitude, lon: exif.longitude };
      const place = await reverseGeocode(exif.latitude, exif.longitude);
      if (place) { result.location = place; result.found.push('location'); }
    }

    // Camera model (for fun, we tag it)
    if (exif.Make || exif.Model) {
      const cam = [exif.Make, exif.Model].filter(Boolean).join(' ').trim();
      result.camera = cam;
    }

    // IPTC caption / description
    if (exif.Caption) { result.description = exif.Caption; result.found.push('description'); }

    // Infer mood
    const mood = inferMoodFromExif(exif);
    if (mood) { result.mood = mood; result.found.push('vibe'); }

    // Build title
    result.title = buildTitleFromExif(exif, result.location || null);
    result.found.push('title');

    return result;
  } catch (e) {
    return null;
  }
}

/* ══════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════ */
export default function EventModal({ event, onSubmit, onClose, allPeople = [] }) {
  const [form, setForm] = useState({
    title:       event?.title || '',
    description: event?.description || '',
    date:        event?.date ? new Date(event.date).toISOString().split('T')[0] : today(),
    location:    event?.location || '',
    mood:        event?.mood || 'joyful',
    tags:        event?.tags?.join(', ') || '',
    color:       event?.color || '#c4813a',
    isPrivate:   event?.isPrivate || false,
    media:       event?.media || [],
    people:      event?.people || [],
    audioUrl:    event?.audioUrl || '',
    unlockDate:  event?.unlockDate ? new Date(event.unlockDate).toISOString().split('T')[0] : '',
    coordinates: event?.coordinates || null,
  });
  const [tagInput,      setTagInput]      = useState(event?.tags?.join(', ') || '');
  const [personInput,   setPersonInput]   = useState('');
  const [personSuggest, setPersonSuggest] = useState(false);
  const [uploading,     setUploading]     = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [error,       setError]       = useState('');
  const [autofilled,  setAutofilled]  = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  // EXIF state
  const [exifScan,     setExifScan]     = useState(false);   // scanning in progress
  const [exifBanner,   setExifBanner]   = useState(null);    // { found: [], camera? }
  const [exifApplied,  setExifApplied]  = useState(false);

  const fileRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  /* ── Random autofill ── */
  const handleAutofill = () => {
    const mood = pickRandom(MOODS).value;
    const title = pickRandom(AUTOFILL_TITLES);
    const location = pickRandom(AUTOFILL_LOCATIONS);
    const tags = pickRandom(AUTOFILL_TAGS);
    const colorIdx = MOODS.findIndex(m => m.value === mood);
    const color = COLORS[colorIdx % COLORS.length];
    setForm(f => ({ ...f, title, date: today(), mood, location, color }));
    setTagInput(tags.join(', '));
    flashAutofill();
  };

  const flashAutofill = () => {
    setAutofilled(true);
    setTimeout(() => setAutofilled(false), 1200);
  };

  /* ── Apply EXIF data from banner ── */
  const applyExif = (exifData) => {
    setForm(f => ({
      ...f,
      ...(exifData.date     ? { date: exifData.date } : {}),
      ...(exifData.location ? { location: exifData.location } : {}),
      ...(exifData.gps      ? { coordinates: exifData.gps } : {}),
      ...(exifData.mood     ? { mood: exifData.mood } : {}),
      ...(exifData.title    ? { title: exifData.title } : {}),
      ...(exifData.description && !f.description ? { description: exifData.description } : {}),
    }));
    setExifApplied(true);
    setExifBanner(null);
    flashAutofill();
  };

  /* ── File handler with EXIF scan ── */
  const handleFile = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    setExifBanner(null);
    setExifApplied(false);

    // Scan first image for EXIF (do this in parallel with upload)
    const firstImage = [...files].find(f => f.type.startsWith('image/'));
    let exifDataPending = null;

    if (firstImage && !event) {   // only scan on new memories
      setExifScan(true);
      exifDataPending = extractExifFromFile(firstImage); // promise
    }

    // Upload loop
    const newMedia = [];
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      const reader = new FileReader();
      await new Promise(resolve => {
        reader.onload = async (e) => {
          try {
            const res = await api.post('/upload', { base64: e.target.result, filename: file.name });
            newMedia.push(res.data);
          } catch {}
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }

    setForm(f => ({ ...f, media: [...f.media, ...newMedia] }));
    setUploading(false);

    // Await EXIF result
    if (exifDataPending) {
      const exifData = await exifDataPending;
      setExifScan(false);
      if (exifData && exifData.found.length > 0) {
        setExifBanner(exifData);
      }
    }
  };

  const removeMedia = (idx) => {
    setForm(f => ({ ...f, media: f.media.filter((_, i) => i !== idx) }));
  };

  /* ── People helpers ── */
  const addPerson = (name) => {
    const n = name.trim();
    if (!n || form.people.includes(n)) return;
    setForm(f => ({ ...f, people: [...f.people, n] }));
    setPersonInput('');
    setPersonSuggest(false);
  };
  const removePerson = (name) => setForm(f => ({ ...f, people: f.people.filter(p => p !== name) }));
  const suggestions = allPeople.filter(p => p.toLowerCase().includes(personInput.toLowerCase()) && !form.people.includes(p));

  const handleAutoDescribe = async () => {
    if (!form.media || form.media.length === 0) return;
    
    setAiGenerating(true);
    try {
      // Load the image captioning model
      const captioner = await pipeline('image-to-text', 'Xenova/vit-gpt2-image-captioning');
      
      // Pass the base64 URL directly
      const result = await captioner(form.media[0].url);
      
      if (result && result.length > 0 && result[0].generated_text) {
        // Capitalize first letter
        const text = result[0].generated_text;
        const formatted = text.charAt(0).toUpperCase() + text.slice(1) + '.';
        setForm(prev => ({ 
          ...prev, 
          description: prev.description ? `${prev.description}\n\nAI Caption: ${formatted}` : formatted 
        }));
      }
    } catch (err) {
      console.error("AI Caption failed", err);
      alert("Failed to generate AI description.");
    }
    setAiGenerating(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.date) { setError('Title and date are required'); return; }
    setLoading(true);
    setError('');
    try {
      const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
      await onSubmit({ ...form, tags });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`modal-content event-modal ${autofilled ? 'autofilled' : ''}`}>

        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title font-display">
            {event ? 'Edit Memory' : 'Add a Memory'}
          </h2>
          <div className="modal-header-actions">
            {!event && (
              <button
                type="button"
                className="btn btn-ghost btn-sm autofill-btn"
                onClick={handleAutofill}
                title="Autofill with a random memory prompt"
              >
                <span className="autofill-star">✦</span> Autofill
              </button>
            )}
            <button className="modal-close btn btn-ghost btn-icon" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* EXIF scanning indicator */}
        {exifScan && (
          <div className="exif-scanning">
            <span className="exif-scanning-dot" />
            <span>Reading photo metadata…</span>
          </div>
        )}

        {/* EXIF banner — shown after scan, before user applies */}
        {exifBanner && !exifApplied && (
          <div className="exif-banner">
            <div className="exif-banner-left">
              <span className="exif-banner-icon">📷</span>
              <div>
                <div className="exif-banner-title">Photo data found</div>
                <div className="exif-banner-fields">
                  {exifBanner.found.map(f => (
                    <span key={f} className="exif-field-chip">{f}</span>
                  ))}
                  {exifBanner.camera && (
                    <span className="exif-camera-chip">📸 {exifBanner.camera}</span>
                  )}
                  {exifBanner.gps && (
                    <span className="exif-gps-chip">
                      📍 {exifBanner.gps.lat.toFixed(4)}°, {exifBanner.gps.lon.toFixed(4)}°
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="exif-banner-actions">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => applyExif(exifBanner)}
              >
                Apply
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setExifBanner(null)}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Title */}
          <div className="form-group">
            <label className="input-label">Title *</label>
            <input
              className={`input ${autofilled ? 'input-autofilled' : ''}`}
              type="text"
              placeholder="What happened?"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              required
              maxLength={100}
            />
          </div>

          {/* Date & Location */}
          <div className="modal-row">
            <div className="form-group">
              <label className="input-label">Date *</label>
              <input
                className={`input ${autofilled ? 'input-autofilled' : ''}`}
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label className="input-label">Location</label>
              <input
                className={`input ${autofilled ? 'input-autofilled' : ''}`}
                type="text"
                placeholder="Where were you?"
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label className="input-label" style={{ margin: 0 }}>Description</label>
              {form.media?.length > 0 && (
                <button 
                  type="button" 
                  className="btn btn-ghost btn-sm" 
                  onClick={handleAutoDescribe}
                  disabled={aiGenerating}
                  style={{ color: 'var(--accent-indigo)', fontSize: '12px', padding: '4px 8px' }}
                >
                  {aiGenerating ? '✨ AI is thinking...' : '✨ Auto-Describe Image'}
                </button>
              )}
            </div>
            <textarea
              className="input"
              placeholder="Tell the story of this moment…"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={4}
            />
          </div>

          {/* Mood */}
          <div className="form-group">
            <div className="input-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Vibe / Mood</span>
              <button 
                type="button" 
                className="btn btn-ghost btn-sm" 
                style={{ fontSize: '11px', padding: '2px 8px' }}
                onClick={() => {
                  const score = sentimentScore(form.description);
                  const newMood = sentimentToMood(score);
                  setForm(f => ({ ...f, mood: newMood }));
                }}
                title="Detect mood from description"
              >
                ✨ Auto-detect
              </button>
            </div>
            <div className="mood-grid">
              {MOODS.map(m => (
                <button
                  key={m.value}
                  type="button"
                  className={`mood-btn ${form.mood === m.value ? 'active' : ''} ${autofilled && form.mood === m.value ? 'mood-btn--autofilled' : ''}`}
                  onClick={() => setForm(f => ({ ...f, mood: m.value }))}
                  title={m.label}
                >
                  <span className="mood-emoji">{m.emoji}</span>
                  <span className="mood-label">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="form-group">
            <label className="input-label">Card Color</label>
            <div className="color-picker">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  className={`color-dot ${form.color === c ? 'active' : ''}`}
                  style={{ background: c }}
                  onClick={() => setForm(f => ({ ...f, color: c }))}
                />
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="input-label">Tags (comma separated)</label>
            <input
              className={`input ${autofilled ? 'input-autofilled' : ''}`}
              type="text"
              placeholder="travel, milestone, family…"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
            />
          </div>

          {/* People */}
          <div className="form-group">
            <label className="input-label">People in this memory
              <span className="input-label-hint">— type a name, press Enter</span>
            </label>
            {/* Chips */}
            {form.people.length > 0 && (
              <div className="people-chips">
                {form.people.map(name => (
                  <span key={name} className="people-chip">
                    <span className="people-chip-avatar">{name.charAt(0).toUpperCase()}</span>
                    {name}
                    <button type="button" className="people-chip-remove" onClick={() => removePerson(name)}>✕</button>
                  </span>
                ))}
              </div>
            )}
            <div style={{ position: 'relative' }}>
              <input
                className="input"
                type="text"
                placeholder="Add a name…"
                value={personInput}
                onChange={e => { setPersonInput(e.target.value); setPersonSuggest(true); }}
                onFocus={() => setPersonSuggest(true)}
                onBlur={() => setTimeout(() => setPersonSuggest(false), 150)}
                onKeyDown={e => {
                  if (e.key === 'Enter') { e.preventDefault(); addPerson(personInput); }
                  if (e.key === ',')     { e.preventDefault(); addPerson(personInput); }
                }}
              />
              {/* Suggestions dropdown */}
              {personSuggest && suggestions.length > 0 && (
                <div className="people-suggestions">
                  {suggestions.map(s => (
                    <button key={s} type="button" className="people-suggestion-item" onMouseDown={() => addPerson(s)}>
                      <span className="people-chip-avatar">{s.charAt(0).toUpperCase()}</span>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Media upload */}
          <div className="form-group">
            <label className="input-label">
              Photos
              <span className="input-label-hint">— drop a photo to auto-read its metadata</span>
            </label>
            <div
              className={`media-dropzone ${dragOver ? 'drag-over' : ''}`}
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files); }}
            >
              {uploading ? (
                <span className="media-uploading">Uploading…</span>
              ) : (
                <>
                  <span className="media-icon">📷</span>
                  <span>Drop photos here or click to browse</span>
                  <span className="media-exif-hint">EXIF date &amp; GPS location will be read automatically</span>
                </>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={e => handleFile(e.target.files)}
              />
            </div>

            {form.media.length > 0 && (
              <div className="media-preview">
                {form.media.map((m, i) => (
                  <div key={i} className="media-preview-item">
                    <img src={m.url} alt="" />
                    <button type="button" className="media-remove" onClick={() => removeMedia(i)}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Vault & Future Lock */}
          <div className="form-group-row" style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label className="toggle-label" style={{ marginTop: '24px' }}>
                <input
                  type="checkbox"
                  checked={form.isPrivate}
                  onChange={e => setForm(f => ({ ...f, isPrivate: e.target.checked }))}
                />
                <span style={{ display: 'flex', flexDirection: 'column' }}>
                  <strong>🔒 Private (Vault)</strong>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Hide behind PIN</span>
                </span>
              </label>
            </div>

            <div style={{ flex: 1 }}>
              <label className="input-label">⏳ Future Lock (Unlock Date)</label>
              <input
                type="date"
                className="input"
                value={form.unlockDate}
                onChange={e => setForm(f => ({ ...f, unlockDate: e.target.value }))}
                min={today()}
              />
            </div>
          </div>

          {/* Voice Note (Base64 for Demo) */}
          <div className="form-group" style={{ marginTop: '16px' }}>
            <label className="input-label">🎙️ Voice Note URL (Base64 or Link)</label>
            <input
              type="text"
              className="input"
              placeholder="Paste audio URL or Base64 data..."
              value={form.audioUrl}
              onChange={e => setForm(f => ({ ...f, audioUrl: e.target.value }))}
            />
            {form.audioUrl && (
              <audio controls src={form.audioUrl} style={{ width: '100%', marginTop: '8px', height: '36px' }} />
            )}
          </div>

          {error && <div className="auth-error" style={{ marginBottom: '16px' }}><span>⚠</span> {error}</div>}

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '…' : event ? 'Save Changes' : 'Add Memory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
