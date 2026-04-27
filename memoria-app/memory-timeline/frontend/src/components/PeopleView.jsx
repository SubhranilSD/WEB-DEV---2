import { useState, useEffect } from 'react';
import { loadFaceModels, processEventsForFaces } from '../utils/faceUtils';
import TimelineView from './TimelineView';
import './PeopleView.css';

export default function PeopleView({ events, onEdit, onDelete }) {
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedPerson, setSelectedPerson] = useState(null);

  // Load clusters from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('memoria_face_clusters');
      if (saved) setClusters(JSON.parse(saved));
    } catch (e) { }
  }, []);

  const handleScan = async () => {
    setLoading(true);
    setProgress(0);
    
    // 1. Load AI Models
    const modelsReady = await loadFaceModels();
    if (!modelsReady) {
      alert("Failed to load AI Face Models. Check your internet connection.");
      setLoading(false);
      return;
    }
    
    // 2. Process
    const results = await processEventsForFaces(events, (p) => setProgress(Math.round(p)));
    
    // 3. Save
    setClusters(results);
    localStorage.setItem('memoria_face_clusters', JSON.stringify(results));
    
    setLoading(false);
    setProgress(0);
  };

  const handleRename = (id, newName) => {
    const updated = clusters.map(c => c.id === id ? { ...c, name: newName } : c);
    setClusters(updated);
    localStorage.setItem('memoria_face_clusters', JSON.stringify(updated));
  };

  // If a person is selected, show their specific memories
  if (selectedPerson) {
    // Filter events
    const personEvents = events.filter(e => selectedPerson.eventIds.includes(e._id));
    
    return (
      <div className="people-view-detail animate-fadeIn">
        <div className="people-detail-header">
          <button className="btn btn-ghost" onClick={() => setSelectedPerson(null)}>← Back to People</button>
          <div className="people-detail-title">
            <img src={selectedPerson.faceUrl} alt="" className="people-detail-avatar" />
            <div>
              <h2>{selectedPerson.name}</h2>
              <p>{personEvents.length} Memories together</p>
            </div>
          </div>
        </div>
        
        {/* Reuse TimelineView for consistent layout */}
        <div style={{ marginTop: '40px' }}>
          <TimelineView 
            events={personEvents} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="people-view animate-fadeIn">
      <div className="people-header">
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '42px', margin: '0 0 8px' }}>
            People & Faces
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            Our AI scans your photos entirely within your browser to privately group the people you care about.
          </p>
        </div>
        
        <button 
          className="btn btn-primary" 
          onClick={handleScan}
          disabled={loading}
          style={{ background: 'var(--accent-indigo)' }}
        >
          {loading ? 'Scanning...' : 'Scan Library'}
        </button>
      </div>

      {loading && (
        <div className="people-loading-state">
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <h3>AI Face Recognition Running</h3>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <p>{progress}% complete — Processing all photos</p>
        </div>
      )}

      {!loading && clusters.length === 0 && (
        <div className="people-empty">
          <span style={{ fontSize: '64px', marginBottom: '24px', display: 'block' }}>📸</span>
          <h2>No Faces Scanned Yet</h2>
          <p>Click "Scan Library" to let the AI process your photos and group identical faces.</p>
        </div>
      )}

      {!loading && clusters.length > 0 && (
        <div className="people-grid">
          {clusters.map(cluster => (
            <div key={cluster.id} className="person-card">
              <div 
                className="person-avatar-wrap" 
                onClick={() => setSelectedPerson(cluster)}
              >
                <img src={cluster.faceUrl} alt="" className="person-avatar" />
                <div className="person-count">{cluster.eventIds.length}</div>
              </div>
              
              <input 
                type="text" 
                className="person-name-input"
                value={cluster.name}
                placeholder="Who is this?"
                onChange={(e) => handleRename(cluster.id, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
