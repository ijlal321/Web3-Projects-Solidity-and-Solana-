import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/CreateVoteCampaign.css';
import { useWeb3 } from '../contexts/Web3Context';


const CreateVoteCampaign = () => {
    const { VotingContract, accounts } = useWeb3();
    const [orgId, setOrgId] = useState('');
    const [voteName, setVoteName] = useState('');
    const [options, setOptions] = useState(['']);
    const [selectedDate, setSelectedDate] = useState(null);
    const [errors, setErrors] = useState([]);

    const handleOptionChange = (index, event) => {
        const newOptions = [...options];
        newOptions[index] = event.target.value;
        setOptions(newOptions);
    };

    const handleAddOption = () => {
        if (options.length < 10) {
            setOptions([...options, '']);
        }
    };

    const handleRemoveOption = (index) => {
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
    };

    const handleSubmit = async () => {
        const validationErrors = [];
        if (!orgId) validationErrors.push("Organization ID is required.");
        if (!voteName) validationErrors.push("Vote name is required.");
        if (options.length < 1) validationErrors.push("At least one option is required.");
        if (options.length > 10) validationErrors.push("No more than 10 options are allowed.");
        if (!selectedDate) validationErrors.push("Date and time are required.");
        if (selectedDate && (selectedDate.getTime() < Date.now() || (selectedDate.getTime() - Date.now()) < 10 * 60 * 1000 || (selectedDate.getTime() - Date.now()) > 30 * 24 * 60 * 60 * 1000)) {
            validationErrors.push("Vote duration must be between 10 minutes and 1 month.");
        }

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
        } else {
            // Convert date to Unix timestamp
            const timestamp = Math.floor(selectedDate.getTime() / 1000);
            try {
                await VotingContract.methods.createVote(orgId, voteName, timestamp, options).send({ from: accounts[0] });
            }
            catch (e) {
                let message = e.message.split('message')[1].slice(2, -3);
                alert("Error creating new vote: " + message);
                setErrors([message]);
            }
            finally {
            }
        }
    };

    return (
        <div className="create-vote-container">
            <h1>Create Vote</h1>
            <div className="form-group">
                <label htmlFor="orgId">Organization ID:</label>
                <input
                    id="orgId"
                    type="text"
                    value={orgId}
                    onChange={(e) => setOrgId(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label htmlFor="voteName">Vote Name:</label>
                <input
                    id="voteName"
                    type="text"
                    value={voteName}
                    onChange={(e) => setVoteName(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label>Options:</label>
                {options.map((option, index) => (
                    <div key={index} className="option-group">
                        <input
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(index, e)}
                            placeholder={`Option ${index + 1}`}
                            className="form-control option-input"
                        />
                        {options.length > 1 && (
                            <button
                                type="button"
                                onClick={() => handleRemoveOption(index)}
                                className="remove-option-button"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                ))}
                {options.length < 10 && (
                    <button
                        type="button"
                        onClick={handleAddOption}
                        className="add-option-button"
                    >
                        Add Option
                    </button>
                )}
            </div>
            <div className="form-group">
                <label>Vote End Date and Time:</label>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    showTimeSelect
                    dateFormat="Pp"
                    className="form-control date-picker"
                />
            </div>
            <button type="button" onClick={handleSubmit} className="submit-button">
                Create Vote
            </button>
            {errors.length > 0 && (
                <div className="errors">
                    {errors.map((error, index) => (
                        <div key={index} className="error-message">{error}</div>
                    ))}
                </div>
            )}
            <div className="rules">
                <h2>Rules</h2>
                <ul>
                    <li>Only organization Owner can create new vote compaigns.</li>
                    <li>Organization must be Approved before creating an organization.</li>
                    <li>Misuse can lead to a ban from the head admin.</li>
                    <li>Vote duration must be between 10 minutes and 1 month.</li>
                    <li>Options must be at least 1 and no more than 10.</li>
                </ul>
            </div>
        </div>
    );
};

export default CreateVoteCampaign;
