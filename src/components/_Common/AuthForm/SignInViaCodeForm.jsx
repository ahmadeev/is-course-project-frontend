import {useAuth} from "../../_DBD/utils/AuthProvider.jsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useNotification} from "../Notification/NotificationProvider.jsx";

function SignInViaCodeForm({ from, setIsSignedUpParentState }) {
    const { signInViaCodeName, signInViaCodeCode } = useAuth();

    const navigate = useNavigate();

    const [isDisabled, setIsDisabled] = useState(false);

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
                        disabled={isDisabled}
                    />
                </label><br/>
                <label>
                    Введите код:<br/>
                    <input
                        value={password}
                        onChange={handlePasswordChange}
                        className="password-input"
                        type="text"
                        disabled={!isDisabled}
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

                    if (!isDisabled) {
                        signInViaCodeName(
                            username
                        )
                            .then(responseData => {
                                if (responseData.status === "SUCCESS") {
                                    setIsDisabled(true);
                                } else {
                                    setResponseError(responseData.details);
                                }
                            })
                            .catch((error) => {
                                console.error(error);
                            })
                    } else {
                        signInViaCodeCode(
                            username,
                            password
                        )
                            .then(responseData => {
                                if (responseData.status === "SUCCESS") {
                                    navigate(from, {replace: true})
                                } else {
                                    setResponseError(responseData.details);
                                }
                            })
                            .catch((error) => {
                                console.error(error);
                            })
                    }

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

export default SignInViaCodeForm;