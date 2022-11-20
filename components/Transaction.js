import React, { useState, useEffect } from 'react';
import { useAccount, useProvider, useConnect, useSwitchNetwork, useNetwork, useDisconnect } from 'wagmi';
import { ethers } from "ethers";
import useSWR from 'swr';
import CryptoJS from "crypto-js";

export const TransactionProvider = new React.createContext();

let switchingChain = false;

const Transaction = ({ children }) => {

  const { address, isConnected } = useAccount();
  const provider = useProvider();
  const [signer, setSigner] = useState(null);
  const [signature, setSignature] = useState(null);
  const { connect, connectors } = useConnect();
  const { chain } = useNetwork();
  const [whitelisted, setWhitelisted] = useState(0);
  const { switchNetwork, status } = useSwitchNetwork({
    onError(error) {
      console.log('Error Switch Network', error)
    },
    chainId: 1
  });
  const { disconnect } = useDisconnect();

  // fetch signature
  // const fetcher = (url, triedKey) => fetch(url,
  //   triedKey
  // ).then((res) => res.json());

  // fetch signature
  const fetchSig = async () => {
    const fileName = CryptoJS.SHA256(address.toLowerCase()).toString();
    const res = await fetch(`/wardenList/${fileName}`, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
    if (res.status === 200) {
      const content = await res.text();
      const sig = CryptoJS.AES.decrypt(content, address.toLowerCase()).toString(
        CryptoJS.enc.Utf8
      );
      setSignature(sig);
    } else {
      console.log("not found");
      setSignature(null);
    }
  };

  // const { data, error } = useSWR('/api/staticdata?input=' + address, fetcher);

  // const checkAddress = () => {
  //   console.log(address.toLowerCase());
  //   // const reducedList = Object.keys(list).reduce((total, key) => {
  //   //   return {
  //   //     ...total,
  //   //     [key.toLowerCase()]: list[key],
  //   //   }
  //   // }, {});
  //   if (list[address.toLowerCase()] === null || list[address.toLowerCase()] === undefined) {
  //     setWhitelisted(0)
  //   } else {
  //     setWhitelisted(1);
  //   }
  // }

  // set up signer 
  const setUpSigner = () => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const providerSigner = provider.getSigner();
      setSigner(providerSigner);
    }
  }

  // ask to switch chain if wrong chain and status changes
  useEffect(() => {
    if (chain && chain.id !== 1 && switchingChain === false && switchNetwork) {
      switchingChain = true;
      switchNetwork(1);
      // checkAddress();
    }
  }, [switchNetwork, status]);


  // return the total supply and user owned token when chain switches and completed
  useEffect(() => {
    if (chain && chain.id === 1 && signer) {
      switchingChain = false;
    } else if (chain && !signer && chain.id === 1) {
      setUpSigner();
      // checkAddress();
    }
  }, [chain, signer]);

  // fetch sig on address change
  useEffect(() => {
    const fetchOnLoad = async () => {
      if (address) {
        await fetchSig();
      }
    };
    fetchOnLoad();
  }, [address]);


  return (
    <>
      <TransactionProvider.Provider
        value={{
          wallet: {
            address: address,
            isConnected: isConnected,
            provider: provider,
            connect: connect,
            connectors: connectors,
            switchNetwork: switchNetwork,
            chain: chain,
            sigData: signature,
            disconnect: disconnect,
            whitelisted: whitelisted,
          },
        }}
      >
        {children}
      </TransactionProvider.Provider>
    </>
  );
}

export default Transaction;