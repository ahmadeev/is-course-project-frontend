import Navbar from "../../../components/_DBD/Navbar/Navbar.jsx";
import styles from "./Main.module.css";
import React, {useEffect, useState} from "react";
import {useData} from "../../../components/_DBD/utils/DataProvider.jsx";
import DynamicDataTable from "../../../components/_DBD/Table/DynamicDataTable.jsx";
import {crudCreate, crudDelete, crudReadMany} from "../../../utils/crud.js";
import ToggleSwitch from "../../../components/_Common/ToggleSwitch/ToggleSwitch.jsx";

function Main({ pageTitle }) {

    useEffect(() => {
        document.title = pageTitle;
    })

    const [characterState, setCharacterState] = useState("killer");
    const [typeState, setTypeState] = useState("build");

    const {killerPerks, survivorPerks} = useData();
    const { favoriteKillerBuildIds, favoriteSurvivorBuildIds, setFavoriteKillerBuildIds, setFavoriteSurvivorBuildIds, setIsFavoriteLoaded } = useData();

    const [reloadKillerPerksTable, setReloadKillerPerksTable] = useState(false);
    const [reloadSurvivorPerksTable, setReloadSurvivorPerksTable] = useState(false);

    const [reloadKillerBuildTable, setReloadKillerBuildTable] = useState(false);
    const [reloadSurvivorBuildTable, setReloadSurvivorBuildTable] = useState(false);

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

                <ToggleSwitch
                    options={[
                        {label: "Build", value: "build"},
                        {label: "Perk", value: "perk"}
                    ]}
                    selected={typeState}
                    onChange={setTypeState}
                />

                {characterState === "killer" && typeState === "perk" && (
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

                {characterState === "survivor" && typeState === "perk" && (
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

                {characterState === "killer" && typeState === "build" && (
                    <>
                        {/* killer build table */}
                        <DynamicDataTable
                            fetchData={crudReadMany}
                            baseUrl="http://localhost:25000/is-course-project-1.0-SNAPSHOT/api/build/killer"
                            tableReloadParentState={reloadKillerBuildTable}
                            setTableReloadParentState={setReloadKillerBuildTable}
                            columns={["id", "perk 1", "perk 2", "perk 3", "perk 4", "rating", "usageCount", "approvedByAdmin", "favorite"]}

                            renderRow={(item, rowIndex) => {
                                let columns= ["id", "perk 1", "perk 2", "perk 3", "perk 4", "rating", "usageCount", "approvedByAdmin", "favorite"];

                                return (
                                    <tr key={item.id || rowIndex}>
                                        {columns.map((col, colIndex) => {
                                            if (col.startsWith("perk")) {
                                                const perkIndex = parseInt(col.split(" ")[1]) - 1; // Например, "perk 1" -> 0
                                                const perk = item.perks[perkIndex];
                                                return <td key={colIndex}>{perk ? perk.name : "N/A"}</td>;
                                            } else if (col.startsWith("favorite")) {
                                                return (
                                                    <td key={colIndex}>
                                                        <button
                                                            className={favoriteKillerBuildIds?.includes(Number(item.id)) ? styles.inFavorite : styles.notInFavorite}
                                                            onClick={async () => {
                                                                const isAboutToAdd = !favoriteKillerBuildIds?.includes(Number(item.id));
                                                                try {
                                                                    if (isAboutToAdd) {
                                                                        const response = await fetch(
                                                                            `http://localhost:25000/is-course-project-1.0-SNAPSHOT/api/favorites/build/killer/${item.id}`,
                                                                            {method: "POST"}
                                                                        );
                                                                        const result = await response.json();
                                                                        if (result.status === "SUCCESS") {
                                                                            setFavoriteKillerBuildIds(prev => [...prev, Number(item.id)]);
                                                                        }
                                                                    } else {
                                                                        const response = await fetch(
                                                                            `http://localhost:25000/is-course-project-1.0-SNAPSHOT/api/favorites/build/killer/${item.id}`,
                                                                            {method: "DELETE"}
                                                                        );
                                                                        const result = await response.json();
                                                                        if (result.status === "SUCCESS") {
                                                                            setFavoriteKillerBuildIds(prev => prev.filter(id => id !== Number(item.id)));
                                                                        }
                                                                    }
                                                                } catch (error) {
                                                                    console.error("Ошибка:", error);
                                                                    setIsFavoriteLoaded(false); // Рефетч при ошибке
                                                                }
                                                            }}
                                                        >add
                                                        </button>
                                                    </td>
                                                );
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

                {characterState === "survivor" && typeState === "build" && (
                    <>
                        {/* survivor build table */}
                        <DynamicDataTable
                            fetchData={crudReadMany}
                            baseUrl="http://localhost:25000/is-course-project-1.0-SNAPSHOT/api/build/survivor"
                            tableReloadParentState={reloadSurvivorBuildTable}
                            setTableReloadParentState={setReloadSurvivorBuildTable}
                            columns={["id", "perk 1", "perk 2", "perk 3", "perk 4", "rating", "usageCount", "approvedByAdmin", "favorite"]}
                            renderRow={(item, rowIndex) => {
                                let columns = ["id", "perk 1", "perk 2", "perk 3", "perk 4", "rating", "usageCount", "approvedByAdmin", "favorite"];

                                return (
                                    <tr key={item.id || rowIndex}>
                                        {columns.map((col, colIndex) => {
                                            if (col.startsWith("perk")) {
                                                const perkIndex = parseInt(col.split(" ")[1]) - 1; // Например, "perk 1" -> 0
                                                const perk = item.perks[perkIndex];
                                                return <td key={colIndex}>{perk ? perk.name : "N/A"}</td>;
                                            } else if (col.startsWith("favorite")) {
                                                return (
                                                    <td key={colIndex}>
                                                        <button
                                                            className={favoriteSurvivorBuildIds?.includes(Number(item.id)) ? styles.inFavorite : styles.notInFavorite}
                                                            onClick={async () => {
                                                                const isAboutToAdd = !favoriteSurvivorBuildIds?.includes(Number(item.id));
                                                                try {
                                                                    if (isAboutToAdd) {
                                                                        const response = await fetch(
                                                                            `http://localhost:25000/is-course-project-1.0-SNAPSHOT/api/favorites/build/survivor/${item.id}`,
                                                                            {method: "POST"}
                                                                        );
                                                                        const result = await response.json();
                                                                        if (result.status === "SUCCESS") {
                                                                            setFavoriteSurvivorBuildIds(prev => [...prev, Number(item.id)]);
                                                                        }
                                                                    } else {
                                                                        const response = await fetch(
                                                                            `http://localhost:25000/is-course-project-1.0-SNAPSHOT/api/favorites/build/survivor/${item.id}`,
                                                                            {method: "DELETE"}
                                                                        );
                                                                        const result = await response.json();
                                                                        if (result.status === "SUCCESS") {
                                                                            setFavoriteSurvivorBuildIds(prev => prev.filter(id => id !== Number(item.id)));
                                                                        }
                                                                    }
                                                                } catch (error) {
                                                                    console.error("Ошибка:", error);
                                                                    setIsFavoriteLoaded(false); // Рефетч при ошибке
                                                                }
                                                            }}
                                                        >add
                                                        </button>
                                                    </td>
                                                );
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
