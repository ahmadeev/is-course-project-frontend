import React, { useState } from 'react';
import styles from './DiceRoller.module.css';

const DiceRoller = () => {
    const [rolling, setRolling] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const rollDice = async () => {
        setRolling(true);
        setResult(null);
        setError(null);

        try {
            const response = await fetch(
                'http://localhost:25000/is-course-project-1.0-SNAPSHOT/api/external/roll-dice?amount=1&max-value=20'
            );
            const data = await response.json();

            if (data.status === 'SUCCESS') {
                setTimeout(() => {
                    setRolling(false);
                    setResult(data.data.result);
                }, 1000);
            } else {
                throw new Error(data.message || 'Unknown error');
            }
        } catch (err) {
            setRolling(false);
            setError(err.message);
        }
    };

    return (
        <div className={styles.diceRoller}>
            <h1>Roll the Dice!</h1>
            <button className={styles.button} onClick={rollDice} disabled={rolling}>
                {rolling ? 'Rolling...' : 'Roll'}
            </button>
            <div className={styles.diceContainer}>
                <div className={`${styles.dice} ${rolling ? styles.rolling : ""}`}>
                    {rolling ? '?' : result || '?'}
                </div>

            </div>
            {error && <p className={styles.error}>Error: {error}</p>}
            {result && !rolling && <p className={styles.result}>Result: {result}</p>}
        </div>
    );
};

export default DiceRoller;