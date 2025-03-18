import Navbar from "../../../components/_DBD/Navbar/Navbar.jsx";
import styles from "./Home.module.css";
import {useEffect} from "react";

function Home({ pageTitle }) {

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

export default Home
