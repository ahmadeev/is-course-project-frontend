import Navbar from "../../../components/_DBD/Navbar/Navbar.jsx";
import styles from "./Admin.module.css";
import {useEffect} from "react";

function Admin({ pageTitle }) {

    useEffect(() => {
        document.title = pageTitle;
    })

    return (
        <>
            <Navbar/>
            <div className={styles.wrapper}></div>
        </>
    )
}

export default Admin
