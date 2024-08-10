import React, { useState } from 'react';
import './Buy.css';

const Buy = ({ buyChai, chaiPrice }) => {
  // State for form inputs
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionState, setTransactionState] = useState(""); // State for loading status

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setTransactionState("Transaction in process ...")
    try {
      // Call the parent component's buyChai function
      await buyChai(name, message, amount);
    }
    catch (err) {

    }
    finally {
      // Clear the form fields
      setName('');
      setMessage('');
      setAmount('');
      setTransactionState("")
    }
  };

  return (
    <div className="center">
      <h1>Chai Price: {chaiPrice} Wei</h1>
      <form onSubmit={handleSubmit}>
        <div className="inputbox">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <span>Name</span>
        </div>
        <div className="inputbox">
          <input
            type="text"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <span>Message</span>
        </div>
        <div className="inputbox">
          <input
            type="number"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <span>Tip In Wei</span>
        </div>
        <div className="inputbox">
          <input type="submit" value="Pay" />
        </div>
      </form>
      <h2 style={{marginTop:"20px"}}>{transactionState}</h2>
    </div>
  );
};

export default Buy;
