import Navbar from "../../../components/_DBD/Navbar/Navbar.jsx";
import styles from "./Home.module.css";
import {useEffect, useState} from "react";
import {useData} from "../../../components/_DBD/utils/DataProvider.jsx";
import DynamicDataTable from "../../../components/_DBD/Table/DynamicDataTable.jsx";
import {crudReadMany} from "../../../utils/crud.js";

function Home({ pageTitle }) {

    useEffect(() => {
        document.title = pageTitle;
    })

    const BASE_URL = "http://localhost:8080/backend-jakarta-ee-1.0-SNAPSHOT/api/user";
    const WS_URL = "ws://localhost:8080/backend-jakarta-ee-1.0-SNAPSHOT/ws/dragons";
    const columns = [
        "Name",
        "Coordinates: x",
        "Coordinates: y",
        "Cave: number of treasures",
        "Killer: name",
        "Killer: eye color",
        "Killer: hair color",
        "Killer: Location: x",
        "Killer: Location: y",
        "Killer: Location: z",
        "Killer: birthday",
        "Killer: height",
        "Age",
        "Description",
        "Wingspan",
        "Character",
        "Head: eyes count",
        "Head: tooth count"
    ]

    const {killerPerks, survivorPerks} = useData();

    const [reloadKillerPerksTable, setReloadKillerPerksTable] = useState(false);

    return (
        <>
            <Navbar/>
            <div className={styles.wrapper}>
                {/* killer perk table */}
                <DynamicDataTable
                    fetchData={crudReadMany}
                    baseUrl="http://localhost:25000/is-course-project-1.0-SNAPSHOT/api/perk/killer"
                    staticData={killerPerks}
                    tableReloadParentState={reloadKillerPerksTable}
                    setTableReloadParentState={setReloadKillerPerksTable}
                    columns={["id", "name", "description", "killer"]}
                ></DynamicDataTable>
            </div>
        </>
    )
}

export default Home
