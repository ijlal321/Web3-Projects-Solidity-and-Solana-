import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">Decentralized Voting System</h1>
        <ul className="navbar-menu">
          <li className="navbar-item"><Link to="/" className="navbar-link">Home</Link></li>
          <li className="navbar-item"><Link to="/organizations" className="navbar-link">See Organizations</Link></li>
          <li className="navbar-item"><Link to="/create-organization" className="navbar-link">Create Organization</Link></li>
          <li className="navbar-item"><Link to="/create-vote" className="navbar-link">Create Vote</Link></li>
          <li className="navbar-item"><Link to="/search-vote" className="navbar-link">Submit Vote</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
