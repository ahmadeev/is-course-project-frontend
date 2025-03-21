import React, { createContext, useState, useEffect, useContext } from "react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    // ------
    const [dlc, setDlc] = useState(null);
    const [isDlcLoaded, setDlcLoaded] = useState(false);
    const DLC_URL = "http://localhost:25000/is-course-project-1.0-SNAPSHOT/api/dlc";

    const [survivorPerks, setSurvivorPerks] = useState([]);
    const [killerPerks, setKillerPerks] = useState([]);
    // ------
    const [favoriteSurvivorBuilds, setFavoriteSurvivorBuilds] = useState([]);
    const [favoriteKillerBuilds, setFavoriteKillerBuilds] = useState([]);

    const [favoriteSurvivorBuildIds, setFavoriteSurvivorBuildIds] = useState([]);
    const [favoriteKillerBuildIds, setFavoriteKillerBuildIds] = useState([]);

    const [isFavoriteLoaded, setIsFavoriteLoaded] = useState(false);
    const FAVORITE_SURVIVOR_BUILDS_URL = "http://localhost:25000/is-course-project-1.0-SNAPSHOT/api/favorites/build/survivor";
    const FAVORITE_KILLER_BUILDS_URL = "http://localhost:25000/is-course-project-1.0-SNAPSHOT/api/favorites/build/killer";
    // ------

    useEffect(() => {
        console.log(favoriteKillerBuildIds);
    }, [favoriteKillerBuildIds])

    useEffect(() => {
        console.log("Загрузка перков")
        console.log("Перки Выживших: ", survivorPerks)
        console.log("Перки Убийц: ", killerPerks)
        const fetchData  = async () => {
            if (!isDlcLoaded) {
                await fetch(DLC_URL)
                    .then((res) => res.json())
                    .then((result) => {
                        setDlc(result.data);
                        setDlcLoaded(true);
                        return result.data;
                    })
                    .then((result) => {
                        for(const dlc of result) {
                            for(const survivor of dlc.survivors) {
                                for(const perk of survivor.perks) {
                                    setSurvivorPerks((prev) => [...prev, perk]);
                                }
                            }
                            for(const killer of dlc.killers) {
                                for(const perk of killer.perks) {
                                    setKillerPerks((prev) => [...prev, perk]);
                                }
                            }
                        }
                    })
                    .catch(console.error);
            }
        }
        fetchData();
    }, [isDlcLoaded]);

/*    useEffect(() => {
/!*        const fetchData  = async () => {
            if (!isFavoriteLoaded) {
                await fetch(FAVORITE_SURVIVOR_BUILDS_URL)
                    .then((res) => res.json())
                    .then((result) => {
                        setFavoriteSurvivorBuilds(result.data);
                        // setIsFavoriteLoaded(true);
                        console.log(result.data)
                        return result.data;
                    })
                    .then((result) => {
                        const ids = result.map(build => build.id);
                        setFavoriteSurvivorBuildIds(ids);
                    })
                    .catch(console.error);

                await fetch(FAVORITE_KILLER_BUILDS_URL)
                    .then((res) => res.json())
                    .then((result) => {
                        setFavoriteKillerBuilds(result.data);
                        // setIsFavoriteLoaded(true);
                        return result.data;
                    })
                    .then((result) => {
                        const ids = result.map(build => build.id);
                        setFavoriteKillerBuildIds(ids);
                    })
                    .catch(console.error);

                setIsFavoriteLoaded(true);
            }
        }
        fetchData();*!/

        const fetchFavoriteBuilds = async () => {
            try {
                // Запускаем оба запроса параллельно
                const [survivorResponse, killerResponse] = await Promise.all([
                    fetch(FAVORITE_SURVIVOR_BUILDS_URL)
                        .then(res => res.json()),
                    fetch(FAVORITE_KILLER_BUILDS_URL)
                        .then(res => res.json())
                ]);

                // Проверяем статусы ответов
                if (survivorResponse.status !== 'SUCCESS') {
                    throw new Error(survivorResponse.message || 'Error fetching favorite survivor builds');
                }
                if (killerResponse.status !== 'SUCCESS') {
                    throw new Error(killerResponse.message || 'Error fetching favorite killer builds');
                }

                // Обрабатываем данные
                const survivorBuilds = Array.isArray(survivorResponse.data) ? survivorResponse.data : [];
                const killerBuilds = Array.isArray(killerResponse.data) ? killerResponse.data : [];

                // Обновляем состояние
                setFavoriteSurvivorBuilds(survivorBuilds);
                setFavoriteSurvivorBuildIds(survivorBuilds.map(build => build.id));
                setFavoriteKillerBuilds(killerBuilds);
                setFavoriteKillerBuildIds(killerBuilds.map(build => build.id));

                console.log('Survivor builds:', survivorBuilds);
                console.log('Killer builds:', killerBuilds);
            } catch (error) {
                console.error('Error fetching favorite builds:', error);
                // Сбрасываем состояние в случае ошибки
                setFavoriteSurvivorBuilds([]);
                setFavoriteSurvivorBuildIds([]);
                setFavoriteKillerBuilds([]);
                setFavoriteKillerBuildIds([]);
            }
        };

        // Вызываем функцию
        fetchFavoriteBuilds();
        return setIsFavoriteLoaded(true);
    }, [isFavoriteLoaded])*/

    useEffect(() => {
        const fetchFavoriteBuilds = async () => {
            try {
                const [survivorResponse, killerResponse] = await Promise.all([
                    fetch(FAVORITE_SURVIVOR_BUILDS_URL).then(res => res.json()),
                    fetch(FAVORITE_KILLER_BUILDS_URL).then(res => res.json())
                ]);

                if (survivorResponse.status !== 'SUCCESS') throw new Error('Survivor fetch failed');
                if (killerResponse.status !== 'SUCCESS') throw new Error('Killer fetch failed');

                const survivorBuilds = Array.isArray(survivorResponse.data) ? survivorResponse.data : [];
                const killerBuilds = Array.isArray(killerResponse.data) ? killerResponse.data : [];

                setFavoriteSurvivorBuilds(survivorBuilds);
                setFavoriteSurvivorBuildIds(survivorBuilds.map(build => Number(build.id)));
                setFavoriteKillerBuilds(killerBuilds);
                setFavoriteKillerBuildIds(killerBuilds.map(build => Number(build.id)));
            } catch (error) {
                console.error('Error fetching favorite builds:', error);
                setFavoriteSurvivorBuilds([]);
                setFavoriteSurvivorBuildIds([]);
                setFavoriteKillerBuilds([]);
                setFavoriteKillerBuildIds([]);
            } finally {
                setIsFavoriteLoaded(true);
            }
        };

        if (!isFavoriteLoaded) fetchFavoriteBuilds();
    }, [isFavoriteLoaded]);

    return (
        <DataContext.Provider value={{
            dlc,
            survivorPerks, killerPerks,
            favoriteSurvivorBuildIds, setFavoriteSurvivorBuildIds, favoriteKillerBuildIds, setFavoriteKillerBuildIds, setIsFavoriteLoaded
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
