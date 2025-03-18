import React, { createContext, useState, useEffect, useContext } from "react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [dlc, setDls] = useState(null);
    const [isDlcLoaded, setDlcLoaded] = useState(false);
    const DLC_URL = "http://localhost:25000/is-course-project-1.0-SNAPSHOT/api/dlc";

    const [survivorPerks, setSurvivorPerks] = useState([]);
    const [killerPerks, setKillerPerks] = useState([]);

    useEffect(() => {
        const fetchData  = async () => {
            console.log("looking for dlcs")
            if (!isDlcLoaded) {
                console.log("loading dlcs")
                await fetch(DLC_URL)
                    .then((res) => res.json())
                    .then((result) => {
                        setDls(result);
                        setDlcLoaded(true);
                        return result;
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
            console.log(survivorPerks);
            console.log(killerPerks);
        }
        fetchData();
    }, [isDlcLoaded]);

    return (
        <DataContext.Provider value={{dlc, survivorPerks, killerPerks}}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
