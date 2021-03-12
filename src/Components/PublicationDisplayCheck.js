import { useState } from 'react'
import FullCitation from './FullCitation'

function PublicationDisplayCheck({ alumnName, alumn_publication, updateIdArray }) {

    const { ap_id, display, publication, coauthors } = alumn_publication
    const [displayed, setDisplayed] = useState(display)

    return (
        <div className="d-flex align-items-center">
            <input
                type="checkbox"
                checked={displayed}
                onChange={() => {
                    setDisplayed(!displayed)
                    updateIdArray(ap_id, !displayed)
                }} />
            <FullCitation ap_id={ap_id} alumnName={alumnName} publication={publication} coauthors={coauthors} />
        </div>
    )

}

export default PublicationDisplayCheck