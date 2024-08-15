// src/App.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import "./App.css";


import itemManagerJSON from "./contracts/Item_Manager.json";
import ItemJSON from "./contracts/Item.json";

// Replace with your contract ABI and address
const ItemABI = ItemJSON.abi;
const CONTRACT_ABI = itemManagerJSON.abi;
const CONTRACT_ADDRESS = itemManagerJSON.networks[11155111].address;

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [owner, setOwner] = useState(null);
  const [identifier, setIdentifier] = useState("");
  const [price, setPrice] = useState("");
  const [items, setItems] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [priceInWei, setPriceInWei] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [createStatus, setCreateStatus] = useState("");
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
        setSelectedAddress(itemsArray[0]._item);
      } catch (error) {
        console.log(error);
      }
    }
  };

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
      setCreateStatus("sending...");
      await contract.methods.createItem(identifier, price).send({ from: account });
      alert("Item created successfully!");
      loadItems(); // Reload items after creating a new one
      setCreateStatus("successful");
    } catch (error) {
      console.error('Error uploading new item:', error);
      setCreateStatus("failed");
    }
  };

  const givePriceFromAddress = async (itemAddress) => {
    const contract2 = new web3.eth.Contract(ItemABI, itemAddress);
    const price = await contract2.methods._priceInWei().call();
    return price;
  };

  const handleAddressChange = (event) => {
    setSelectedAddress(event.target.value);
  };

  const handleUserBuy = async () => {
    try {
      setTransactionStatus("Sending transaction...");
      await web3.eth.sendTransaction({
        from: account,
        to: selectedAddress,
        value: priceInWei,
      });
      setTransactionStatus("Transaction sent successfully!");
      loadItems(); // Reload items after a successful transaction
    } catch (error) {
      console.error(error);
      setTransactionStatus("Transaction failed.");
    }
  };

  const deliverTransaction = async () => {
    if (idxToShip < 0 || idxToShip >= items.length) {
      alert("Invalid index.");
      return;
    }
    try {
      setDeliveryStatus("sending...")
      await contract.methods.triggerDelivery(idxToShip).send({ from: account });
      alert("Item delivered successfully!");
      loadItems(); // Reload items after delivery
      setDeliveryStatus("successful")
    } catch (error) {
      console.error(error);
      setDeliveryStatus("failed");
    }
  };

  return (
    <div>
      <h1>Supply Chain DApp</h1>
      <p>Current Account: {account}</p>
      <p>Owner: {owner}</p>
      <p>Contract Address: {CONTRACT_ADDRESS}</p>

      <div id='owner-area'>
        <h2>Owner Actions</h2>
        <div>
          <h3>Add New Item</h3>
          <p>As the owner, you can create a new item by providing a unique identifier and the price in Wei (1 Ether = 10^18 Wei). 
          The item will be added to the blockchain and will be available for purchase.</p>
          <p>Enter Identifier:</p>
          <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
          <p>Enter Price (in Wei):</p>
          <input value={price} onChange={(e) => setPrice(parseInt(e.target.value, 10) || 0)} type='number' />
          <button onClick={enterNewItem}>Add Item</button>
          <h3>{createStatus}</h3>
        </div>

        <div>
          <h3>Deliver Item</h3>
          <p>Once an item has been paid for, you can mark it as delivered by entering the index of the item in the list. 
          This action is restricted to the owner.</p>
          <p>Enter Item Index to Ship:</p>
          <input value={idxToShip} onChange={(e) => setIdxToShip(parseInt(e.target.value, 10) || 0)} type='number' />
          <button onClick={deliverTransaction}>Mark as Delivered</button>
          <h3>{deliveryStatus}</h3>
        </div>
      </div>

      <div className='buyer-area'>
        <h2>Available Products</h2>
        <p>Here, you can view all the items that have been added to the supply chain. 
        You can check their status (whether they are available for purchase or not) and their price in Wei.</p>
        <button onClick={loadItems}>Load Items</button>
        {items.length !== 0 && (
          <div>
            <div style={{ display: "flex", gap: "20px" }}>
              <p>Identifier</p>
              <p>Contract Address</p>
              <p>Status</p>
              <p>Price (in Wei)</p>
            </div>
            {items.map((curItem, idx) => (
              <div key={idx} style={{ display: "flex", gap: "20px" }}>
                <p>{curItem._identifier}</p>
                <p>{curItem._item}</p>
                <p>{curItem._step === "0" ? "Available" : "Not Available"}</p>
                <p>{curItem.price}</p>
              </div>
            ))}
          </div>
        )}

        <div>
          <h2>Purchase Product</h2>
          <p>If an item is available, you can purchase it by selecting its address, entering the exact price in Wei, and clicking "Buy Now". 
          The transaction will be processed, and the item will be marked as purchased.</p>
          {items.length !== 0  && (
            <div>
              <p>Select a Product by Address:</p>
              <select value={selectedAddress} onChange={handleAddressChange}>
                {items.map((curItem, idx) => (
                  <option key={idx} value={curItem._item}>
                    {curItem._identifier} ({curItem._item})
                  </option>
                ))}
              </select>

              <p>Enter Price (in Wei):</p>
              <input value={priceInWei} onChange={(e) => setPriceInWei(parseInt(e.target.value, 10) || 0)} type='number' />
              <button onClick={handleUserBuy}>Buy Now</button>
              <h3>{transactionStatus}</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
