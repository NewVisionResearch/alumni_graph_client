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
            <Container className="p-0">
                <Row>
                    <Col>
                        <h1 className="text-center m-2">Your Researchers</h1>
                        <Form inline className="alumns-list-search">
                            <Form.Label>
                                Search Researcher:{" "}
                            </Form.Label>
                            <Form.Control
                                id="alumns-list-search"
                                type="text"
                                value={searchTerm}
                                placeholder="Search..."
                                onChange={({ target: { value } }) => setSearchTerm(value)}
                            />
                        </Form>
                        <ListGroup as="ul" className="alumns-list-scrollable">
                            {byLastName(filteredAlumns).map((alumn) => (
                                <ListGroup.Item
                                    key={alumn.alumn_id}
                                    className="alumn-list-item"
                                    action
                                    onClick={() => openAlumnShow(alumn.alumn_id, alumn.full_name)}
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
