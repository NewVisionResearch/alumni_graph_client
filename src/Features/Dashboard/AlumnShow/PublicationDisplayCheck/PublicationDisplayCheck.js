import { useState } from "react";
import Button from "react-bootstrap/Button";
import FormCheck from "react-bootstrap/FormCheck";

import FullCitation from "./FullCitation/FullCitation";

function PublicationDisplayCheck({
    alumnName,
    alumn_publication,
    updateIdArray,
    handleDeletePublication,
}) {
    const { alumn_publication_id, display, publication, coauthors } =
        alumn_publication;
    const [displayed, setDisplayed] = useState(display);

    return (
        <div className="d-flex align-items-center">
            <FormCheck
                type="checkbox"
                aria-label="Checkbox for following citation"
                checked={displayed}
                onChange={() => {
                    setDisplayed(!displayed);
                    updateIdArray(alumn_publication_id, !displayed);
                }}
            />

            <FullCitation
                alumnName={alumnName}
                publication={publication}
                coauthors={coauthors}
            />
            <Button
                className="delete-button"
                size="sm"
                onClick={() => handleDeletePublication(alumn_publication_id)}
            >
                Delete
            </Button>
        </div>
    );
}

export default PublicationDisplayCheck;
