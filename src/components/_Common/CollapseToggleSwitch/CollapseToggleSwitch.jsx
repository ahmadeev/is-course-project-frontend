import styles from "./CollapseToggleSwitch.module.css";

const CollapseToggleSwitch = ({ isOpen, onToggle }) => {
    return (
        <button
            className={`${styles.toggleButton} ${isOpen ? styles.open : ""}`}
            onClick={onToggle}
        >
            ▾
        </button>
    );
};

export default CollapseToggleSwitch;
