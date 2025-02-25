import Navbar from "../../components/Navbar/Navbar.jsx";
import {useEffect, useState} from "react";
import AdminTable from "../../components/Table/AdminTable.jsx";

import styles from "./ImportHistory.module.css";
import {crudReadMany} from "../../utils/crud.js";
import {useAuth} from "../../components/utils/AuthProvider.jsx";
import ImportHistoryTable from "../../components/Table/ImportHistoryTable.jsx";

function ImportHistory({ pageTitle }) {
    // const BASE_URL = "http://localhost:8080/backend-jakarta-ee-1.0-SNAPSHOT/api/admin";

    const BASE_URL = "http://localhost:8080/backend-jakarta-ee-1.0-SNAPSHOT/api/user/import";

    const { logout } = useAuth();

    const [tableReload, setTableReload] = useState(false);

    useEffect(() => {
        document.title = pageTitle;
    })

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

    return (
        <div className={styles.wrapper}>
            <Navbar/>
            <ImportHistoryTable
                fetchData={crudReadMany}
                readManyUrl={`${BASE_URL}/history`}
                // deleteOneUrl

                loadDataWrapper={loadDataWrapper}
                loadDataWrapperWithoutReload={loadDataWrapperWithoutReload}

                tableReloadParentState={tableReload}
                setTableReloadParentState={setTableReload}
            />
        </div>
    )
}

export default ImportHistory
