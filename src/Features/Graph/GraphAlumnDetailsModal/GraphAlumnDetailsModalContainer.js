import Accordion from "react-bootstrap/Accordion";

import AccordionCitation from "./AccordionCitation/AccordionCitation";
import { byDate, byCoAuthors, sortByTwoFns } from "../../../services/sorts";
import { filterValidPublications } from "../../../services/filters";

function GraphAlumnDetailsModalContainer({ alumn }) {
    return (
        <Accordion>
            <h3 className="graph-alumn-details-modal-header">
                {alumn.full_name}
            </h3>
            {filterValidPublications(
                sortByTwoFns(byDate, byCoAuthors, alumn.my_alumn_publications)
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
                            alumnSearchQuery={alumn.search_query}
                            publication={publication}
                            coauthors={coauthors}
                        />
                    </Accordion.Item>
                );
            })}
        </Accordion>
    );
}

export default GraphAlumnDetailsModalContainer;
