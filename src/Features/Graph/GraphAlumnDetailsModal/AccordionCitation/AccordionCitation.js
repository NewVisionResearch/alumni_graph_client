import Accordion from "react-bootstrap/Accordion";

import dashToDate from "../../../../services/conversions";

function AccordionCitation({ listNum, alumnName, publication, coauthors }) {
    const {
        authors,
        elocationid,
        epubdate,
        pages,
        pmcid,
        pmid,
        pubdate,
        title,
        volume,
        source,
    } = publication;

    const displayDate = dashToDate(pubdate).split("-")[0];

    const decideClassName = (author) => {
        const splitName = alumnName.split(" ");
        const first = splitName[0];
        const last = splitName[splitName.length - 1];
        const [authorLast, initials] = author.split(" ");
        const coauthorsLastNames = () => {
            let lastNames = coauthors.map((ca) => {
                let splitName = ca.split(" ");
                return splitName[splitName.length - 1];
            });
            return lastNames;
        };

        if (authorLast === last && initials[0] === first[0]) {
            return "alumn";
        } else if (coauthorsLastNames().includes(authorLast)) {
            return "coauthor";
        } else {
            return "non-alumn";
        }
    };

    const highlightAlumns = (authors) => {
        let count = 0;
        if (authors.length) {
            let authorsArray = authors
                .slice(0, authors.length - 1)
                .map((author) => (
                    <span
                        key={`${publication.id + count++}_${author}`}
                        className={decideClassName(author)}
                    >
                        {author + ", "}
                    </span>
                ));

            let author = authors[authors.length - 1];
            authorsArray = authorsArray.concat(
                <span
                    key={`${publication.id + count++}_${author}`}
                    className={decideClassName(author)}
                >
                    {author}
                </span>
            );

            return authorsArray;
        } else {
            return [];
        }
    };

    return (
        <>
            <Accordion.Header className="d-flex accordion-title" variant="link">
                <div style={{ color: "rgb(73, 50, 165)" }}>{listNum + 1}.</div>
                <div
                    className="ml-3 text-left"
                    style={{ color: "rgb(73, 50, 165)" }}
                >
                    {title}
                </div>
            </Accordion.Header>
            <Accordion.Body>
                {
                    <p>
                        {highlightAlumns(authors)}.{" "}
                        {
                            <a
                                href={`https://pubmed.ncbi.nlm.nih.gov/${pmid}`}
                                rel="noreferrer"
                                target="_blank"
                            >
                                {title}
                            </a>
                        }{" "}
                        {source}. {displayDate || ""};{volume || ""}:
                        {pages || ""}.{elocationid || ""}. Epub {epubdate || ""}
                        . PMID: {pmid || ""}; PMCID: {pmcid || ""}.
                    </p>
                }
            </Accordion.Body>
        </>
    );
}

export default AccordionCitation;
