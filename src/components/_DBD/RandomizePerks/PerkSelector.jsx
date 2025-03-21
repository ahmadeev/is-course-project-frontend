import React, {useState} from 'react';

const PerkSelector = ({ onSelect, closeModal, allPerks }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPerks, setSelectedPerks] = useState([]);

    // Фильтрация перков по поисковому запросу
    const filteredPerks = allPerks.filter(perk =>
        perk.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (perk) => {
        if (selectedPerks.length < 4 && !selectedPerks.includes(perk)) {
            const newSelected = [...selectedPerks, perk];
            setSelectedPerks(newSelected);
            onSelect(perk); // Передаем выбранный перк в родительский компонент
            if (newSelected.length === 4) closeModal(); // Закрываем окно после выбора 4 перков
        }
    };

    const stub = "src/assets/stub_perk.png"

    return (
        <div className="perk-selector">
            <input
                type="text"
                placeholder="Поиск перков..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', maxHeight: '400px', overflowY: 'auto' }}>
                {filteredPerks.map(perk => (
                    <div
                        key={perk.id}
                        onClick={() => handleSelect(perk)}
                        style={{
                            cursor: 'pointer',
                            opacity: selectedPerks.includes(perk) ? 0.5 : 1,
                            margin: '5px'
                        }}
                    >
                        <img src={stub} alt={perk.name} width="50" />
                        <p>{perk.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PerkSelector;
