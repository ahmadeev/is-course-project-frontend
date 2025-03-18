import styles from "./CreateDragon.module.css"
import React, {useEffect, useState} from "react";
import {crudCreate, crudDeleteMany, crudRead, crudReadMany, crudUpdate} from "../../../utils/crud.js";
import FormTextInput from "./FormTextInput.jsx";
import {
    CoordinatesDTO,
    DragonCaveDTO,
    DragonDTO,
    DragonHeadDTO,
    LocationDTO,
    PersonDTO
} from "../../../utils/object.model.js";

function CreateDragon({
                          isToCreate=true,
                          prototype=null,
                          loadDataWrapper,
                          loadDataWrapperWithoutReload,
                          tableReloadParentState,
                          setTableReloadParentState,
                          setAlertMessageParentState,
                          setAlertStatusParentState,
                          setUpdateDragonModalActiveParentState
}) {

    // const BASE_URL = "http://localhost:8080/backend-jakarta-ee-1.0-SNAPSHOT/api/user";
    const BASE_URL = "http://localhost:8080/backend-jakarta-ee-1.0-SNAPSHOT/api/user";

    const FORM_SECTION_STYLE = {
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: "10px",
        alignItems: "center",
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        let formData = new DragonDTO(
            dragonId,
            dragonName,
            new CoordinatesDTO(
                coordinatesId,
                coordinatesX,
                coordinatesY,
                coordinatesOwnerId,
                coordinatesUpdatedBy,
                coordinatesEditingAllowed
            ),
            new DragonCaveDTO(
                dragonCaveId,
                dragonCaveNumberOfTreasures,
                dragonCaveOwnerId,
                caveUpdatedBy,
                caveEditingAllowed
            ),
            dragonKillerInputNotNull ? (
                new PersonDTO(
                    personId,
                    personName,
                    personEyeColor,
                    personHairColor,
                    new LocationDTO(
                        locationId,
                        locationX,
                        locationY,
                        locationZ,
                        locationOwnerId,
                        locationUpdatedBy,
                        false // TODO: бубубу, выше тоже бубубу
                    ),
                    personBirthday,
                    personHeight,
                    personOwnerId,
                    personUpdatedBy,
                    personEditingAllowed
                )
            ) : null,
            dragonAge,
            dragonDescription,
            dragonWingspan,
            dragonCharacter,
            new DragonHeadDTO(
                dragonHeadId,
                dragonHeadEyesCount,
                dragonHeadToothCount,
                dragonHeadOwnerId,
                headUpdatedBy,
                headEditingAllowed
            ),
            dragonOwnerId,
            updatedBy,
            editingAllowed
        )

        let res;
        if (isToCreate) {
            res = await loadDataWrapper(crudCreate, [`${BASE_URL}/dragon`, formData]);
        } else {
            res = await loadDataWrapper(crudUpdate, [`${BASE_URL}/dragon`, prototype.id, formData]);
        }
        let rd = await res.json();
        setUpdateDragonModalActiveParentState(false);
        setAlertMessageParentState("Error occurred! Details: " + rd.details);
        setAlertStatusParentState((prev) => !prev);
        console.log("Submitted data:", formData);
    };

    // чекбоксы для nullable полей формы (только для вложенных объектов) TODO: валидация
    const [dragonKillerInputNotNull, setDragonKillerInputNotNull] = useState(true);

    // чекбоксы на привязку существующего объекта (1)/(0) самостоятельное создание объекта
    const [coordinatesExistence, setCoordinatesExistence] = useState(false);
    const [caveExistence, setCaveExistence] = useState(false);
    const [killerExistence, setKillerExistence] = useState(false);
    // const [locationExistence, setLocationExistence] = useState(false);
    const [headExistence, setHeadExistence] = useState(false);

    // галочка для разрешения редактирования и удаления админами
    const [editingAllowed, setEditingAllowed] = useState(false);
    const [coordinatesEditingAllowed, setCoordinatesEditingAllowed] = useState(false);
    const [caveEditingAllowed, setCaveEditingAllowed] = useState(false);
    const [personEditingAllowed, setPersonEditingAllowed] = useState(false);
    // const [locationEditingAllowed, setLocationEditingAllowed] = useState(false);
    const [headEditingAllowed, setHeadEditingAllowed] = useState(false);

    // рудимент
    const [killerEyeColorTouched, setKillerEyeColorTouched] = useState(false);

    // было бы круто единоразово получать с бэка эти два списка
    const dragonCharacterList = [
        "CUNNING",
        "GOOD",
        "CHAOTIC_EVIL"
    ]

    const colorList = [
        "GREEN",
        "BLACK",
        "WHITE"
    ]

    const regexInt = /^-?\d+$/; // +- int
    const regexFloat = /^-?\d+([.,]\d+)?$/; // +- float

    // данные для селектов в форме (списки существующих объектов для привязки)
    const [coordinates, setCoordinates] = useState(null);
    const [caves, setCaves] = useState(null);
    const [persons, setPersons] = useState(null);
    const [heads, setHeads] = useState(null);

    useEffect(() => {
        if (prototype?.killer === null) setDragonKillerInputNotNull(false);
    }, [prototype]);

    useEffect(() => {
        console.log(prototype);

        if (prototype !== null) {
            setDragonId(prototype.id || -1);
            setDragonName(prototype.name || "");
            // ---
            setCoordinatesId(prototype.coordinates.id || "");
            setCoordinatesX(prototype.coordinates.x || "");
            setCoordinatesY(prototype.coordinates.y || "");
            setCoordinatesOwnerId(prototype.coordinates.ownerId || "");
            setCoordinatesEditingAllowed(prototype.coordinates.ownerId || false);
            // ---
            setDragonCaveId(prototype.cave.id || "");
            setDragonCaveNumberOfTreasures(prototype.cave.numberOfTreasures || "");
            setDragonCaveOwnerId(prototype.cave.ownerId || "");
            // ---
            setPersonId(prototype.killer?.id || "");
            setPersonName(prototype.killer?.name || "");
            setPersonEyeColor(prototype.killer?.eyeColor || "");
            setPersonHairColor(prototype.killer?.hairColor || "");
            setPersonBirthday(new Date(prototype.killer?.birthday).toLocaleDateString("sv-SE") || "");
            setPersonHeight(prototype.killer?.height || "");
            setPersonOwnerId(prototype.killer?.ownerId || "");
            // ---
            setLocationId(prototype.killer?.location.id || "");
            setLocationX(prototype.killer?.location.x || "");
            setLocationY(prototype.killer?.location.y || "");
            setLocationZ(prototype.killer?.location.z || "");
            setLocationOwnerId(prototype.killer?.location.ownerId || "");
            // ---
            setDragonAge(prototype.age || "");
            setDragonDescription(prototype.description || "");
            setDragonWingspan(prototype.wingspan || "");
            setDragonCharacter(prototype.character || "");
            // ---
            setDragonHeadId(prototype.head.id || "");
            setDragonHeadEyesCount(prototype.head.eyesCount || "");
            setDragonHeadToothCount(prototype.head.toothCount || "");
            setDragonHeadOwnerId(prototype.head.ownerId || "");
            // ---
            setDragonOwnerId(prototype.ownerId || "");
            setUpdatedBy(prototype.updatedBy || "");
        }

    }, [prototype]);

    useEffect(() => {
        if (coordinatesExistence) {
            loadDataWrapperWithoutReload(crudReadMany, [`${BASE_URL}/coordinates`])
                .then(rd => {
                    setCoordinates(rd.data);
                })
        } else {
            setCoordinatesId(prototype ? prototype.coordinates.id : -1); // сброс id после возвращения к ручному созданию
        }
    }, [coordinatesExistence]);

    useEffect(() => {
        if (caveExistence) {
            loadDataWrapperWithoutReload(crudReadMany, [`${BASE_URL}/caves`])
                .then(rd => {
                    setCaves(rd.data);
                })
        } else {
            setDragonCaveId(prototype ? prototype.cave.id : -1);
        }
    }, [caveExistence]);

    useEffect(() => {
        if (killerExistence) {
            loadDataWrapperWithoutReload(crudReadMany, [`${BASE_URL}/persons`])
                .then(rd => {
                    setPersons(rd.data);
                })
        } else {
            setPersonId(prototype ? prototype.killer.id : -1);
        }
    }, [killerExistence]);

    // добавить location

    useEffect(() => {
        if (headExistence) {
            loadDataWrapperWithoutReload(crudReadMany, [`${BASE_URL}/heads`])
                .then(rd => {
                    setHeads(rd.data);
                })
        } else {
            setDragonHeadId(prototype ? prototype.head.id : -1);
        }
    }, [headExistence]);

    // основы для полей ввода формы (передаются в FormTextInput и FormSelectInput)

    // ниже в функции валидации преобразование number типа в строковый (иначе ошибка при отмене фокуса на инпут)
    // неактуально для полей id, но нужно для работы других инпутов
    const [dragonId, setDragonId] = useState("");
    const isDragonIdValid = () => {
        return ("" + dragonId).match(regexInt) && dragonId >= 0;
    }

    const [dragonName, setDragonName] = useState("");
    const isDragonNameValid = () => {
        return dragonName !== null && dragonName !== "";
    }

    const [coordinatesId, setCoordinatesId] = useState("");
    const isCoordinatesIdValid = () => {
        return ("" + coordinatesId).match(regexInt) && coordinatesId >= 0;
    }

    const [coordinatesX, setCoordinatesX] = useState("");
    const isCoordinatesXValid = () => {
        return ("" + coordinatesX).match(regexInt) && coordinatesX > -596;
    }

    const [coordinatesY, setCoordinatesY] = useState("");
    const isCoordinatesYValid = () => {
        return coordinatesY === null || coordinatesY === "" || ("" + coordinatesY).match(regexInt);
    }

    const [coordinatesOwnerId, setCoordinatesOwnerId] = useState("");
    const isCoordinatesOwnerIdValid = () => {
        return ("" + coordinatesOwnerId).match(regexInt) && coordinatesOwnerId >= 0;
    }

    const [coordinatesUpdatedBy, setCoordinatesUpdatedBy] = useState("");
    const isCoordinatesUpdatedByValid = () => {
        return ("" + coordinatesUpdatedBy).match(regexInt) && coordinatesUpdatedBy >= 0;
    }

    const [dragonCaveId, setDragonCaveId] = useState("");
    const isDragonCaveIdValid = () => {
        return ("" + dragonCaveId).match(regexInt) && dragonCaveId >= 0;
    }

    const [dragonCaveNumberOfTreasures, setDragonCaveNumberOfTreasures] = useState("");
    const isDragonCaveNumberOfTreasuresValid = () => {
        return ("" + dragonCaveNumberOfTreasures).match(regexFloat) && dragonCaveNumberOfTreasures > 0;
    }

    const [dragonCaveOwnerId, setDragonCaveOwnerId] = useState("");
    const isDragonCaveOwnerIdValid = () => {
        return ("" + dragonCaveOwnerId).match(regexInt) && dragonCaveOwnerId >= 0;
    }

    const [caveUpdatedBy, setCaveUpdatedBy] = useState("");
    const isCaveUpdatedByValid = () => {
        return ("" + caveUpdatedBy).match(regexInt) && caveUpdatedBy >= 0;
    }

    const [personId, setPersonId] = useState("");
    const isPersonIdValid = () => {
        return ("" + personId).match(regexInt) && personId >= 0;
    }

    const [personName, setPersonName] = useState("");
    const isPersonNameValid = () => {
        return personName !== null && personName !== "";
    }

    const [personEyeColor, setPersonEyeColor] = useState("");
    const isPersonEyeColorValid = () => {
        return personEyeColor !== null && personEyeColor !== "";
    }

    const [personHairColor, setPersonHairColor] = useState("");
    const isPersonHairColorValid = () => {
        return true;
    }

    const [locationId, setLocationId] = useState("");
    const isLocationIdValid = () => {
        return ("" + locationId).match(regexInt) && locationId >= 0;
    }

    const [locationX, setLocationX] = useState("");
    const isLocationXValid = () => {
        return ("" + locationX).match(regexInt) || locationX === "";
    }

    const [locationY, setLocationY] = useState("");
    const isLocationYValid = () => {
        return ("" + locationY).match(regexInt) && locationY !== "";
    }

    const [locationZ, setLocationZ] = useState("");
    const isLocationZValid = () => {
        return ("" + locationZ).match(regexInt) || locationZ === "";
    }

    const [locationOwnerId, setLocationOwnerId] = useState("");
    const isLocationOwnerIdValid = () => {
        return ("" + locationOwnerId).match(regexInt) && locationOwnerId >= 0;
    }

    const [locationUpdatedBy, setLocationUpdatedBy] = useState("");
    const isLocationUpdatedByValid = () => {
        return ("" + locationUpdatedBy).match(regexInt) && locationUpdatedBy >= 0;
    }

    const [personBirthday, setPersonBirthday] = useState("");
    const isPersonBirthdayValid = () => {
        return personBirthday !== null && personBirthday !== "";
    }

    const [personHeight, setPersonHeight] = useState("");
    const isPersonHeightValid = () => {
        return ("" + personHeight).match(regexInt) && personHeight > 0;
    }

    const [personOwnerId, setPersonOwnerId] = useState("");
    const isPersonOwnerIdValid = () => {
        return ("" + personOwnerId).match(regexInt) && personOwnerId >= 0;
    }

    const [personUpdatedBy, setPersonUpdatedBy] = useState("");
    const isPersonUpdatedByValid = () => {
        return ("" + personUpdatedBy).match(regexInt) && personUpdatedBy >= 0;
    }

    const [dragonAge, setDragonAge] = useState("");
    const isDragonAgeValid = () => {
        return ("" + dragonAge).match(regexInt) && dragonAge > 0;
    }

    const [dragonDescription, setDragonDescription] = useState("");
    const isDragonDescriptionValid = () => {
        return true;
    }

    const [dragonWingspan, setDragonWingspan] = useState("");
    const isDragonWingspanValid = () => {
        return ("" + dragonWingspan).match(regexInt) && dragonWingspan > 0;
    }

    const [dragonCharacter, setDragonCharacter] = useState("");
    const isDragonCharacterValid = () => {
        return true;
    }

    const [dragonHeadId, setDragonHeadId] = useState("");
    const isDragonHeadIdValid = () => {
        return ("" + dragonHeadId).match(regexInt) && dragonHeadId >= 0;
    }

    const [dragonHeadEyesCount, setDragonHeadEyesCount] = useState("");
    const isDragonHeadEyesCountValid = () => {
        return ("" + dragonHeadEyesCount).match(regexFloat) || dragonHeadEyesCount === "";
    }

    const [dragonHeadToothCount, setDragonHeadToothCount] = useState("");
    const isDragonHeadToothCountValid = () => {
        return ("" + dragonHeadToothCount).match(regexFloat) && dragonHeadToothCount !== "";
    }

    const [dragonHeadOwnerId, setDragonHeadOwnerId] = useState("");
    const isDragonHeadOwnerIdValid = () => {
        return ("" + dragonHeadOwnerId).match(regexInt) && dragonHeadOwnerId >= 0;
    }

    const [headUpdatedBy, setHeadUpdatedBy] = useState("");
    const isHeadUpdatedByValid = () => {
        return ("" + headUpdatedBy).match(regexInt) && headUpdatedBy >= 0;
    }

    const [dragonOwnerId, setDragonOwnerId] = useState("");
    const isDragonOwnerIdValid = () => {
        return ("" + dragonOwnerId).match(regexInt) && dragonOwnerId >= 0;
    }

    const [updatedBy, setUpdatedBy] = useState("");
    const isUpdatedByValid = () => {
        return ("" + updatedBy).match(regexInt) && updatedBy >= 0;
    }

    const isFormValid = () => {
        return isDragonNameValid() && isCoordinatesXValid() && isCoordinatesYValid()
            && isDragonCaveNumberOfTreasuresValid() && isPersonNameValid() && isPersonEyeColorValid()
            && isPersonHairColorValid() && isLocationXValid() && isLocationYValid() && isLocationZValid()
            && isPersonBirthdayValid() && isPersonHeightValid() && isDragonAgeValid() && isDragonDescriptionValid()
            && isDragonWingspanValid() && isDragonCharacterValid() && isDragonHeadEyesCountValid() && isDragonHeadToothCountValid()
    }

    const [isValid, setIsValid] = useState(isFormValid());

    // useEffect

    const [coordinatesSelectState, setCoordinatesSelectState] = useState("");
    const [dragonCaveSelectState, setDragonCaveSelectState] = useState("");
    const [personSelectState, setPersonSelectState] = useState("");
    const [dragonHeadSelectState, setDragonHeadSelectState] = useState("");

    return (
        <div className={styles.form_wrapper}>
            <form> {/* onChange={() => setIsValid(isFormValid())} TODO: валидация :( */}
                <h2>Информация о драконе</h2>
                <div className="form-section">
                    <FormTextInput
                        label="Имя дракона:"
                        errorMessage="Значение поля 'Имя дракона' не может быть пустым!"
                        value={dragonName}
                        setValue={setDragonName}
                        isValid={isDragonNameValid}
                    />
                </div>

                {/*------------*/}

                <h2>Координаты</h2>
                <label>
                    <input type="checkbox" value={coordinatesExistence}
                           onChange={() => setCoordinatesExistence((prev) => !prev)}/>
                    Выбрать из существующих?
                </label>
                <br/><br/>

                <div className="form-section">
                    {
                        coordinatesExistence ? (
                            <>
                                <select
                                    name="coordinates"
                                    value={coordinatesSelectState}
                                    onChange={(e) => {
                                        setCoordinatesSelectState(e.target.value);
                                        setCoordinatesId(JSON.parse(e.target.value).id);
                                        setCoordinatesX(JSON.parse(e.target.value).x);
                                        setCoordinatesY(JSON.parse(e.target.value).y);
                                    }}
                                >
                                    <option value="" disabled>Выберите объект:</option>
                                    {(coordinates && coordinates.length > 0) && coordinates.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                    {(!coordinates || coordinates.length === 0) &&
                                        <option value="" disabled>&lt;пусто&gt;</option>}
                                </select>
                            </>
                        ) : (
                            <>
                                <FormTextInput
                                    label="Координаты: x:"
                                    errorMessage="Значение поля 'Координаты: x' должно быть представлено в виде числа и быть больше -596!"
                                    value={coordinatesX}
                                    setValue={setCoordinatesX}
                                    isValid={isCoordinatesXValid}
                                />
                                <FormTextInput
                                    label="Координаты: y:"
                                    errorMessage="Значение поля 'Координаты: y' должно быть представлено в виде числа или отсутствовать вовсе!"
                                    value={coordinatesY}
                                    setValue={setCoordinatesY}
                                    isValid={isCoordinatesYValid}
                                />
                                <br/>
                                <label>
                                    <input type="checkbox" value={coordinatesEditingAllowed}
                                           onClick={() => setCoordinatesEditingAllowed((prev) => (!prev))}/>
                                    Разрешить редактирование и удаление Администраторами?
                                </label>
                            </>
                        )
                    }
                </div>

                {/*------------*/}

                <h2>Пещера</h2>

                <label>
                    <input type="checkbox" value={caveExistence}
                           onChange={() => setCaveExistence((prev) => !prev)}/>
                    Выбрать из существующих?
                </label>
                <br/><br/>

                <div className="form-section">
                    {
                        caveExistence ? (
                            <>
                                <select
                                    value={dragonCaveSelectState}
                                    onChange={(e) => {
                                        setDragonCaveId(JSON.parse(e.target.value).id);
                                        setDragonCaveSelectState(e.target.value);
                                        setDragonCaveNumberOfTreasures(JSON.parse(e.target.value).numberOfTreasures);
                                    }}
                                >
                                    <option value="" disabled>Выберите объект:</option>
                                    {(caves && caves.length > 0) && caves.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                    {(!caves || caves.length === 0) &&
                                        <option value="" disabled>&lt;пусто&gt;</option>}
                                </select>
                            </>
                        ) : (
                            <>
                                <FormTextInput
                                    label="Количество сокровищ:"
                                    errorMessage="Значение поля 'Количество сокровищ' должно быть больше нуля!"
                                    value={dragonCaveNumberOfTreasures}
                                    setValue={setDragonCaveNumberOfTreasures}
                                    isValid={isDragonCaveNumberOfTreasuresValid}
                                />
                                <br/>
                                <label>
                                    <input type="checkbox" value={caveEditingAllowed}
                                           onClick={() => setCaveEditingAllowed((prev) => (!prev))}/>
                                    Разрешить редактирование и удаление Администраторами?
                                </label>
                            </>
                        )
                    }
                </div>

                {/*------------*/}

                <h2>Убийца дракона
                    <input
                        type="checkbox"
                        checked={dragonKillerInputNotNull}
                        onChange={() => setDragonKillerInputNotNull((prev) => !prev)}
                    />
                </h2>

                {
                    dragonKillerInputNotNull ?
                    (
                        <>
                            <label>
                                <input type="checkbox" value={killerExistence}
                                       onChange={() => setKillerExistence((prev) => !prev)}/>
                                Выбрать из существующих?
                            </label>
                            <br/><br/>

                            <div className="form-section">
                                {
                                    killerExistence ? (
                                        <>
                                            <select
                                                value={personSelectState}
                                                onChange={(e) => {
                                                    setPersonId(JSON.parse(e.target.value).id);
                                                    setPersonSelectState(e.target.value);
                                                    setPersonName(JSON.parse(e.target.value).name);
                                                    setPersonEyeColor(JSON.parse(e.target.value).eyeColor);
                                                    setPersonHairColor(JSON.parse(e.target.value).hairColor);
                                                    setLocationId(JSON.parse(e.target.value).location.id);
                                                    setLocationX(JSON.parse(e.target.value).location.x);
                                                    setLocationY(JSON.parse(e.target.value).location.y);
                                                    setLocationZ(JSON.parse(e.target.value).location.z);
                                                    setPersonBirthday(JSON.parse(e.target.value).birthday);
                                                    setPersonHeight(JSON.parse(e.target.value).height)
                                                }}
                                            >
                                                <option value="" disabled>Выберите объект:</option>
                                                {(persons && persons.length > 0) && persons.map((option, index) => (
                                                    <option key={index} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                                {(!persons || persons.length === 0) &&
                                                    <option value="" disabled>&lt;пусто&gt;</option>}
                                            </select>
                                        </>
                                    ) : (
                                        <>
                                            <FormTextInput
                                                label="Имя:"
                                                errorMessage="Значение поля 'Имя' не может быть пустым!"
                                                value={personName}
                                                setValue={setPersonName}
                                                isValid={isPersonNameValid}
                                            />

                                            {/* инпут */}
                                            <div className={styles.form_group}>
                                                <label>Цвет глаз:</label>
                                                <select
                                                    value={personEyeColor}
                                                    onChange={(e) => setPersonEyeColor(e.target.value)}
                                                    onBlur={() => setKillerEyeColorTouched(true)}
                                                >
                                                    <option value="" disabled>Выберите цвет</option>
                                                    {colorList && colorList.map((option, index) => (
                                                        <option key={index} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            {/* ошибка */}
                                            <div className={styles.form_group}>
                                                {
                                                    killerEyeColorTouched && !isPersonEyeColorValid ?
                                                        <span
                                                            style={{color: "red"}}>Значение поля &apos;Цвет глаз&apos; не может быть пустым!</span> : <></>
                                                }
                                            </div>

                                            {/* инпут */}
                                            <div className={styles.form_group}>
                                                <label>Цвет волос:</label>
                                                <select value={personHairColor} name="killer.hairColor"
                                                        onChange={(e) => setPersonHairColor(e.target.value)}>
                                                    <option value="">Выберите цвет</option>
                                                    {colorList && colorList.map((option, index) => (
                                                        <option key={index} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <FormTextInput
                                                inputType="text"
                                                label="Координаты: x:"
                                                errorMessage="Значение поля 'Местоположение: x' должно быть представлено целым числом или отсутствовать вовсе!"
                                                value={locationX}
                                                setValue={setLocationX}
                                                isValid={isLocationXValid}
                                            />

                                            <FormTextInput
                                                label="Координаты: y:"
                                                errorMessage="Значение поля 'Местоположение: y' должно быть представлено целым числом!"
                                                value={locationY}
                                                setValue={setLocationY}
                                                isValid={isLocationYValid}
                                            />

                                            <FormTextInput
                                                label="Координаты: z:"
                                                errorMessage="Значение поля 'Местоположение: z' должно быть представлено целым числом или отсутствовать вовсе!"
                                                value={locationZ}
                                                setValue={setLocationZ}
                                                isValid={isLocationZValid}
                                            />

                                            <FormTextInput
                                                inputType="date"
                                                label="День рождения:"
                                                errorMessage="Значение поля 'День рождения' не может быть пустым!"
                                                value={personBirthday}
                                                setValue={setPersonBirthday}
                                                isValid={isPersonBirthdayValid}
                                            />

                                            <FormTextInput
                                                label="Рост:"
                                                errorMessage="Значение поля 'Рост' должно быть больше нуля!"
                                                value={personHeight}
                                                setValue={setPersonHeight}
                                                isValid={isPersonHeightValid}
                                            />

                                            <br/>

                                            <label>
                                                <input type="checkbox" value={personEditingAllowed}
                                                       onClick={() => setPersonEditingAllowed((prev) => (!prev))}/>
                                                Разрешить редактирование и удаление Администраторами?
                                            </label>
                                        </>
                                    )
                                }
                            </div>
                        </>
                    ) : (<><p>&lt;скрыто&gt;</p></>)
                }


                {/*------------*/}

                <h2>Детали о драконе</h2>
                <div className="form-section">
                    <FormTextInput
                        label="Возраст:"
                        errorMessage="Значение поля 'Возраст' должно быть больше нуля!"
                        value={dragonAge}
                        setValue={setDragonAge}
                        isValid={isDragonAgeValid}
                    />
                    <FormTextInput
                        label="Описание:"
                        errorMessage=""
                        value={dragonDescription}
                        setValue={setDragonDescription}
                        isValid={isDragonDescriptionValid}
                    />
                    <FormTextInput
                        label="Размах крыльев:"
                        errorMessage="Значение поля 'Размах крыльев' должно быть больше нуля!"
                        value={dragonWingspan}
                        setValue={setDragonWingspan}
                        isValid={isDragonWingspanValid}
                    />

                    {/* инпут */}
                    <div className={styles.form_group}>
                        <label>Характер:</label>
                        <select value={dragonCharacter} name="character"
                                onChange={(e) => setDragonCharacter(e.target.value)}>
                            <option value="">Выберите характер</option>
                            {dragonCharacterList && dragonCharacterList.map((option, index) => ( // TODO: словарь -> ключи и значения
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>

                {/*------------*/}

                <h2>Голова дракона</h2>

                <label>
                    <input type="checkbox" value={headExistence}
                           onChange={() => setHeadExistence((prev) => !prev)}/>
                    Выбрать из существующих?
                </label>
                <br/><br/>

                <div className="form-section">
                    {
                        headExistence ? (
                            <>
                                <select
                                    value={dragonHeadSelectState}
                                    onChange={(e) => {
                                        setDragonHeadSelectState(e.target.value);
                                        setDragonHeadId(JSON.parse(e.target.value).id);
                                        setDragonHeadEyesCount(JSON.parse(e.target.value).eyesCount);
                                        setDragonHeadToothCount(JSON.parse(e.target.value).toothCount);
                                    }}
                                >
                                    <option value="" disabled>Выберите объект:</option>
                                    {(heads && heads.length > 0) && heads.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                    {(!heads || heads.length === 0) &&
                                        <option value="" disabled>&lt;пусто&gt;</option>}
                                </select>
                            </>
                        ) : (
                            <>
                                <FormTextInput
                                    label="Количество глаз:"
                                    errorMessage="Значение поля 'Количество глаз' должно быть представлено в виде десятичного числа или отсутствовать вовсе!"
                                    value={dragonHeadEyesCount}
                                    setValue={setDragonHeadEyesCount}
                                    isValid={isDragonHeadEyesCountValid}
                                />
                                <FormTextInput
                                    label="Количество зубов:"
                                    errorMessage="Значение поля 'Количество зубов' должно быть представлено в виде десятичного числа!"
                                    value={dragonHeadToothCount}
                                    setValue={setDragonHeadToothCount}
                                    isValid={isDragonHeadToothCountValid}
                                />
                                <br/>
                                <label>
                                    <input type="checkbox" value={headEditingAllowed}
                                           onClick={() => setHeadEditingAllowed((prev) => (!prev))}/>
                                    Разрешить редактирование и удаление Администраторами?
                                </label>
                            </>
                        )
                    }
                </div>
                <br/>

                {/*------------*/}

                <div className="form-section">
                    <label>
                        <input type="checkbox" value={editingAllowed}
                               onClick={() => setEditingAllowed((prev) => (!prev))}/>
                        Разрешить редактирование и удаление Администраторами?
                    </label>
                </div>
                <br/>

                {/*------------*/}

                <button onClick={(e) => handleSubmit(e)}>CREATE</button>
                {/* (disabled={!isValid}) TODO: валидация :( */}
            </form>
        </div>
    )
}

export default CreateDragon
