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
    if (transactionProvider.wallet.sigData === "whitelistWarden") {
      return (
        <div className={styles.messageContainer}>
          <p className={styles.listMessage}>
            {`A true criminal. Warden has taken notice. Officer Pastos will see you for our first phase of arrests on the 21st of November at 12pm EST.`}
          </p>
        </div>
      );
    }
    if (transactionProvider.wallet.sigData === "whitelistDrunken") {
      return (
        <div className={styles.messageContainer}>
          <p className={styles.listMessage}>
            {`You are lucky the Warden was drunk and he thinks you show promise with your efforts. Officer Pastos will see you for our second phase of arrest on the 21st of November at 4pm EST.`}
          </p>
        </div>
      );
    }
    else {
      return (
        <div className={styles.messageContainer}>
          <p className={styles.listMessage}>
            {`Warden has no records for your crime. Ricardo will see you on the 21st at 6pm EST. If he is still here...`}
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
