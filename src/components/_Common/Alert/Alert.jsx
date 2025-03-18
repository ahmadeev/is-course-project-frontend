import React, { useEffect } from 'react';
import styles from './Alert.module.css'

const Alert = ({ message, isActive, onClose, duration = 3000 }) => {
    useEffect(() => {
        if (isActive) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isActive, duration, onClose]);

    return (
        isActive && (
            <div className={styles.alert}>
                <div className={styles.alert_content}>
                    {message}
                </div>
            </div>
        )
    );
};

export default Alert;
