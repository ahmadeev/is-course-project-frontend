import React, { createContext, useState, useEffect, useContext } from "react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    // TODO: dev
    const bu = "http://localhost:25000/is-course-project-1.0-SNAPSHOT/api";

    // TODO: prod
    // const bu = "/api";

    const [BASE_URL, setBASE_URL] = useState(bu);
    // ------
    const [dlc, setDlc] = useState(null);

    const [isDlcLoaded, setDlcLoaded] = useState(false);

    const DLC_URL = `${BASE_URL}/dlc`;

    const [survivorPerks, setSurvivorPerks] = useState([]);
    const [killerPerks, setKillerPerks] = useState([]);
    // ------
    const [favoriteSurvivorBuilds, setFavoriteSurvivorBuilds] = useState([]);
    const [favoriteKillerBuilds, setFavoriteKillerBuilds] = useState([]);

    const [isFavoriteLoaded, setIsFavoriteLoaded] = useState(false);

    const FAVORITE_SURVIVOR_BUILDS_URL = `${BASE_URL}/favorites/build/survivor`;
    const FAVORITE_KILLER_BUILDS_URL = `${BASE_URL}/favorites/build/killer`;

    const [favoriteSurvivorBuildIds, setFavoriteSurvivorBuildIds] = useState([]);
    const [favoriteKillerBuildIds, setFavoriteKillerBuildIds] = useState([]);
    // ------
    const [ratedSurvivorBuilds, setRatedSurvivorBuilds] = useState([]);
    const [ratedKillerBuilds, setRatedKillerBuilds] = useState([]);

    const [isRatedLoaded, setIsRatedLoaded] = useState(false);

    // TODO: rating -> ratings
    const RATED_SURVIVOR_BUILDS_URL = `${BASE_URL}/build/survivor/ratings`;
    const RATED_KILLER_BUILDS_URL = `${BASE_URL}/build/killer/ratings`;


    useEffect(() => {
        console.log(favoriteKillerBuildIds);
    }, [favoriteKillerBuildIds])

    useEffect(() => {
        console.log("Загрузка перков")
        console.log("Перки Выживших: ", survivorPerks)
        console.log("Перки Убийц: ", killerPerks)
        const fetchData  = async () => {
            if (!isDlcLoaded) {
                await fetch(DLC_URL, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('session-token')}`
                    }
                })
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

    useEffect(() => {
        const fetchFavoriteBuilds = async () => {
            try {
                const [survivorResponse, killerResponse] = await Promise.all([
                    fetch(FAVORITE_SURVIVOR_BUILDS_URL, {
                        headers: {
                            'Authorization': `Bearer ${sessionStorage.getItem('session-token')}`
                        }
                    }).then(res => res.json()),
                    fetch(FAVORITE_KILLER_BUILDS_URL, {
                        headers: {
                            'Authorization': `Bearer ${sessionStorage.getItem('session-token')}`
                        }
                    }).then(res => res.json())
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [survivorResponse, killerResponse] = await Promise.all([
                    fetch(RATED_SURVIVOR_BUILDS_URL, {
                        headers: {
                            'Authorization': `Bearer ${sessionStorage.getItem('session-token')}`
                        }
                    }).then(res => res.json()),
                    fetch(RATED_KILLER_BUILDS_URL, {
                        headers: {
                            'Authorization': `Bearer ${sessionStorage.getItem('session-token')}`
                        }
                    }).then(res => res.json())
                ]);

                if (survivorResponse.status !== 'SUCCESS') throw new Error('Survivor fetch failed');
                if (killerResponse.status !== 'SUCCESS') throw new Error('Killer fetch failed');

                const survivorBuilds = Array.isArray(survivorResponse.data) ? survivorResponse.data : [];
                const killerBuilds = Array.isArray(killerResponse.data) ? killerResponse.data : [];

                setRatedSurvivorBuilds(survivorBuilds);
                setRatedKillerBuilds(killerBuilds);
            } catch (error) {
                console.error('Error fetching rated builds:', error);
                setRatedKillerBuilds([]);
                setRatedSurvivorBuilds([]);
            } finally {
                setIsRatedLoaded(true);
            }
        }

        if(!isRatedLoaded) fetchData();
    }, [isRatedLoaded]);

    return (
        <DataContext.Provider value={{
            BASE_URL,
            dlc,
            survivorPerks, killerPerks,
            favoriteSurvivorBuildIds, setFavoriteSurvivorBuildIds, favoriteKillerBuildIds, setFavoriteKillerBuildIds, setIsFavoriteLoaded,
            ratedSurvivorBuilds, ratedKillerBuilds, isRatedLoaded, setIsRatedLoaded
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
