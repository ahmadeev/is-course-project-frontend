import Navbar from "../../../components/_DBD/Navbar/Navbar.jsx";
import {useEffect, useState} from "react";
import SignInForm from "../../../components/_Common/AuthForm/SignInForm.jsx";
import SignUpForm from "../../../components/_Common/AuthForm/SignUpForm.jsx";
import styles from "./Auth.module.css";
import {useLocation} from "react-router-dom";
import Alert from "../../../components/_Common/Alert/Alert.jsx";
import SignInViaCodeForm from "../../../components/_Common/AuthForm/SignInViaCodeForm.jsx";

function Auth({ pageTitle, isSignedUp }) {
    const [isSignedUpHook, setIsSignedUpHook] = useState(isSignedUp);
    const location = useLocation();

    const [alertActive, setAlertActive] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertStatus, setAlertStatus] = useState(false);

    const [from, setFrom] = useState(location.state?.from?.pathname || "/");

    const [isViaCode, setIsViaCode] = useState(false);

    const showAlert = () => {
        setAlertActive(true);
    };

    useEffect(() => {
        document.title = pageTitle;
    })

    useEffect(() => {
        if (alertMessage !== "") {
            showAlert();
        }
    }, [alertMessage, alertStatus])

    return (
        <div className={styles.wrapper}>
            <Navbar/>
            {
                isSignedUpHook && (
                    <>
                        <a onClick={() => {
                            setIsViaCode(prev => !prev);
                        }}>{isViaCode ? "Войти с помощью пароля" : "Войти с помощью кода"}</a>
                        <br/>
                    </>
                )
            }

            {isViaCode && isSignedUpHook && (
                <SignInViaCodeForm
                    from={from}
                    setIsSignedUpParentState={setIsSignedUpHook}
                />
            )}

            {!isViaCode && isSignedUpHook && (
                <SignInForm
                    from={from}
                    setIsSignedUpParentState={setIsSignedUpHook}
                />
            )}

            {!isSignedUpHook && (
                <SignUpForm
                    from={from}
                    setIsSignedUpParentState={setIsSignedUpHook}
                />
            )}

            {/* можно убрать думаю */}
            <Alert
                message={alertMessage}
                isActive={alertActive}
                onClose={() => setAlertActive(false)}
            />
        </div>
    )
}

export default Auth
