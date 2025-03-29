import React, { useState, useEffect } from 'react';
// import styles from './Text.module.css';
import {useAuth} from "./AuthProvider.jsx";
import DynamicDataTextModule from "./DynamicDataTextModule.jsx";

const DynamicDataText = ({
                              dynamicData=null,

                              baseUrl,
                              wsUrl,

                              tags,

                              fetchData,

                              contentReloadParentState,
                              setContentReloadParentState,

                              setAlertMessageParentState,
                              setAlertStatusParentState
                          }) => {
    const { logout } = useAuth();

    const [data, setData] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetchData(baseUrl);
                if (!response.ok) {
                    if (response.status === 401) {
                        console.log("Ошибка 401 при загрузке данных");
                        logout();
                    }
                    throw new Error();
                }
                const responseData = await response.json();
                setData(responseData.data);
            } catch (error) {
                setErrorMessage(error.message);
                console.error("Error fetching data:", error);
            } finally {
                setContentReloadParentState(false);
                setIsLoading(false);
            }
        };

        dynamicData ? setData(dynamicData) : loadData();
    }, [fetchData, contentReloadParentState]);

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
            {isLoading && <p>Загрузка данных...</p>}
            {!isLoading && data.length === 0 && (
                <>
                    <p>Данные отсутствуют.</p>
                    {errorMessage && <p>{errorMessage}</p>}
                </>
            )}
            {!isLoading && <DynamicDataTextModule data={data}/>}
        </>
    );
};

export default DynamicDataText;