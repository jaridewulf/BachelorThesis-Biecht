import React from 'react';
import ReactPlayer from 'react-player';

const Feedback = ({ feedback }) => {
    return (
        <div>
            <p>ID: {feedback.id}</p>
            <p>Created At: {feedback.createdAt}</p>
            <p>Intensity: {feedback.intensity}</p>
            <p>Sentiment: {feedback.sentiment}</p>
            <p>Department ID: {feedback.departmentId}</p>
            <p>Location ID: {feedback.locationId}</p>
            <audio controls>
                <source src={feedback.audioUrls.open} type="audio/mp3" />
            </audio>
            <audio controls>
                <source src={feedback.audioUrls.closed} type="audio/mp3" />
            </audio>
        </div>
    );
};

export default Feedback;
