// src/App.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

import itemManagerJSON from "./contracts/Item_Manager.json";
import ItemJSON from "./contracts/Item.json";

// Replace with your contract ABI and address
const ItemABI = ItemJSON.abi;
const CONTRACT_ABI = itemManagerJSON.abi;
const CONTRACT_ADDRESS = itemManagerJSON.networks[5777].address;

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [owner, setOwner] = useState(null);
  const [identifier, setIdentifier] = useState("");
  const [price, setprice] = useState("");
  const [items, setItems] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [priceInWei, setPriceInWei] = useState("");
  const [transactionSTatus, setTransactionSTatus] = useState("");
  const [idxToShip, setIdxToShip] = useState("");


  useEffect(() => {
    if (window.ethereum) {
      // Initialize web3
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      // Request account access
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => {
          setAccount(accounts[0]);
        });

      // Initialize contract
      const contractInstance = new web3Instance.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      setContract(contractInstance);

      // Fetch the owner
      fetchOwner(contractInstance);
      loadItems();
    } else {
      alert('Please install MetaMask!');
    }


  }, []);


  const loadItems = async () => {
    if (contract) {
      try {
        const itemsArray = [];
        const nr_items = await contract.methods.index().call();
        for (let i = 0; i < nr_items; i++) {
          const item = await contract.methods.items(i).call();
          item.price = await givePriceFromAddress(item._item);
          itemsArray.push(item);
        }
        setItems(itemsArray);
        console.log(items);
      } catch (error) {
        console.log(error);
      }
    }
  }

  const fetchOwner = async (contract) => {
    if (contract) {
      try {
        const ownerAddress = await contract.methods.owner().call();
        setOwner(ownerAddress);
      } catch (error) {
        console.error('Error fetching owner:', error);
      }
    }
  };

  const enterNewItem = async () => {
    try {
      await contract.methods.createItem(identifier, price).call({ from: account });
    } catch (error) {
      console.error('Error uploading new item:', error);
    }
  }

  const givePriceFromAddress = async (itemAddress) => {
    const contract2 = new web3.eth.Contract(ItemABI, itemAddress);
    const price = await contract2.methods._priceInWei().call();
    return price;
  }

  const handleAddressChange = (event) => {
    setSelectedAddress(event.target.value);
  };

  const handleUserBuy = async(event) => {
    try {
      setTransactionSTatus("sending...");
      await web3.eth.sendTransaction({
        from: account,
        to: selectedAddress,
        value: priceInWei,
      });
      setTransactionSTatus("send successfully")
    } catch (error) {
      console.error(error);
      setTransactionSTatus("not done, some error")
    }
  };

  const deliverTransaction = async() =>{
    if (idxToShip < 0 || idxToShip >= items.length){
      return;
    } 
    const res = await contract.methods.triggerDelivery(idxToShip).call({from:account});
    console.log(res);
  }


  return (
    <div>
      <h1>My DApp</h1>
      <p>Current Account: {account}</p>
      <p>Owner: {owner}</p>
      <p>Contract address: {CONTRACT_ADDRESS}</p>


      <div id='owner-area'>
        <h2>add new item (owner only)</h2>
        <p>enter identifier for item</p>
        <input className='identifier' value={identifier} onChange={(e) => setIdentifier(e.target.value)}></input>
        <p>enter price for item</p>
        <input className='price' value={price} onChange={(e) => setprice(parseInt(e.target.value, 10) || 0)} type='number'></input>
        <button onClick={enterNewItem}>enter new item</button>

        <h2>delivery (owner only)</h2>
        <input className='idxToShip' value={idxToShip} onChange={(e) => setIdxToShip(parseInt(e.target.value, 10) || 0)} type='number'></input>
        <button onClick={deliverTransaction}>deliver</button>
      </div>

      <div className='byer area'>
        <h2 style={{ padding: "50px 0px" }}>See available product here</h2>
        <button onClick={loadItems}>load items</button>
        {items.length != 0 && <div style={{ display: "flex", gap: "20px" }}><p>identifier</p><p>adddress</p><p>availability</p><p>price</p></div>}
        {items.map((curItem, idx) => (
          <div className='item' key={idx} style={{ display: "flex", gap: "20px" }}>
            <p>{curItem._identifier }</p>
            <p>{curItem._item}</p>
            <p>{curItem._step == 0 ? "available" : "not available"}</p>
            <p>{curItem.price}</p>
          </div>
        ))}
        <div>
          <h2 style={{ padding: "50px 0px" }}>Buy your fav product here</h2>

          {items.length !== 0 && (
            <div>
              <p>Enter address for item to buy</p>
              <label htmlFor="address">Select a product to buy from identifier:</label>
              <select id="address" name="fruit" value={selectedAddress} onChange={handleAddressChange}>
                {items.map((curItem, idx) => (
                  <option key={idx} value={curItem._item}>
                    Item name: {curItem._identifier} at address: {curItem._item}
                  </option>
                ))}
              </select>

              <p>enter price in wei</p>
              <input className='price' style={{ margin: "10px" }} value={priceInWei} onChange={(e) => setPriceInWei(parseInt(e.target.value, 10) || 0)} type='number'></input>

              <button onClick={handleUserBuy}>Click to buy product</button>
              <h3>{transactionSTatus}</h3>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;
