import React, {useEffect, useState} from 'react';
import Modal from "../../../components/_Common/Modal/Modal.jsx";
import PerkSelector from "../../../components/_DBD/RandomizePerks/PerkSelector.jsx";
import styles from "./MatchCreator.module.css";
import { useData } from "../../../components/_DBD/utils/DataProvider.jsx";
import Navbar from "../../../components/_DBD/Navbar/Navbar.jsx";
import ToggleSwitch from "../../../components/_Common/ToggleSwitch/ToggleSwitch.jsx";
import {useNotification} from "../../../components/_Common/Notification/NotificationProvider.jsx";

const MatchCreator = () => {
    // const BASE_URL = "http://localhost:25000/is-course-project-1.0-SNAPSHOT/api";
    const { BASE_URL } = useData();

    const { addNotification } = useNotification();

    const [selectedPerks, setSelectedPerks] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const handleSelect = (selectedPerks) => {
        setSelectedPerks(selectedPerks);
    };

    const stub = "src/assets/stub_perk.png";
    const { killerPerks, survivorPerks } = useData();

    const [characterState, setCharacterState] = useState("killer");
    const [resultState, setResultState] = useState("win");

    return (
        <>
            <Navbar />
            <div className={styles.wrapper}>
                <div className={styles.container + " " + styles.centerer}>
                    <h1 className={styles.title}>Добавление матча</h1>
                    <ToggleSwitch
                        options={[
                            {label: "Killer", value: "killer"},
                            {label: "Survivor", value: "survivor"}
                        ]}
                        selected={characterState}
                        onChange={setCharacterState}
                    />
                    <ToggleSwitch
                        options={[
                            {label: "Win", value: "win"},
                            {label: "Loss", value: "loss"}
                        ]}
                        selected={resultState}
                        onChange={setResultState}
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
                            fetch(`${BASE_URL}/match/${characterState}`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    'Authorization': `Bearer ${sessionStorage.getItem('session-token')}`
                                },
                                body: JSON.stringify({
                                    build: {perks: selectedPerks, id: -1},
                                    won: resultState === "win"
                                }) // TODO: id -- костыль (long -> Long)
                            })
                                .then((res) => res.json())
                                .then((result) => {
                                    console.log(result);
                                    addNotification("Успешно добавлены результаты матча!", "success");
                                })
                                .catch((error) => {
                                    console.error(error);
                                    addNotification("Ошибка при добавлении результатов матча!\n" + error.message, "error");
                                })
                        }}
                    >
                        Отправить
                    </button>
                </div>
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

export default MatchCreator;