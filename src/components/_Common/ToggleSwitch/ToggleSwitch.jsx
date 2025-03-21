import React from 'react';
import styles from './ToggleSwitch.module.css';

// [{label, value}, ...], state, setState
const ToggleSwitch = ({ options, selected, onChange }) => {
    return (
        <div className={styles.toggleSwitch}>
            {options.map((option, index) => (
                <button
                    key={option.value}
                    className={`${styles.toggleOption} ${selected === option.value ? styles.active : ''}`}//`toggle-option ${selected === option.value ? 'active' : ''}`
                    onClick={() => onChange(option.value)}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};

export default ToggleSwitch;