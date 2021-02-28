import { Card, Accordion, Button } from 'react-bootstrap'
import PublicationDisplayCheck from '../Containers/PublicationDisplayCheck'

function AlumnCard({ alumn, updateIdArray }) {
    const { id, display_name, my_alumn_publications } = alumn

    return (
        <Card>
            <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey={id}>
                    <h3>{display_name}</h3>
                </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey={id}>
                <Card.Body>{my_alumn_publications.map(alumn_pub =>
                    <PublicationDisplayCheck
                        key={`${alumn.id}_${alumn_pub.ap_id}`}
                        alumn_publication={alumn_pub}
                        updateIdArray={updateIdArray} />)}
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    )
}

export default AlumnCard