import React from 'react';
import '../styles/Home.css'; 

const Home = () => {
  return (
    <div className="home">
      <header className="home-header">
        <h1>Decentralized Voting System</h1>
        <p>Welcome to our cutting-edge decentralized voting platform, built on the Ethereum Sepolia test network.</p>
        <p><strong>Contract Address:</strong> 0x3C552b16AAA9F79Db4020a5dc3f0dee4aEa57D3D</p>
        
        <section className="home-features">
          <h2>Key Features</h2>
          <ul>
            <li><strong>Scalable Design:</strong> Our system efficiently supports a large number of organizations and votes, ensuring minimal transaction fees.</li>
            <li><strong>Efficient Operations:</strong> Operations like creating an organization, starting a new vote, and joining an organization are handled in constant time, O(1), minimizing delays and costs.</li>
            <li><strong>Cost-Effective:</strong> By avoiding array iterations during transactions, we keep gas fees to a minimum, making our system highly cost-effective.</li>
          </ul>
        </section>

        <section className="home-how-it-works">
          <h2>How It Works</h2>
          <p>Our decentralized voting system leverages Ethereum smart contracts for transparent and efficient voting. Here's a quick overview:</p>
          <ol>
            <li><strong>Create an Organization:</strong> Initialize an organization with constant-time operations and minimal fees.</li>
            <li><strong>Start a New Vote:</strong> Set up a new vote quickly and cost-effectively.</li>
            <li><strong>Join an Organization:</strong> Seamlessly become a member with efficient O(1) operations.</li>
            <li><strong>Submit your Vote:</strong> Raise you voice and submit a vote with efficient O(1) operations.</li>
          </ol>
        </section>

        <footer className="home-footer">
          <p>For more information and updates, visit our <a href="https://github.com/ijlal321/Web3-Projects-Solidity-and-Solana-" target="_blank" rel="noopener noreferrer">GitHub repository</a>.</p>
        </footer>
      </header>
    </div>
  );
}

export default Home;
