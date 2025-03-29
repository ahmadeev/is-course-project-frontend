import Navbar from "../../../components/_DBD/Navbar/Navbar.jsx";
import styles from "./DiceRollerPage.module.css";
import {useEffect} from "react";
import DiceRoller from "../../../components/_DBD/DiceRoller/DiceRoller.jsx";

function DiceRollerPage({ pageTitle }) {

    useEffect(() => {
        document.title = pageTitle;
    })

    return (
        <>
            <Navbar/>
            <div className={styles.wrapper}>
                <DiceRoller />
            </div>
        </>
    )
}

export default DiceRollerPage
