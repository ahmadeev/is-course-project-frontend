import React, {useState} from "react";
import styles from "./CreateDragon.module.css";

function FormTextInput({ inputType="text", label, errorMessage, value, setValue, isValid }) {
    const [isTouched, setIsTouched] = useState(false);

    return (
        <>
            {/* инпут */}
            <div className={styles.form_group}>
                <label>{label}</label>
                <input
                    value={value}
                    type={inputType}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={() => setIsTouched(true)}
                />
            </div>
            {/* ошибка */}
            <div className={styles.form_group}>
                {
                    (isTouched && !isValid()) ?
                        <span style={{color: "red"}}>{errorMessage}</span> : <></>
                }
            </div>
        </>
    )
}

export default FormTextInput;
