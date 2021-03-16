import { useState } from 'react'
import FullCitation from './FullCitation'

function PublicationDisplayCheck({ alumnName, alumn_publication, updateIdArray, invalidatePublication }) {

    const { ap_id, display, publication, coauthors } = alumn_publication
    const [displayed, setDisplayed] = useState(display)
    return (
        <div className="d-flex align-items-center" key={`${ap_id}_${alumnName}`}>
            <input
                type="checkbox"
                checked={displayed}
                onChange={() => {
                    setDisplayed(!displayed)
                    updateIdArray(ap_id, !displayed)
                }} />
            <FullCitation alumnName={alumnName} publication={publication} coauthors={coauthors} />
            <button onClick={(e) => invalidatePublication(e, publication.id)}>This Publication is Invalid</button>
        </div>
    )

}

export default PublicationDisplayCheck