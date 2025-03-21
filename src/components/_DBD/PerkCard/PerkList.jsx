import React from 'react';
import styles from './PerkList.module.css';
import PerkCard from "./PerkCard.jsx";

const PerkList = ({ data }) => {
    if (!data || data.length === 0) {
        return <p>Перки отсутствуют</p>
    }

    return (
        <div className={styles.perkContainer}>
            {data.map((perk, index) => (
                <PerkCard key={index} perk={perk} />
            ))}
        </div>
    );
};

export default PerkList;
