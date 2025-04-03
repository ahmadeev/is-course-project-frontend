import React from 'react';
import styles from './CharacterCard.module.css';
import PerkList from "../PerkCard/PerkList.jsx";

const CharacterCard = ({ character, imageUrl }) => {
    const { id, name, lore, perks } = character;

    return (
        <div className={styles.card}>
            <div className={styles.container + " " + styles.centerer}>
                {imageUrl && (
                    <img src={imageUrl} alt={name} className={styles.image} />
                )}
                <div className={styles.header}>
                    <h2 className={styles.title}>{name}</h2>
                    <p className={styles.id}>Character ID: {id}</p>
                </div>
                <p className={styles.description}>
                    {lore || 'История отсутствует'}
                </p>
            </div>
            <div className={styles.perksSection}>
                <h3 className={styles.perksTitle}>Перки</h3>
                <PerkList data={perks} />
            </div>
        </div>
    );
};

export default CharacterCard;