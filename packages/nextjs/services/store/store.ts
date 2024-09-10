import { create } from "zustand";
import scaffoldConfig from "~~/scaffold.config";
import { ChainWithAttributes } from "~~/utils/scaffold-eth";

/**
 * Zustand Store
 *
 * You can add global state to the app using this useGlobalState, to get & set
 * values from anywhere in the app.
 *
 * Think about it as a global useState.
 */

type GlobalState = {
  nativeCurrency: {
    price: number;
    isFetching: boolean;
  };
  setNativeCurrencyPrice: (newNativeCurrencyPriceState: number) => void;
  setIsNativeCurrencyFetching: (newIsNativeCurrencyFetching: boolean) => void;
  targetNetwork: ChainWithAttributes;
  setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => void;
  web3authUserInfo: {
    appState: string;
    email: string;
    address: string;
    aggregateVerifier: string;
    name: string;
    profileImage: string;
    typeOfLogin: string;
    verifier: string;
    verifierId: string;
    dappShare: string;
    oAuthIdToken: string;
    oAuthAccessToken: string;
    isMfaEnabled: boolean;
    idToken: string;
  };
  setWeb3AuthUserInfo: (newUserInfo: GlobalState["web3authUserInfo"]) => void;
};

export const useGlobalState = create<GlobalState>(set => ({
  nativeCurrency: {
    price: 0,
    isFetching: true,
  },
  setNativeCurrencyPrice: (newValue: number): void =>
    set(state => ({ nativeCurrency: { ...state.nativeCurrency, price: newValue } })),
  setIsNativeCurrencyFetching: (newValue: boolean): void =>
    set(state => ({ nativeCurrency: { ...state.nativeCurrency, isFetching: newValue } })),
  targetNetwork: scaffoldConfig.targetNetworks[0],
  setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => set(() => ({ targetNetwork: newTargetNetwork })),
  // Add the web3authUserInfo property
  web3authUserInfo: {
    appState: "",
    email: "",
    address: "",
    aggregateVerifier: "",
    name: "",
    profileImage: "",
    typeOfLogin: "",
    verifier: "",
    verifierId: "",
    dappShare: "",
    oAuthIdToken: "",
    oAuthAccessToken: "",
    isMfaEnabled: false,
    idToken: "",
  },
  // Add a setter for web3authUserInfo
  setWeb3AuthUserInfo: (newUserInfo: GlobalState["web3authUserInfo"]) => set(() => ({ web3authUserInfo: newUserInfo })),
}));
