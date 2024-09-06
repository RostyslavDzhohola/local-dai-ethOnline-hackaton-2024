import React from "react";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

interface FakeUSDBalanceProps {
  className?: string;
}

export const FakeUSDBalance: React.FC<FakeUSDBalanceProps> = ({ className = "" }) => {
  const { address } = useAccount();

  const { data: fakeUsdBalance } = useScaffoldReadContract({
    contractName: "FakeUSD",
    functionName: "balanceOf",
    args: [address],
  });

  // Convert bigint balance to a regular number with 2 decimal places
  const formattedBalance = fakeUsdBalance ? parseFloat(formatUnits(fakeUsdBalance, 18)).toFixed(2) : "0.00";

  return (
    <div className={`text-center ${className}`}>
      <p className="text-xl mb-4">Your FakeUSD Balance</p>
      <div className="text-4xl font-bold mb-8 text-primary">${formattedBalance}</div>
    </div>
  );
};
