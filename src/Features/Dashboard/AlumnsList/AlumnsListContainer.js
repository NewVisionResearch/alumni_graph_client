import { Form, ListGroup, Container, Row, Col, Spinner } from "react-bootstrap";

import { byLastName } from "../../../services/sorts";

import "./styles/AlumnsList.css";

function AlumnsListContainer({
    filteredAlumns,
    searchTerm,
    setSearchTerm,
    openAlumnShow,
    showNoResultFoundListItem,
    showPleaseAddResearchersListItem,
    isAlumnListLoading,
}) {
    return (
        <div className="alumns-list">
            <Container className="p-0">
                <Row>
                    <Col>
                        <h1 className="text-center m-2">Your Researchers</h1>
                        <Form inline className="alumns-list-search">
                            <Form.Label>Search Researcher: </Form.Label>
                            <Form.Control
                                id="alumns-list-search"
                                type="text"
                                value={searchTerm}
                                placeholder="Search..."
                                onChange={({ target: { value } }) =>
                                    setSearchTerm(value)
                                }
                            />
                        </Form>
                        {isAlumnListLoading ? (
                            <div className="d-flex justify-content-center">
                                <Spinner
                                    className="add-alumns-spinner"
                                    animation="border"
                                    role="loading"
                                />
                            </div>
                        ) : (
                            <ListGroup
                                as="ul"
                                className="alumns-list-scrollable"
                            >
                                {byLastName(filteredAlumns).map((alumn) => (
                                    <ListGroup.Item
                                        key={alumn.alumn_id}
                                        className="alumn-list-item"
                                        action
                                        onClick={() =>
                                            openAlumnShow(
                                                alumn.alumn_id,
                                                alumn.full_name
                                            )
                                        }
                                    >
                                        {alumn.full_name}
                                    </ListGroup.Item>
                                ))}
                                {showNoResultFoundListItem && (
                                    <ListGroup.Item
                                        as="li"
                                        key={0}
                                        className=""
                                    >
                                        No Result Found
                                    </ListGroup.Item>
                                )}
                                {showPleaseAddResearchersListItem && (
                                    <ListGroup.Item
                                        as="li"
                                        key={0}
                                        className=""
                                    >
                                        It looks empty here! Start by adding
                                        some researchers in the "Add Researcher"
                                        section above.
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default AlumnsListContainer;
