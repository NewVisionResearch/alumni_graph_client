import { Button, Card, Container, Row, Col, ListGroup } from "react-bootstrap";
import { AiFillInfoCircle } from "react-icons/ai";

import { byLastName } from "../services/sorts";

import AlumnShowContainer from "../Containers/AlumnShowContainer";
import AddAlumns from "../Containers/AddAlumns";

function DashboardComponent({
    showInfoModal,
    setShowInfoModal,
    openAlumnShow,
    handleInfoClick,
    handleDeleteAlumn,
    loading,
    setLoading,
    alumns,
    setAlumns,
    alumnShowId,
}) {
    return (
        <div className="dashboard d-flex flex-wrap align-items-center justify-content-center p-5">
            {showInfoModal ? (
                <Card border="info">
                    <Card.Header className="text-center">Instructions</Card.Header>
                    <Card.Body>
                        <Card.Title className="text-center">
                            Follow these steps to enter an investigator’s name
                            <br />
                            (the name will populate so long as the research has published an
                            article and it is on PubMed).
                        </Card.Title>
                        <div className="text-left" style={{ padding: 10 }}>
                            <ol>
                                <li>
                                    Enter the full name of the investigator you are searching for
                                    in the input field. Make sure to use the name displayed in the
                                    publication you are referencing, typically the first and last
                                    name.
                                </li>
                                <li>
                                    Click on the "Submit" button to start the search process. If
                                    the system finds the name you entered, it will display
                                    publications associated with that investigator.
                                </li>
                                <li>
                                    You can customize your search by clicking on the "Edit
                                    Investigator" button. This will allow you to change the search
                                    names, which should be comma-separated. You can also click on
                                    the "Delete Investigator" button to remove them from your
                                    search.
                                </li>
                                <li>
                                    If you do not want a particular publication to be associated
                                    with the investigator in the graph, you can click on the
                                    checkbox next to it. If you want to remove a publication from
                                    the investigator altogether, you can click on the "Remove"
                                    button next to it.
                                </li>
                                <li>
                                    Any edits you make to the search names or publications will be
                                    saved only if you click on the "Update Publications" button.
                                </li>
                                <li>
                                    If the system does not find any publications associated with
                                    the investigator, you can refine your search by editing the
                                    search names and trying again.
                                </li>
                                <li>
                                    If you want to fetch new publications for the investigator,
                                    you can click on the "Fetch New Publications" button.
                                </li>
                            </ol>
                        </div>
                        <Button variant="primary" onClick={() => setShowInfoModal(false)}>
                            Hide
                        </Button>
                    </Card.Body>
                    <Card.Footer className="text-muted text-center">
                        New Vision Research
                    </Card.Footer>
                </Card>
            ) : (
                <div></div>
            )}
            <Container fluid>
                <Row className="justify-content-md-center">
                    <Col md={6}>
                        <Container>
                            <Row>
                                <Col>
                                    {/* Content for the first row in the left column */}
                                    <AddAlumns
                                        alumns={alumns}
                                        setAlumns={setAlumns}
                                        openAlumnShow={openAlumnShow}
                                        setLoading={setLoading}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    {/* Content for the second row in the left column */}
                                    <div
                                        style={{
                                            display: "flex",
                                            maxHeight: "700px",
                                            overflow: "hidden",
                                            overflowY: "scroll",
                                        }}
                                    >
                                        <ListGroup as="ul" style={{ width: "100%" }}>
                                            {byLastName(alumns).map((alumn) => (
                                                <ListGroup.Item
                                                    as="li"
                                                    key={alumn.alumn_id}
                                                    onClick={() => openAlumnShow(alumn.alumn_id)}
                                                    className=""
                                                >
                                                    {alumn.full_name}
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                    <Col md={6}>
                        {/* Right Column */}
                        {alumnShowId && (
                            <AlumnShowContainer
                                alumnId={alumnShowId}
                                handleDeleteAlumn={handleDeleteAlumn}
                                loading={loading}
                                setLoading={setLoading}
                            />
                        )}
                    </Col>
                </Row>
            </Container>
            <Button
                style={{
                    position: "absolute",
                    padding: 0,
                    right: 30,
                    top: 60,
                    zIndex: 1000,
                    borderRadius: "50%",
                    boxShadow: "-1px 1px 10px rgb(31, 31, 31)",
                }}
                variant="info"
                onClick={handleInfoClick}
            >
                <AiFillInfoCircle size={"2em"} />
            </Button>

        </div>
    );
}

export default DashboardComponent;
