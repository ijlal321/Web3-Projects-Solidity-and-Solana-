// src/EthereumContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ethers } from 'ethers';

interface EthereumContextType {
    accounts: string[];
    contract: ethers.Contract | null;
    provider: ethers.providers.Web3Provider | null;
}

const EthereumContext = createContext<EthereumContextType | undefined>(undefined);

export const useEthereum = () => {
    const context = useContext(EthereumContext);
    if (!context) {
        throw new Error("useEthereum must be used within an EthereumProvider");
    }
    return context;
};

interface EthereumProviderProps {
    children: ReactNode;
}

export const EthereumProvider: React.FC<EthereumProviderProps> = ({ children }) => {
    const [accounts, setAccounts] = useState<string[]>([]);
    const [contract, setContract] = useState<ethers.Contract | null>(null);
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

    useEffect(() => {
        const initEthereum = async () => {
            if (window.ethereum) {
                const provider = new ethers.BrowserProvider(window.ethereum);
                setProvider(provider);

                // Request account access
                await window.ethereum.request({ method: 'eth_requestAccounts' });

                const accounts = await provider.listAccounts();
                setAccounts(accounts);

                // Replace with your contract's ABI and address
                const contractAddress = 'YOUR_CONTRACT_ADDRESS';
                const contractABI = [ /* YOUR_CONTRACT_ABI */ ];
                const contractInstance = new ethers.Contract(contractAddress, contractABI, provider.getSigner());
                setContract(contractInstance);
            } else {
                console.error('Ethereum provider not found');
            }
        };

        initEthereum();
    }, []);

    return (
        <EthereumContext.Provider value={{ accounts, contract, provider }}>
            {children}
        </EthereumContext.Provider>
    );
};
