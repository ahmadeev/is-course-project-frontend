import Navbar from "../../../components/_DBD/Navbar/Navbar.jsx";
import styles from "./Main.module.css";
import {useEffect, useState} from "react";
import {useData} from "../../../components/_DBD/utils/DataProvider.jsx";
import DynamicDataTable from "../../../components/_DBD/Table/DynamicDataTable.jsx";
import {crudReadMany} from "../../../utils/crud.js";

function Main({ pageTitle }) {

    useEffect(() => {
        document.title = pageTitle;
    })

    const [isKiller, setIsKiller] = useState(false);
    const [isBuild, setIsBuild] = useState(false);

    const {killerPerks, survivorPerks} = useData();

    const [reloadKillerPerksTable, setReloadKillerPerksTable] = useState(false);
    const [reloadSurvivorPerksTable, setReloadSurvivorPerksTable] = useState(false);

    const [reloadKillerBuildTable, setReloadKillerBuildTable] = useState(false);
    const [reloadSurvivorBuildTable, setReloadSurvivorBuildTable] = useState(false);

    return (
        <>
            <Navbar/>
            <div className={styles.wrapper}>

                <h2><span onClick={() => setIsKiller(true)}>Killer</span>/<span onClick={() => setIsKiller(false)}>Survivor</span></h2>
                <h2><span onClick={() => setIsBuild(false)}>Perk</span>/<span onClick={() => setIsBuild(true)}>Build</span></h2>


                {isKiller && !isBuild && (
                    <>
                        {/* killer perk table */}
                        <DynamicDataTable
                            fetchData={crudReadMany}
                            baseUrl="http://localhost:25000/is-course-project-1.0-SNAPSHOT/api/perk/killer"
                            tableReloadParentState={reloadKillerPerksTable}
                            setTableReloadParentState={setReloadKillerPerksTable}
                            columns={["id", "name", "description", "killerId"]}
                        ></DynamicDataTable>
                    </>
                )}

                {!isKiller && !isBuild && (
                    <>
                        {/* survivor perk table */}
                        <DynamicDataTable
                            fetchData={crudReadMany}
                            baseUrl="http://localhost:25000/is-course-project-1.0-SNAPSHOT/api/perk/survivor"
                            tableReloadParentState={reloadSurvivorPerksTable}
                            setTableReloadParentState={setReloadSurvivorPerksTable}
                            columns={["id", "name", "description", "survivorId"]}
                        ></DynamicDataTable>
                    </>
                )}

                {isKiller && isBuild && (
                    <>
                        {/* killer build table */}
                        <DynamicDataTable
                            fetchData={crudReadMany}
                            baseUrl="http://localhost:25000/is-course-project-1.0-SNAPSHOT/api/build/killer"
                            tableReloadParentState={reloadKillerBuildTable}
                            setTableReloadParentState={setReloadKillerBuildTable}
                            columns={["id", "name", "description", "killerId"]}
                        ></DynamicDataTable>
                    </>
                )}

                {!isKiller && isBuild && (
                    <>
                        {/* survivor build table */}
                        <DynamicDataTable
                            fetchData={crudReadMany}
                            baseUrl="http://localhost:25000/is-course-project-1.0-SNAPSHOT/api/build/survivor"
                            tableReloadParentState={reloadSurvivorBuildTable}
                            setTableReloadParentState={setReloadSurvivorBuildTable}
                            columns={["id", "name", "description", "survivorId"]}
                        ></DynamicDataTable>
                    </>
                )}

            </div>
        </>
    )
}

export default Main
