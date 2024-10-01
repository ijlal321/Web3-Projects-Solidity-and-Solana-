'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Web3 from 'web3'
import { Contract } from 'ethers'
import { error } from 'console'

const contractABI = [
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_commit",
        "type": "bytes32"
      }
    ],
    "name": "Bid",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      }
    ],
    "name": "createVote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "int256",
        "name": "_randomNumber",
        "type": "int256"
      },
      {
        "internalType": "uint256",
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "revealBid",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "biddingRecord",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "commitment",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "curAuction",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "startDate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "endDate",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllBids",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "int256",
        "name": "_randomNumber",
        "type": "int256"
      }
    ],
    "name": "getHash",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getLastAuctionEndDate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

const contractAddress = '0xe3f4d3706eA9fD0DBaB51415FCd21b7c0dB8F729';
// const contractAddress = '0x524C15b36dCa4d240412ed2d40fA06484097490c';

// Placeholder functions for blockchain interactions

export default function PrivateAuctionDemoComponent() {
  const [auctionActive, setAuctionActive] = useState(false)
  const [auctionName, setAuctionName] = useState('')
  const [bidAmount, setBidAmount] = useState('')
  const [randomValue, setRandomValue] = useState('')
  const [commitHash, setCommitHash] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)
  const [phase, setPhase] = useState<'bid' | 'reveal' | 'ended'>('bid')
  const [results, setResults] = useState<{ address: string; amount: number }[]>([])
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<any>(null);

  useEffect(() => {
    const initWeb3 = async () => {
      // Check if MetaMask is installed
      if ((window as any).ethereum) {
        const web3 = new Web3((window as any).ethereum);
        await (window as any).ethereum.request({ method: 'eth_requestAccounts' });

        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        // Initialize the contract
        const instance = new web3.eth.Contract(contractABI, contractAddress);
        setContract(instance);
        findCurPhase(instance);
      } else {
        alert('Please install MetaMask to use this app');
      }
    };

    const findCurPhase = async (instance) => {
      try {
        const endTime = Number(await instance.methods.getLastAuctionEndDate().call());
        const currentTimeUnix = Math.floor(Date.now() / 1000);
        console.log(endTime - currentTimeUnix)
        if (currentTimeUnix < endTime) {  // bid time
          setAuctionActive(true)
          setTimeLeft(endTime - currentTimeUnix) // 10 minutes for bidding phase
          setPhase('bid')
        }
        else if (currentTimeUnix < endTime + 120){
          setAuctionActive(true)
          setPhase('reveal')
          setTimeLeft(endTime + 120 - currentTimeUnix)
        }
        else{
          setPhase('ended')
          setAuctionActive(false)
        }
      } catch (error) {
        console.log(error);
      }
    }

    initWeb3();
  }, []);


  useEffect(() => {
    if (auctionActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      if (phase === 'bid') {
        setPhase('reveal')
        setTimeLeft(120)
      } else if (phase === 'reveal') {
        setPhase('ended')
        setAuctionActive(false)
        fetchResults()
      }
    }
  }, [auctionActive, timeLeft, phase])

  const createAuction = async (name: string) => {

    try {
      await contract.methods.createVote(name).send({ from: account });
      return { success: true }
    }
    catch (e) {
      console.log(e);
      alert("transaction Failed due to reason: " + e)
      return { success: false }
    }
  }

  const submitBid = async (amount: number, randomValue: number) => {
    try {
      const newHash = await contract.methods.getHash(amount, randomValue).call();
      await contract.methods.Bid(newHash).send({ from: account });
      return { commitHash: newHash }
    } catch (error) {
      return { commitHash: 'Transaction Falied fue to error: ' + error }
    }
  }

  const revealBid = async (amount: number, randomValue: number) => {

    try {
      await contract.methods.revealBid(randomValue, amount).send({ from: account });
      return { success: true }
    } catch (error) {
      return { success: false }
    }
  }

  const getAuctionResults = async () => {

    const data = [];
    try {
      const result = await contract.methods.getAllBids().call();
      // console.log(result);
      for (var i = 0; i < result[0].length; i++) {
        data.push(
          {
            address: result[0][i].slice(0, 5) + "...",
            amount: Number(result[1][i])
          }
        )
      }
      console.log(data);

    } catch (error) {
      console.log(error)

    }

    return data;

    // sample return data
    //   return[
    //   { address: '0x123...', amount: 100 },
    //   { address: '0x456...', amount: 150 },
    // ]
  }

  const startAuction = async () => {
    const result = await createAuction(auctionName)
    if (result.success) {
      setAuctionActive(true)
      setTimeLeft(120) // 10 minutes for bidding phase
      setPhase('bid')
    }
  }

  const handleBid = async () => {
    const result = await submitBid(Number(bidAmount), Number(randomValue))
    setCommitHash(result.commitHash)
  }

  const handleReveal = async () => {
    await revealBid(Number(bidAmount), Number(randomValue))
    setCommitHash('')
    setBidAmount('')
    setRandomValue('')
  }

  const fetchResults = async () => {
    const auctionResults = await getAuctionResults()
    setResults(auctionResults)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Private Auction Demo</CardTitle>
      </CardHeader>
      <CardContent>
        {!auctionActive ? (
          <div className="space-y-4">
            <Input
              placeholder="Auction Name"
              value={auctionName}
              onChange={(e) => setAuctionName(e.target.value)}
            />
            <Button onClick={startAuction} className="w-full">Create Auction</Button>
            <Button onClick={fetchResults} className="w-full">View Last Auction Results</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>Time left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
            {phase === 'bid' && (
              <>
                <Input
                  type="number"
                  placeholder="Bid Amount"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Random Value"
                  value={randomValue}
                  onChange={(e) => setRandomValue(e.target.value)}
                />
                <Button onClick={handleBid} className="w-full">Submit Bid</Button>
                <Button onClick={fetchResults} className="w-full">View Last Auction Results</Button>
                {commitHash && (
                  <div className="text-sm">
                    Commit Hash: {commitHash}
                    <br />
                    Remember your random value for the reveal phase!
                  </div>
                )}
              </>
            )}
            {phase === 'reveal' && (
              <>
                <Input
                  type="number"
                  placeholder="Bid Amount"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Random Value"
                  value={randomValue}
                  onChange={(e) => setRandomValue(e.target.value)}
                />
                <Button onClick={handleReveal} className="w-full">Reveal Bid</Button>
                <Button onClick={fetchResults} className="w-full">View Last Auction Results</Button>
              </>
            )}
          </div>
        )}
        {results.length > 0 && (
          <div className="mt-4">
            <h3 className="font-bold">Auction Results</h3>
            <ul>
              {results.map((result, index) => (
                <li key={index}>
                  Address: {result.address}, Amount: {result.amount}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}