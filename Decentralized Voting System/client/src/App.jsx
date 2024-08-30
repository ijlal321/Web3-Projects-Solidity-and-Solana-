import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Web3Provider } from './contexts/Web3Context';

import Navbar from './components/Navbar';
import SeeOrganizations from './components/SeeOrganizations';
import CreateOrganizations from './components/CreateOrganizations.jsx';
import CreateVoteCampaign from './components/CreateVoteCampaign.jsx';
import OrganizationDetails from './components/OrganizationDetails.jsx';
import SubmitVote from './components/SubmitVote.jsx';
import SearchVotePage from "./components/SearchVotePage.jsx";
import Home from "./components/Home.jsx";

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
            <Route path="/search-vote" element={<SearchVotePage />} />
            <Route path="/voteDetails/:index/organization/:id" element={<SubmitVote />} />
          </Routes>
        </Router>
      </div>
    </Web3Provider>
  );
}

export default App;
