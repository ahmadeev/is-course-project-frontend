import React from 'react';
import {Link} from "react-router-dom";
import DlcList from "../DlcCard/DlcCard.jsx";


const DynamicDataTextModule = ({ data }) => {
    return (
        <>
            <div>
{/*                {data && data.map((dlc, index) => (
                    <div key={index}>
                        <h2>{dlc.name}</h2>
                        <p>Release date: {new Date(dlc.releaseDate[0], dlc.releaseDate[1], dlc.releaseDate[2]).toLocaleDateString()}</p>
                        <p>Description: {dlc.description}</p>
                        <p>Survivors:</p>
                        {dlc.survivors && dlc.survivors.map((survivor, index) => (
                            <div key={index}>
                                <p><Link to={`/perk/${survivor.name}`}>{survivor.name}</Link></p>
                            </div>
                        ))}
                        <p>Killers:</p>
                        {dlc.killers && dlc.killers.map((killer, index) => (
                            <div key={index}>
                                <p><Link to={`/perk/${killer.name}`}>{killer.name}</Link></p>
                            </div>
                        ))}
                    </div>
                ))}*/}
                <DlcList data={data} />
            </div>
        </>
    )
};

export default DynamicDataTextModule;