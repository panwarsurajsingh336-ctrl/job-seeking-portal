import React from 'react';

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="stat-card animated-card">
      <div className="stat-icon">{icon}</div>
      <div>
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
    </div>
  );
};

export default StatCard;
