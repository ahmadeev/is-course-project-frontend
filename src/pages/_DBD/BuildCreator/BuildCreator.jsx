import React, { useState } from 'react';
import Modal from "../../../components/_Common/Modal/Modal.jsx";
import PerkSelector from "../../../components/_DBD/RandomizePerks/PerkSelector.jsx";

import style from "./BuildCreator.module.css";
import {useData} from "../../../components/_DBD/utils/DataProvider.jsx";
import Navbar from "../../../components/_DBD/Navbar/Navbar.jsx";

const BuildCreator = () => {
    const [selectedPerks, setSelectedPerks] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const handleSelect = (perk) => {
        if (selectedPerks.length < 4 && !selectedPerks.includes(perk)) {
            setSelectedPerks([...selectedPerks, perk]);
        }
    };

    const stub = "src/assets/stub_perk.png"
    const { killerPerks, survivorPerks } = useData();
    const [isKiller, setIsKiller] = useState(true);

    return (
        <>
            <Navbar/>
            <div className={style.wrapper}>
                <h1>Создание билда</h1>
                <h2><span onClick={() => setIsKiller(true)}>Killer</span>/<span
                    onClick={() => setIsKiller(false)}>Survivor</span></h2>
                <div style={{display: 'flex', gap: '10px'}}>
                    {selectedPerks.map(perk => (
                        <div key={perk.id}>
                            <img src={stub} alt={perk.name} width="50"/>
                            <p>{perk.name}</p>
                        </div>
                    ))}
                </div>
                {selectedPerks.length < 4 && (
                    <button onClick={() => setModalIsOpen(true)}>Выбрать перк</button>
                )}
                <Modal
                    active={modalIsOpen}
                    setActive={setModalIsOpen}
                >
                    <h2>Выберите перки</h2>
                    <PerkSelector
                        onSelect={handleSelect}
                        closeModal={() => setModalIsOpen(false)}
                        allPerks={isKiller ? killerPerks : survivorPerks}
                    />
                    <button onClick={() => setModalIsOpen(false)}>Закрыть</button>
                </Modal>
            </div>
        </>
    );
};

export default BuildCreator;