import React, { useState } from 'react';
import '../styles/CreateOrganizations.css';
import { useWeb3 } from '../contexts/Web3Context';

const CreateOrganization = () => {
    const { VotingContract, accounts } = useWeb3();
    const [orgName, setOrgName] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult('');

        try {
            await VotingContract.methods.CreateOrganization(orgName).send({from:accounts[0]});
            setResult('Organization created successfully!');
        } catch (error) {
            setResult('Error creating organization. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>Create an Organization</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="org-name">Organization Name:</label>
                    <input
                        type="text"
                        id="org-name"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create</button>
            </form>
            {loading && <div id="loading">Loading, please wait...</div>}
            {result && <div id="result">{result}</div>}
            <div className="rules">
                <h2>Rules</h2>
                <ul>
                    <li>One address cannot create more than one organization.</li>
                    <li>Organization must be approved before it can create new vote campaigns.</li>
                    <li>If the organization seems suspicious, the head can ban it.</li>
                </ul>
            </div>
        </div>
    );
};

export default CreateOrganization;
