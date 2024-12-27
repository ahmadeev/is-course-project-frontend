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

const DragonTable = ({ fetchData, readManyUrl, deleteOneUrl }) => {
    const { logout } = useAuth();

    const [data, setData] = useState([]);

    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);

    const [reload, setReload] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handlePageChange = (direction) => {
        setPage((prevPage) => prevPage + direction);
    };

    const loadDataWrapper = async (func, args) => {
        try {
            const response = await func(...args);

            if (!response.ok) {
                if (response.status === 401)  {
                    console.log("401 Error processing table refresh")
                    logout();
                }
                throw new Error();
            }

            let responseData;
            try {
                responseData = await response.json();
            } catch (error) {
                console.error("Error reading response body", error);
            }
            console.log(responseData)
            return responseData;
            // раньше setReload(true) был тут
        } catch (error) {
            console.error("Error proccessing CRUD:", error);
            return null;
        } finally {
            setReload(true);
        }
    }

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetchData(readManyUrl, page, size); // асинхронно грузим страницу данных из БД

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
                setReload(false);
                setIsLoading(false);
            }
        };

        loadData();

    }, [fetchData, readManyUrl, page, size, reload]); // пустой -- один раз. data не добавляем, иначе луп

    const BASE_URL = "http://localhost:8080/backend-jakarta-ee-1.0-SNAPSHOT/api/user";

    // Пример создания экземпляра
    const coordinates = new CoordinatesDTO(50, 30);
    const cave = new DragonCaveDTO(15);
    const killer = new PersonDTO("killer", "WHITE", "WHITE", new LocationDTO(1, 1, 1), new Date().toISOString().split('T')[0], 200);
    const head = new DragonHeadDTO(200, 100500);
    const dragon = new DragonDTO(
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

    const DIV_STYLE = {
        display: "flex",
        justifyContent: "space-between",
        gap: "0.5rem"
    }

    return (
        <>
            <button onClick={() => {
                loadDataWrapper(crudCreate, [`${BASE_URL}/dragon`, dragon]);
            }}>CREATE
            </button>

            <button onClick={() => {
                loadDataWrapper(crudDeleteMany, [`${BASE_URL}/dragons`]);
            }}>DELETE MANY
            </button>

            <h1>Таблица данных</h1>
            <div style={{
                maxWidth: "100%",
                display: "flex",
                alignItems: "center",
                overflowX: "auto"
            }}>
                <table border="1">
                    <thead>
                    <tr>
                        <th rowSpan={2}>ID</th>
                        <th rowSpan={2}>Name</th>
                        <th colSpan={2}>Coordinates</th>
                        <th colSpan={1}>Cave</th>
                        <th colSpan={6}>Killer</th>
                        <th rowSpan={2}>Age</th>
                        <th rowSpan={2}>Description</th>
                        <th rowSpan={2}>Wingspan</th>
                        <th rowSpan={2}>Character</th>
                        <th colSpan={2}>Head</th>
                        <th rowSpan={2}>Edit</th>
                        <th rowSpan={2}>Remove</th>
                    </tr>
                    <tr>
                        <th>x</th>
                        <th>y</th>

                        <th>number of treasures</th>

                        <th>name</th>
                        <th>eye color</th>
                        <th>hair color</th>
                        <th>LOCATION</th>
                        <th>birthday</th>
                        <th>height</th>

                        <th>eyes count</th>
                        <th>tooth count</th>
                    </tr>
                    </thead>
                    <tbody>
                    {isLoading && (
                        <tr>
                            <td colSpan="19" style={{textAlign: "center"}}>Загрузка данных...</td>
                        </tr>
                    )}
                    {!isLoading && (!data || !data.length) && (
                        <tr>
                            <td colSpan="19" style={{textAlign: "center"}}>Данные отсутствуют</td>
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
                            <td>{item.killer.location.toString()}</td>
                            <td>{item.killer.birthday}</td>
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

            <div style={DIV_STYLE}>
                <button className={styles.turn_page} id="decrease-page" onClick={() => handlePageChange(-1)} disabled={page === 0}>left</button>
                <p>{page + 1}</p>
                <button className={styles.turn_page} id="increase-page" onClick={() => handlePageChange(1)} disabled={data.length < 10}>right</button>
            </div>

            </>
            );
            };

            export default DragonTable;
