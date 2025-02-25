import Navbar from "../../components/Navbar/Navbar.jsx";
import styles from "./Home.module.css";
import React, {useEffect, useState} from "react";
import Modal from "../../components/Modal/Modal.jsx";
import {crudCreate, crudRead, crudUpdate, crudDelete, crudReadMany, crudDeleteMany} from "../../utils/crud.js";
import DragonTable from "../../components/Table/DragonTable.jsx";
import CreateDragon from "../../components/CreateDragon/CreateDragon.jsx";
import {useAuth} from "../../components/utils/AuthProvider.jsx";
import AdditionalFunctions from "../../components/Other/AdditionalFunctions.jsx";
import Alert from "../../components/Alert/Alert.jsx";
import FileUploader from "../../components/Other/FileUploader.jsx";
import {useNavigate} from "react-router-dom";

function Home({ pageTitle }) {
    // const BASE_URL = "http://localhost:8080/backend-jakarta-ee-1.0-SNAPSHOT/api/user";

    const BASE_URL = "http://localhost:8080/backend-jakarta-ee-1.0-SNAPSHOT/api/user";

    // надо проверять CreateDragon, DragonTable, Admin, Home, AdminTable, ImportHistory

    const { logout, isAuthenticated } = useAuth();

    const [createDragonModalActive, setCreateDragonModalActive] = useState(false);
    const [additionalFunctionsModalActive, setAdditionalFunctionsModalActive] = useState(false);

    const [tableReload, setTableReload] = useState(false);

    const [alertActive, setAlertActive] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertStatus, setAlertStatus] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        document.title = pageTitle;
    })

    useEffect(() => {
        if (alertMessage !== "") {
            setAlertActive(true);
        }
    }, [alertMessage, alertStatus])

    class CustomError extends Error {
        constructor(message, data) {
            super(message);
            this.data = data;
        }
    }

    // возвращает мэпу из тела ответа в случае успеха или сам объект ответа в случае неуспеха
    // было бы круто всегда возвращать одно и то же
    // решение: [response, responseJson]
    // проверить DragonTable.jsx (delete button) при изменении
    const loadDataWrapper = async (func, args) => {
        try {
            const response = await func(...args);

            if (!response.ok) {
                if (response.status === 401)  {
                    console.log("401 Error processing table refresh")
                    logout();
                }
                throw new CustomError("", response);
            }

            let responseData;
            try {
                responseData = await response.json();
            } catch (error) {
                console.error("Error reading response body\n\n", error);
                throw new CustomError("", response); // раньше не было throw
            }
            console.log(responseData)
            return responseData;
            // раньше setReload(true) был тут
        } catch (error) {
            console.error("Error proccessing CRUD.\n\n", error);
            return error.data; // было null
        } finally {
            setTableReload((prev) => !prev);
        }
    }

    // TODO: костыль
    const loadDataWrapperWithoutReload = async (func, args) => {
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
        }
    }

    if (!isAuthenticated) {
        return (
            <>
                <Navbar/>
                <div className={styles.wrapper}>
                    <h2>Сначала войдите в аккаунт!</h2>
                </div>
            </>
        )
    }

    return (
        <>
            <Navbar/>
            <div className={styles.wrapper}>
                <h1>
                    Загрузка файлов
                </h1>

                <FileUploader
                    setAlertMessageParentState={setAlertMessage}
                    setAlertStatusParentState={setAlertStatus}
                />
                <button onClick={() => {
                    loadDataWrapperWithoutReload(crudReadMany, [`${BASE_URL}/import/history`]);
                }}>ИСТОРИЯ ИМПОРТОВ (ТЕСТ)</button>

                <button onClick={() => {
                    navigate("/import/history");
                }}>ИСТОРИЯ ИМПОРТОВ</button>

                <h1>
                    Быстрые кнопки
                </h1>

                <button onClick={() => setCreateDragonModalActive(true)}>СОЗДАТЬ ДРАКОНА</button>
                <button onClick={() => setAdditionalFunctionsModalActive(true)}>СПЕЦИАЛЬНЫЕ ФУНКЦИИ</button>

                <DragonTable
                    fetchData={crudReadMany}
                    readManyUrl={`${BASE_URL}/dragons`}
                    deleteOneUrl={`${BASE_URL}/dragon`}

                    loadDataWrapper={loadDataWrapper}
                    loadDataWrapperWithoutReload={loadDataWrapperWithoutReload}

                    tableReloadParentState={tableReload}
                    setTableReloadParentState={setTableReload}

                    setAlertMessageParentState={setAlertMessage}
                    setAlertStatusParentState={setAlertStatus}
                />
            </div>

            <Modal active={createDragonModalActive} setActive={setCreateDragonModalActive}>
                <CreateDragon
                    loadDataWrapper={loadDataWrapper}
                    loadDataWrapperWithoutReload={loadDataWrapperWithoutReload}

                    tableReloadParentState={tableReload}
                    setTableReloadParentState={setTableReload}
                />
            </Modal>

            <Modal active={additionalFunctionsModalActive} setActive={setAdditionalFunctionsModalActive}>
                <AdditionalFunctions
                    loadDataWrapper={loadDataWrapper}
                    loadDataWrapperWithoutReload={loadDataWrapperWithoutReload}
                />
            </Modal>

            <Alert
                message={alertMessage}
                isActive={alertActive}
                onClose={() => setAlertActive(false)}
            />
        </>
    )
}

export default Home
