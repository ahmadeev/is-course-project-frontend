import Navbar from "../../../components/_DBD/Navbar/Navbar.jsx";
import styles from "./Admin.module.css";
import React, {useEffect, useState} from "react";
import DynamicDataTable from "../../../components/_DBD/Table/DynamicDataTable.jsx";
import {crudReadMany} from "../../../utils/crud.js";
import {useData} from "../../../components/_DBD/utils/DataProvider.jsx";
import ToggleSwitch from "../../../components/_Common/ToggleSwitch/ToggleSwitch.jsx";

function Admin({ pageTitle }) {

    const { BASE_URL } = useData();

    const [characterState, setCharacterState] = useState("killer");

    const [reloadKillerLogTable, setReloadKillerLogTable] = useState(false);
    const [reloadSurvivorLogTable, setReloadSurvivorLogTable] = useState(false);

    useEffect(() => {
        document.title = pageTitle;
    })

    return (
        <>
            <Navbar/>
            <div className={styles.wrapper}>

                <ToggleSwitch
                    options={[
                        {label: "Killer", value: "killer"},
                        {label: "Survivor", value: "survivor"}
                    ]}
                    selected={characterState}
                    onChange={setCharacterState}
                />

                <div className={styles.container + " " + styles.centerer + " " + styles.table_special}>
                    <DynamicDataTable
                        header="Журнал изменений подтверждений"
                        fetchData={crudReadMany}
                        baseUrl={`${BASE_URL}/approve-build/${characterState}`}
                        tableReloadParentState={characterState === "survivor" ? reloadSurvivorLogTable : reloadKillerLogTable}
                        setTableReloadParentState={characterState === "survivor" ? setReloadSurvivorLogTable : setReloadKillerLogTable}
                        columns={["id", "perk 1", "perk 2", "perk 3", "perk 4", "currentValue", "updatedAt"]}

                        renderRow={(item, rowIndex) => {
                            let columns = ["id", "perk 1", "perk 2", "perk 3", "perk 4", "currentValue", "updatedAt"];

                            return (
                                <tr
                                    key={item.id || rowIndex}
                                >
                                    {columns.map((col, colIndex) => {
                                        if (col.startsWith("perk")) {
                                            const perkIndex = parseInt(col.split(" ")[1]) - 1; // "perk 1" -> 0
                                            const perk = item.build.perks[perkIndex];
                                            return <td key={colIndex}>{perk ? perk.name : "N/A"}</td>;
                                        } else if (col === "currentValue") {
                                            return (
                                                <td key={colIndex}>
                                                    <b>
                                                        <span style={{
                                                            color: item.currentValue ? "green" : "red"
                                                        }}>{"" + item.currentValue}</span>
                                                    </b>
                                                </td>
                                            )
                                        } else {
                                            return <td key={colIndex}>{"" + item[col]}</td>;
                                        }
                                    })}
                                </tr>
                            )
                        }}
                    ></DynamicDataTable>
                </div>
            </div>
        </>
    )
}

export default Admin
