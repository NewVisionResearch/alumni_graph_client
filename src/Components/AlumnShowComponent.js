import { Button } from "react-bootstrap";

import PublicationDisplayCheck from "./PublicationDisplayCheck";
import EditAlumnForm from "../Containers/EditAlumnForm";
import Loading from "../Components/Loading";
import { byDate, byCoAuthors, sortByTwoFns } from "../services/sorts";
import { filterValidPublications } from "../services/filters";

function AlumnShowComponent({
    alumn,
    editSearchNames,
    setEditSearchNames,
    handleRemoveAlumn,
    invalidatePublication,
    updateIdArray,
    loading,
    updateDatabase,
    refetchPublications,
    updateSearchNames,
    editingReseracherError,
    setEditingReseracherError,
    idObj,
}) {
    const closeModal = () => {
        setEditSearchNames(false);
        setEditingReseracherError("");
    };

    return (
        <div className="col">
            <h1 className="text-center m-2">{alumn.full_name}</h1>
            {editSearchNames ? (
                <EditAlumnForm
                    submitInput={updateSearchNames}
                    propsValue={[alumn.full_name, alumn.search_query]}
                    closeModal={closeModal}
                    editingReseracherError={editingReseracherError}
                />
            ) : (
                <>
                    <p className="m-2">
                        Search Query: {loading ? "Loading..." : alumn.search_query}
                    </p>
                    <Button
                        className="button"
                        size="lg"
                        type="button"
                        onClick={() => setEditSearchNames(true)}
                    >
                        Edit Researcher
                    </Button>
                    <Button
                        className="delete-button m-1"
                        size="lg"
                        type="button"
                        onClick={() => handleRemoveAlumn()}
                    >
                        Delete Researcher
                    </Button>
                    <p className="m-2">
                        Publications (
                        {loading ? "Loading..." : filterValidPublications(alumn).length}):
                    </p>
                    {loading ? (
                        <Loading key={alumn.full_name} />
                    ) : (
                        <ul className="alumn-show-list">
                            {sortByTwoFns(
                                byDate,
                                byCoAuthors,
                                filterValidPublications(alumn)
                            ).map((alumn_pub, idx) => (
                                <PublicationDisplayCheck
                                    key={`${alumn_pub.lab_alumn_publication_id}_${idx}`}
                                    alumnName={alumn.search_query}
                                    alumn_publication={alumn_pub}
                                    updateIdArray={updateIdArray}
                                    invalidatePublication={invalidatePublication}
                                />
                            ))}
                        </ul>
                    )}
                    <Button
                        className="button m-1"
                        type="button"
                        size="lg"
                        onClick={updateDatabase}
                        disabled={Object.keys(idObj).length === 0 ? true : false}
                    >
                        Update Publications
                    </Button>
                    <Button
                        className="button m-1"
                        type="button"
                        size="lg"
                        onClick={refetchPublications}
                    >
                        Fetch New Publications
                    </Button>
                </>
            )}
        </div>
    );
}

export default AlumnShowComponent;
