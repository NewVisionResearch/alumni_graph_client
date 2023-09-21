import { useState } from "react";
import { Button, InputGroup } from "react-bootstrap";
import FullCitation from "./FullCitation/FullCitation";

function PublicationDisplayCheck({
    alumnName,
    alumn_publication,
    updateIdArray,
    invalidatePublication,
}) {
    const { alumn_publication_id, display, publication, coauthors } =
        alumn_publication;
    const [displayed, setDisplayed] = useState(display);

    return (
        <div
            className="d-flex align-items-center justify-content-between mb-5 p-3 border border-secondary"
            key={`${alumn_publication_id}_${alumnName}`}
        >
            <InputGroup.Checkbox
                className="button"
                aria-label="Checkbox for following citation"
                size="md"
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
                className="delete-button ml-1"
                size="sm"
                onClick={() => invalidatePublication(alumn_publication_id)}
            >
                Delete
            </Button>
        </div>
    );
}

export default PublicationDisplayCheck;
