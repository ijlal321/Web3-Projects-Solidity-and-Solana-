"'use client'"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ZkSnarkDemoJsx() {
  const [number, setNumber] = useState("''")
  const [square, setSquare] = useState("''")
  const [proof, setProof] = useState(null)
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    // Generate proof
    const generatedProof = generateProof(Number(number), Number(square))
    setProof(generatedProof)

    // Simulate sending proof to backend
    console.log("'Sending proof to backend:'", generatedProof)
    
    // Simulate API call to backend
    try {
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          const isValid = Number(square) === Number(number) * Number(number)
          resolve({ ok: true, json: () => Promise.resolve({ isValid }) })
        }, 1500) // Simulate network delay
      })

      if (response.ok) {
        const data = await response.json()
        setResult(data.isValid)
      } else {
        throw new Error("'Network response was not ok'")
      }
    } catch (error) {
      console.error("'Error:'", error)
      setResult(false)
    }

    setIsLoading(false)
  }

  // Simulate proof generation (this is not a real zkSNARK proof)
  const generateProof = (number, square) => {
    // Simulate a large, complex proof
    const complexProof = {
      commitment: btoa(`${number}${square}`), // Base64 encode the inputs (not secure, just for demo)
      proof: Array(50).fill(0).map(() => Math.random().toString(36).substring(2)).join("''"),
      publicInputs: {
        squareHash: btoa(square.toString()),
      },
      protocol: "Groth16",
      curve: "BN254",
      merklePath: Array(10).fill(0).map(() => ({
        left: Math.random().toString(36).substring(2),
        right: Math.random().toString(36).substring(2),
      })),
    }
    return JSON.stringify(complexProof, null, 2);
  }

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