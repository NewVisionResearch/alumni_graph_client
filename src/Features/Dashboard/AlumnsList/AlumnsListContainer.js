import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";

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
            <h1 className="text-center m-2">Your Researchers</h1>
            <Form className="m-2">
                <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                        Search List:{" "}
                    </Form.Label>
                    <Col sm={9}>
                        <Form.Control
                            type="text"
                            value={searchTerm}
                            placeholder="Search..."
                            onChange={({ target: { value } }) =>
                                setSearchTerm(value)
                            }
                        />
                    </Col>
                </Form.Group>
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
                <ListGroup as="ul" className="alumns-list-scrollable">
                    {byLastName(filteredAlumns).map((alumn) => (
                        <ListGroup.Item
                            key={alumn.alumn_id}
                            as="li"
                            action
                            onClick={() =>
                                openAlumnShow(alumn.alumn_id, alumn.full_name)
                            }
                        >
                            {alumn.full_name}
                        </ListGroup.Item>
                    ))}
                    {showNoResultFoundListItem && (
                        <ListGroup.Item as="li" key={0} className="">
                            No Result Found
                        </ListGroup.Item>
                    )}
                    {showPleaseAddResearchersListItem && (
                        <ListGroup.Item as="li" key={0} className="">
                            It looks empty here! Start by adding some
                            researchers in the "Add Researcher" section above.
                        </ListGroup.Item>
                    )}
                </ListGroup>
            )}
        </div>
    );
}

export default AlumnsListContainer;
