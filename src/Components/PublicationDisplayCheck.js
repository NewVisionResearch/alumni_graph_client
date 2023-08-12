import { useState } from 'react';
import { Button, InputGroup } from 'react-bootstrap';
import FullCitation from './FullCitation';

function PublicationDisplayCheck({ alumnName, alumn_publication, updateIdArray, invalidatePublication }) {

    const { lab_alumn_publication_id, display, publication, coauthors } = alumn_publication;
    const [displayed, setDisplayed] = useState(display);
    return (
        <div
            className="d-flex align-items-center justify-content-between mb-5 p-3 border border-secondary"
            key={`${lab_alumn_publication_id}_${alumnName}`}>
            <InputGroup.Checkbox
                className=""
                aria-label="Checkbox for following citation"
                size="md"
                checked={displayed}
                onChange={() => {
                    setDisplayed(!displayed);
                    updateIdArray(lab_alumn_publication_id, !displayed);
                }} />
            <FullCitation
                alumnName={alumnName}
                publication={publication}
                coauthors={coauthors} />
            <Button
                className="ml-1"
                onClick={() => invalidatePublication(publication.lab_publication_id)}
                variant="danger"
                size="sm"
            >
                Remove
            </Button>
        </div>
    );

}

export default PublicationDisplayCheck;