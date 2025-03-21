import React, {useEffect} from "react";

import Navbar from "../../../components/_DBD/Navbar/Navbar.jsx";
import styles from "./CharacterPage.module.css";
import {useLocation} from "react-router-dom";
import CharacterCard from "../../../components/_DBD/CharacterCard/CharacterCard.jsx";

function CharacterPage({ pageTitle }) {

    useEffect(() => {
        document.title = pageTitle;
    })

    let { state } = useLocation();

    let characterImageStubUrl = state.who === "killer" ? "src/assets/stub_character_2.png" : "src/assets/stub_character.png"

    return (
        <>
            <Navbar/>
            <div className={styles.wrapper}>
                <CharacterCard character={state.character} imageUrl={characterImageStubUrl} />
            </div>
        </>
    )
}

export default CharacterPage;
