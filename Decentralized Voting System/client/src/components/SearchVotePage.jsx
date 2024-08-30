// src/components/SearchVotePage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import '../styles/SearchVotePage.css';

const SearchVotePage = () => {
    const { VotingContract, accounts } = useWeb3();
    const [orgId, setOrgId] = useState('');
    const [voteId, setVoteId] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const nextOrgId = await VotingContract.methods.nextOrgId().call();
            if (nextOrgId <= orgId) {
                setError('Invalid Organization ID');
                return;
            }
            const nrVotes = await VotingContract.methods.getAllVoteCampaigns(orgId).call();
            console.log(nrVotes);
            if (nrVotes.length <= voteId) {
                setError('Invalid Vote ID');
                return;
            }
            const index = voteId;
            const id = orgId;
            navigate(`/voteDetails/${index}/organization/${id}`);
        } catch (error) {
            console.log(error);
        };
    }

    return (
        <div className='search-vote-page'>
            <div className="search-container">
                <h1>Search Votes</h1>
                <form onSubmit={handleSubmit} className="search-form">
                    <div className="form-group">
                        <label htmlFor="orgId">Organization ID</label>
                        <input
                            type="text"
                            id="orgId"
                            value={orgId}
                            onChange={(e) => setOrgId(e.target.value)}
                            placeholder="Enter Organization ID"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="voteId">Vote ID</label>
                        <input
                            type="text"
                            id="voteId"
                            value={voteId}
                            onChange={(e) => setVoteId(e.target.value)}
                            placeholder="Enter Vote ID"
                            required
                        />
                    </div>
                    <button type="submit" className="search-button">Search</button>
                    {error && <p className="error-message">{error}</p>}
                </form>
                <div className="how-to-use">
                    <h2>How to Use</h2>
                    <p>You can browse all organizations and their votes from the "See Organization" page. If you already know the Organization ID and Vote ID, you can input them here to search directly.</p>
                    <p>Common Knowledge about Making Votes:</p>
                    <ul>
                        <li><strong>Understand the Voting Process:</strong> Ensure you are familiar with how votes are cast and counted. Each organization may have different procedures.</li>
                        <li><strong>Verify Your Information:</strong> Double-check the Organization ID and Vote ID before searching to avoid errors.</li>
                        <li><strong>Contact Support:</strong> If you encounter issues or have questions about the voting process, reach out to support or the organization for assistance.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SearchVotePage;
