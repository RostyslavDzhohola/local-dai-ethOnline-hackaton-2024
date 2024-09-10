"use client";

import React from "react";
import { useAccount } from "wagmi";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

const RecentTransactions: React.FC = () => {
  const { address } = useAccount();

  const {
    data: events,
    isLoading,
    error: errorReadingEvents,
  } = useScaffoldEventHistory({
    contractName: "FakeUSD",
    eventName: "TransferWithAddresses",
    fromBlock: 0n,
    watch: true,
    filters: { from: address, to: address },
    blockData: true,
    transactionData: true,
    receiptData: true,
  });

  console.log("events from transactions", events);

  return (
    <div className="mt-8">
      <p className="text-sm text-primary font-semibold">Recent transactions</p>
      <div className="bg-base-100 rounded-lg shadow-md p-4 mt-2 border border-primary">
        <p className="text-base-content">Sent $50 to user@example.com</p>
        <p className="text-sm text-base-content/70">2 hours ago</p>
      </div>
    </div>
  );
};

export default RecentTransactions;
