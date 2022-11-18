import { configureChains, chain, WagmiConfig, createClient } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import "../styles/globals.css";
import Transaction from "../components/Transaction";
import { useEffect, useState } from "react";

function MyApp({ Component, pageProps }) {
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  const { chains, provider, webSocketProvider } = configureChains(
    [chain.mainnet],
    [
      infuraProvider({ apiKey: process.env.INFURA_KEY, priority: 1 }),
      alchemyProvider({ apiKey: process.env.ALCHEMY_KEY, priority: 0 }),
      publicProvider(),
    ]
  );

  const client = createClient({
    autoConnect: true,
    provider,
    webSocketProvider,
    connectors: [
      new WalletConnectConnector({ chains }),
      new CoinbaseWalletConnector({ chains }),
      new MetaMaskConnector({ chains }),
    ],
  });

  return (
    <WagmiConfig client={client}>
      <Transaction>
        {pageLoaded ? <Component {...pageProps} /> : null}
      </Transaction>
    </WagmiConfig>
  );
}

export default MyApp;
