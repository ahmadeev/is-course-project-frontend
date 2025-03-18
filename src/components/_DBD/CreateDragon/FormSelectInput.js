// // TODO: туду
// import React, {useEffect, useState} from "react";
// import styles from "./CreateDragon/CreateDragon.module.css";
//
// function FormSelectInput({ label, errorMessage, value, setValue, isValid, options }) {
//     const [isTouched, setIsTouched] = useState(false);
//
//     return (
//         <>
//             {/* инпут */}
//             <div className={styles.form_group}>
//                 <label>{label}</label>
//                 <select
//                     value={value}
//                     onChange={(e) => setValue(e.target.value)}
//                     onBlur={() => setIsTouched(true)}
//                 >
//                     <option value="" disabled>Выберите:</option>
//                     {options && options.map((option, index) => (
//                         <option key={index} value={option}>
//                             {option}
//                         </option>
//                     ))}
//                 </select>
//             </div>
//             {/* ошибка */}
//             <div className={styles.form_group}>
//                 {
//                     isTouched && !isValid ?
//                         <span style={{color: "red"}}>{errorMessage}</span> : <></>
//                 }
//             </div>
//         </>
//     )
// }
//
// export default FormSelectInput;
