import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './App.css'; // Import the CSS file

const contractAddress = '0xf03F6E2c37a7F9F8034dD062B0Be3d95d43F67A9';
import contractJson from "./BankAccount.json";
const contractABI = contractJson.abi;

function App() {
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const [balance, setBalance] = useState(0);
    const [accountId, setAccountId] = useState('');
    const [amount, setAmount] = useState('');
    const [withdrawId, setWithdrawId] = useState('');

    useEffect(() => {
        const init = async () => {
            try {
                if (window.ethereum) {
                    const web3 = new Web3(window.ethereum);
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    setAccount(accounts);
  
                    const contractInstance = new web3.eth.Contract(contractABI, contractAddress);
                    setContract(contractInstance);
  
                    window.ethereum.on("accountsChanged", () => {
                        window.location.reload();
                    });
                } else {
                    throw new Error("MetaMask not installed");
                }
            } catch (error) {
                console.error(error);
                alert("Please install MetaMask.");
            }
        };
        init();
    }, []);

    const createAccount = async () => {
        try {
            await contract.methods.createAccount([]).send({ from: account[0] });
            alert('Account created!');
        } catch (error) {
            console.error(error);
        }
    };

    const deposit = async () => {
        try {
            await contract.methods.deposit(accountId).send({ value: Web3.utils.toWei(amount, 'ether'), from: account[0] });
            alert('Deposit successful!');
        } catch (error) {
            console.error(error);
        }
    };

    const requestWithdraw = async () => {
        try {
            const tx = await contract.methods.requestWithdraw(accountId, Web3.utils.toWei(amount, 'ether')).send({ from: account[0] });
            await tx.wait();
            alert('Withdraw request submitted!');
        } catch (error) {
            console.error(error);
        }
    };

    const approveWithdraw = async () => {
        try {
            const tx = await contract.methods.approveWithdraw(accountId, withdrawId).send({ from: account[0] });
            await tx.wait();
            alert('Withdraw request approved!');
        } catch (error) {
            console.error(error);
        }
    };

    const withdraw = async () => {
        try {
            const tx = await contract.methods.withdraw(accountId, withdrawId).send({ from: account[0] });
            await tx.wait();
            alert('Withdraw successful!');
        } catch (error) {
            console.error(error);
        }
    };

    const getBalance = async () => {
        try {
            const balance = await contract.methods.getBalance(accountId).call();
            setBalance(Web3.utils.fromWei(balance, 'ether'));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container">
            <h1>Bank Account</h1>
            <h2>This is deployed on Seoplia Test Network</h2>
            <p>Connected account: {account}</p>

            <section>
                <h2>How to Use</h2>
                <p>
                    This is a decentralized joint bank account system built on Ethereum.
                    The following functionalities are provided:
                </p>
                <ul>
                    <li>Each account can have up to 3 owners.</li>
                    <li>Any owner can deposit Ether into the account.</li>
                    <li>
                        To withdraw funds, an owner must first create a withdrawal request. 
                        The request must then be approved by the other owners.
                    </li>
                    <li>Once approved, the requester can withdraw the specified amount of Ether.</li>
                    <li>Each user can own up to 3 accounts, and an account can have a maximum of 4 owners including the creator.</li>
                </ul>
            </section>

            <div>
                <h2>Create Account</h2>
                <button onClick={createAccount}>Create Account</button>
            </div>

            <div>
                <h2>Deposit</h2>
                <input
                    type="text"
                    placeholder="Account ID"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Amount (ETH)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <button onClick={deposit}>Deposit</button>
            </div>

            <div>
                <h2>Request Withdraw</h2>
                <input
                    type="text"
                    placeholder="Account ID"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Amount (ETH)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <button onClick={requestWithdraw}>Request Withdraw</button>
            </div>

            <div>
                <h2>Approve Withdraw</h2>
                <input
                    type="text"
                    placeholder="Account ID"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Withdraw ID"
                    value={withdrawId}
                    onChange={(e) => setWithdrawId(e.target.value)}
                />
                <button onClick={approveWithdraw}>Approve Withdraw</button>
            </div>

            <div>
                <h2>Withdraw</h2>
                <input
                    type="text"
                    placeholder="Account ID"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Withdraw ID"
                    value={withdrawId}
                    onChange={(e) => setWithdrawId(e.target.value)}
                />
                <button onClick={withdraw}>Withdraw</button>
            </div>

            <div>
                <h2>Check Balance</h2>
                <input
                    type="text"
                    placeholder="Account ID"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                />
                <button onClick={getBalance}>Get Balance</button>
                <p>Balance: {balance} ETH</p>
            </div>
        </div>
    );
}

export default App;
