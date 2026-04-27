import StudentRow from './StudentRow';

function StudentTable({ students, onUpdateScore, onRemove }) {
  return (
    <section className="table-section">
      <div className="table-section__header">
        <span className="table-section__title">All Students</span>
        <span className="table-section__count">{students.length} enrolled</span>
      </div>

      <div className="table-wrapper">
        {students.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📋</div>
            <p className="empty-state__text">No students yet.</p>
            <p className="empty-state__hint">Use the form above to add your first student.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Score / 100</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <StudentRow
                  key={student.id}
                  student={student}
                  rank={index + 1}
                  onUpdateScore={onUpdateScore}
                  onRemove={onRemove}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

export default StudentTable;
