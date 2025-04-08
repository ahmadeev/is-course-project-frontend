import Navbar from "../../../components/_DBD/Navbar/Navbar.jsx";
import styles from "./Main.module.css";
import React, {useEffect, useState} from "react";
import {useData} from "../../../components/_DBD/utils/DataProvider.jsx";
import DynamicDataTable from "../../../components/_DBD/Table/DynamicDataTable.jsx";
import {crudCreate, crudDelete, crudReadMany} from "../../../utils/crud.js";
import ToggleSwitch from "../../../components/_Common/ToggleSwitch/ToggleSwitch.jsx";
import {useAuth} from "../../../components/_DBD/utils/AuthProvider.jsx";
import Modal from "../../../components/_Common/Modal/Modal.jsx";
import TagList from "../../../components/_DBD/TagList/TagList.jsx";
import BuildCard from "../../../components/_DBD/BuildCard/BuildCard.jsx";

function Main({ pageTitle }) {
    // const BASE_URL = "http://localhost:25000/is-course-project-1.0-SNAPSHOT/api";
    const { BASE_URL } = useData();

    useEffect(() => {
        document.title = pageTitle;
    })

    const { hasRole } = useAuth();

    const [characterState, setCharacterState] = useState("killer");
    const [typeState, setTypeState] = useState("build");

    const {killerPerks, survivorPerks} = useData();
    const { favoriteKillerBuildIds, favoriteSurvivorBuildIds, setFavoriteKillerBuildIds, setFavoriteSurvivorBuildIds, setIsFavoriteLoaded } = useData();

    const [reloadKillerPerksTable, setReloadKillerPerksTable] = useState(false);
    const [reloadSurvivorPerksTable, setReloadSurvivorPerksTable] = useState(false);

    const [reloadKillerBuildTable, setReloadKillerBuildTable] = useState(false);
    const [reloadSurvivorBuildTable, setReloadSurvivorBuildTable] = useState(false);

    const [isBuildTagModalOpen, setIsBuildTagModalOpen] = useState(false);
    const [currentBuild, setCurrentBuild] = useState(null);
    const [currentBuildData, setCurrentBuildData] = useState(null);
    const [currentBuildTagInput, setCurrentBuildTagInput] = useState("");
    const [isTagListReloaded, setIsTagListReloaded] = useState(true);

    const [currentBuildRatingData, setCurrentBuildRatingData] = useState(null);

    const rowOnClick = (item) => {
        setCurrentBuild(item);
        setIsBuildTagModalOpen(true);
    }

    useEffect(() => {
        if (currentBuild === null) return;
        const fetchData = async () => {
            await fetch(`${BASE_URL}/tag/build/${characterState}?build=${currentBuild.id}`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('session-token')}`
                }
            })
                .then((res) => res.json())
                .then((result) => {
                    setCurrentBuildData(result.data);
                })
                .catch((err) => {
                    console.error(err)
                })
        }
        fetchData();

        const fetchRating = async () => {
            await fetch(`${BASE_URL}/build/${characterState}/rating?build=${currentBuild.id}`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('session-token')}`
                }
            })
                .then((res) => res.json())
                .then((result) => {
                    setCurrentBuildRatingData(result.data);
                })
                .catch((err) => {
                    console.error(err)
                })
        }
        fetchRating();
    }, [currentBuild, isTagListReloaded]);

    return (
        <>
            <Navbar/>
            <div className={styles.wrapper}>

                <div className={styles.container + " " + styles.centerer}>
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
                </div>

                {characterState === "killer" && typeState === "perk" && (
                    <>
                        {/* killer perk table */}
                        <DynamicDataTable
                            fetchData={crudReadMany}
                            baseUrl={`${BASE_URL}/perk/killer`}
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
                            baseUrl={`${BASE_URL}/perk/survivor`}
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
                            baseUrl={`${BASE_URL}/build/killer`}
                            tableReloadParentState={reloadKillerBuildTable}
                            setTableReloadParentState={setReloadKillerBuildTable}
                            columns={["id", "perk 1", "perk 2", "perk 3", "perk 4", "rating", "usageCount", "approvedByAdmin", "favorite"]}

                            renderRow={(item, rowIndex) => {
                                let columns= ["id", "perk 1", "perk 2", "perk 3", "perk 4", "rating", "usageCount", "approvedByAdmin", "favorite"];

                                return (
                                    <tr
                                        onClick={() => {
                                            rowOnClick(item);
                                        }}
                                        key={item.id || rowIndex}
                                    >
                                        {columns.map((col, colIndex) => {
                                            if (col.startsWith("perk")) {
                                                const perkIndex = parseInt(col.split(" ")[1]) - 1; // "perk 1" -> 0
                                                const perk = item.perks[perkIndex];
                                                return <td key={colIndex}>{perk ? perk.name : "N/A"}</td>;
                                            } else if (col === "rating") {
                                                return (
                                                    <td key={colIndex}>
                                                        {item.rating + "*"}
                                                    </td>
                                                )} else if (col === "approvedByAdmin") {
                                                    return (
                                                        <td
                                                            onClick={(e) => {
                                                                if (hasRole("ROLE_ADMIN")) e.stopPropagation();
                                                            }}
                                                            key={colIndex}
                                                        >
                                                            {
                                                                hasRole("ROLE_ADMIN") && (
                                                                    <input type="checkbox" checked={item.approvedByAdmin}
                                                                           onChange={async (e) => {
                                                                               e.stopPropagation();
                                                                               const response = await fetch(
                                                                                   `${BASE_URL}/build/killer/${item.id}/approve?approved=${!item.approvedByAdmin}`,
                                                                                   {
                                                                                       method: "PUT",
                                                                                       headers: {
                                                                                           'Authorization': `Bearer ${sessionStorage.getItem('session-token')}`
                                                                                       }
                                                                                   }
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
                                                    <td
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                        }}
                                                        key={colIndex}
                                                    >
                                                        <button
                                                            className={favoriteKillerBuildIds?.includes(Number(item.id)) ? styles.inFavorite : styles.notInFavorite}
                                                            onClick={async (e) => {
                                                                e.stopPropagation();
                                                                const isAboutToAdd = !favoriteKillerBuildIds?.includes(Number(item.id));
                                                                try {
                                                                    if (isAboutToAdd) {
                                                                        const response = await fetch(
                                                                                `${BASE_URL}/favorites/build/killer/${item.id}`,
                                                                                {
                                                                                    method: "POST",
                                                                                    headers: {
                                                                                        'Authorization': `Bearer ${sessionStorage.getItem('session-token')}`
                                                                                    }
                                                                                }
                                                                            );
                                                                            const result = await response.json();
                                                                            if (result.status === "SUCCESS") {
                                                                                setFavoriteKillerBuildIds(prev => [...prev, Number(item.id)]);
                                                                            }
                                                                        } else {
                                                                            const response = await fetch(
                                                                                `${BASE_URL}/favorites/build/killer/${item.id}`,
                                                                                {
                                                                                    method: "DELETE",
                                                                                    headers: {
                                                                                        'Authorization': `Bearer ${sessionStorage.getItem('session-token')}`
                                                                                    }
                                                                                }
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
                                                            >{favoriteKillerBuildIds?.includes(item.id) ? <i className="fas fa-heart"></i> : <i className="far fa-heart"></i>}
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
                            baseUrl={`${BASE_URL}/build/survivor`}
                            tableReloadParentState={reloadSurvivorBuildTable}
                            setTableReloadParentState={setReloadSurvivorBuildTable}
                            columns={["id", "perk 1", "perk 2", "perk 3", "perk 4", "rating", "usageCount", "approvedByAdmin", "favorite"]}

                            renderRow={(item, rowIndex) => {
                                let columns = ["id", "perk 1", "perk 2", "perk 3", "perk 4", "rating", "usageCount", "approvedByAdmin", "favorite"];

                                return (
                                    <tr
                                        onClick={() => {
                                            rowOnClick(item);
                                        }}
                                        key={item.id || rowIndex}
                                    >
                                        {columns.map((col, colIndex) => {
                                            if (col.startsWith("perk")) {
                                                const perkIndex = parseInt(col.split(" ")[1]) - 1; // "perk 1" -> 0
                                                const perk = item.perks[perkIndex];
                                                return <td key={colIndex}>{perk ? perk.name : "N/A"}</td>;
                                            } else if (col === "rating") {
                                                return (
                                                    <td key={colIndex}>
                                                        {item.rating + "*"}
                                                    </td>
                                                );
                                            } else if (col === "approvedByAdmin") {
                                                return (
                                                    <td
                                                        onClick={(e) => {
                                                            if (hasRole("ROLE_ADMIN")) e.stopPropagation();
                                                        }}
                                                        key={colIndex}
                                                    >
                                                        {
                                                            hasRole("ROLE_ADMIN") && (
                                                                <input type="checkbox" checked={item.approvedByAdmin}
                                                                       onChange={async (e) => {
                                                                           e.stopPropagation();
                                                                           const response = await fetch(
                                                                               `${BASE_URL}/build/survivor/${item.id}/approve?approved=${!item.approvedByAdmin}`,
                                                                               {
                                                                                   method: "PUT",
                                                                                   headers: {
                                                                                       'Authorization': `Bearer ${sessionStorage.getItem('session-token')}`
                                                                                   }
                                                                               }
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
                                                    <td
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                        }}
                                                        key={colIndex}
                                                    >
                                                        <button
                                                            className={favoriteSurvivorBuildIds?.includes(Number(item.id)) ? styles.inFavorite : styles.notInFavorite}
                                                            onClick={async (e) => {
                                                                e.stopPropagation();
                                                                const isAboutToAdd = !favoriteSurvivorBuildIds?.includes(Number(item.id));
                                                                try {
                                                                    if (isAboutToAdd) {
                                                                        const response = await fetch(
                                                                            `${BASE_URL}/favorites/build/survivor/${item.id}`,
                                                                            {
                                                                                method: "POST",
                                                                                headers: {
                                                                                    'Authorization': `Bearer ${sessionStorage.getItem('session-token')}`
                                                                                }
                                                                            }
                                                                        );
                                                                        const result = await response.json();
                                                                        if (result.status === "SUCCESS") {
                                                                            setFavoriteSurvivorBuildIds(prev => [...prev, Number(item.id)]);
                                                                        }
                                                                    } else {
                                                                        const response = await fetch(
                                                                            `${BASE_URL}/favorites/build/survivor/${item.id}`,
                                                                            {
                                                                                method: "DELETE",
                                                                                headers: {
                                                                                    'Authorization': `Bearer ${sessionStorage.getItem('session-token')}`
                                                                                }
                                                                            }
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
                                                        >{favoriteSurvivorBuildIds?.includes(item.id) ? <i className="fas fa-heart"></i> : <i className="far fa-heart"></i>}
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


                <Modal
                    active={isBuildTagModalOpen}
                    setActive={setIsBuildTagModalOpen}
                >
                    {
                        currentBuild && (
                            <BuildCard
                                data={currentBuild}
                                characterState={characterState}
                            />
                        )
                    }

                    <h2>Комментарии</h2>

                    {
                        // TODO: оптимистичное обновление для тегов можно сделать
                        currentBuildData && (
                            <TagList
                                tagsData={currentBuildData}
                                onTagClick={(tag) => {
                                    fetch(`${BASE_URL}/tag/build/${characterState}`, {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            'Authorization': `Bearer ${sessionStorage.getItem('session-token')}`
                                        },
                                        body: JSON.stringify({build: {id: currentBuild.id}, tag: tag}),
                                    })
                                        .then((res) => res.json())
                                        .then((result) => {
                                            setIsTagListReloaded(prev => !prev);
                                        })
                                        .catch((error) => {
                                            console.error(error);
                                        })
                                }}
                            />
                        )
                    }
                    {/* глюк с этой строчкой ниже при повторном клике */}
                    {
                        !currentBuildData && <p>Данные отсутствуют!</p>
                    }
                    {
                        currentBuildData !== null && currentBuildData.length === 0 && <p>Комментарии отсутствуют!</p>
                    }
                    {
                        currentBuildData && (
                            <>
                                <select
                                    value={currentBuildRatingData?.rating || 0}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                    onChange={async (e) => {
                                        const newRating = e.target.value;
                                        try {
                                            const response = await fetch(
                                                `${BASE_URL}/build/${characterState}/${currentBuild.id}/rating?rating=${newRating}`,
                                                {
                                                    method: "PATCH",
                                                    // headers: { "Content-Type": "application/json" },
                                                    // body: JSON.stringify({ rating: newRating })
                                                    headers: {
                                                        'Authorization': `Bearer ${sessionStorage.getItem('session-token')}`
                                                    }
                                                }
                                            );
                                            const result = await response.json();
                                            if (result.status === "SUCCESS") {
                                                (characterState === "survivor" ? setReloadSurvivorBuildTable : setReloadKillerBuildTable)(prev => !prev);
                                            }
                                        } catch (error) {
                                            console.error("Ошибка при обновлении рейтинга:", error);
                                        } finally {
                                            setIsTagListReloaded(prev => !prev);
                                        }
                                    }}
                                >
                                    <option disabled value={0}>0</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                        <option key={num} value={num}>{num}</option>
                                    ))}
                                </select>
                                <input type="text" placeholder="от 3 до 10 символов" onChange={(e) => {
                                    setCurrentBuildTagInput(e.target.value);
                                }}/>
                                <button onClick={() => {
                                    fetch(`${BASE_URL}/tag/build/${characterState}`, {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            'Authorization': `Bearer ${sessionStorage.getItem('session-token')}`
                                        },
                                        body: JSON.stringify({build: {id: currentBuild.id}, tag: currentBuildTagInput}),
                                    })
                                        .then((res) => res.json())
                                        .then((result) => {
                                            setIsTagListReloaded(prev => !prev);
                                        })
                                        .catch((error) => {
                                            console.error(error);
                                        })
                                }}>Отправить
                                </button>
                                <br/>
                            </>
                        )
                    }

                    <button onClick={() => setIsBuildTagModalOpen(false)}>Закрыть</button>
                </Modal>

            </div>
        </>
    )
}

export default Main
