import React, { useState, useEffect, useRef } from 'react';
import styles from './Table.module.css';
import {useAuth} from "../utils/AuthProvider.jsx";
import {useNotification} from "../../_Common/Notification/NotificationProvider.jsx"; // Предполагаемый импорт стилей

const DynamicDataTable = ({
                         dynamicData=null,

                         baseUrl,
                         wsUrl,

                         columns, // Массив строк для заголовков таблицы (например, ['id', 'name', 'description'])
                         columnLabels, // Объект для отображения читаемых названий колонок (например, { id: 'ID', name: 'Название' })
                         renderRow, // Функция для рендеринга строки таблицы (опционально)

                         fetchData,

                         tableReloadParentState,
                         setTableReloadParentState,

                         setAlertMessageParentState,
                         setAlertStatusParentState
                     }) => {
    const { logout } = useAuth();
    const { addNotification } = useNotification();

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
    };

    const handleResetEvent = () => {
        setPage(0);
        setSize(10);
        setFilterValue("");
        setFilterCol("");
        setSortBy("id");
        setSortDir("ASC");
        handleFindEvent();
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetchData(baseUrl, page, size, filterValue, filterCol, sortBy, sortDir);
                if (!response.ok) {
                    if (response.status === 401) {
                        console.log("Ошибка 401 при загрузке таблицы");
                        logout();
                    }
                    throw new Error();
                }
                const responseData = await response.json();
                setData(responseData.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                addNotification(error.message, "error");
            } finally {
                // setTableReloadParentState(false); // TODO: пока не очень понятно но ладно
                setIsLoading(false);
            }
        };

        dynamicData ? setData(dynamicData) : loadData();
    }, [fetchData, baseUrl, page, size, tableReloadParentState]);

/*
    // WebSocket
    const wsRef = useRef(null);
    useEffect(() => {
        wsRef.current = new WebSocket(wsUrl);
        wsRef.current.onopen = () => console.log("[WS] Connection opened.");
        wsRef.current.onmessage = (event) => {
            console.log("[WS] Event: ", event.data);
            setTableReloadParentState((prev) => !prev);
        };
        wsRef.current.onerror = (error) => console.log("[WS] Error: ", error);
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
            console.log('[WS] Connection closed.');
        };
    }, [WS_URL]);
*/

    return (
        <>
            <h1>Таблица данных</h1>

            {/* TODO: временная мера, пока фильтрация и сортировка отсутствуют */}
{/*            <div className={styles.filter_block}>
                <div className={styles.filter_block_section}>
                    <label>
                        Filter by column:
                        <select value={filterCol} onChange={(event) => handleSelectChange(event, setFilterCol)}>
                            <option value="" disabled>Select an option</option>
                            {columns && columns.map((col, index) => (
                                <option key={index} value={col}>
                                    {columnLabels?.[col] || col}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        <input
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                            type="text"
                            placeholder="key word"
                        />
                    </label>
                </div>

                <div className={styles.filter_block_section}>
                    <label>
                        Sort by column:
                        <select value={sortBy} onChange={(event) => handleSelectChange(event, setSortBy)}>
                            <option value="id">id</option>
                            {columns && columns.map((col, index) => (
                                <option key={index} value={col}>
                                    {columnLabels?.[col] || col}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        <button onClick={() => setSortDir((prev) => (prev === "ASC" ? "DESC" : "ASC"))}>
                            {sortDir}
                        </button>
                    </label>
                </div>
                <button onClick={handleFindEvent}>Find</button>
                <button onClick={handleResetEvent}>Reset</button>
            </div>*/}

            <div className={styles.table_wrapper}>
                <table className={styles.data_table}>
                    <thead>
                    <tr>
                        {columns && columns.map((col, index) => (
                            <th key={index}>{columnLabels?.[col] || col}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {isLoading && (
                        <tr>
                            <td colSpan={columns?.length || 1}>Загрузка данных...</td>
                        </tr>
                    )}
                    {!isLoading && (!data || !data.length) && (
                        <tr>
                            <td colSpan={columns?.length || 1}>Данные отсутствуют</td>
                        </tr>
                    )}
                    {data && data.length <= size && data.map((item, rowIndex) => (
                        renderRow ? renderRow(item, rowIndex) : (
                            <tr key={item.id || rowIndex}>
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex}>{item[col]}</td>
                                ))}
                            </tr>
                        )
                    ))}
                    {data && data.length > size && data.slice(page * size, page * size + size).map((item, rowIndex) => (
                        renderRow ? renderRow(item, rowIndex) : (
                            <tr key={item.id || rowIndex}>
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex}>{item[col]}</td>
                                ))}
                            </tr>
                        )
                    ))}
                    </tbody>
                </table>
            </div>

            <div className={styles.button_block}>
                <button
                    className={styles.turn_page}
                    onClick={() => setPage(0)}
                    disabled={page === 0}
                >&lt;&lt;</button>
                <button
                    className={styles.turn_page}
                    onClick={() => handlePageChange(-1)}
                    disabled={page === 0}
                >&lt;</button>
                <p>{page + 1}</p>
                <button
                    className={styles.turn_page}
                    onClick={() => handlePageChange(1)}
                    disabled={data?.length > size ? data?.slice(page * size, page * size + size)?.length < size : data?.length < size}
                >&gt;</button>
                <button
                    className={styles.turn_page}
                    disabled={true}
                >&gt;&gt;</button>
            </div>

            <div className={styles.button_block}>
                <a style={{textDecoration: size === 10 ? "underline" : ""}} onClick={() => setSize(10)}>10</a>
                <a style={{textDecoration: size === 50 ? "underline" : ""}} onClick={() => setSize(50)}>50</a>
                <a style={{textDecoration: size === 100 ? "underline" : ""}} onClick={() => setSize(100)}>100</a>
            </div>
        </>
    );
};

export default DynamicDataTable;