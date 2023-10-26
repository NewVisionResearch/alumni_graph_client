import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { AiFillQuestionCircle } from "react-icons/ai";

import AlumnShowController from "./AlumnShow/AlumnShowController";
import AddAlumnsController from "./AddAlumns/AddAlumnsController";
import AlumnsListController from "./AlumnsList/AlumnsListController";

import "./styles/Dashboard.css";

function DashboardContainer({
    handleAlumnShowAndTourSteps,
    handleTourClick,
    handleChangeSteps,
    handleDeleteAlumn,
    alumns,
    setAlumns,
    alumnShowIdAndName,
    isAlumnListLoading,
    progressMap,
    setProgressMap,
}) {
    return (
        <div className="dashboard">
            <div
                data-tour="dashboard-tour"
                className="position-absolute top-50 start-50 translate-middle"
            ></div>
            <Container fluid>
                <Row className="justify-content-md-center">
                    <Col md={5}>
                        <Container>
                            <Row>
                                <Col>
                                    {/* Content for the first row in the left column */}
                                    <AddAlumnsController
                                        alumns={alumns}
                                        setAlumns={setAlumns}
                                        handleAlumnShowAndTourSteps={
                                            handleAlumnShowAndTourSteps
                                        }
                                        setProgressMap={setProgressMap}
                                        handleChangeSteps={handleChangeSteps}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    {/* Content for the second row in the left column */}
                                    <AlumnsListController
                                        alumns={alumns}
                                        handleAlumnShowAndTourSteps={
                                            handleAlumnShowAndTourSteps
                                        }
                                        isAlumnListLoading={isAlumnListLoading}
                                    />
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                    <Col md={7}>
                        {/* Right Column */}
                        <AlumnShowController
                            alumnShowIdAndName={alumnShowIdAndName}
                            handleDeleteAlumn={handleDeleteAlumn}
                            progressMap={progressMap}
                            setProgressMap={setProgressMap}
                        />
                    </Col>
                </Row>
            </Container>
            <Button
                className="button info-button"
                type="button"
                onClick={handleTourClick}
            >
                <AiFillQuestionCircle size={"2em"} />
            </Button>
        </div>
    );
}

export default DashboardContainer;
