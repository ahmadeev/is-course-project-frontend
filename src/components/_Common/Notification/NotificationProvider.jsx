import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (message, type = "info") => {
        console.log("Добавляем уведомление:", message, type); // Проверка
        const id = Date.now();
        setNotifications((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            removeNotification(id);
        }, 5000);
    };

    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ addNotification }}>
            {children}
            <div style={styles.container}>
                {notifications.map((notif) => (
                    <div key={notif.id} style={{ ...styles.notification, ...styles[notif.type] }}>
                        <span>{notif.message}</span>
                        <button style={styles.closeButton} onClick={() => removeNotification(notif.id)}>×</button>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);

const styles = {
    container: {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        zIndex: 9999,
    },
    notification: {
        padding: "10px 20px",
        borderRadius: "5px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        minWidth: "250px",
        fontSize: "14px",
    },
    info: { backgroundColor: "#3498db" },
    success: { backgroundColor: "#2ecc71" },
    warning: { backgroundColor: "#f1c40f" },
    error: { backgroundColor: "#e74c3c" },
    closeButton: {
        background: "none",
        border: "none",
        color: "white",
        fontSize: "16px",
        cursor: "pointer",
        marginLeft: "10px",
    },
};
