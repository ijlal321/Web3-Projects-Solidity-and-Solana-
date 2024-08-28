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
            // let organizations = [];
            // for (let i = start; i < end; i++) {
            //     organizations.push(await VotingContract.methods.Organizations(i).call());
            // }
            // setOrganizationData(organizations);
            setOrganizationData([]);
            for (let i = start; i < end; i++) {
                setOrganizationData([...organizationData, await VotingContract.methods.Organizations(i).call()])
            }
        } catch (error) {
            console.log("Error getting data:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const loadData = async () => {
            const nextOrgId = await VotingContract.methods.nextOrgId().call();
            loadOrganizationsData(0, Math.min(10, nextOrgId));
        };
        loadData();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        loadOrganizationsData(searchTerm, searchTerm + 1);
    };

    const handleRangeChange = () => {
        loadOrganizationsData(startId, endId);
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
                <button onClick={handleRangeChange} className="range-button">Search</button>
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
