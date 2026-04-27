import { useState } from 'react';
import Header from './components/Header';
import AddStudentForm from './components/AddStudentForm';
import StudentTable from './components/StudentTable';

const INITIAL_STUDENTS = [
  { id: 1, name: 'Aarav Mehta', score: 82 },
  { id: 2, name: 'Priya Nair', score: 36 },
  { id: 3, name: 'Rohan Kapoor', score: 67 },
  { id: 4, name: 'Sneha Reddy', score: 91 },
  { id: 5, name: 'Vikram Joshi', score: 28 },
];

let nextId = 6;

function App() {
  const [students, setStudents] = useState(INITIAL_STUDENTS);

  // Add a new student
  const handleAddStudent = ({ name, score }) => {
    const newStudent = { id: nextId++, name, score };
    setStudents(prev => [...prev, newStudent]);
  };

  // Update a student's score by id
  const handleUpdateScore = (id, newScore) => {
    setStudents(prev =>
      prev.map(s => s.id === id ? { ...s, score: newScore } : s)
    );
  };

  // Remove a student by id
  const handleRemove = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  // Derived stats
  const total = students.length;
  const passCount = students.filter(s => s.score >= 40).length;
  const failCount = total - passCount;

  return (
    <div className="app">
      <Header />

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-card">
          <span className="stat-label">Total Students</span>
          <span className="stat-value stat-value--default">{total}</span>
        </div>
        <div className="stat-card stat-card--pass">
          <span className="stat-label">Passing</span>
          <span className="stat-value stat-value--pass">{passCount}</span>
        </div>
        <div className="stat-card stat-card--fail">
          <span className="stat-label">Failing</span>
          <span className="stat-value stat-value--fail">{failCount}</span>
        </div>
      </div>

      <AddStudentForm onAddStudent={handleAddStudent} />

      <StudentTable
        students={students}
        onUpdateScore={handleUpdateScore}
        onRemove={handleRemove}
      />
    </div>
  );
}

export default App;
