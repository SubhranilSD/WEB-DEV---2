import { useState } from 'react';

function StudentRow({ student, rank, onUpdateScore, onRemove }) {
  const [editScore, setEditScore] = useState(String(student.score));
  const [isEditing, setIsEditing] = useState(false);

  const isPassing = student.score >= 40;
  const barWidth = Math.min(Math.max(student.score, 0), 100);

  const handleScoreChange = (e) => {
    setEditScore(e.target.value);
    setIsEditing(true);
  };

  const commitScore = () => {
    const val = Number(editScore);
    if (!isNaN(val) && val >= 0 && val <= 100) {
      onUpdateScore(student.id, val);
    } else {
      setEditScore(String(student.score));
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') commitScore();
    if (e.key === 'Escape') {
      setEditScore(String(student.score));
      setIsEditing(false);
    }
  };

  return (
    <tr className="student-row">
      {/* Rank */}
      <td className="cell-rank">#{rank}</td>

      {/* Name */}
      <td className="cell-name">{student.name}</td>

      {/* Score */}
      <td>
        <div className="score-cell">
          <div className="score-input-wrapper">
            <input
              className="score-input"
              type="number"
              min="0"
              max="100"
              value={editScore}
              onChange={handleScoreChange}
              onBlur={commitScore}
              onKeyDown={handleKeyDown}
              aria-label={`Score for ${student.name}`}
            />
          </div>
          <div className="score-bar">
            <div
              className={`score-bar__fill ${isPassing ? 'score-bar__fill--pass' : 'score-bar__fill--fail'}`}
              style={{ width: `${barWidth}%` }}
            />
          </div>
        </div>
      </td>

      {/* Status badge */}
      <td>
        <span className={`badge ${isPassing ? 'badge--pass' : 'badge--fail'}`}>
          {isPassing ? 'Pass' : 'Fail'}
        </span>
      </td>

      {/* Actions */}
      <td>
        <div className="cell-actions">
          {isEditing && (
            <button
              className="btn btn--save"
              onClick={commitScore}
              title="Save score"
            >
              Save
            </button>
          )}
          <button
            className="btn btn--ghost"
            onClick={() => {
              setEditScore(String(student.score));
              setIsEditing(false);
            }}
            title="Reset changes"
          >
            Reset
          </button>
          <button
            className="btn btn--danger"
            onClick={() => onRemove(student.id)}
            title="Remove student"
          >
            ✕
          </button>
        </div>
      </td>
    </tr>
  );
}

export default StudentRow;
