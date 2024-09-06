"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { FakeUSDBalance } from "~~/components/ui/FakeUSDBalance";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const FakeUSD: NextPage = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useScaffoldWriteContract("FakeUSD");

  const { data: hasMintedFakeUSD } = useScaffoldReadContract({
    contractName: "FakeUSD",
    functionName: "hasMintedTokens",
    args: [address],
  });

  const handleGetCash = async () => {
    try {
      await writeContractAsync(
        {
          functionName: "getCash",
        },
        {
          onBlockConfirmation: txnReceipt => {
            console.log("📦 Transaction blockHash", txnReceipt.blockHash);
          },
        },
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300 pt-16">
      <div className="container mx-auto px-4">
        <div className="text-center p-8 bg-base-100 rounded-xl shadow-2xl max-w-md mx-auto">
          <h1 className="text-5xl font-bold mb-6 text-primary">Fake USD</h1>
          <div className="divider"></div>
          <FakeUSDBalance className="mb-8" />
          {!hasMintedFakeUSD ? (
            <button
              className="btn btn-primary btn-lg w-full max-w-xs mx-auto text-lg font-bold"
              onClick={handleGetCash}
            >
              Get Cash
            </button>
          ) : (
            <Link href="/" passHref className="block">
              <button className="btn btn-secondary btn-lg w-full max-w-xs mx-auto text-lg font-bold">
                Back to App
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default FakeUSD;
