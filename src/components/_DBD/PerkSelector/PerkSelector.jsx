import React, { useState } from 'react';
import styles from './PerkSelector.module.css';

const PerkSelector = ({ onSelect, closeModal, allPerks }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPerks, setSelectedPerks] = useState([]);

    // Фильтрация перков по поисковому запросу
    const filteredPerks = allPerks.filter(perk =>
        perk.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (perk) => {
        if (selectedPerks.includes(perk)) {
            // Если перк уже выбран, удаляем его
            const newSelected = selectedPerks.filter(p => p.id !== perk.id);
            setSelectedPerks(newSelected);
            onSelect(newSelected); // Передаем обновленный список в родительский компонент
        } else if (selectedPerks.length < 4) {
            // Если перк не выбран и есть место, добавляем его
            const newSelected = [...selectedPerks, perk];
            setSelectedPerks(newSelected);
            onSelect(newSelected); // Передаем обновленный список в родительский компонент
        }
    };

    const handleConfirm = () => {
        if (selectedPerks.length === 4) {
            closeModal(); // Закрываем модальное окно только после подтверждения
        } else {
            alert('Пожалуйста, выберите ровно 4 перка.');
        }
    };

    const stub = "src/assets/stub_perk.png";

    return (
        <div className={styles.perkSelector}>
            <input
                type="text"
                placeholder="Поиск перков..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className={styles.perksContainer}>
                {filteredPerks.map(perk => (
                    <div
                        key={perk.id}
                        onClick={() => handleSelect(perk)}
                        className={`${styles.perkItem} ${
                            selectedPerks.includes(perk) ? styles.selected : ''
                        }`}
                    >
                        <div className={styles.perkWrapper}>
                            <img src={stub} alt={perk.name} />
                            {selectedPerks.includes(perk) && (
                                <span
                                    className={styles.removeIcon}
                                    onClick={(e) => {
                                        e.stopPropagation(); // Предотвращаем вызов handleSelect
                                        handleSelect(perk);
                                    }}
                                >
                                    ✕
                                </span>
                            )}
                        </div>
                        <p>{perk.name}</p>
                    </div>
                ))}
            </div>
            <button
                className={styles.confirmButton}
                onClick={handleConfirm}
                disabled={selectedPerks.length !== 4}
            >
                Подтвердить выбор ({selectedPerks.length}/4)
            </button>
        </div>
    );
};

export default PerkSelector;