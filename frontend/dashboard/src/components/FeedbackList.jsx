import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Feedback from './Feedback';
import { PieChart, Pie, Cell, Legend } from 'recharts';

const FeedbackList = () => {
    const { id: departmentId } = useParams();
    const [feedbackData, setFeedbackData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const location = useLocation();
    const departmentName = location.state?.departmentName || 'Kortrijk';

    const COLORS = ['#12EFE2', '#E30613'];

    const positiveFeedbackCount = feedbackData.filter(feedback => feedback.sentiment === 'POSITIVE').length;
    const negativeFeedbackCount = feedbackData.filter(feedback => feedback.sentiment === 'NEGATIVE').length;

    const totalFeedbackCount = feedbackData.length;
    const negativeFeedbackPercentage = Math.floor((negativeFeedbackCount / totalFeedbackCount) * 100);

    const pieChartData = [
        { name: `${100 - negativeFeedbackPercentage}% Positief`, value: positiveFeedbackCount },
        { name: `${negativeFeedbackPercentage}% Negatief`, value: negativeFeedbackCount },
    ];

    const fetchUrl = departmentId
        ? `https://api-debiecht.jaridewulf.be/feedback/department/${departmentId}`
        : 'https://api-debiecht.jaridewulf.be/feedback';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseFeedback = await fetch(fetchUrl);
                const dataFeedback = await responseFeedback.json();
                setFeedbackData(dataFeedback.reverse());
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            }
        };
        fetchData();
    }, [fetchUrl]);

    return (
        <div className='view__container'>
            <div className='view__header'>
                <p className='view__header__title'>{departmentName}</p>
            </div>
            <div className='list__container'>
                <div className='right__column'>
                    <h2>Insights - {feedbackData.length} meningen</h2>
                    <PieChart width={400} height={400}>
                        <Pie
                            data={pieChartData}
                            dataKey='value'
                            nameKey='name'
                            cx='50%'
                            cy='50%'
                            outerRadius={150}
                            innerRadius={110}
                        >
                            {pieChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Legend />
                    </PieChart>
                </div>
                <div>
                    <h2>Recent</h2>
                    {isLoading && <p>Loading...</p>}
                    {!isLoading && feedbackData.length > 0 && feedbackData.map((feedback) => (
                        <Feedback key={feedback.id} feedback={feedback} />
                    ))}
                    {!isLoading && feedbackData.length === 0 && <p>No feedback available.</p>}
                </div>
            </div>
        </div>
    );
};

export default FeedbackList;
