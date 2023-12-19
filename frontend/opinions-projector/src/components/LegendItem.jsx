import React from 'react';

const LegendeItem = ({ name, color }) => {
    return (
        <div style={{ textAlign: 'left', display: 'flex', marginBottom: "1rem" }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: color, marginRight: "1rem" }}></div>
            <span>{name}</span>
        </div>
    );
};

export default LegendeItem;
