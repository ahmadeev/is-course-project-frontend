import React, {useEffect, useState} from 'react';

const FileUploader = ({ setAlertMessageParentState, setAlertStatusParentState }) => {
    const BASE_URL = "http://localhost:8080/backend-jakarta-ee-1.0-SNAPSHOT/api/user/import/csv";
    const FILE_LOWER_LIMIT = 1;

    const [files, setFiles] = useState([]);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const handleFileChange = (e) => {
        // сохраняем все выбранные файлы
        setFiles([...e.target.files]);
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            setAlertMessageParentState('Выберите файлы!');
            setAlertStatusParentState((prev) => !prev);
            return;
        }

        const formData = new FormData();

        // добавляем каждый файл в FormData с ключом "files"
        files.forEach((file) => {
            formData.append('files', file); // используем "files" вместо "file"
        });

        try {
            const response = await fetch(BASE_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('session-token')}`,
                },
                body: formData,
            });

            if (!response.ok) throw new Error('Ошибка загрузки');

            setAlertMessageParentState('Файлы успешно загружены!');
            setAlertStatusParentState((prev) => !prev);
        } catch (error) {
            setAlertMessageParentState('Произошла ошибка: ' + error.message);
            setAlertStatusParentState((prev) => !prev);
        }
    };

    useEffect(() => {
        files.length >= FILE_LOWER_LIMIT ? setIsButtonDisabled(false) : setIsButtonDisabled(true);
    }, [files]);

    return (
        <div>
            <input type="file" onChange={handleFileChange} multiple />
            <button onClick={handleUpload} disabled={isButtonDisabled}>Загрузить</button>
            {0 < files.length && files.length < FILE_LOWER_LIMIT ? <p style={{color: "red"}}>Загрузите не менее {FILE_LOWER_LIMIT} файлов!</p> : <></>}
        </div>
    );
};

export default FileUploader;