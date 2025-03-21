import React from 'react';
import { Link } from 'react-router-dom';
import styles from './DlcCard.module.css'; // Импорт стилей

const DlcCard = ({ dlc }) => {
    // Преобразуем дату из массива [год, месяц, день] в читаемый формат
    const releaseDate = new Date(dlc.releaseDate[0], dlc.releaseDate[1] - 1, dlc.releaseDate[2]).toLocaleDateString();

    return (
        <div className={styles.card}>
            <h2 className={styles.title}>{dlc.name}</h2>
            <p className={styles.releaseDate}>
                <strong>Release Date:</strong> {releaseDate}
            </p>
            <p className={styles.description}>
                <strong>Description:</strong> {dlc.description ? dlc.description : "DLC description is not available."}
            </p>

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Survivors</h3>
                {dlc.survivors && dlc.survivors.length > 0 ? (
                    <ul className={styles.list}>
                        {dlc.survivors.map((survivor, index) => (
                            <li key={index} className={styles.listItem}>
                                <Link
                                    to={`/character/${survivor.name}`}
                                    className={styles.link}
                                    state={{character: survivor, who: "survivor"}}
                                >
                                    {survivor.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className={styles.noData}>No survivors available</p>
                )}
            </div>

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Killers</h3>
                {dlc.killers && dlc.killers.length > 0 ? (
                    <ul className={styles.list}>
                        {dlc.killers.map((killer, index) => (
                            <li key={index} className={styles.listItem}>
                                <Link
                                    to={`/character/${killer.name}`}
                                    className={styles.link}
                                    state={{character: killer, who: "killer"}}
                                >
                                    {killer.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className={styles.noData}>No killers available</p>
                )}
            </div>
        </div>
    );
};

// Компонент списка карточек
const DlcList = ({ data }) => {
    if (!data || data.length === 0) return <p>Загрузка...</p>;

    return (
        <div className={styles.listContainer}>
            {data && data.map((dlc, index) => (
                <DlcCard key={index} dlc={dlc} />
            ))}
        </div>
    );
};

export default DlcList;