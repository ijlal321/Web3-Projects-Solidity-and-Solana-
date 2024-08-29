import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Web3Provider } from './contexts/Web3Context';

import Navbar from './components/Navbar';
import SeeOrganizations from './components/SeeOrganizations';
import CreateOrganizations from './components/CreateOrganizations.jsx';
import CreateVoteCampaign from './components/CreateVoteCampaign.jsx';
import OrganizationDetails from './components/OrganizationDetails.jsx';

const Home = () => <div>Home Page</div>;
const SubmitVote = () => <div>Submit Vote Page</div>;

function App() {
  return (
    <Web3Provider>
      <div className="App">
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/organization/:id" element={<OrganizationDetails/>} />
            <Route path="/organizations" element={<SeeOrganizations />} />
            <Route path="/create-organization" element={<CreateOrganizations />} />
            <Route path="/create-vote" element={<CreateVoteCampaign />} />
            <Route path="/submit" element={<SubmitVote />} />
          </Routes>
        </Router>
      </div>
    </Web3Provider>
  );
}

export default App;
