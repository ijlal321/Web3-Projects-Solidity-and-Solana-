"'use client'"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

import { initialize } from "zokrates-js"
import fs from 'fs'

import artifacts from "../ZkData/artifacts";
import keypair from "../ZkData/keyPair.json"

import Web3 from 'web3';

const MyContractABI = [
  {
    "inputs": [
      {
        "components": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "X",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "Y",
                "type": "uint256"
              }
            ],
            "internalType": "struct Pairing.G1Point",
            "name": "a",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "uint256[2]",
                "name": "X",
                "type": "uint256[2]"
              },
              {
                "internalType": "uint256[2]",
                "name": "Y",
                "type": "uint256[2]"
              }
            ],
            "internalType": "struct Pairing.G2Point",
            "name": "b",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "X",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "Y",
                "type": "uint256"
              }
            ],
            "internalType": "struct Pairing.G1Point",
            "name": "c",
            "type": "tuple"
          }
        ],
        "internalType": "struct Verifier.Proof",
        "name": "proof",
        "type": "tuple"
      },
      {
        "internalType": "uint256[1]",
        "name": "input",
        "type": "uint256[1]"
      }
    ],
    "name": "verifyTx",
    "outputs": [
      {
        "internalType": "bool",
        "name": "r",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const CONTRACT_ADDRESS = "0x06e8e912306d00407527DbF34762022BB86aDCAF";  // Seoplia Testnet
// const CONTRACT_ADDRESS = "0xa2D550Ca78257115196347c81096De5cEC969FFE"; // Ganache Local

export function ZkSnarkDemoJsx() {
  const [number, setNumber] = useState("")
  const [square, setSquare] = useState("")
  const [proof, setProof] = useState("")
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isProofGenerated, setIsProofGenerated] = useState(false)
  const [isProofModified, setIsProofModified] = useState(false)

  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  const generateProof = async () => {
    setIsLoading(true)
    setResult(null)

    let generatedProof;
    try {
      const zokratesProvider = await initialize();
      const { witness, output } = zokratesProvider.computeWitness(artifacts, [String(number), String(square)]);
      generatedProof = zokratesProvider.generateProof(
        artifacts.program,
        witness,
        keypair.pk
      );
    } catch (error) {
      console.log("Error occurred while creating Proof: " + error);
    }

    if (generatedProof == null) {
      setProof("Proof creation failed. Cannot prove you know Square Value.")
    }else{
      const jsonString = JSON.stringify(generatedProof, null, 2)
      setProof(jsonString)
      
      setIsProofGenerated(true)
      setIsProofModified(false)
    }
    
    setIsProofGenerated(true)
    setIsProofModified(false)
    setIsLoading(false)
  }

  const handleSubmit = async () => {
    const generatedProof = JSON.parse(proof);
    setIsLoading(true)
    setResult(null)

    // Simulate sending proof to backend
    console.log("Sending proof to backend:", generatedProof)

    // Simulate API call to backend
    try {
      const sendData = [[generatedProof.proof.a, generatedProof.proof.b, generatedProof.proof.c], generatedProof.inputs]

      const result = await contract.methods.verifyTx([generatedProof.proof.a, generatedProof.proof.b, generatedProof.proof.c], generatedProof.inputs).call();
      console.log(result)
      setResult(result)
    } catch (error) {
      console.error("'Error:'", error)
      setResult(false)
    }

    setIsLoading(false)
  }

  const handleProofChange = (e) => {
    setProof(e.target.value)
    setIsProofModified(true)
  }

  useEffect(() => {
    const initWeb3 = async () => {
      if (!window.ethereum) {
        alert('Please install MetaMask!');
        return;
      }

      // Initialize Web3
      const web3 = new Web3(window.ethereum);

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Get accounts
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      const contractInstance = new web3.eth.Contract(MyContractABI, CONTRACT_ADDRESS);
      setContract(contractInstance);
    };

    initWeb3();
  }, []);


  return (
    (<Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>zkSNARK Demo</CardTitle>
        <CardDescription>Prove you know the square of a number without revealing it</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="number">Number</Label>
              <Input
                id="number"
                type="number"
                placeholder="Enter a number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="square">Square of the number</Label>
              <Input
                id="square"
                type="number"
                placeholder="Enter the square"
                value={square}
                onChange={(e) => setSquare(e.target.value)}
                required />
            </div>
          </div>
          <Button
            onClick={generateProof}
            className="w-full"
            disabled={isLoading || !number || !square}>
            {isLoading ? "Generating Proof..." : "Generate Proof"}
          </Button>

          {isProofGenerated && (
            <div className="space-y-4">
              <Label htmlFor="proof">Generated Proof (editable):</Label>
              <Textarea
                id="proof"
                value={proof}
                onChange={handleProofChange}
                className="h-[200px] font-mono text-sm" />
              {isProofModified && (
                <Alert variant="warning">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>
                    You have modified the proof. This will likely result in a failed verification.
                  </AlertDescription>
                </Alert>
              )}
              <Button onClick={handleSubmit} className="w-full" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Submit Proof for Verification"}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {result !== null && (
          <div
            className={`w-full text-center ${result ? "'text-green-600'" : "'text-red-600'"}`}>
            {result ? "Proof verified successfully!" : "Proof verification failed."}
          </div>
        )}
      </CardFooter>
    </Card>)
  );
}