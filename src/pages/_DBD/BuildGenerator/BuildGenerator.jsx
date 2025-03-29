import React, {useEffect, useState} from 'react';

import style from "./BuildGenerator.module.css";
import Navbar from "../../../components/_DBD/Navbar/Navbar.jsx";
import BuildCard from "../../../components/_DBD/BuildCard/BuildCard.jsx";
import ToggleSwitch from "../../../components/_Common/ToggleSwitch/ToggleSwitch.jsx";
import SelectButton from "../../../components/_Common/SelectButton/SelectButton.jsx";
import Alert from "../../../components/_Common/Alert/Alert.jsx";

const BuildCreator = () => {
    const [alertActive, setAlertActive] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertStatus, setAlertStatus] = useState(false);

    const [data, setData] = useState(null);

    const [characterState, setCharacterState] = useState("killer");
    const [lastCharacterState, setLastCharacterState] = useState(characterState);

    const buildLookUpOptions = [
        {label: "top-rated", value: "top-rated"},
        {label: "approved", value: "approved"},
        {label: "most-popular", value: "most-popular"}
    ]
    const [buildLookUpOption, setBuildLookUpOption] = useState(buildLookUpOptions[0]);

    useEffect(() => {
        if (alertMessage !== "") {
            setAlertActive(true);
        }
    }, [alertMessage, alertStatus])

    return (
        <>
            <Navbar/>
            <div className={style.wrapper}>
                {
                    data && <BuildCard data={data} characterState={lastCharacterState} />
                }
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
                        `http://localhost:25000/is-course-project-1.0-SNAPSHOT/api/build/${characterState}/random`,
                        {method: "GET"}
                    )
                        .then((res) => res.json())
                        .then((result) => {

                            if(result.status !== "SUCCESS") throw new Error(result.details);

                            setData(result.data);
                            setLastCharacterState(characterState);
                        })
                        .catch((error) => {
                            console.error(error);
                            setAlertMessage(error.message);
                            setAlertStatus(prev => !prev);
                        })
                }}>Сгенерировать</button>
                <SelectButton
                    selected={buildLookUpOption}
                    onChange={setBuildLookUpOption}
                    options={buildLookUpOptions}
                    onButtonClick={(selected) => {
                        fetch(
                            `http://localhost:25000/is-course-project-1.0-SNAPSHOT/api/build/${characterState}/random/${selected.value}`,
                            {method: "GET"}
                        )
                            .then((res) => res.json())
                            .then((result) => {

                                if(result.status !== "SUCCESS") throw new Error(result.details);

                                setData(result.data);
                                setLastCharacterState(characterState);
                            })
                            .catch((error) => {
                                console.error(error);
                                setAlertMessage(error.message);
                                setAlertStatus(prev => !prev);
                            })
                    }}
                />

                <Alert
                    message={alertMessage}
                    isActive={alertActive}
                    onClose={() => setAlertActive(false)}
                />

            </div>
        </>
    );
};

export default BuildCreator;