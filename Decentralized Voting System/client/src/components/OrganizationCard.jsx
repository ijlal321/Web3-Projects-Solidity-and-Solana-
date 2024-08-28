import React from 'react';
import '../styles/OrganizationCard.css';

const OrganizationCard = ({ name, id, status, owner }) => {
  return (
    <div className="organization-card">
      <div className="card-header">
        <h2 className="card-title">{name}</h2>
      </div>
      <div className="card-body">
        <p><strong>ID:</strong> {id}</p>
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Owner:</strong> {owner}</p>
      </div>
    </div>
  );
};

export default OrganizationCard;
