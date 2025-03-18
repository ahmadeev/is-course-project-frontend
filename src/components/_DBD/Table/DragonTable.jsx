import React, {useState, useEffect, useRef} from 'react';
import {crudCreate, crudDelete, crudDeleteMany, crudRead, crudReadMany, crudUpdate} from "../../../utils/crud.js";
import {useAuth} from "../utils/AuthProvider.jsx";
import styles from "./Table.module.css";
import CreateDragon from "../CreateDragon/CreateDragon.jsx";
import Modal from "../../_Common/Modal/Modal.jsx";
import {DataProvider, useData} from "../utils/DataProvider.jsx";

const DragonTable = ({
                         baseUrl,
                         wsUrl,
                         columns,

                         fetchData,
                         readManyUrl,

                         tableReloadParentState,
                         setTableReloadParentState,

                         setAlertMessageParentState,
                         setAlertStatusParentState
}) => {
    const BASE_URL = baseUrl;
    const WS_URL = wsUrl;

    const { killerPerks, survivorPerks } = useData();

    const { logout } = useAuth();

    const [data, setData] = useState([]);

    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [filterValue, setFilterValue] = useState("");
    const [filterCol, setFilterCol] = useState("");
    const [sortBy, setSortBy] = useState("id");
    const [sortDir, setSortDir] = useState("ASC");

    const [isLoading, setIsLoading] = useState(true);

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
                setData(killerPerks)
                setTableReloadParentState(false); // вероятно, при отключении этой штуки не будет работать обновление таблицы (при массовом добавлении точно)
                setIsLoading(false);
            }
        };

        loadData();

    }, [fetchData, readManyUrl, page, size, tableReloadParentState]); // пустой -- один раз. data не добавляем, иначе луп

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
            {/* универсально, но нужно передать хуки состояния, columns и создать методы */}

            <h1>Таблица данных</h1>

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
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Killer</th>
                        </tr>
                    </thead>
                    <tbody>
                    {/* вынести функцию loadDataWrapper и хуки состояния isLoading и data */}
                    {isLoading && (
                        <tr>
                            <td colSpan="4">Загрузка данных...</td>
                        </tr>
                    )}
                    {!isLoading && (!data || !data.length) && (
                        <tr>
                            <td colSpan="4">Данные отсутствуют</td>
                        </tr>
                    )}
                    {data && data.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                            <td>{item.killerId}</td>
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
        </>
    );
};

export default DragonTable;
