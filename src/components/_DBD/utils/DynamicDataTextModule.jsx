import React from 'react';
import DlcList from "../DlcCard/DlcCard.jsx";


const DynamicDataTextModule = ({ data }) => {
    return (
        <>
            <div>
                <DlcList data={data} />
            </div>
        </>
    )
};

export default DynamicDataTextModule;