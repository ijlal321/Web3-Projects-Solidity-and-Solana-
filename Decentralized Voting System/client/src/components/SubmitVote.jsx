import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import '../styles/SubmitVote.css';

const SubmitVote = () => {
    const { VotingContract, accounts } = useWeb3();
    const params = useParams();
    const voteId = params.index; 
    const orgId = params.id;   

    const [organization, setOrganization] = useState(null);
    const [vote, setVote] = useState(null);

    const [members, setMembers] = useState([]);
    const [userVotes, setUserVotes] = useState([]);

    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    
    const [voteSummary, setVoteSummary] = useState([]);

    const [loading, setLoading] = useState(true);
    const [transactionStatus, setTransactionStatus] = useState(null); // 'processing', 'success', 'error'

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                const org = await VotingContract.methods.Organizations(orgId).call();
                setOrganization(org);

                const voteDetails = await VotingContract.methods.getAllVoteCampaigns(orgId).call();
                setVote(voteDetails[voteId]);

                setOptions(voteDetails[voteId].options);

                const temp = await VotingContract.methods.getAVoteSubmissions(orgId, voteId).call(); 
                setMembers(temp[0]);
                setUserVotes(temp[1]);
            } catch (error) {
                console.error('Error fetching details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, []);

    const handleVoteChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const handleSubmitVote = async (e) => {
        e.preventDefault();
        setTransactionStatus('processing');
        try {
            const optionNr = options.indexOf(selectedOption) + 1;
            await VotingContract.methods.sumbitVote(orgId, voteId, optionNr).send({ from: accounts[0] });
            setTransactionStatus('success');
            alert('Vote submitted successfully!');
            // Optionally, refresh the vote summary
        } catch (error) {
            setTransactionStatus('error');
            alert('Error submitting vote: ' + error.message);
        }
    };

    const calculateVoteCounts = () => {
        const counts = {};
        userVotes.forEach((voteNr, index)=>{
            counts[voteNr-1] = (counts[voteNr-1] || 0) + 1;
        })
        return counts;
    };

    const voteCounts = calculateVoteCounts();

    if (loading) return <div className="loading-message">Loading data, please wait...</div>;

    return (
        <div className="submit-vote">
            <div className="vote-details">
                <h1>Submit Your Vote</h1>
                <p><strong>Organization Name:</strong> {organization.name}</p>
                <p><strong>Organization ID:</strong> {orgId}</p>
                <p><strong>Vote Name:</strong> {vote.name}</p>
                <p><strong>Vote ID:</strong> {voteId}</p>
                <p><strong>Start Date:</strong> {new Date(vote.startDate * 1000).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true // Use 12-hour format; set to false for 24-hour format
                })}</p>
                <p><strong>End Date:</strong> {new Date(vote.endDate * 1000).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true // Use 12-hour format; set to false for 24-hour format
                })}</p>
            </div>

            <form onSubmit={handleSubmitVote} className="vote-form">
                <div className="options">
                    <label>
                        <strong>Choose an option:</strong>
                        <select value={selectedOption} onChange={handleVoteChange} required>
                            <option value="">Select an option</option>
                            {options.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                    </label>
                </div>
                <button type="submit" className="submit-button">Submit Vote</button>
            </form>

            <div className="vote-summary">
                <h2>Vote Summary</h2>
                <h3>Total Votes:</h3>
                <ul>
                    {options.map((option, index) => (
                        <li key={index}>{option}: {voteCounts[index] || 0}</li>
                    ))}
                </ul>
                <h3>Members:</h3>
                <ul>
                    {members.map((member, index) => {
                        return (
                            <li key={index}>
                                <p><strong>Member:</strong> {member}</p>
                                <p><strong>Vote:</strong> {userVotes[index] != 0 ? userVotes[index] : 'Not voted yet'}</p>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {transactionStatus === 'processing' && (
                <div className="transaction-status">
                    <p>Transaction is being processed. Please wait...</p>
                </div>
            )}
            {transactionStatus === 'success' && (
                <div className="transaction-status success">
                    <p>Transaction completed successfully!</p>
                </div>
            )}
            {transactionStatus === 'error' && (
                <div className="transaction-status error">
                    <p>Transaction failed. Please try again.</p>
                </div>
            )}
        </div>
    );
};

export default SubmitVote;
