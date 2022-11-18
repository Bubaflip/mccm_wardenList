import React, { useState, useEffect } from "react";
import {
  useAccount,
  useProvider,
  useConnect,
  useSwitchNetwork,
  useNetwork,
  useDisconnect,
} from "wagmi";
import CryptoJS from "crypto-js";

export const TransactionProvider = new React.createContext();
let switchingChain = false;

const Transaction = ({ children }) => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const provider = useProvider();
  const [signer, setSigner] = useState(null);
  const { connect, connectors } = useConnect();
  const { chain } = useNetwork();
  const { switchNetwork, status } = useSwitchNetwork({
    onError(error) {
      console.log("Error Switch Network", error);
    },
    chainId: 5,
  });
  const [signature, setSignature] = useState(null);

  // fetch signature
  const fetchSig = async () => {
    console.log("fetching sig", address);
    const fileName = CryptoJS.SHA256(address).toString();
    const res = await fetch(`/wardenList/${fileName}`, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
    if (res.status === 200) {
      const content = await res.text();
      const sig = CryptoJS.AES.decrypt(content, address).toString(
        CryptoJS.enc.Utf8
      );
      setSignature(sig);
    } else {
      console.log("not found");
      setSignature(null);
    }
  };

  // fetch sig on address change
  useEffect(() => {
    const fetchOnLoad = async () => {
      await fetchSig();
    };
    fetchOnLoad();
  }, [address]);

  // ask to switch chain if wrong chain and status changes
  useEffect(() => {
    if (chain && chain.id !== 1 && switchingChain === false && switchNetwork) {
      switchingChain = true;
      switchNetwork(1);
    }
  }, [switchNetwork, status]);

  return (
    <>
      <TransactionProvider.Provider
        value={{
          wallet: {
            address: address,
            isConnected: isConnected,
            disconnect: disconnect,
            provider: provider,
            connect: connect,
            connectors: connectors,
            switchNetwork: switchNetwork,
            chain: chain,
            signature: signature,
            signer: signer,
            setSigner,
          },
        }}
      >
        {children}
      </TransactionProvider.Provider>
    </>
  );
};

export default Transaction;
