import { useState } from 'react';

function AddStudentForm({ onAddStudent }) {
  const [name, setName] = useState('');
  const [score, setScore] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = true;
    const s = Number(score);
    if (score === '' || isNaN(s) || s < 0 || s > 100) newErrors.score = true;
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onAddStudent({ name: name.trim(), score: Number(score) });
    setName('');
    setScore('');
    setErrors({});
  };

  return (
    <section className="form-section">
      <h2 className="form-section__heading">Add New Student</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="student-name">Student Name</label>
            <input
              id="student-name"
              type="text"
              placeholder="e.g. Arjun Sharma"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors(prev => ({ ...prev, name: false }));
              }}
              style={errors.name ? { borderColor: 'var(--fail)', boxShadow: '0 0 0 3px var(--fail-glow)' } : {}}
              autoComplete="off"
            />
          </div>
          <div className="form-group">
            <label htmlFor="student-score">Score (0–100)</label>
            <input
              id="student-score"
              type="number"
              placeholder="e.g. 78"
              value={score}
              min="0"
              max="100"
              onChange={(e) => {
                setScore(e.target.value);
                if (errors.score) setErrors(prev => ({ ...prev, score: false }));
              }}
              style={errors.score ? { borderColor: 'var(--fail)', boxShadow: '0 0 0 3px var(--fail-glow)' } : {}}
            />
          </div>
          <button type="submit" className="btn btn--primary">
            + Add Student
          </button>
        </div>
        {(errors.name || errors.score) && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--fail)', marginTop: '0.5rem' }}>
            ⚠ Please enter a valid name and score between 0–100.
          </p>
        )}
      </form>
    </section>
  );
}

export default AddStudentForm;
