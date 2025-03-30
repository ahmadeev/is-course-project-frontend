import Navbar from "../../../components/_DBD/Navbar/Navbar.jsx";
import styles from "./Id.module.css";
import React, {useEffect, useState} from "react";
import DynamicDataTable from "../../../components/_DBD/Table/DynamicDataTable.jsx";
import {crudReadMany} from "../../../utils/crud.js";
import {useData} from "../../../components/_DBD/utils/DataProvider.jsx";
import ToggleSwitch from "../../../components/_Common/ToggleSwitch/ToggleSwitch.jsx";
import {useAuth} from "../../../components/_DBD/utils/AuthProvider.jsx";
import CollapseToggleSwitch from "../../../components/_Common/CollapseToggleSwitch/CollapseToggleSwitch.jsx";

function Id({ pageTitle }) {
    const BASE_URL = "http://localhost:25000/is-course-project-1.0-SNAPSHOT/api";

    useEffect(() => {
        document.title = pageTitle;
    })

    const [foldFavorites, setFoldFavorites] = useState(true);
    const [favoriteCharacterState, setFavoriteCharacterState] = useState("killer");
    // ------
    const { favoriteKillerBuildIds, favoriteSurvivorBuildIds, setFavoriteKillerBuildIds, setFavoriteSurvivorBuildIds, setIsFavoriteLoaded } = useData();

    const [reloadKillerBuildTable, setReloadKillerBuildTable] = useState(false);
    const [reloadSurvivorBuildTable, setReloadSurvivorBuildTable] = useState(false);

    const { hasRole } = useAuth();
    // ------
    const [foldMatches, setFoldMatches] = useState(true);
    const [matchCharacterState, setMatchCharacterState] = useState("killer");
    // ------
    const [reloadKillerMatchTable, setReloadKillerMatchTable] = useState(false);
    const [reloadSurvivorMatchTable, setReloadSurvivorMatchTable] = useState(false);
    // ------

    return (
        <>
            <Navbar/>
            <div className={styles.wrapper}>

                {/*                <ToggleSwitch
                    options={[
                        {label: "Fold", value: true},
                        {label: "Unfold", value: false}
                    ]}
                    selected={foldFavorites}
                    onChange={setFoldFavorites}
                />*/}

                <div className={styles.switch_container}>
                    <CollapseToggleSwitch
                        isOpen={foldFavorites}
                        onToggle={() => setFoldFavorites(!foldFavorites)}
                    />
                    <ToggleSwitch
                        options={[
                            {label: "Killer", value: "killer"},
                            {label: "Survivor", value: "survivor"}
                        ]}
                        selected={favoriteCharacterState}
                        onChange={setFavoriteCharacterState}
                    />
                </div>

                {/*
                    TODO: удалять из таблицы после удаления из избранного, сделать стили.
                    TODO: таблица отличается только урлами от родительской
                */}
                {!foldFavorites && favoriteCharacterState === "killer" && (
                    <>
                        {/* killer build table */}
                        <DynamicDataTable
                            fetchData={crudReadMany}
                            baseUrl={`${BASE_URL}/favorites/build/killer`}
                            tableReloadParentState={reloadKillerBuildTable}
                            setTableReloadParentState={setReloadKillerBuildTable}
                            columns={["id", "perk 1", "perk 2", "perk 3", "perk 4", "rating", "usageCount", "approvedByAdmin", "favorite"]}

                            renderRow={(item, rowIndex) => {
                                let columns = ["id", "perk 1", "perk 2", "perk 3", "perk 4", "rating", "usageCount", "approvedByAdmin", "favorite"];

                                return (
                                    <tr key={item.id || rowIndex}>
                                        {columns.map((col, colIndex) => {
                                            if (col.startsWith("perk")) {
                                                const perkIndex = parseInt(col.split(" ")[1]) - 1; // "perk 1" -> 0
                                                const perk = item.perks[perkIndex];
                                                return <td key={colIndex}>{perk ? perk.name : "N/A"}</td>;
                                            } else if (col === "rating") {
                                                return (
                                                    <td key={colIndex}>
                                                        <select
                                                            value={item.rating || 0}
                                                            onChange={async (e) => {
                                                                const newRating = e.target.value;
                                                                try {
                                                                    const response = await fetch(
                                                                        `${BASE_URL}/build/killer/${item.id}/rating?rating=${newRating}`,
                                                                        {
                                                                            method: "PATCH",
                                                                            // headers: { "Content-Type": "application/json" },
                                                                            // body: JSON.stringify({ rating: newRating })
                                                                        }
                                                                    );
                                                                    const result = await response.json();
                                                                    if (result.status === "SUCCESS") {
                                                                        setReloadKillerBuildTable(prev => !prev);
                                                                    }
                                                                } catch (error) {
                                                                    console.error("Ошибка при обновлении рейтинга:", error);
                                                                }
                                                            }}
                                                        >
                                                            <option disabled value={0}>0</option>
                                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                                                <option key={num} value={num}>{num}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                )
                                            } else if (col === "approvedByAdmin") {
                                                return (
                                                    <td key={colIndex}>
                                                        {
                                                            hasRole("ROLE_ADMIN") && (
                                                                <input type="checkbox" checked={item.approvedByAdmin}
                                                                       onChange={async () => {
                                                                           const response = await fetch(
                                                                               `${BASE_URL}/build/killer/${item.id}/approve?approved=${!item.approvedByAdmin}`,
                                                                               {method: "PUT"}
                                                                           );
                                                                           /*const result = await response.json();
                                                                           if (result.status === "SUCCESS") {
                                                                               // оптимистичное обновление можно сделать
                                                                           }*/
                                                                           setReloadKillerBuildTable(prev => !prev);
                                                                       }}/>
                                                            )
                                                        }
                                                        {
                                                            !hasRole("ROLE_ADMIN") && (
                                                                "" + item.approvedByAdmin
                                                            )
                                                        }

                                                    </td>
                                                )
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
                                                                            `${BASE_URL}/favorites/build/killer/${item.id}`,
                                                                            {method: "POST"}
                                                                        );
                                                                        const result = await response.json();
                                                                        if (result.status === "SUCCESS") {
                                                                            setFavoriteKillerBuildIds(prev => [...prev, Number(item.id)]);
                                                                        }
                                                                    } else {
                                                                        const response = await fetch(
                                                                            `${BASE_URL}/favorites/build/killer/${item.id}`,
                                                                            {method: "DELETE"}
                                                                        );
                                                                        const result = await response.json();
                                                                        if (result.status === "SUCCESS") {
                                                                            setFavoriteKillerBuildIds(prev => prev.filter(id => id !== Number(item.id)));
                                                                        }
                                                                    }
                                                                } catch (error) {
                                                                    console.error("Ошибка:", error);
                                                                    setIsFavoriteLoaded(false); // рефетч в глобальном компоненте при ошибке
                                                                }
                                                            }}
                                                        >{favoriteKillerBuildIds?.includes(item.id) ?
                                                            <i className="fas fa-heart"></i> :
                                                            <i className="far fa-heart"></i>}
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

                {!foldFavorites && favoriteCharacterState === "survivor" && (
                    <>
                        {/* survivor build table */}
                        <DynamicDataTable
                            fetchData={crudReadMany}
                            baseUrl={`${BASE_URL}/favorites/build/survivor`}
                            tableReloadParentState={reloadSurvivorBuildTable}
                            setTableReloadParentState={setReloadSurvivorBuildTable}
                            columns={["id", "perk 1", "perk 2", "perk 3", "perk 4", "rating", "usageCount", "approvedByAdmin", "favorite"]}
                            renderRow={(item, rowIndex) => {
                                let columns = ["id", "perk 1", "perk 2", "perk 3", "perk 4", "rating", "usageCount", "approvedByAdmin", "favorite"];

                                return (
                                    <tr key={item.id || rowIndex}>
                                        {columns.map((col, colIndex) => {
                                            if (col.startsWith("perk")) {
                                                const perkIndex = parseInt(col.split(" ")[1]) - 1; // "perk 1" -> 0
                                                const perk = item.perks[perkIndex];
                                                return <td key={colIndex}>{perk ? perk.name : "N/A"}</td>;
                                            } else if (col === "rating") {
                                                return (
                                                    <td key={colIndex}>
                                                        <select
                                                            value={item.rating || 0}
                                                            onChange={async (e) => {
                                                                const newRating = e.target.value;
                                                                try {
                                                                    const response = await fetch(
                                                                        `${BASE_URL}/build/survivor/${item.id}/rating?rating=${newRating}`,
                                                                        {
                                                                            method: "PATCH",
                                                                            //headers: { "Content-Type": "application/json" },
                                                                            //body: JSON.stringify({ rating: newRating })
                                                                        }
                                                                    );
                                                                    const result = await response.json();
                                                                    if (result.status === "SUCCESS") {
                                                                        setReloadSurvivorBuildTable(prev => !prev);
                                                                    }
                                                                } catch (error) {
                                                                    console.error("Ошибка при обновлении рейтинга:", error);
                                                                }
                                                            }}
                                                        >
                                                            <option disabled value={0}>0</option>
                                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                                                <option key={num} value={num}>{num}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                );
                                            } else if (col === "approvedByAdmin") {
                                                return (
                                                    <td key={colIndex}>
                                                        {
                                                            hasRole("ROLE_ADMIN") && (
                                                                <input type="checkbox" checked={item.approvedByAdmin}
                                                                       onChange={async () => {
                                                                           const response = await fetch(
                                                                               `${BASE_URL}/build/survivor/${item.id}/approve?approved=${!item.approvedByAdmin}`,
                                                                               {method: "PUT"}
                                                                           );
                                                                           /*const result = await response.json();
                                                                           if (result.status === "SUCCESS") {
                                                                               // оптимистичное обновление можно сделать
                                                                           }*/
                                                                           setReloadSurvivorBuildTable(prev => !prev);
                                                                       }}/>
                                                            )
                                                        }
                                                        {
                                                            !hasRole("ROLE_ADMIN") && (
                                                                "" + item.approvedByAdmin
                                                            )
                                                        }

                                                    </td>
                                                )
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
                                                                            `${BASE_URL}/favorites/build/survivor/${item.id}`,
                                                                            {method: "POST"}
                                                                        );
                                                                        const result = await response.json();
                                                                        if (result.status === "SUCCESS") {
                                                                            setFavoriteSurvivorBuildIds(prev => [...prev, Number(item.id)]);
                                                                        }
                                                                    } else {
                                                                        const response = await fetch(
                                                                            `${BASE_URL}/favorites/build/survivor/${item.id}`,
                                                                            {method: "DELETE"}
                                                                        );
                                                                        const result = await response.json();
                                                                        if (result.status === "SUCCESS") {
                                                                            setFavoriteSurvivorBuildIds(prev => prev.filter(id => id !== Number(item.id)));
                                                                        }
                                                                    }
                                                                } catch (error) {
                                                                    console.error("Ошибка:", error);
                                                                    setIsFavoriteLoaded(false); // рефетч при ошибке
                                                                }
                                                            }}
                                                        >{favoriteSurvivorBuildIds?.includes(item.id) ?
                                                            <i className="fas fa-heart"></i> :
                                                            <i className="far fa-heart"></i>}
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

                <div className={styles.switch_container}>
                    <CollapseToggleSwitch
                        isOpen={foldMatches}
                        onToggle={() => setFoldMatches(!foldMatches)}
                    />
                    <ToggleSwitch
                        options={[
                            {label: "Killer", value: "killer"},
                            {label: "Survivor", value: "survivor"}
                        ]}
                        selected={matchCharacterState}
                        onChange={setMatchCharacterState}
                    />
                </div>

                {!foldMatches && matchCharacterState === "survivor" && (
                    <DynamicDataTable
                        fetchData={crudReadMany}
                        baseUrl={`${BASE_URL}/match/survivor`}
                        tableReloadParentState={reloadSurvivorMatchTable}
                        setTableReloadParentState={setReloadSurvivorMatchTable}
                        columns={["id", "perk 1", "perk 2", "perk 3", "perk 4", "won", "createdAt"]}

                        renderRow={(item, rowIndex) => {
                            let columns= ["id", "perk 1", "perk 2", "perk 3", "perk 4", "won", "createdAt"];

                            return (
                                <tr
                                    key={item.id || rowIndex}
                                >
                                    {columns.map((col, colIndex) => {
                                        if (col.startsWith("perk")) {
                                            const perkIndex = parseInt(col.split(" ")[1]) - 1; // "perk 1" -> 0
                                            const perk = item.build.perks[perkIndex];
                                            return <td key={colIndex}>{perk ? perk.name : "N/A"}</td>;
                                        } else {
                                            return <td key={colIndex}>{"" + item[col]}</td>;
                                        }
                                    })}
                                </tr>
                            )
                        }}
                    ></DynamicDataTable>
                )}

                {!foldMatches && matchCharacterState === "killer" && (
                    <DynamicDataTable
                        fetchData={crudReadMany}
                        baseUrl={`${BASE_URL}/match/killer`}
                        tableReloadParentState={reloadKillerMatchTable}
                        setTableReloadParentState={setReloadKillerMatchTable}
                        columns={["id", "perk 1", "perk 2", "perk 3", "perk 4", "won", "createdAt"]}

                        renderRow={(item, rowIndex) => {
                            let columns= ["id", "perk 1", "perk 2", "perk 3", "perk 4", "won", "createdAt"];

                            return (
                                <tr
                                    key={item.id || rowIndex}
                                >
                                    {columns.map((col, colIndex) => {
                                        if (col.startsWith("perk")) {
                                            const perkIndex = parseInt(col.split(" ")[1]) - 1; // "perk 1" -> 0
                                            const perk = item.build.perks[perkIndex];
                                            return <td key={colIndex}>{perk ? perk.name : "N/A"}</td>;
                                        } else {
                                            return <td key={colIndex}>{"" + item[col]}</td>;
                                        }
                                    })}
                                </tr>
                            )
                        }}
                    ></DynamicDataTable>
                )}

            </div>
        </>

    )
}

export default Id;
