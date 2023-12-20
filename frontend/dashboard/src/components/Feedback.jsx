import React from 'react';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
};


const Feedback = ({ feedback }) => {
    return (
        <div className="card">
            <h3>Open question</h3>
            <audio controls>
                <source src={feedback.audioUrls.open} type="audio/mp3" />
            </audio>
            <h3>Closed question</h3>
            <audio controls>
                <source src={feedback.audioUrls.closed} type="audio/mp3" />
            </audio>
            <div className='info'>
                <p className='info__item'><b>ID</b> {feedback.id}</p>
                <p className='info__item'><b>Gemaakt op</b> {formatDate(feedback.createdAt)}</p>
                <p className='info__item'><b>Intensiteit</b> {feedback.intensity}</p>
                <p className='info__item'><b>Mening</b> {feedback.sentiment === 'POSITIVE' ? 'Positief' : 'Negatief'}</p>
            </div>
        </div>
    );
};

export default Feedback;
