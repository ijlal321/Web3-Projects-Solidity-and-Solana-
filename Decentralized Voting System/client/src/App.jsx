import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import SeeOrganizations from './components/SeeOrganizations';
import { Web3Provider } from './contexts/Web3Context';

const Home = () => <div>Home Page</div>;
const CreateOrganization = () => <div>Create Organization Page</div>;
const SubmitVote = () => <div>Submit Vote Page</div>;

function App() {
  return (
    <Web3Provider>
      <div className="App">
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/organizations" element={<SeeOrganizations />} />
            <Route path="/create" element={<CreateOrganization />} />
            <Route path="/submit" element={<SubmitVote />} />
          </Routes>
        </Router>
      </div>
    </Web3Provider>
  );
}

export default App;
