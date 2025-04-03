import {useAuth} from "../../_DBD/utils/AuthProvider.jsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useNotification} from "../Notification/NotificationProvider.jsx";

function SignInForm({ from, setIsSignedUpParentState }) {
    const { signIn } = useAuth();
    const { addNotification } = useNotification();

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [submitButtonState, setSubmitButtonState] = useState(false);

    // ошибки клиентской валидации
    const [invalidUsernameError, setInvalidUsernameError] = useState(false);

    // ошибки, пришедшие в ответе с сервера
    const [responseError, setResponseError] = useState("");

    // для улучшения пользовательского опыта (надо продумать как связать с FormTextInput)
    const [isUsernameTouched, setIsUsernameTouched] = useState(false);

    useEffect(() => {
        const isUsernameValid = checkIsValidUsername(username);

        if (username !== "" && !isUsernameValid) setInvalidUsernameError(true);
        else setInvalidUsernameError(false);

        if (isUsernameValid) {
            setSubmitButtonState(true);
        } else {
            setSubmitButtonState(false);
        }
    },[username])

    const checkIsValidUsername = (username) => {
        return username && username.match(/^[a-zA-Z0-9]{4,}$/g);
    }

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    return (
        <div>
            <form>
                <label>
                    Введите имя пользователя:<br/>
                    <input
                        value={username}
                        onChange={(e) => {
                            handleUsernameChange(e);
                        }}
                        onBlur={() => {
                            setIsUsernameTouched(true);
                        }}
                        className="login-input"
                        type="text"
                    />
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

                {
                    (isUsernameTouched && invalidUsernameError) && <p style={{color: "red"}}>Неверное имя пользователя.</p>
                }

                {
                    responseError !== "" && <p style={{color: "red"}}>{responseError}</p>
                }

                <button disabled={(!submitButtonState)} onClick={() => {
                    event.preventDefault();

                    signIn(
                        username,
                        password
                    )
                        .then(responseData => {
                            if (responseData.status === "SUCCESS") {
                                addNotification("Успешный вход!", "success");
                                navigate(from, {replace: true})
                            } else {
                                setResponseError(responseData.details);
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                            addNotification(`Ошибка при попытке войти в аккаунт!\n(Error: ${error})`, "error");
                        })
                }}>Sign In
                </button>
            </form>
            <br/>
            <a onClick={() => {
                setIsSignedUpParentState((prev) => (!prev));
            }}>Sign Up</a>
        </div>
    )
    }

export default SignInForm