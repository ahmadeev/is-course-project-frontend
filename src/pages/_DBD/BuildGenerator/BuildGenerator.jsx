import React, {useEffect, useState} from 'react';

import style from "./BuildGenerator.module.css";
import Navbar from "../../../components/_DBD/Navbar/Navbar.jsx";
import BuildCard from "../../../components/_DBD/BuildCard/BuildCard.jsx";
import ToggleSwitch from "../../../components/_Common/ToggleSwitch/ToggleSwitch.jsx";

const BuildCreator = () => {
    const stub = "src/assets/stub_perk.png"

    const [data, setData] = useState(null);

    const [characterState, setCharacterState] = useState("killer");
    const [lastCharacterState, setLastCharacterState] = useState(characterState);

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
                <button onClick={() => {
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
                }}>generate</button>
            </div>
        </>
    );
};

export default BuildCreator;