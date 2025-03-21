import Navbar from "../../../components/_DBD/Navbar/Navbar.jsx";
import styles from "./Main.module.css";
import React, {useEffect, useState} from "react";
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
                            columns={["id", "perk 1", "perk 2", "perk 3", "perk 4", "rating", "usageCount", "approvedByAdmin"]}

                            renderRow={(item, rowIndex) => {
                                let columns= ["id", "perk 1", "perk 2", "perk 3", "perk 4", "rating", "usageCount", "approvedByAdmin"];

                                return (
                                    <tr key={item.id || rowIndex}>
                                        {columns.map((col, colIndex) => {
                                            if (col.startsWith("perk")) {
                                                const perkIndex = parseInt(col.split(" ")[1]) - 1; // Например, "perk 1" -> 0
                                                const perk = item.perks[perkIndex];
                                                return <td key={colIndex}>{perk ? perk.name : "N/A"}</td>;
                                            } else {
                                                return <td key={colIndex}>{"" + item[col]}</td>;
                                            }
                                        })}
                                    </tr>
                                )
                            }}
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
                            columns={["id", "perk 1", "perk 2", "perk 3", "perk 4", "rating", "usageCount", "approvedByAdmin"]}

                            renderRow={(item, rowIndex) => {
                                let columns= ["id", "perk 1", "perk 2", "perk 3", "perk 4", "rating", "usageCount", "approvedByAdmin"];

                                return (
                                    <tr key={item.id || rowIndex}>
                                        {columns.map((col, colIndex) => {
                                            if (col.startsWith("perk")) {
                                                const perkIndex = parseInt(col.split(" ")[1]) - 1; // Например, "perk 1" -> 0
                                                const perk = item.perks[perkIndex];
                                                return <td key={colIndex}>{perk ? perk.name : "N/A"}</td>;
                                            } else {
                                                return <td key={colIndex}>{"" + item[col]}</td>;
                                            }
                                        })}
                                    </tr>
                                )
                            }}
                        ></DynamicDataTable>
                    </>
                )}

            </div>
        </>
    )
}

export default Main
