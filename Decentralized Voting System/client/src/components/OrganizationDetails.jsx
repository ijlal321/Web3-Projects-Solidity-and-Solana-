import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import '../styles/OrganizationDetails.css';

const OrganizationDetails = () => {
    const navigate = useNavigate();
    const { VotingContract, accounts } = useWeb3();
    const { id } = useParams();
    const [organization, setOrganization] = useState(null);
    const [organizationMembers, setOrganizationMembers] = useState([]);
    const [organizationCampaigns, setOrganizationCampaigns] = useState([]);
    const [showMembers, setShowMembers] = useState(false);
    const [showCampaigns, setShowCampaigns] = useState(false);
    const [status, setStatus] = useState(''); // For ban/unban/approve status
    const [isMember, setIsMember] = useState(false); // Track membership status

    useEffect(() => {

        const fetchOrganizationDetails = async () => {
            try {
                const Myorganization = await VotingContract.methods.Organizations(id).call();
                setOrganization(Myorganization);

                const members = await VotingContract.methods.getAllOrganizationMembers(id).call();
                setOrganizationMembers(members);

                for (let i = 0; i < members.length; i++) {
                    if (members[i].toLowerCase() == accounts[0]) {
                        setIsMember(true);
                        break;
                    }
                }

                const campiagns = await VotingContract.methods.getAllVoteCampaigns(id).call();
                setOrganizationCampaigns(campiagns);

            } catch (error) {
                console.error('Error fetching organization details:', error);
            }
        };

        fetchOrganizationDetails();
    }, []);

    const handleShowMembers = () => {
        setShowMembers(!showMembers);
    };

    const handleShowCampaigns = () => {
        setShowCampaigns(!showCampaigns);
    };

    const handleAction = async (action) => {
        try {
            if (action == 'ban') {
                if (organization.status != 1) {
                    alert("Organization Must be Approved to be banned");
                    return;
                }
                await VotingContract.methods.BanOrganization(id).send({ from: accounts[0] });
            }
            else if (action == 'approve') {
                if (organization.status != 0) {
                    alert("Only unapproved organiations can be approved");
                    return;
                }
                const result = await VotingContract.methods.approveOrganization(id).send({ from: accounts[0] });
                console.log("result is ", result);
            }
            else if (action == 'unban') {
                if (organization.status != 2) {
                    alert("Only banned organiations can be unbanned");
                    return;
                }
                await VotingContract.methods.unBanOrganization(id).send({ from: accounts[0] });
            }
        } catch (e) {
            alert("Some error occured" + e.message)
            console.log("error");
        }
    };

    const handleMembership = async () => {
        try {
            if (!isMember) {
                await VotingContract.methods.becomeMember(id).send({ from: accounts[0] })
            }
            else {
                let myIndex = -1;
                for (let i = 0; i < organizationMembers.length; i++) {
                    if (organizationMembers[i].toLowerCase() == accounts[0]) {
                        myIndex = i;
                        break;
                    }
                }
                if (myIndex == -1) {
                    throw "Index Not found, double check if you are a member";
                }
                await VotingContract.methods.revokeMembership(id, myIndex).send({ from: accounts[0] })
            }
            alert("Process Successful");
        } catch (error) {
            alert("error during transaction: " + error.message);
            console.log(error);
        }
    };

    if (!organization) return <div>Loading...</div>;

    return (
        <div className="organization-details">
            <div className="details-header">
                <h1>{organization.name}</h1>
                <p><strong>ID:</strong> {organization.id}</p>
                <p><strong>Status:</strong> {organization.status == 0 ? "Not Approved" : organization.status == 1 ? "Approved" : "Banned"}</p>
                <p><strong>Owner Address:</strong> {organization.owner}</p>
            </div>

            <div className="actions">
                <button onClick={() => handleAction('ban')} className="action-button">Ban</button>
                <button onClick={() => handleAction('unban')} className="action-button">Unban</button>
                <button onClick={() => handleAction('approve')} className="action-button">Approve</button>
            </div>

            <div className="membership">
                <button onClick={handleMembership} className="membership-button">
                    {isMember ? 'Leave Organization' : 'Become a Member'}
                </button>
            </div>

            <div className="toggle-buttons">
                <button onClick={handleShowMembers} className="toggle-button">
                    {showMembers ? 'Hide Members' : 'Show Members'}
                </button>
                <button onClick={handleShowCampaigns} className="toggle-button">
                    {showCampaigns ? 'Hide Campaigns' : 'Show Campaigns'}
                </button>
            </div>

            {showMembers && (
                <div className="members-list">
                    <h2>Members</h2>
                    <ul>
                        {organizationMembers.map((member, index) => (
                            <li key={index}>{member}</li>
                        ))}
                    </ul>
                </div>
            )}

            {showCampaigns && (
                <div className="campaigns-list">
                    <h2>Vote Campaigns</h2>
                    <ul>
                        {organizationCampaigns.map((campaign, index) => (
                            <li key={index} className="campaign-item">
                                <h3>{campaign.name}</h3>
                                <h3>Id: {index}</h3>
                                <p><strong>Options:</strong> {campaign.options.join(', ')}</p>
                                <p><strong>Start Timing:</strong> {new Date(campaign.startDate * 1000).toLocaleString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: true // Use 12-hour format; set to false for 24-hour format
                                })}</p>

                                <p><strong>End Timing:</strong> {new Date(campaign.endDate * 1000).toLocaleString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: true // Use 12-hour format; set to false for 24-hour format
                                })}</p>
                                <button onClick={() => navigate(`/voteDetails/${index}/organization/${id}`) } className="results-button">See Results</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default OrganizationDetails;




