import styles from '../styles/Popup.module.css'
import { useRouter } from 'next/router'
import { useEffect, useContext } from 'react'
import { TransactionProvider } from './Transaction';

const Popup = ({ open = false, onClose }) => {

    const transactionProvider = useContext(TransactionProvider);
    const router = useRouter();

    useEffect(() => {
        if (transactionProvider.wallet.isConnected) router.replace("/dashboard")
    }, [transactionProvider.wallet.isConnected])

    const handleOpen = (e) => {
        e.stopPropagation();
    }

    const handleClose = () => {
        onClose();
    }

    const connectorImageArr = [
        '../wallet-connector/walletconnect-logo.png',
        '../wallet-connector/coinbase-coin-logo.png',
        '../wallet-connector/metamask-logo.png'
    ]

    return (open) ? (
        <div className={styles.popupContainer} onClick={() => handleClose()}>
            <div className={styles.popup} onClick={handleOpen}>
                <div className={styles.connectorContainer}>
                <p className={styles.title}>CONNECT YOUR WALLET</p>
                    {
                        transactionProvider.wallet.connectors.map((connector, index) => <button
                            className={styles.connectorButtons}
                            key={connector.id}
                            onClick={() => transactionProvider.wallet.connect({ connector })}
                        >
                            {connector.name}
                            {
                                <img
                                    src={connectorImageArr[index]}
                                    className={styles.connectorImage}
                                />
                            }
                        </button>
                        )}

                </div>
            </div>
        </div>
    ) : null;
}

export default Popup;