import { Helmet } from "react-helmet";
import { useAccount, useSigner } from "wagmi";
import Connection from "../components/Connection";
import styles from "../styles/Home.module.css";
import Loader from "../components/Loader";
import { useContext, useEffect } from "react";
import { TransactionProvider } from "../components/Transaction";

export default function Home() {
  const { isConnected, isConnecting, isReconnecting, isDisconnected } =
    useAccount();
  const transactionProvider = useContext(TransactionProvider);

  // return the page content depending on account status
  const returnContent = () => {
    if (!isConnected) {
      return (
        // connection
        <Connection />
      );
    }

    // if (!transactionProvider.wallet.sigData) {
    if (transactionProvider.wallet.sigData === "hotLead") {
      return (
        <div className={styles.messageContainer}>
          <p className={styles.listMessage}>
            {`Ricardo's top lead. He will be looking out for you during his first wave of arrest on the 28th of November at 12pm EST. A guaranteed arrest.`}
          </p>
        </div>
      );
    }
    if (transactionProvider.wallet.sigData === "lead") {
      return (
        <div className={styles.messageContainer}>
          <p className={styles.listMessage}>
            {`Ricardo has got you down as a lead. Not his priority, but there is still a thin chance to get arrested on the 28th of November at 4pm EST. If he is still here...`}
          </p>
        </div>
      );
    }
    else {
      return (
        <div className={styles.messageContainer}>
          <p className={styles.listMessage}>
            {`Ricardo was too drunk to get you down as a lead. Looks like your last chance to get into Steel Hose is travelling via the open sea.`}
          </p>
        </div>
      );
    }
  };

  //return connection status
  const returnConnectionStatus = () => {
    if (isConnecting) {
      return (
        <div className={styles.connecting}>
          <div>CONNECTING...</div>
          <Loader />
        </div>
      );
    } else if (isReconnecting) {
      return (
        <div className={styles.connecting}>
          <div>RECONNECTING...</div>
          <Loader />
        </div>
      );
    }
  };

  const stringifyAddress = (stringToModify) => `${stringToModify.slice(0, 4)}...${stringToModify.slice(-4)}`;

  return (
    <>
      <Helmet>
        <title>MCCM Warden List</title>
        <meta name="description" content="MCCM Warden List" />
        <link rel="icon" href="/favicon.ico" />
      </Helmet>

      <div className={styles.pageContainer}>
        <button
          onClick={transactionProvider.wallet.disconnect}
          className={styles.connectedAddressButton}
        >

          {
            transactionProvider.wallet.address === null || transactionProvider.wallet.address === undefined ? (
              null
            ) : (
              <p className={styles.connectedAddress}>{stringifyAddress(transactionProvider.wallet.address)}</p>
            )
          }
        </button>

        <div>{returnContent()}</div>

        <div className={styles.connectionStatus}>
          {returnConnectionStatus()}
        </div>
      </div>
    </>
  );
}
