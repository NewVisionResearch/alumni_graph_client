import { useState } from "react";

import AlumnsListContainer from "./AlumnsListContainer";

function AlumnsListController({
    alumns,
    handleAlumnShowAndTourSteps,
    isAlumnListLoading,
}) {
    const [searchTerm, setSearchTerm] = useState("");

    let filteredAlumns = [];
    let showNoResultFoundListItem = false;
    let showPleaseAddResearchersListItem = false;

    if (searchTerm && searchTerm.length > 0) {
        filteredAlumns = alumns.filter((alumn) =>
            alumn.full_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    } else {
        filteredAlumns = alumns;
    }

    if (alumns.length > 0 && filteredAlumns.length === 0) {
        showNoResultFoundListItem = true;
    } else {
        showNoResultFoundListItem = false;
    }

    if (alumns.length === 0) {
        showPleaseAddResearchersListItem = true;
    } else {
        showPleaseAddResearchersListItem = false;
    }

    return (
        <AlumnsListContainer
            filteredAlumns={filteredAlumns}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleAlumnShowAndTourSteps={handleAlumnShowAndTourSteps}
            showNoResultFoundListItem={showNoResultFoundListItem}
            showPleaseAddResearchersListItem={showPleaseAddResearchersListItem}
            isAlumnListLoading={isAlumnListLoading}
        />
    );
}

export default AlumnsListController;
