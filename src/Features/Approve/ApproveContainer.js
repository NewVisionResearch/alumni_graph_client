import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import "./styles/Approve.css";

function ApproveContainer({ loading }) {
    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col className="deny" lg={5}>
                    {loading ? (
                        <>
                            <h1>Approving Request...</h1>
                            <Spinner
                                className="approve-spinner"
                                animation="border"
                                role="status"
                            />
                        </>
                    ) : (
                        <>
                            <h4>Request approved!</h4>
                            <h5>An email has been sent to the requester.</h5>
                            <h5>You may now close this window.</h5>
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default ApproveContainer;
