import React, {useEffect, useState} from 'react';

import style from "./BuildGenerator.module.css";
import Navbar from "../../../components/_DBD/Navbar/Navbar.jsx";
import BuildCard from "../../../components/_DBD/BuildCard/BuildCard.jsx";
import ToggleSwitch from "../../../components/_Common/ToggleSwitch/ToggleSwitch.jsx";
import SelectButton from "../../../components/_Common/SelectButton/SelectButton.jsx";

const BuildCreator = () => {
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
                            setData(result.data);
                            setLastCharacterState(characterState);
                        })
                        .catch((error) => {
                            console.error(error);
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
                                setData(result.data);
                                setLastCharacterState(characterState);
                            })
                            .catch((error) => {
                                console.error(error);
                            })
                    }}
                />
            </div>
        </>
    );
};

export default BuildCreator;