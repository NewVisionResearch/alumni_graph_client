import { Button, Card } from "react-bootstrap";
import { AiFillInfoCircle } from "react-icons/ai";

import AlumnShow from "../Containers/AlumnShow";
import AddAlumns from "../Containers/AddAlumns";

function DashboardComponent({
    showModal,
    setShowModal,
    openAlumnShow,
    alumnShowId,
    removeAlumnId,
    confirmRemovedAlumn,
    handleAlumnsChange,
    handleRemoveAlumn,
    handleInfoClick,
}) {
    return (
        <div className="dashboard d-flex flex-wrap align-items-center justify-content-center p-5">
            <AddAlumns
                onAlumnsChange={handleAlumnsChange}
                openAlumnShow={openAlumnShow}
                removeAlumnId={removeAlumnId}
                confirmRemovedAlumn={confirmRemovedAlumn}
            />
            {showModal ? (
                <Card border="info">
                    <Card.Header className="text-center">Instructions</Card.Header>
                    <Card.Body>
                        <Card.Title className="text-center">
                            Follow these steps to enter an investigator’s name
                            <br />
                            (the name will populate so long as the research has published an
                            article and it is on PubMed).
                        </Card.Title>
                        <Card.Text className="text-left" style={{ padding: 10 }}>
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
                        </Card.Text>
                        <Button variant="primary" onClick={() => setShowModal(false)}>
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
            {alumnShowId ? (
                <AlumnShow alumnId={alumnShowId} handleRemoveAlumn={handleRemoveAlumn} />
            ) : (
                <div></div>
            )}
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
