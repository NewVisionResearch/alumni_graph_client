import { useCallback, useState, useEffect, useContext } from "react";
import { useTour } from "@reactour/tour";

import DashboardContainer from "./DashboardContainer";
import { deleteAlumn, fetchAlumnsIndex } from "../../services/api";
import { AdminContext } from "../../Context/AdminContext/AdminContext";
import {
    ADD_RESEARCHER_INITIAL_STEPS,
    ALUMN_SHOW_STEPS,
    ALUMNS_LIST_STEPS,
} from "../../Constants/TourSteps";

function DashboardController() {
    const [alumns, setAlumns] = useState([]);
    const [alumnShowIdAndName, setAlumnShowIdAndName] = useState(null);
    const [isAlumnListLoading, setIsAlumnListLoading] = useState(true);
    const [progressMap, setProgressMap] = useState(new Map());
    const [selectedAlumnId, setSelectedAlumnId] = useState(null);

    const {
        isOpen: isTourOpen,
        steps: tourSteps,
        setIsOpen: setIsTourOpen,
        setCurrentStep: setCurrentTourStep,
        setSteps: setTourSteps,
        setDisabledActions: setTourDisabledActions,
    } = useTour();

    const admin = useContext(AdminContext);

    const handleDeleteAlumn = async (alumn_id) => {
        try {
            const res = await deleteAlumn(alumn_id);

            if (!res.ok) throw res;

            setAlumns((prevAlumns) =>
                prevAlumns.filter((alumn) => alumn.alumn_id !== alumn_id)
            );
            setAlumnShowIdAndName(null);
        } catch (error) {
            throw error;
        }
    };

    const toggleTour = () => {
        setIsTourOpen((prev) => !prev);
    };

    const handleAlumnShowAndTourSteps = (alumn_id, full_name) => {
        setAlumnShowIdAndName({ alumn_id, full_name });
        handleChangeSteps(
            (prevSteps) => {
                if (tourSteps.some((step) => step.selector === ".alumn-show")) {
                    return prevSteps;
                }
                return [
                    ...ADD_RESEARCHER_INITIAL_STEPS,
                    ...ALUMN_SHOW_STEPS,
                    ...ALUMNS_LIST_STEPS,
                ];
            },
            4,
            false,
            false
        );
    };

    const handleChangeSteps = (
        newStepsOrFunction,
        stepNumber,
        isDisabled,
        bypass = false
    ) => {
        if (isTourOpen || bypass) {
            if (typeof newStepsOrFunction === "function") {
                setTourSteps((prevSteps) => newStepsOrFunction(prevSteps));
            } else {
                setTourSteps(newStepsOrFunction);
            }

            if (stepNumber !== -1) {
                setCurrentTourStep(stepNumber);
            }

            setTourDisabledActions(isDisabled);
        }
    };

    const isSoloTour = (selector) => {
        const soloTourSelectors = [
            '[data-tour="query-results-modal"]',
            '[data-tour="add-researcher-modal"]',
            '[data-tour="add-researcher-dropdown-menu"]',
        ];

        return soloTourSelectors.includes(selector);
    };

    const handleAlumnsChange = useCallback(
        (alumnsLength) => {
            if (alumnsLength === 0 && !isAlumnListLoading) {
                if (!isTourOpen) {
                    handleChangeSteps(
                        ADD_RESEARCHER_INITIAL_STEPS,
                        0,
                        false,
                        true
                    );
                    setIsTourOpen(true);
                }
            } else if (alumnsLength > 0) {
                if (!isSoloTour(tourSteps[0].selector)) {
                    handleChangeSteps(
                        (prevSteps) => {
                            if (
                                prevSteps[prevSteps.length - 1].selector ===
                                ".alumns-list"
                            ) {
                                return prevSteps;
                            }

                            return [...prevSteps, ...ALUMNS_LIST_STEPS];
                        },
                        -1,
                        false,
                        true
                    );
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isAlumnListLoading, tourSteps]
    );

    const handleItemClick = (alumnId, alumnFullName) => {
        setSelectedAlumnId(alumnId);
        handleAlumnShowAndTourSteps(alumnId, alumnFullName);
    };

    const memoizedAlumnFetch = useCallback(async () => {
        setIsAlumnListLoading(true);

        try {
            const res = await fetchAlumnsIndex(admin.labId);

            if (!res.ok) {
                throw res;
            }
            const alumnsArray = await res.json();

            return setAlumns([...alumnsArray]);
        } catch (res) {
            console.error(res);
        } finally {
            setIsAlumnListLoading(false);
        }
    }, [admin.labId]);

    useEffect(() => {
        if (admin.labId !== "") {
            memoizedAlumnFetch();
        }
    }, [admin.labId, memoizedAlumnFetch]);

    useEffect(() => {
        handleAlumnsChange(alumns.length);
    }, [alumns.length, handleAlumnsChange]);

    return (
        <DashboardContainer
            handleItemClick={handleItemClick}
            handleTourClick={toggleTour}
            handleChangeSteps={handleChangeSteps}
            handleDeleteAlumn={handleDeleteAlumn}
            alumns={alumns}
            setAlumns={setAlumns}
            alumnShowIdAndName={alumnShowIdAndName}
            isAlumnListLoading={isAlumnListLoading}
            progressMap={progressMap}
            setProgressMap={setProgressMap}
            selectedAlumnId={selectedAlumnId}
        />
    );
}

export default DashboardController;
