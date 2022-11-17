import styles from '../styles/Loader.module.css'

const Loader = () => {

    return (
        <div >
            <img
                className={styles.loader}
                src='garlic-loading-alpha.gif'
            />
        </div>
    );
}

export default Loader;