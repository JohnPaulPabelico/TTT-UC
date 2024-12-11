"use client";
import { useState } from "react";
import { BrowserProvider } from "ethers";
import { getContract } from "./utils";

interface EthereumProvider {
  request: (request: {
    method: string;
    params?: Array<
      | string
      | {
          nativeCurrency?: {
            name: string;
            symbol: string;
            decimals: number;
          };
          rpcUrls?: string[];
          chainId: string;
          chainName?: string;
        }
    >;
  }) => Promise<string[]>;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export default function Home() {
  const [walletKey, setWalletKey] = useState("");
  const [depositAmount, setDepositAmount] = useState(0);

  const connectWallet = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              nativeCurrency: {
                name: "ETH",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: ["https://sepolia.base.org"],
              chainId: "0x14a34",
              chainName: "Base Sepolia Testnet",
            },
          ],
        });

        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletKey(accounts[0]);

        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x14a34" }],
        });
      } catch (error) {
        console.error("Wallet connection error:", error);
        alert("Failed to connect wallet. Please try again.");
      }
    } else {
      alert("Ethereum wallet not detected. Please install MetaMask.");
    }
  };

  const depositFunds = async (amount: number) => {
    const ethereum = window.ethereum;
    if (!ethereum) {
      alert("Ethereum wallet not detected.");
      return;
    }
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const tx = await contract.deposit(amount);
      await tx.wait();
    } catch (error) {
      alert(`Minting failed: ${error}`);
    }
  };

  const withdrawFunds = async () => {
    const ethereum = window.ethereum;
    if (!ethereum) {
      alert("Ethereum wallet not detected.");
      return;
    }
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const tx = await contract.withdraw();
      await tx.wait();
    } catch (error) {
      alert(`Withdraw failed: ${error}`);
    }
  };

  const getInterest = async () => {
    const ethereum = window.ethereum;
    if (!ethereum) {
      alert("Ethereum wallet not detected.");
      return;
    }
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const interest = await contract.getInterest(walletKey);
      alert(`Accumulated Interest: ${interest}`);
    } catch (error) {
      alert(`Fetching failed: ${error}`);
    }
  };

  const getTotalAmount = async () => {
    const ethereum = window.ethereum;
    if (!ethereum) {
      alert("Ethereum wallet not detected.");
      return;
    }
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const totalAmount = await contract.getTotalAmount(walletKey);
      alert(`Total Amount: ${totalAmount}`);
    } catch (error) {
      alert(`Fetching failed: ${error}`);
    }
  };

  return (
    <div>
      <div className="min-h-[10dvh] bg-neutral-800 items-center flex justify-between">
        <div className="text-white text-4xl font-bold ml-5">Bank dApp</div>
        <button
          onClick={() => {
            connectWallet();
          }}
          className="text-black text-xl p-4 rounded-md bg-white hover:bg-neutral-400 mr-5"
        >
          {walletKey !== "" && (
            <>
              <span className="text-xl"> Connected: </span>
              <span>{walletKey}</span>
            </>
          )}
          {walletKey === "" && <span className="">Connect Wallet</span>}
        </button>
      </div>
      <div className="min-h-[90dvh] bg-neutral-400 flex flex-col items-center justify-center">
        <input
          type="number"
          value={depositAmount}
          onChange={(e) => setDepositAmount(Number(e.target.value))}
          placeholder="Enter deposit amount"
          className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 text-xl text-black"
        />
        <button
          onClick={() => depositFunds(depositAmount)}
          className="text-white bg-blue-400 text-2xl p-4 rounded-md mb-4 hover:bg-blue-600"
        >
          Deposit {depositAmount || 0}
        </button>
        <button
          onClick={withdrawFunds}
          className="text-white bg-green-500 text-2xl p-4 rounded-md mb-4 hover:bg-green-600"
        >
          Withdraw
        </button>
        <button
          onClick={getInterest}
          className="text-white bg-green-500 text-2xl p-4 rounded-md mb-4 hover:bg-green-600"
        >
          Get Interest
        </button>
        <button
          onClick={getTotalAmount}
          className="text-white bg-green-500 text-2xl p-4 rounded-md mb-4 hover:bg-green-600"
        >
          Get Total Amount
        </button>
      </div>
    </div>
  );
}
