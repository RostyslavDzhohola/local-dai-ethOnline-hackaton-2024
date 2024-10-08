import { Wallet, WalletDetailsParams } from "@rainbow-me/rainbowkit";
import { ADAPTER_STATUS, CHAIN_NAMESPACES, UX_MODE, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth } from "@web3auth/modal";
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { createConnector as createWagmiConnector } from "wagmi";

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID as string; // get from https://dashboard.web3auth.io

// This is configuration for Polygon Amoy Testnet
// TODO: Create dynamic chain config based on target network for scaffold-eth community
const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x13882",
  rpcTarget: "https://rpc.ankr.com/polygon_amoy",
  displayName: "Polygon Amoy Testnet",
  blockExplorerUrl: "https://amoy.polygonscan.com/",
  ticker: "MATIC",
  tickerName: "Polygon",
  logo: "https://cryptologos.cc/logos/polygon-matic-logo.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });

const web3AuthInstance = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
  uiConfig: {
    mode: "light",
    useLogoLoader: true,
    logoLight: "https://cryptologos.cc/logos/polygon-matic-logo.png",
    logoDark: "https://cryptologos.cc/logos/polygon-matic-logo.png",
    defaultLanguage: "en",
    theme: {
      primary: "#768729",
    },
    uxMode: UX_MODE.REDIRECT,
    modalZIndex: "2147483647",
  },
});

// Remove this line:
// const user = await web3AuthInstance.getUserInfo();
// console.log("user", user);

export const rainbowWeb3AuthConnector = (): Wallet => ({
  id: "web3auth",
  name: "Web3auth",
  rdns: "web3auth",
  iconUrl: "https://web3auth.io/images/web3authlog.png",
  iconBackground: "#fff",
  installed: true,
  downloadUrls: {},
  createConnector: (walletDetails: WalletDetailsParams) =>
    createWagmiConnector(config => ({
      ...Web3AuthConnector({
        web3AuthInstance,
      })(config),
      ...walletDetails,
    })),
});

// Add this function to get user info after successful login
export const getWeb3AuthUserInfo = async () => {
  try {
    const user = await web3AuthInstance.getUserInfo();
    console.log("Web3Auth user:", user);
    return user;
  } catch (error) {
    console.error("Error getting Web3Auth user info:", error);
    return null;
  }
};

// Updated function to check if Web3Auth is connected without attempting to connect
export const isWeb3AuthConnected = (): boolean => {
  console.log("Web3Auth status:", web3AuthInstance.status);
  return web3AuthInstance.status === ADAPTER_STATUS.CONNECTED;
};
