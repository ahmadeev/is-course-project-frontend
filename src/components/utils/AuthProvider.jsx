import React, { createContext, useState, useContext } from 'react';
import {UserDTO} from "../../utils/user.model.js";

const AuthContext = createContext();

const BASE_URL = "http://localhost:8080/backend-jakarta-ee-1.0-SNAPSHOT/api/auth";

// компонент AuthProvider оборачивает приложение и предоставляет доступ к AuthContext
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const savedAuthState = sessionStorage.getItem("isAuthenticated");
        return savedAuthState === "true";
    });

    const [username, setUsername] = useState(() => {
        const username = sessionStorage.getItem("session-username");
        return username ? username : "";
    });

    const [roles, setRoles] = useState(() => {
        const savedRoles = sessionStorage.getItem("session-roles");
        return savedRoles ? JSON.parse(savedRoles) : [];
    });

    // метод для входа в систему
    const signIn = (name, password) => {
        console.log("Sign in...");

        // было так:
        // crudCreate(`${BASE_URL}/sign-in`, new UserDTO(name, password));
        return fetch(`${BASE_URL}/sign-in`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(new UserDTO(name, password)),
        })
            .then(response => {
                return response.json();
            })
            .then((responseData) => {
                if (responseData.status === "SUCCESS") {
                    setIsAuthenticated(true);
                    setUsername(name);

                    // костыль, позволяющий не использовать many-to-many на сервере
                    const roles = [...responseData.data.roles];
                    if (roles.includes("ADMIN") && !roles.includes("USER")) roles.push("USER")
                    setRoles(roles);

                    sessionStorage.setItem("isAuthenticated", "true");
                    sessionStorage.setItem("session-token", responseData.data.token)
                    sessionStorage.setItem("session-username", name)
                    sessionStorage.setItem("session-roles", JSON.stringify(roles));
                }
                return responseData;
            })
            .catch(error => {
                console.error('Error:', error)
            });
    };

    // метод для регистрации в системе
    const signUp = (name, password, isAdmin) => {
        console.log("Sign up...");

        // crudCreate(`${BASE_URL}/sign-up`, new UserDTO(name, password));
        return fetch(`${BASE_URL}/sign-up`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(new UserDTO(name, password, isAdmin)),
        })
    };

    // метод для выхода из системы
    const logout = () => {
        console.log("Logging out...");
        setIsAuthenticated(false);
        setUsername("");
        setRoles([])
        sessionStorage.setItem("isAuthenticated", "false");
        sessionStorage.setItem("session-token", null)
        sessionStorage.setItem("session-username", "")
        sessionStorage.setItem("session-roles", "[] ")
        console.log("isAuthenticated after logout: ", isAuthenticated, "\nexpected: false");
    };

    const checkAuthStatus = async () => {
        // здесь запрос к API для проверки состояния аутентификации
        // например, проверка валидности токена
        const status = await fetchAuthStatus();
        setIsAuthenticated(status);
    }

    const fetchAuthStatus = async () => {
        // здесь логика для обращения к API или проверка localStorage
        const savedAuthState = sessionStorage.getItem("isAuthenticated");
        return savedAuthState === "true";
    };

    const hasRole = (role) => roles.includes(role);

    // значения, которые будут доступны всем компонентам, использующим AuthContext
    return (
        <AuthContext.Provider value={{ isAuthenticated, username, roles, hasRole, signIn, signUp, logout, checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

// хук для удобного доступа к AuthContext
export const useAuth = () => useContext(AuthContext);
