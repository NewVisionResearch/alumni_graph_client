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
}) {
    const closeModal = () => {
        setEditSearchNames(false);
    };

    return (
        <div className="col">
            <h1 className="text-center m-2">{alumn.full_name}</h1>
            <p className="m-2">Search Query: {loading ? "Loading..." : alumn.search_query}</p>
            {editSearchNames ? (
                <EditAlumnForm
                    submitInput={updateSearchNames}
                    propsValue={[alumn.full_name, alumn.search_query]}
                    closeModal={closeModal}
                />
            ) : (
                <Button onClick={() => setEditSearchNames(true)}>
                    Edit Researcher
                </Button>
            )}
            <Button
                className={editSearchNames ? "mb-3" : "ml-3"}
                variant="danger"
                onClick={() => handleRemoveAlumn()}
            >
                Delete Researcher
            </Button>
            <p>
                Publications ({loading ? "Loading..." : filterValidPublications(alumn).length}):
            </p>
            {loading ? (
                <Loading />
            ) : (
                <ul className="alumn-show-list" >
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
            <Button className="mr-3" onClick={updateDatabase}>
                Update Publications
            </Button>
            <Button className="ml-3" onClick={refetchPublications}>
                Fetch New Publications
            </Button>
        </div>
    );
}

export default AlumnShowComponent;
