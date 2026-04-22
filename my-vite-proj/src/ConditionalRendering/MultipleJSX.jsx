import React from 'react';

const MultipleJSX = () => {
    const isStudent = true;

    return (
        <>
            <div>MultipleJSX</div>
            {isStudent ? (
                <div>
                    <h2>Student dashboard</h2>
                    <p>Welcome to the course</p>
                </div>
            ) : (
                <div>
                    <h2>Guest Dashboard</h2>
                    <p>Please Enroll in the Course</p>
                </div>
            )}
        </>
    );
}

export default MultipleJSX;