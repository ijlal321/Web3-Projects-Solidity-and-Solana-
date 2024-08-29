import React, { useEffect, useState } from 'react';
import '../styles/SeeOrganizations.css';
import { useWeb3 } from '../contexts/Web3Context';
import OrganizationCard from './OrganizationCard';

const SeeOrganizations = () => {
    const { VotingContract } = useWeb3();
    const [organizationData, setOrganizationData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(0);
    const [startId, setStartId] = useState(0);
    const [endId, setEndId] = useState(0);

    const loadOrganizationsData = async (start, end) => {
        try {
            setIsLoading(true);
            const nextOrgId = await VotingContract.methods.nextOrgId().call();
            let organizations = [];
            for (let i = Math.max(start, 0); i < Math.min(end, nextOrgId); i++) {
                organizations.push(await VotingContract.methods.Organizations(i).call());
                const temp = organizations.length - 1;

                if (organizations[temp].status == 0){
                    organizations[temp].status = 'Not Approved'
                }
                else if (organizations[temp].status == 1){
                    organizations[temp].status = 'Approved'
                }
                else{
                    organizations[temp].status = 'Banned'
                }
            }
            setOrganizationData(organizations);
        } catch (error) {
            console.log("Error getting data:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const loadData = async () => {
            loadOrganizationsData(0, 10);
        };
        loadData();
    }, []);

    const handleSearchClick = (e) => {
        if (searchTerm == null || searchTerm < 0){
            alert("enter valid Id");
            return;
        }
        loadOrganizationsData(searchTerm, searchTerm + 1);
    };

    const handleRangeChange = () => {
        loadOrganizationsData(startId, endId+1);
    };

    return (
        <div className='SeeOrganizations'>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search organizations by ID..."
                    value={searchTerm}
                    onChange={(e)=>setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <button onClick={handleSearchClick} className="search-button range-button">Search</button>
            </div>
            <div className="range-container">
                <input
                    type="number"
                    placeholder="Start ID"
                    value={startId}
                    onChange={(e) => setStartId(e.target.value)}
                    className="range-input"
                />
                <input
                    type="number"
                    placeholder="End ID"
                    value={endId}
                    onChange={(e) => setEndId(e.target.value)}
                    className="range-input"
                />
                <button onClick={handleRangeChange} className="range-button">Load Range</button>
            </div>
            <div className="organizations-list">
                {isLoading ? (
                    <h1>Loading...</h1>
                ) : organizationData.length > 0 ? (
                    organizationData.map((org) => (
                        <OrganizationCard
                            key={org.id}
                            name={org.name}
                            id={org.id}
                            status={org.status}
                            owner={org.owner}
                        />
                    ))
                ) : (
                    <h2>No data found</h2>
                )}
            </div>
        </div>
    );
};

export default SeeOrganizations;
