import Navbar from "../../../components/_DBD/Navbar/Navbar.jsx";
import styles from "./Id.module.css";
import React, {useEffect, useState} from "react";
import DynamicDataTable from "../../../components/_DBD/Table/DynamicDataTable.jsx";
import {crudReadMany} from "../../../utils/crud.js";
import {useData} from "../../../components/_DBD/utils/DataProvider.jsx";
import ToggleSwitch from "../../../components/_Common/ToggleSwitch/ToggleSwitch.jsx";
import {useAuth} from "../../../components/_DBD/utils/AuthProvider.jsx";
import CollapseToggleSwitch from "../../../components/_Common/CollapseToggleSwitch/CollapseToggleSwitch.jsx";
import TagList from "../../../components/_DBD/TagList/TagList.jsx";
import Modal from "../../../components/_Common/Modal/Modal.jsx";

function Id({ pageTitle }) {
    // const BASE_URL = "http://localhost:25000/is-course-project-1.0-SNAPSHOT/api";
    const { BASE_URL } = useData();

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
            await fetch(`${BASE_URL}/tag/build/${favoriteCharacterState}?build=${currentBuild.id}`, {
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
            await fetch(`${BASE_URL}/build/${favoriteCharacterState}/rating?build=${currentBuild.id}`, {
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
                {!foldFavorites && (
                    <>
                        {/* survivor build table */}
                        <DynamicDataTable
                            fetchData={crudReadMany}
                            baseUrl={`${BASE_URL}/favorites/build/${favoriteCharacterState}`}
                            tableReloadParentState={favoriteCharacterState === "survivor" ? reloadSurvivorBuildTable : reloadKillerBuildTable}
                            setTableReloadParentState={favoriteCharacterState === "survivor" ? setReloadSurvivorBuildTable : setReloadKillerBuildTable}
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
                                                                       onChange={async () => {
                                                                           const response = await fetch(
                                                                               `${BASE_URL}/build/${favoriteCharacterState}/${item.id}/approve?approved=${!item.approvedByAdmin}`,
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
                                                            className={(favoriteCharacterState === "survivor" ? favoriteSurvivorBuildIds : favoriteKillerBuildIds)?.includes(Number(item.id)) ? styles.inFavorite : styles.notInFavorite}
                                                            onClick={async () => {
                                                                const isAboutToAdd = !(favoriteCharacterState === "survivor" ? favoriteSurvivorBuildIds : favoriteKillerBuildIds)?.includes(Number(item.id));
                                                                try {
                                                                    if (isAboutToAdd) {
                                                                        const response = await fetch(
                                                                            `${BASE_URL}/favorites/build/${favoriteCharacterState}/${item.id}`,
                                                                            {
                                                                                method: "POST",
                                                                                headers: {
                                                                                    'Authorization': `Bearer ${sessionStorage.getItem('session-token')}`
                                                                                }
                                                                            }
                                                                        );
                                                                        const result = await response.json();
                                                                        if (result.status === "SUCCESS") {
                                                                            (favoriteCharacterState === "survivor" ? setFavoriteSurvivorBuildIds : setFavoriteKillerBuildIds)(prev => [...prev, Number(item.id)]);
                                                                        }
                                                                    } else {
                                                                        const response = await fetch(
                                                                            `${BASE_URL}/favorites/build/${favoriteCharacterState}/${item.id}`,
                                                                            {method: "DELETE"}
                                                                        );
                                                                        const result = await response.json();
                                                                        if (result.status === "SUCCESS") {
                                                                            (favoriteCharacterState === "survivor" ? setFavoriteSurvivorBuildIds : setFavoriteKillerBuildIds)(prev => prev.filter(id => id !== Number(item.id)));
                                                                        }
                                                                    }
                                                                } catch (error) {
                                                                    console.error("Ошибка:", error);
                                                                    setIsFavoriteLoaded(false); // рефетч при ошибке
                                                                }
                                                            }}
                                                        >{(favoriteCharacterState === "survivor" ? favoriteSurvivorBuildIds : favoriteKillerBuildIds)?.includes(item.id) ?
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

                {!foldMatches && (
                    <DynamicDataTable
                        fetchData={crudReadMany}
                        baseUrl={`${BASE_URL}/match/${matchCharacterState}`}
                        tableReloadParentState={matchCharacterState === "survivor" ? reloadSurvivorMatchTable : reloadKillerMatchTable}
                        setTableReloadParentState={matchCharacterState === "survivor" ? setReloadSurvivorMatchTable : setReloadKillerMatchTable}
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

                <Modal
                    active={isBuildTagModalOpen}
                    setActive={setIsBuildTagModalOpen}
                >
                    <h2>Комментарии</h2>

                    {
                        // TODO: оптимистичное обновление для тегов можно сделать
                        currentBuildData && (
                            <TagList
                                tagsData={currentBuildData}
                                onTagClick={(tag) => {
                                    fetch(`${BASE_URL}/tag/build/${favoriteCharacterState}`, {
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
                                                `${BASE_URL}/build/${favoriteCharacterState}/${currentBuild.id}/rating?rating=${newRating}`,
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
                                                (favoriteCharacterState === "survivor" ? setReloadSurvivorBuildTable : setReloadKillerBuildTable)(prev => !prev);
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
                                    fetch(`${BASE_URL}/tag/build/${favoriteCharacterState}`, {
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

export default Id;
