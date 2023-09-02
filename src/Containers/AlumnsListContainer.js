import { useState } from 'react';

import AlumnsListComponent from "../Components/AlumnsListComponent";

function AlumnsListContainer({ alumns, openAlumnShow }) {
    const [searchTerm, setSearchTerm] = useState("");

    let filteredAlumns = [];
    let showNoResultFoundListItem = false;

    if (searchTerm && searchTerm.length > 0) {
        filteredAlumns = alumns.filter((alumn) => alumn.full_name.toLowerCase().includes(searchTerm.toLowerCase()));
    } else {
        filteredAlumns = alumns;
    }

    if (alumns.length > 0 && filteredAlumns.length === 0) {
        showNoResultFoundListItem = true;
    } else {
        showNoResultFoundListItem = false;
    }


    return (
        <AlumnsListComponent
            filteredAlumns={filteredAlumns}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            openAlumnShow={openAlumnShow}
            showNoResultFoundListItem={showNoResultFoundListItem}
        />
    );
}

export default AlumnsListContainer;