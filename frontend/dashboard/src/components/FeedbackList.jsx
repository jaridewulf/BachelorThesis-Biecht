import React, { useEffect, useState } from 'react';
import Feedback from './Feedback';

const FeedbackList = () => {
    const [feedbackData, setFeedbackData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://api-debiecht.jaridewulf.be/feedback');
                const data = await response.json();
                setFeedbackData(data);
            } catch (error) {
                console.error('Error fetching feedback:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {feedbackData.map((feedback) => (
                <Feedback key={feedback.id} feedback={feedback} />
            ))}
        </div>
    );
};

export default FeedbackList;
