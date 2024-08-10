
import { useState, useEffect } from "react";
import Web3 from 'web3';
import myChai from "./contracts/chai.json";


function App() {
  let web3;
  const [accounts, setAccounts] = useState([]);
  const [chaiContract, setChaiContract] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        if (window.ethereum) {
          web3 = new Web3(window.ethereum)
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setAccounts(accounts);

          const contractInstance = new web3.eth.Contract(myChai.abi, myChai.networks[11155111].address);
          setChaiContract(contractInstance);
        }
      }
      catch (error) {
        alert("install metamask plz");
      }
    }
    init();
  }, []);
  return (
    <div>

    </div>
  );
}

export default App;
