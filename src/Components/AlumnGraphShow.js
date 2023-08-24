import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Accordion } from "react-bootstrap";
import { byDate, byCoAuthors, sortByTwoFns } from "../services/sorts";
import AccordionCitation from "../Containers/AccordionCitation";
import Loading from "./Loading";
import { fetchAlumnById } from "../services/api";

function AlumnGraphShow({ alumnId, closeModal }) {
    const [alumn, setAlumn] = useState({
        full_name: "",
        search_query: "",
        my_lab_alumn_publications: [],
    });
    const navigate = useRef(useNavigate());

    useEffect(() => {
        if (alumnId) {
            setAlumn({
                full_name: "",
                search_query: "",
                my_lab_alumn_publications: [],
            });

            const controller = new AbortController();
            const signal = controller.signal;

            fetchAlumnById(alumnId, signal)
                .then((res) => {
                    if (!res.ok) {
                        throw res;
                    }
                    return res.json();
                })
                .then((alumnObj) => setAlumn(alumnObj))
                .catch((res) => {
                    console.error(res);
                    navigate.current("/error");
                });

            return () => {
                controller.abort();
            };
        }
    }, [alumnId]);

    return (
        <div
            id="alumn-graph-show"
            className="mt-3 mr-3 rounded d-flex-column justify-content-center align-items-center"
            style={{
                position: "absolute",
                zIndex: 1000,
                background: "rgb(255, 255, 255)",
                boxShadow: "-7px 10px 20px rgb(31, 31, 31)",
                overflowY: "scroll",
                display: alumnId !== null ? "block" : "none",
            }}
        >
            <button
                type="button"
                className="close text-danger"
                aria-label="Close"
                style={{
                    position: "sticky",
                    top: 7,
                    right: 7,
                    width: "5%",
                    zIndex: 1000,
                    border: "none",
                    borderRadius: "25px",
                    background: "rgba(211,211,211 ,0.55 )",
                }}
                onClick={closeModal}
            >
                <span aria-hidden="true">&times;</span>
            </button>
            {alumn.my_lab_alumn_publications.length ? (
                <>
                    <h3
                        className="author-show-name mt-4 mb-3"
                        style={{
                            width: "100%",
                            textAlign: "center",
                            color: "rgb(77, 172, 147)",
                        }}
                    >
                        {alumn.full_name}
                    </h3>
                    <Accordion>
                        {sortByTwoFns(
                            byDate,
                            byCoAuthors,
                            alumn.my_lab_alumn_publications
                        ).map((alumn_pub, idx) => {
                            const { publication, coauthors } = alumn_pub;

                            return (
                                <AccordionCitation
                                    key={`${alumn_pub}_${idx}`}
                                    listNum={idx}
                                    alumnName={alumn.search_query}
                                    publication={publication}
                                    coauthors={coauthors}
                                />
                            );
                        })}
                    </Accordion>
                </>
            ) : (
                <div>
                    <Loading />
                </div>
            )}
        </div>
    );
}

export default AlumnGraphShow;
