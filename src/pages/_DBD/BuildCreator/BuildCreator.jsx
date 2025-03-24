import React, { useState } from 'react';
import Modal from "../../../components/_Common/Modal/Modal.jsx";
import PerkSelector from "../../../components/_DBD/RandomizePerks/PerkSelector.jsx";
import styles from "./BuildCreator.module.css";
import { useData } from "../../../components/_DBD/utils/DataProvider.jsx";
import Navbar from "../../../components/_DBD/Navbar/Navbar.jsx";
import ToggleSwitch from "../../../components/_Common/ToggleSwitch/ToggleSwitch.jsx";

const BuildCreator = () => {
    const [selectedPerks, setSelectedPerks] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const handleSelect = (selectedPerks) => {
        setSelectedPerks(selectedPerks);
    };

    const stub = "src/assets/stub_perk.png";
    const { killerPerks, survivorPerks } = useData();

    const [characterState, setCharacterState] = useState("killer");

    return (
        <>
            <Navbar />
            <div className={styles.wrapper}>
                <h1 className={styles.title}>Создание билда</h1>
                <ToggleSwitch
                    options={[
                        {label: "Killer", value: "killer"},
                        {label: "Survivor", value: "survivor"}
                    ]}
                    selected={characterState}
                    onChange={setCharacterState}
                />
                <div className={styles.selectedPerks}>
                    {selectedPerks.map(perk => (
                        <div key={perk.id} className={styles.perkItem}>
                            <img src={stub} alt={perk.name}/>
                            <p>{perk.name}</p>
                        </div>
                    ))}
                </div>
                <button
                    className={styles.selectButton}
                    onClick={() => setModalIsOpen(true)}
                >
                    Выбрать перк
                </button>
                <button
                    className={styles.selectButton}
                    onClick={() => {
                        fetch(`http://localhost:25000/is-course-project-1.0-SNAPSHOT/api/build/${characterState}`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({id: -1, perks: selectedPerks}) // TODO: id -- костыль (long -> Long)
                        })
                            .then((res) => res.json())
                            .then((result) => {
                                console.log(result);
                            })
                            .catch((error) => {
                                console.error(error);
                            })
                    }}
                >
                    Отправить
                </button>
                <Modal
                    active={modalIsOpen}
                    setActive={setModalIsOpen}
                >
                    <h2>Выберите перки</h2>
                    <PerkSelector
                        onSelect={handleSelect}
                        closeModal={() => setModalIsOpen(false)}
                        allPerks={characterState === "killer" ? killerPerks : survivorPerks}
                    />
                    <button onClick={() => setModalIsOpen(false)}>Закрыть</button>
                </Modal>
            </div>
        </>
    );
};

export default BuildCreator;