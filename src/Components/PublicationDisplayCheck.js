import { useState } from 'react'
import { Button, InputGroup } from 'react-bootstrap'
import FullCitation from './FullCitation'

function PublicationDisplayCheck({ alumnName, alumn_publication, updateIdArray, invalidatePublication }) {

    const { ap_id, display, publication, coauthors } = alumn_publication
    const [displayed, setDisplayed] = useState(display)
    return (
        <div
            className="d-flex align-items-center justify-content-between mb-5 p-3 border border-secondary"
            key={`${ap_id}_${alumnName}`}>
            <InputGroup.Checkbox
                className=""
                aria-label="Checkbox for following citation"
                size="md"
                checked={displayed}
                onChange={() => {
                    setDisplayed(!displayed)
                    updateIdArray(ap_id, !displayed)
                }} />
            <FullCitation
                alumnName={alumnName}
                publication={publication}
                coauthors={coauthors} />
            <Button
                onClick={(e) => invalidatePublication(e, publication.id)}
                variant="danger"
                size="sm"
            >Remove</Button>
        </div>
    )

}

export default PublicationDisplayCheck