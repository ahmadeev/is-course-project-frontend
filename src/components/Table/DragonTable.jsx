import React, { useState, useEffect } from 'react';
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

const DragonTable = ({ fetchData, readManyUrl, deleteOneUrl, loadDataWrapper, tableReloadParentState, setTableReloadParentState }) => {
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

    // можно улучшить, сделав его универсальным для селектов
    const handleSelectChange = (event, setFunction) => {
        setFunction(event.target.value);
    };

    const handleFindEvent = () => {
        setTableReloadParentState((prev) => !prev);
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

    const BASE_URL = "http://localhost:8080/backend-jakarta-ee-1.0-SNAPSHOT/api/user";

    // Пример создания экземпляра
    const coordinates = new CoordinatesDTO(50, 30);
    const cave = new DragonCaveDTO(15);
    const killer = new PersonDTO("killer", "WHITE", "WHITE", new LocationDTO(1, 1, 1), new Date().toISOString().split('T')[0], 200);
    const head = new DragonHeadDTO(200, 100500);
    const dragon1 = new DragonDTO(
        "Fire Dragon",
        coordinates,
        cave,
        killer,
        200,  // Age,
        "A fierce and powerful dragon", // Description
        150,  // Wingspan
        null, // No character
        head, // Dragon head
    );

    const dragon2 = new DragonDTO(
        "Air Dragon",
        coordinates,
        cave,
        killer,
        200,  // Age,
        "A fierce and powerful dragon", // Description
        1000,  // Wingspan
        null, // No character
        head, // Dragon head
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

    return (
        <>
            <button onClick={() => {
                loadDataWrapper(crudCreate, [`${BASE_URL}/dragon`, Math.random() < 0.5 ? dragon1 : dragon2]);
            }}>CREATE
            </button>

            <button onClick={() => {
                loadDataWrapper(crudDeleteMany, [`${BASE_URL}/dragons`]);
            }}>DELETE MANY
            </button>

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
                <button>Reset</button>
            </div>

            <div className={styles.table_wrapper}>
                <table className={styles.data_table}>
                    <thead>
                    <tr>
                        <th rowSpan={3}>ID</th>
                        <th rowSpan={3}>Name</th>
                        <th colSpan={2}>Coordinates</th>
                        <th colSpan={1}>Cave</th>
                        <th colSpan={8}>Killer</th>
                        <th rowSpan={3}>Age</th>
                        <th rowSpan={3}>Description</th>
                        <th rowSpan={3}>Wingspan</th>
                        <th rowSpan={3}>Character</th>
                        <th colSpan={2}>Head</th>
                        <th rowSpan={3}>Edit</th>
                        <th rowSpan={3}>Remove</th>
                    </tr>
                    <tr>
                        <th rowSpan={2}>x</th>
                        <th rowSpan={2}>y</th>

                        <th rowSpan={2}>number of treasures</th>

                        <th rowSpan={2}>name</th>
                        <th rowSpan={2}>eye color</th>
                        <th rowSpan={2}>hair color</th>
                        <th colSpan={3}>location</th>
                        <th rowSpan={2}>birthday</th>
                        <th rowSpan={2}>height</th>

                        <th rowSpan={2}>eyes count</th>
                        <th rowSpan={2}>tooth count</th>
                    </tr>
                    <tr>
                        <th>x</th>
                        <th>y</th>
                        <th>z</th>
                    </tr>
                    </thead>
                    <tbody>
                    {isLoading && (
                        <tr>
                            <td colSpan="21">Загрузка данных...</td>
                        </tr>
                    )}
                    {!isLoading && (!data || !data.length) && (
                        <tr>
                            <td colSpan="21">Данные отсутствуют</td>
                        </tr>
                    )}
                    {data && data.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.coordinates.x}</td>
                            <td>{item.coordinates.y}</td>
                            <td>{item.cave.numberOfTreasures}</td>
                            <td>{item.killer.name}</td>
                            <td>{item.killer.eyeColor}</td>
                            <td>{item.killer.hairColor}</td>
                            <td>{item.killer.location.x}</td>
                            <td>{item.killer.location.y}</td>
                            <td>{item.killer.location.z}</td>
                            <td>{item.killer.birthday.join("-")}</td>
                            <td>{item.killer.height}</td>
                            <td>{item.age}</td>
                            <td>{item.description}</td>
                            <td>{item.wingspan}</td>
                            <td>{item.character}</td>
                            <td>{item.head.eyesCount}</td>
                            <td>{item.head.toothCount}</td>
                            <td>
                                <button onClick={() => {
                                    // crudUpdate(`${BASE_URL}/dragon`, id);
                                    // setReload(true);
                                }}>
                                    /
                                </button>
                            </td>
                            <td>
                                <button onClick={() => {
                                    loadDataWrapper(crudDelete, [deleteOneUrl, item.id])
                                }}>
                                    X
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className={styles.button_block}>
                <button disabled={true}>&lt;&lt;</button>
                <button className={styles.turn_page} id="decrease-page" onClick={() => handlePageChange(-1)}
                        disabled={page === 0}>&lt;
                </button>
                <p>{page + 1}</p>
                <button className={styles.turn_page} id="increase-page" onClick={() => handlePageChange(1)}
                        disabled={data.length < 10}>&gt;
                </button>
                <button disabled={true}>&gt;&gt;</button>
            </div>

        </>
    );
};

export default DragonTable;
