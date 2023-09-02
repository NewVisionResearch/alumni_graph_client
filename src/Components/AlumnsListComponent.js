import { Form, ListGroup, Container, Row, Col } from "react-bootstrap";

import { byLastName } from "../services/sorts";

import '../styles/AlumnsList.css';

function AlumnsListComponent({
    filteredAlumns,
    searchTerm,
    setSearchTerm,
    openAlumnShow,
    showNoResultFoundListItem,
}) {
    return (
        <div className="alumns-list">
            <Container>
                <Row>
                    <Col>
                        <h1 className="text-center m-2">Your Researchers</h1>
                        <Form.Group as={Row} className="p-2">
                            <Form.Label column sm={4}>
                                Search Researcher:{" "}
                            </Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    id="alumns-list-search"
                                    type="text"
                                    value={searchTerm}
                                    placeholder="Search..."
                                    onChange={({ target: { value } }) => setSearchTerm(value)}
                                />
                            </Col>
                        </Form.Group>
                        <ListGroup as="ul" className="m-2 w-100 alumns-list-scrollable">
                            {byLastName(filteredAlumns).map((alumn) => (
                                <ListGroup.Item
                                    as="li"
                                    key={alumn.alumn_id}
                                    onClick={() => openAlumnShow(alumn.alumn_id)}
                                    className="alumn-list-item"
                                    action
                                >
                                    {alumn.full_name}
                                </ListGroup.Item>
                            ))}
                            {showNoResultFoundListItem && (
                                <ListGroup.Item as="li" key={0} className="">
                                    No Result Found
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default AlumnsListComponent;
