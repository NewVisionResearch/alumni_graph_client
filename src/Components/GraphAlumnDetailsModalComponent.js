import { Accordion } from "react-bootstrap";
import { byDate, byCoAuthors, sortByTwoFns } from "../services/sorts";
import AccordionCitation from "../Containers/AccordionCitation";

function GraphAlumnDetailsModalComponent({ alumn }) {
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
    );
}

export default GraphAlumnDetailsModalComponent;
