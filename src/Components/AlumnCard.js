import { Card, Accordion } from 'react-bootstrap'
import PublicationDisplayCheck from '../Containers/PublicationDisplayCheck'

function AlumnCard({ alumn, updateIdArray }) {
    const { id, display_name, my_alumn_publications } = alumn

    const sortByNumberOfCoAuthors = (array) => {
        return array.sort((a, b) => b.coauthors.length - a.coauthors.length)
    }


    return (
        <Card>
            <Card.Header>
                <Accordion.Toggle as={Card.Header} eventKey={id}>
                    {display_name}
                </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey={id}>
                <Card.Body>{sortByNumberOfCoAuthors(my_alumn_publications).map(alumn_pub =>
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