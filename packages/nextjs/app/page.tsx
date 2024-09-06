"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { parseEther } from "viem";
import { ContactsUI } from "~~/components/ui/ContactsUI";
import { FakeUSDBalance } from "~~/components/ui/FakeUSDBalance";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCryptoAddress, setSelectedCryptoAddress] = useState("");
  const { writeContractAsync } = useScaffoldWriteContract("FakeUSD");

  const parsedAmount = parseEther(amount);

  const handleTransfer = async () => {
    try {
      await writeContractAsync(
        {
          functionName: "transfer",
          args: [selectedCryptoAddress, parsedAmount],
        },
        {
          onBlockConfirmation: txnReceipt => {
            console.log("📦 Transaction blockHash", txnReceipt.blockHash);
          },
        },
      );
    } catch (error) {
      console.error("Error transferring tokens:", error);
    }
  };

  const handleContactSelected = (email: string, cryptoAddress: string) => {
    setRecipientEmail(email);
    setSelectedCryptoAddress(cryptoAddress);
    console.log(`Selected Crypto Address: ${cryptoAddress}`);
  };

  return (
    <div className="flex min-h-screen bg-base-300 p-4">
      <div className="flex-1 flex flex-col items-center mr-4">
        <h1 className="text-4xl font-bold mb-8 text-primary">Local DAI</h1>

        <FakeUSDBalance />

        <div className="bg-base-100 rounded-lg shadow-lg p-6 w-full max-w-md border border-primary mt-8">
          <div className="mb-4">
            <input
              type="email"
              placeholder="Recipient's email"
              className="w-full p-2 border rounded bg-base-200 text-base-content placeholder-base-content/50"
              value={recipientEmail}
              onChange={e => setRecipientEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Amount"
              className="w-full p-2 border rounded bg-base-200 text-base-content placeholder-base-content/50"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </div>

          <button
            className="w-full bg-primary text-primary-content py-2 rounded hover:bg-primary-focus transition-colors duration-200"
            onClick={handleTransfer}
          >
            Send
          </button>
        </div>

        <div className="mt-8">
          <p className="text-sm text-primary font-semibold">Recent transactions</p>
          <div className="bg-base-100 rounded-lg shadow-md p-4 mt-2 border border-primary">
            <p className="text-base-content">Sent $50 to user@example.com</p>
            <p className="text-sm text-base-content/70">2 hours ago</p>
          </div>
        </div>
      </div>

      <ContactsUI onContactSelected={handleContactSelected} />
    </div>
  );
};

export default Home;
