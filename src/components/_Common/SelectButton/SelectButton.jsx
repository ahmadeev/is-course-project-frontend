import { useState } from "react";
import styles from "./SelectButton.module.css";

const SelectButton = ({ options, selected, onChange, onButtonClick }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={styles.dropdownContainer}>
            <button className={styles.dropdownButton}>
                <span
                    className={styles.arrow}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(!isOpen);
                    }}
                >
                    ▼
                </span>
                <span
                    className={styles.text}
                    onClick={() => {
                        if(onButtonClick) onButtonClick(selected);
                    }}
                >
                    {selected ? selected.label : "Выберите опцию"}
                </span>
            </button>

            {isOpen && (
                <ul className={styles.dropdownMenu}>
                    {options.map((option) => (
                        <li
                            key={option.value}
                            className={styles.dropdownItem}
                            onClick={() => {
                                onChange(option);
                                setIsOpen(false);
                            }}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SelectButton;
