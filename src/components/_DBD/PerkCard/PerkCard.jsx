import React from 'react';
import styles from './PerkCard.module.css';

const PerkCard = ({ perk }) => {
    const { id, name, description } = perk;
    const characterId = perk.killerId ? perk.killerId : perk.survivorId;

    // формируем URL для изображения на основе id перка
    // const imageUrl = `/images/perks/${id}.png`;
    const stub = "src/assets/stub_perk.png"

    return (
        <div className={styles.card}>

            <img src={stub} alt={name} className={styles.image} />

            <div className={styles.content}>
                <h2 className={styles.title}>{name}</h2>
                <p className={styles.id}>Perk ID: {id}</p>
                <p className={styles.description}>
                    {description || 'Описание отсутствует'}
                </p>
                <p className={styles.characterId}>Character ID: {characterId}</p>
            </div>
        </div>
    );
};

export default PerkCard;
