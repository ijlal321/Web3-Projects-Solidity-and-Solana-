import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/OrganizationCard.css';


const OrganizationCard = ({ name, id, status, owner }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/organization/${id}`);
  };
  return (
    <div className="organization-card" onClick={handleClick}>
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
