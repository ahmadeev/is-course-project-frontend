import React, {useEffect, useState} from 'react';

import style from "./BuildGenerator.module.css";
import Navbar from "../../../components/_DBD/Navbar/Navbar.jsx";
import BuildCard from "../../../components/_DBD/BuildCard/BuildCard.jsx";
import ToggleSwitch from "../../../components/_Common/ToggleSwitch/ToggleSwitch.jsx";
import SelectButton from "../../../components/_Common/SelectButton/SelectButton.jsx";
import Alert from "../../../components/_Common/Alert/Alert.jsx";
import {useNotification} from "../../../components/_Common/Notification/NotificationProvider.jsx";
import {useLocation} from "react-router-dom";
import {useData} from "../../../components/_DBD/utils/DataProvider.jsx";
import styles from "../MatchCreator/MatchCreator.module.css";

const BuildCreator = () => {
    // const BASE_URL = "http://localhost:25000/is-course-project-1.0-SNAPSHOT/api";
    const { BASE_URL } = useData();

    const { addNotification } = useNotification();

    const [data, setData] = useState(null);

    const [characterState, setCharacterState] = useState("killer");
    const [lastCharacterState, setLastCharacterState] = useState(characterState);

    const buildLookUpOptions = [
        {label: "top-rated", value: "top-rated"},
        {label: "approved", value: "approved"},
        {label: "most-popular", value: "most-popular"}
    ]
    const [buildLookUpOption, setBuildLookUpOption] = useState(buildLookUpOptions[0]);

    return (
        <>
            <Navbar/>
            <div className={style.wrapper}>
                {
                    data && <BuildCard data={data} characterState={lastCharacterState} />
                }
                <div className={styles.container + " " + styles.centerer}>
                    <ToggleSwitch
                        options={[
                            {label: "Killer", value: "killer"},
                            {label: "Survivor", value: "survivor"}
                        ]}
                        selected={characterState}
                        onChange={setCharacterState}
                    />
                    <button
                        className={style.selectButton}
                        onClick={() => {
                            fetch(
                                `${BASE_URL}/build/${characterState}/random`,
                                {
                                    method: "GET",
                                    headers: {
                                        'Authorization': `Bearer ${sessionStorage.getItem('session-token')}`
                                    }
                                }
                            )
                                .then((res) => res.json())
                                .then((result) => {

                                    if(result.status !== "SUCCESS") throw new Error(result.details);

                                    setData(result.data);
                                    setLastCharacterState(characterState);
                                })
                                .catch((error) => {
                                    console.error(error);
                                    addNotification(error.message, "error");
                                })
                        }}>Сгенерировать</button>
                    <SelectButton
                        selected={buildLookUpOption}
                        onChange={setBuildLookUpOption}
                        options={buildLookUpOptions}
                        onButtonClick={(selected) => {
                            fetch(
                                `${BASE_URL}/build/${characterState}/random/${selected.value}`,
                                {
                                    method: "GET",
                                    headers: {
                                        'Authorization': `Bearer ${sessionStorage.getItem('session-token')}`
                                    }
                                }
                            )
                                .then((res) => res.json())
                                .then((result) => {

                                    if(result.status !== "SUCCESS") throw new Error(result.details);

                                    setData(result.data);
                                    setLastCharacterState(characterState);
                                })
                                .catch((error) => {
                                    console.error(error);
                                    addNotification(error.message, "error");
                                })
                        }}
                    />
                </div>
            </div>
        </>
    );
};

export default BuildCreator;