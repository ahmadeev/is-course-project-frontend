import {useEffect} from "react";
import Navbar from "../../../components/_DBD/Navbar/Navbar.jsx";
import styles from "./Forbidden.module.css";

function Forbidden({ pageTitle }) {
    useEffect(() => {
        document.title = pageTitle;
    })

    return (
        <>
            <Navbar/>
            <div className={styles.wrapper}>
                <h3>403: Упс, доступ запрещён!</h3>
                <p>
                    К сожалению, у Вас нет разрешения на просмотр этой страницы. <br/>
                    Если Вы считаете, что это ошибка, свяжитесь с нашей поддержкой.
                </p>
            </div>
        </>
    )
}

export default Forbidden
