
import { useState, useEffect } from "react";
import Web3 from 'web3';
import myChai from "./contracts/chai.json";
import './App.css';
import Memos from './components/Memos'
import Buy from './components/Buy'

function App() {
  let web3;
  const [accounts, setAccounts] = useState([]);
  const [chaiContract, setChaiContract] = useState(null);
  const chaiPrice = 2;
  const [memos, setMemos] = useState([]);



  const buyChai = async (name, message, amount) => {
    if (window.ethereum == undefined) {
      alert("install metamask first");
      return;
    }
    try {
      const transaction = await chaiContract.methods.buyChai(name, message).send({
        from: accounts[0],
        value: amount + chaiPrice // Convert amount to Wei
      });
      alert("Transaction is successful");
      LoadMemos(); // Reload memos or update state
    } catch (error) {
      console.error("Transaction failed", error);
      alert("Transaction cancelled by user");
    }
  };


  const LoadMemos = async () => {
    const memos = await chaiContract.methods.getMemos().call();
    setMemos(memos);
  }

  useEffect(() => {

    const init = async () => {
      try {
        if (window.ethereum) {
          web3 = new Web3(window.ethereum)
          const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setAccounts(account);

          const contractInstance = new web3.eth.Contract(myChai.abi, myChai.networks[11155111].address);
          await setChaiContract(contractInstance);

          window.ethereum.on("accountsChanged", () => {
            window.location.reload()
          })
        }
        else {
          throw ("metamask not installed");
        }
      }
      catch (error) {
        console.log(error);
        alert("install metamask plz");
      }
    }
    init();
  }, []);


  useEffect(() => {
    if (chaiContract) {
      LoadMemos();
    }
  }, [chaiContract]);




  return (
    <div >
      <img src={"https://chaicodeeater.netlify.app/assets/chai-a8e14337.png"} className="img-fluid" alt=".." width="100%" />
      <p style={{ marginTop: "10px", marginLeft: "5px" }}>
        <p style={{fontSize:"1rem", textAlign:"center"}}>Connected Account - <b>{chaiContract ? accounts[0]: "Not Connected"} </b></p>
        <p style={{fontSize:"1rem", textAlign:"center"}}>Contract deployed on Seoplia Network on address - <b>{myChai.networks[11155111].address} </b></p>
      </p>

      <Buy buyChai={buyChai} chaiPrice={chaiPrice} />
      {chaiContract && memos.length > 0 &&
        <Memos memos={memos} />
      }

    </div>
  );
}

export default App;
