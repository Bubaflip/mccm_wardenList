import { useState } from "react";
import Popup from '../components/Popup'
import styles from '../styles/Connection.module.css'


const Connection = () => {

    const [openPopup, setOpenPopup] = useState(false);

    const handleConnectButtonClick = () => {
        setOpenPopup(true);
    }

    return (
        <>
            <div className={styles.container}>
                <img
                    className={styles.frontImage}
                    src='./logo_animated.gif'
                />
                <button
                    className={styles.connectButton}
                    onClick={handleConnectButtonClick}
                >
                    {`Check Ricardo's leads`}
                </button>
                {openPopup ? <Popup
                    onClose={() => {
                        setOpenPopup(false);
                    }}
                    open={open}
                /> : <></>}
            </div>
        </>
    );
}

export default Connection;