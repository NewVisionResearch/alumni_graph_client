import Accordion from "react-bootstrap/Accordion";

import AccordionCitation from "./AccordionCitation/AccordionCitation";
import { byDate, byCoAuthors, sortByTwoFns } from "../../../services/sorts";

function GraphAlumnDetailsModalContainer({ alumn }) {
    return (
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
                    alumn.my_alumn_publications
                ).map((alumn_pub, idx) => {
                    const { publication, coauthors } = alumn_pub;

                    return (
                        <Accordion.Item
                            eventKey={`item_eventKey_${alumn_pub}_${idx}`}
                            key={`item_key_${alumn_pub}_${idx}`}
                        >
                            <AccordionCitation
                                key={`citation_key_${alumn_pub}_${idx}`}
                                listNum={idx}
                                alumnName={alumn.search_query}
                                publication={publication}
                                coauthors={coauthors}
                            />
                        </Accordion.Item>
                    );
                })}
            </Accordion>
        </>
    );
}

export default GraphAlumnDetailsModalContainer;
