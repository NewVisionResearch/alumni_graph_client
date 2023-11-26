import Button from "react-bootstrap/Button";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import ListGroup from "react-bootstrap/ListGroup";
import Spinner from "react-bootstrap/Spinner";

import EditAlumnForm from "./EditAlumnForm/EditAlumnForm";
import PublicationDisplayCheck from "./PublicationDisplayCheck/PublicationDisplayCheck";
import Loading from "../../../Components/Loading/Loading";
import { byDate, byCoAuthors, sortByTwoFns } from "../../../services/sorts";

function AlumnShowContainer({
    alumn,
    showEditAlumnForm,
    handleShowEditAlumnForm,
    handleRemoveAlumn,
    handleDeletePublication,
    updateIdArray,
    loading,
    updateDatabase,
    refetchPublications,
    updateSearchNames,
    editingReseracherError,
    idObj,
    closeForm,
    progressMap,
    isSavingAlumnEdit,
    isUpdatingPublication,
}) {
    return (
        <>
            <h1 className="custom-h1">{alumn.full_name}</h1>
            {showEditAlumnForm ? (
                <EditAlumnForm
                    submitInput={updateSearchNames}
                    propsValue={[alumn.full_name, alumn.search_query]}
                    closeForm={closeForm}
                    editingReseracherError={editingReseracherError}
                    isSavingAlumnEdit={isSavingAlumnEdit}
                />
            ) : (
                <>
                    <div data-tour="alumn-show-edit-button-tour">
                        <p className="m-2">
                            Search Query:{" "}
                            {loading ? "Loading..." : alumn.search_query}
                        </p>
                        <ButtonToolbar>
                            <Button
                                className="button my-2 ms-2"
                                size="md"
                                type="button"
                                onClick={() => handleShowEditAlumnForm()}
                            >
                                Edit Researcher
                            </Button>
                            <Button
                                className="delete-button my-2 ms-2"
                                size="md"
                                type="button"
                                onClick={() => handleRemoveAlumn()}
                            >
                                Delete Researcher
                            </Button>
                        </ButtonToolbar>
                    </div>
                    <p className="m-2">
                        Publications (
                        {loading
                            ? "Loading..."
                            : alumn.my_alumn_publications.length}
                        ):
                    </p>
                    {loading ? (
                        <Loading
                            key={alumn.full_name}
                            progressMapData={progressMap.get(alumn.full_name)}
                        />
                    ) : (
                        <ListGroup as="ul" className="alumn-show-list">
                            {sortByTwoFns(
                                byDate,
                                byCoAuthors,
                                alumn.my_alumn_publications
                            ).map((alumn_pub, idx) => (
                                <ListGroup.Item
                                    key={`${alumn_pub.alumn_publication_id}_${idx}`}
                                    as="li"
                                    className="mb-2"
                                >
                                    <></>
                                    <PublicationDisplayCheck
                                        alumnName={alumn.search_query}
                                        alumn_publication={alumn_pub}
                                        updateIdArray={updateIdArray}
                                        handleDeletePublication={
                                            handleDeletePublication
                                        }
                                    />
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                    <ButtonToolbar>
                        <Button
                            className="button my-2 ms-2"
                            type="button"
                            size="md"
                            onClick={updateDatabase}
                            disabled={
                                Object.keys(idObj).length === 0
                                    ? true
                                    : false || isUpdatingPublication
                            }
                        >
                            {isUpdatingPublication ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    {" Updating..."}
                                </>
                            ) : (
                                "Update Publications"
                            )}
                        </Button>
                        <Button
                            className="button my-2 ms-2"
                            type="button"
                            size="md"
                            onClick={refetchPublications}
                        >
                            Fetch New Publications
                        </Button>
                    </ButtonToolbar>
                </>
            )}
        </>
    );
}

export default AlumnShowContainer;
