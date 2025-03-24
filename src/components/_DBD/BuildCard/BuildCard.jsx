import React from 'react';
import styles from './BuildCard.module.css';

// Заглушка для изображения перка
const placeholderImage = 'src/assets/stub_perk.png';

const BuildCard = ({ data, characterState, isNew=true }) => {
    const { perks, usageCount, rating, approvedByAdmin } = data;

    // надо унести куда-нибудь выше
    const transformToCapitalized = (str) => {
        if (!str) return str;
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return (
        <div className={styles.build_card}>
            {/* Заголовок карточки */}
            <div className={styles.card_header}>
                <h3>{transformToCapitalized(characterState)} Build</h3>
                {!isNew && (
                    <div className={styles.build_meta}>
                        <span className={styles.usage_count}>Usage: {usageCount}</span>
                        <span className={styles.rating}>Rating: {rating.toFixed(1)}</span>
                        <span
                            className={`${styles.approval_status} ${
                                approvedByAdmin ? styles.approved : styles.notApproved
                            }`}
                        >
                            {approvedByAdmin ? 'Approved' : 'Not Approved'}
                        </span>
                    </div>
                )}
            </div>

            {/* Список перков */}
            <div className={styles.perks_container}>
                {perks.map((perk) => (
                    <div key={perk.id} className={styles.perk_item}>
                        <img
                            src={placeholderImage}
                            alt={perk.name}
                            className={styles.perk_image}
                        />
                        <span className={styles.perk_name}>{perk.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BuildCard;