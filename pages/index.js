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
  const { data } = useSigner();

  useEffect(() => {
    if (!data) return;
    transactionProvider.wallet.setSigner(data);
  }, [data]);

  // return the page content depending on account status
  const returnContent = () => {
    if (!isConnected) {
      return (
        // connection
        <Connection />
      );
    }

    if (!transactionProvider.wallet.signature) {
      return (
        <div className={styles.messageContainer}>
          <p className={styles.listMessage}>
            The Warden has no record for your crimes. Officer Pastos will see you another time.
          </p>
        </div>
      );
    } else {
      return (
        <div className={styles.messageContainer}>
          <p className={styles.listMessage}>
            Looks like we have a potential offender on our hands. Ricardo Pastos will see about that on the 21st of November.
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
