import {useAuth} from "../utils/AuthProvider.jsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

function SignUpForm({ from, setIsSignedUpParentState, setAlertMessageParentState, setAlertStatusParentState }) {
    const { signUp } = useAuth();

    // ошибки, пришедшие в ответе с сервера
    const [responseError, setResponseError] = useState("");

    // ошибки клиентской валидации
    const [invalidUsernameError, setInvalidUsernameError] = useState(false);
    const [incorrectPasswordsError, setIncorrectPasswordsError] = useState(false);

    const [submitButtonState, setSubmitButtonState] = useState(false);

    // считается хорошей практикой использовать хуки для обработки (иначе нарушается реактивность приложения)
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const isUsernameValid = checkIsValidUsername(username);
        const isPasswordValid = comparePasswords(password, confirmPassword);

        if (username !== "" && !isUsernameValid) setInvalidUsernameError(true);
        else setInvalidUsernameError(false);

        if (password !== "" && confirmPassword !== "" && !isPasswordValid) setIncorrectPasswordsError(true);
        else setIncorrectPasswordsError(false);

        if (isUsernameValid && isPasswordValid) {
            setSubmitButtonState(true);
        } else {
            setSubmitButtonState(false);
        }
    },[username, password, confirmPassword])

    const checkIsValidUsername = (username) => {
        return username && username.match(/^[a-zA-Z0-9]{4,}$/g);
    }

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const comparePasswords = (password1, password2) => {
        return password1 && password2 && password1 === password2
    };

    const handleIsAdminPropertyChange = (e) => {
        setIsAdmin(!isAdmin);
    };

    return (
        <div>
            <form>
                <label>
                    Введите имя пользователя:<br/>
                    <input
                        value={username}
                        onChange={handleUsernameChange}
                        className="login-input"
                        type="text"
                    />
                </label><br/>
                <label>
                    <input
                        value={isAdmin}
                        onChange={handleIsAdminPropertyChange}
                        type="checkbox"
                    />
                    Администратор?<br/>
                </label><br/>
                <label>
                    Введите пароль:<br/>
                    <input
                        value={password}
                        onChange={handlePasswordChange}
                        className="password-input"
                        type="password"
                    />
                </label><br/>
                <label>
                    Повторите пароль:<br/>
                    <input
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        className="password-input"
                        type="password"
                    />
                </label><br/>

                {
                    responseError !== "" && <p style={{color: "red"}}>{responseError}</p>
                }

                {
                    invalidUsernameError &&
                    <p style={{color: "red"}}>
                        Имя пользователя должно содержать минимум 4 символа!<br/>
                        Имя пользователя может содержать строчные и заглавные символы латинского алфавита и цифры.
                    </p>
                }

                {
                    incorrectPasswordsError && <p style={{color: "red"}}>Пароли не совпадают!</p>
                }

                <button disabled={(!submitButtonState)} onClick={() => {
                    event.preventDefault();

                    signUp(
                        username,
                        password,
                        isAdmin
                    )
                        .then(response => response.json())
                        .then(responseData => {
                            if (responseData.status === "SUCCESS") {
                                setAlertMessageParentState("Успешная регистрация!");
                                setIsSignedUpParentState((prev) => (!prev));
                            } else {
                                setResponseError(responseData.details);
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                            setAlertMessageParentState(`Ошибка при попытке войти в аккаунт!\n(Error: ${error})`);
                            setAlertStatusParentState((prev) => (!prev));
                        })
                }}>Sign Up
                </button>
            </form>
            <br/>
            <a onClick={() => {
                setIsSignedUpParentState((prev) => (!prev));
            }}>Sign In</a>
        </div>
    )
}

export default SignUpForm
