import React from 'react';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
};


const Feedback = ({ feedback }) => {
    return (
        <div>
            <h3>Open question</h3>
            <audio controls>
                <source src={feedback.audioUrls.open} type="audio/mp3" />
            </audio>
            <h3>Closed question</h3>
            <audio controls>
                <source src={feedback.audioUrls.closed} type="audio/mp3" />
            </audio>
            <p><b>ID</b> {feedback.id}</p>
            <p><b>Created At</b> {formatDate(feedback.createdAt)}</p>
            <p><b>Intensity</b> {feedback.intensity}</p>
            <p><b>Sentiment</b> {feedback.sentiment}</p>
            <p><b>Department ID</b> {feedback.departmentId}</p>
            <p><b>Location ID</b> {feedback.locationId}</p>
            <p>______________________________________________________________</p>
        </div>
    );
};

export default Feedback;
