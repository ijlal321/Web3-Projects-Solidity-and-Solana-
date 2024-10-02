"'use client'"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

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

// const CONTRACT_ADDRESS = "0x06e8e912306d00407527DbF34762022BB86aDCAF";  // Seoplia Testnet
const CONTRACT_ADDRESS = "0xa2D550Ca78257115196347c81096De5cEC969FFE"; // Ganache Local


export function ZkSnarkDemoJsx() {
  const [number, setNumber] = useState("")
  const [square, setSquare] = useState("")
  const [proof, setProof] = useState(null)
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    // Generate proof
    const generatedProof = await generateProof(Number(number), Number(square))
    // console.log(generatedProof)
    if (generatedProof == null) {
      setProof("Proof creation failed. Cannot prove you know Square Value.")
      setIsLoading(false)
      setResult(false)
      return
    }

    const jsonString = JSON.stringify(generatedProof.proof, null, 2)
    setProof(jsonString)

    // console.log("'Sending proof to backend:'", generatedProof)

    try {
      const sendData = [[generatedProof.proof.a, generatedProof.proof.b, generatedProof.proof.c], generatedProof.inputs]

      const result = await contract.methods.verifyTx([generatedProof.proof.a, generatedProof.proof.b, generatedProof.proof.c], generatedProof.inputs).send({from:account});
      setResult(true)
    } catch (error) {
      console.error("'Error:'", error)
      setResult(false)
    }

    setIsLoading(false)
  }


  const generateProof = async (number, square) => {
    try {
      const zokratesProvider = await initialize();
      const { witness, output } = zokratesProvider.computeWitness(artifacts, [String(number), String(square)]);
      const proof = zokratesProvider.generateProof(
        artifacts.program,
        witness,
        keypair.pk
      );
      return proof
    } catch (error) {
      console.log("Error occurred while creating Proof: " + error);
      return null;
    }
  };

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
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "'Generating Proof...'" : "'Generate and Submit Proof'"}
          </Button>
        </form>

        {proof && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Generated Proof:</h3>
            <ScrollArea
              className="h-[200px] w-full rounded-md border border-zinc-200 p-4 dark:border-zinc-800">
              <pre className="text-sm">{proof}</pre>
            </ScrollArea>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {result !== null && (
          <div
            className={`w-full text-center ${result ? "'text-green-600'" : "'text-red-600'"}`}>
            {result ? "'Proof verified successfully!'" : "'Proof verification failed.'"}
          </div>
        )}
      </CardFooter>
    </Card>)
  );
}