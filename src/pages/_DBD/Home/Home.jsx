import Navbar from "../../../components/_DBD/Navbar/Navbar.jsx";
import styles from "./Home.module.css";
import {useEffect, useState} from "react";
import {crudReadMany} from "../../../utils/crud.js";
import DynamicDataText from "../../../components/_DBD/utils/DynamicDataText.jsx";

function Home({ pageTitle }) {
    const BASE_URL = "http://localhost:25000/is-course-project-1.0-SNAPSHOT/api";

    useEffect(() => {
        document.title = pageTitle;
    })

    const [reloadDlcContent, setReloadDlcContent] = useState(false);

    return (
        <>
            <Navbar/>
            <div className={styles.wrapper}>
                {/* dlc content */}
                <DynamicDataText
                    fetchData={crudReadMany}
                    baseUrl={`${BASE_URL}/dlc`}
                    contentReloadParentState={reloadDlcContent}
                    setContentReloadParentState={setReloadDlcContent}
                ></DynamicDataText>
            </div>
        </>
    )
}

export default Home
