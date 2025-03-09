import React, {useState, useEffect, useRef} from 'react';
import {crudCreate, crudDelete, crudDeleteMany, crudRead, crudReadMany, crudUpdate} from "../../utils/crud.js";
import {
    CoordinatesDTO,
    DragonCaveDTO,
    DragonDTO,
    DragonHeadDTO,
    LocationDTO,
    PersonDTO
} from "../../utils/object.model.js";
import {useAuth} from "../utils/AuthProvider.jsx";
import styles from "./Table.module.css";
import CreateDragon from "../CreateDragon/CreateDragon.jsx";
import Modal from "../Modal/Modal.jsx";

const DragonTable = ({
                         fetchData,
                         readManyUrl,
                         deleteOneUrl,
                         loadDataWrapper,
                         loadDataWrapperWithoutReload,
                         tableReloadParentState,
                         setTableReloadParentState,
                         setAlertMessageParentState,
                         setAlertStatusParentState
}) => {
    // const BASE_URL = "http://localhost:8080/backend-jakarta-ee-1.0-SNAPSHOT/api/user";
    // const WS_URL = "ws://localhost:8080/backend-jakarta-ee-1.0-SNAPSHOT/ws/dragons";

    const BASE_URL = "http://localhost:8080/backend-jakarta-ee-1.0-SNAPSHOT/api/user";
    const WS_URL = "ws://localhost:8080/backend-jakarta-ee-1.0-SNAPSHOT/ws/dragons";

    const { logout } = useAuth();

    const [data, setData] = useState([]);

    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [filterValue, setFilterValue] = useState("");
    const [filterCol, setFilterCol] = useState("");
    const [sortBy, setSortBy] = useState("id");
    const [sortDir, setSortDir] = useState("ASC");

    const [isLoading, setIsLoading] = useState(true);

    // модальное окно формы апдейта и прототип для заполнения полей формы апдейта
    const [updateDragonModalActive, setUpdateDragonModalActive] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    const handlePageChange = (direction) => {
        setPage((prevPage) => prevPage + direction);
    };

    const handleSelectChange = (event, setFunction) => {
        setFunction(event.target.value);
    };

    const handleFindEvent = () => {
        setTableReloadParentState((prev) => !prev);
    }

    const handleResetEvent = () => {
        setPage(0);
        setSize(10);
        setFilterValue("");
        setFilterCol("");
        setSortBy("id");
        setSortDir("ASC");
        handleFindEvent();
    }

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetchData(readManyUrl, page, size, filterValue, filterCol, sortBy, sortDir); // асинхронно грузим страницу данных из БД

                if (!response.ok) {
                    if (response.status === 401)  {
                        console.log("Ошибка 401 при загрузке DragonTable")
                        logout();
                    }
                    throw new Error();
                }

                const responseData = await response.json();
                setData(responseData.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setTableReloadParentState(false); // вероятно, при отключении этой штуки не будет работать обновление таблицы (при массовом добавлении точно)
                setIsLoading(false);
            }
        };

        loadData();

    }, [fetchData, readManyUrl, page, size, tableReloadParentState]); // пустой -- один раз. data не добавляем, иначе луп

    // Пример создания экземпляра
    const coordinates = new CoordinatesDTO(-1, 50, 30, -1, -1, true);
    const cave = new DragonCaveDTO(-1, 15,-1, -1, true);
    const killer = new PersonDTO(-1, "killer", "WHITE", "WHITE", new LocationDTO(-1, 1, 1, 1,-1, -1, true), new Date().toISOString().split('T')[0], 200, -1, -1, true);
    const head = new DragonHeadDTO(-1, 200, 100500, -1, -1, true);

    const dragon1 = new DragonDTO(
        -1,
        "Fire Dragon",
        coordinates,
        cave,
        killer,
        Math.floor(Math.random() * (100500 - 1)) + 1,  // Age,
        "A fierce and powerful dragon", // Description
        150,  // Wingspan
        null, // No character
        head, // Dragon head
        -1,
        -1,
        true
    );

    const dragon2 = new DragonDTO(
        -1,
        "Air Dragon",
        coordinates,
        cave,
        killer,
        Math.floor(Math.random() * (100500 - 1)) + 1,  // Age,
        "A fierce and powerful dragon", // Description
        1000,  // Wingspan
        "CUNNING", // No character
        head, // Dragon head
        -1,
        -1,
        false
    );

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

    // универсально, но надо передать url ws

    const wsRef = useRef(null);

    useEffect(() => {
        wsRef.current = new WebSocket(WS_URL);

        wsRef.current.onopen = () => {
            console.log("[WS] Connection opened.")
        };

        wsRef.current.onmessage = (event) => {
            console.log("[WS] Event: ", event.data);
            setTableReloadParentState((prev) => !prev);
        };

        wsRef.current.onerror = (error) => {
            console.log("[WS] Error: ", error);
        };

        return () => {
            if (wsRef.current.current) {
                wsRef.current.close();
            }
            console.log('[WS] Connection closed.');
        };
    }, []);

    // стоп

    return (
        <>
            <button onClick={() => {
                console.log("MEOW: ", dragon1, dragon2)
                loadDataWrapper(crudCreate, [`${BASE_URL}/dragon`, Math.random() < 0.5 ? dragon1 : dragon2]);
            }}>БЫСТРОЕ СОЗДАНИЕ (ОДИН ДРАКОН)
            </button>

            <button onClick={() => {
                loadDataWrapper(crudDeleteMany, [`${BASE_URL}/dragons`]);
            }}>УДАЛИТЬ ВСЕХ ДРАКОНОВ (ТОЛЬКО МОИ)
            </button>

            <h1>Таблица данных</h1>

            {/* универсально, но нужно передать хуки состояния, columns и создать методы */}

            <div className={styles.filter_block}>
                <div className={styles.filter_block_section}>
                    <label>
                        Filter by column:
                        <select value={filterCol} onChange={(event) => {
                            handleSelectChange(event, setFilterCol);
                        }}>
                            <option value="" disabled>Select an option</option>
                            {columns && columns.map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        <input value={filterValue} onChange={(e) => setFilterValue(e.target.value)} type="text"
                               placeholder="key word"/>
                    </label>
                </div>

                <div className={styles.filter_block_section}>
                    <label>
                        Sort by column:
                        <select value={sortBy} onChange={(event) => {
                            handleSelectChange(event, setSortBy);
                        }}>
                            <option value="id">id</option>
                            {columns && columns.map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        <button
                            onClick={() => setSortDir((prev) => (prev === "ASC" ? "DESC" : "ASC"))}>{sortDir}</button>
                    </label>
                </div>
                <button onClick={handleFindEvent}>Find</button>
                <button onClick={handleResetEvent}>Reset</button>
            </div>

            {/* стоп */}

            <div className={styles.table_wrapper}>
                <table className={styles.data_table}>
                    <thead>
                    <tr>
                        <th rowSpan={3}>ID</th>
                        <th rowSpan={3}>Created By</th>
                        <th rowSpan={3}>Name</th>
                        <th colSpan={5}>Coordinates</th>
                        <th colSpan={4}>Cave</th>
                        <th colSpan={14}>Killer</th>
                        <th rowSpan={3}>Age</th>
                        <th rowSpan={3}>Description</th>
                        <th rowSpan={3}>Wingspan</th>
                        <th rowSpan={3}>Character</th>
                        <th colSpan={5}>Head</th>
                        <th rowSpan={3}>Edit</th>
                        <th rowSpan={3}>Remove</th>
                    </tr>
                    <tr>
                        <th rowSpan={2}>id</th>
                        <th rowSpan={2}>x</th>
                        <th rowSpan={2}>y</th>
                        <th rowSpan={2}>created by</th>
                        <th rowSpan={2}>updated by</th>

                        <th rowSpan={2}>id</th>
                        <th rowSpan={2}>number of treasures</th>
                        <th rowSpan={2}>created by</th>
                        <th rowSpan={2}>updated by</th>

                        <th rowSpan={2}>id</th>
                        <th rowSpan={2}>name</th>
                        <th rowSpan={2}>eye color</th>
                        <th rowSpan={2}>hair color</th>
                        <th colSpan={6}>location</th>
                        <th rowSpan={2}>birthday</th>
                        <th rowSpan={2}>height</th>
                        <th rowSpan={2}>created by</th>
                        <th rowSpan={2}>updated by</th>

                        <th rowSpan={2}>id</th>
                        <th rowSpan={2}>eyes count</th>
                        <th rowSpan={2}>tooth count</th>
                        <th rowSpan={2}>created by</th>
                        <th rowSpan={2}>updated by</th>
                    </tr>
                    <tr>
                        <th>id</th>
                        <th>x</th>
                        <th>y</th>
                        <th>z</th>
                        <th>owner id</th>
                        <th>updated by</th>
                    </tr>
                    </thead>
                    <tbody>
                    {/* вынести функцию loadDataWrapper и хуки состояния isLoading и data */}
                    {isLoading && (
                        <tr>
                            <td colSpan="37">Загрузка данных...</td>
                        </tr>
                    )}
                    {!isLoading && (!data || !data.length) && (
                        <tr>
                            <td colSpan="37">Данные отсутствуют</td>
                        </tr>
                    )}
                    {data && data.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.ownerId}</td>
                            <td>{item.name}</td>
                            <td>{item.coordinates.id}</td>
                            <td>{item.coordinates.x}</td>
                            <td>{item.coordinates.y}</td>
                            <td>{item.coordinates.ownerId}</td>
                            <td>{item.coordinates.updatedBy}</td>
                            <td>{item.cave.id}</td>
                            <td>{item.cave.numberOfTreasures}</td>
                            <td>{item.cave.ownerId}</td>
                            <td>{item.cave.updatedBy}</td>
                            <td>{item.killer?.id || "-"}</td>
                            <td>{item.killer?.name || "-"}</td>
                            <td>{item.killer?.eyeColor || "-"}</td>
                            <td>{item.killer?.hairColor || "-"}</td>
                            <td>{item.killer?.location.id || "-"}</td>
                            <td>{item.killer?.location.x || "-"}</td>
                            <td>{item.killer?.location.y || "-"}</td>
                            <td>{item.killer?.location.z || "-"}</td>
                            <td>{item.killer?.location.ownerId || "-"}</td>
                            <td>{item.killer?.location.updatedBy || "-"}</td>
                            <td>{item.killer?.birthday.join("-") || "-"}</td>
                            <td>{item.killer?.height || "-"}</td>
                            <td>{item.killer?.ownerId || "-"}</td>
                            <td>{item.killer?.updatedBy || "-"}</td>
                            <td>{item.age}</td>
                            <td>{item.description}</td>
                            <td>{item.wingspan}</td>
                            <td>{item.character || "-"}</td>
                            <td>{item.head.id}</td>
                            <td>{item.head.eyesCount}</td>
                            <td>{item.head.toothCount}</td>
                            <td>{item.head.ownerId}</td>
                            <td>{item.head.updatedBy}</td>
                            <td>
                                <button onClick={() => {
                                    setCurrentItem(item);
                                    setUpdateDragonModalActive(true);
                                }}>
                                    /
                                </button>
                            </td>
                            <td>
                                <button onClick={async () => {
                                    let res = await loadDataWrapper(crudDelete, [deleteOneUrl, item.id]);
                                    let rd = await res.json();
                                    setAlertMessageParentState("Error occurred! Details: " + rd.details);
                                    setAlertStatusParentState((prev) => !prev);
                                }}>
                                    X
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* универсально, но нужно передать хуки состояния и создать методы */}

            <div className={styles.button_block}>
                <button
                    className={styles.turn_page}
                    id="decrease-page-min"
                    onClick={() => {
                        setPage(0);
                    }} disabled={page === 0}>&lt;&lt;</button>

                <button
                    className={styles.turn_page}
                    id="decrease-page"
                    onClick={() => handlePageChange(-1)}
                    disabled={page === 0}>&lt;</button>

                <p>{page + 1}</p>

                <button
                    className={styles.turn_page}
                    id="increase-page"
                    onClick={() => {
                        handlePageChange(1);
                    }} disabled={data.length < size}>&gt;</button>

                <button
                    className={styles.turn_page}
                    id="increase-page-max"
                    onClick={() => {
                        return;
                    }} disabled={true}>&gt;&gt;</button>
            </div>

            <div className={styles.button_block}>
                <a onClick={() => setSize(10)}>10</a>
                <a onClick={() => setSize(50)}>50</a>
                <a onClick={() => setSize(100)}>100</a>
            </div>

            {/* стоп */}

            <Modal active={updateDragonModalActive} setActive={setUpdateDragonModalActive}>
                <CreateDragon
                    isToCreate={false}
                    prototype={currentItem}
                    loadDataWrapper={loadDataWrapper}
                    loadDataWrapperWithoutReload={loadDataWrapperWithoutReload}
                    tableReloadParentState={tableReloadParentState}
                    setTableReloadParentState={setTableReloadParentState}
                    setUpdateDragonModalActiveParentState={setUpdateDragonModalActive}
                />
            </Modal>

        </>
    );
};

export default DragonTable;
