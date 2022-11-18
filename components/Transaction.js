import React, { useState, useEffect } from 'react';
import { useAccount, useProvider, useConnect, useSwitchNetwork, useNetwork, useDisconnect } from 'wagmi';
import { ethers } from "ethers";
import useSWR from 'swr';

export const TransactionProvider = new React.createContext();

let switchingChain = false;

const Transaction = ({ children }) => {

    const { address, isConnected } = useAccount();
    const provider = useProvider();
    const [signer, setSigner] = useState(null);
    const { connect, connectors } = useConnect();
    const { chain } = useNetwork();
    const { switchNetwork, status } = useSwitchNetwork({
        onError(error) {
            console.log('Error Switch Network', error)
        },
        chainId: 1
    });
    const { disconnect } = useDisconnect();

    // fetch signature
    const fetcher = (url, triedKey) => fetch(url,
        triedKey
    ).then((res) => res.json());

    const { data, error } = useSWR('/api/staticdata?input=' + address, fetcher);

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
        }
    }, [switchNetwork, status]);


    // return the total supply and user owned token when chain switches and completed
    useEffect(() => {
        if (chain && chain.id === 1 && signer) {
            switchingChain = false;
        } else if (chain && !signer && chain.id === 1) {
            setUpSigner();
        }
    }, [chain, signer]);

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
                        sigData: data,
                        disconnect: disconnect,
                    },
                }}
            >
                {children}
            </TransactionProvider.Provider>
        </>

    );
}

export default Transaction;