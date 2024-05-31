import React from "react";
import Accordion from "react-bootstrap/Accordion";

import dashToDate from "../../../../services/conversions";

import "./styles/AccordionCitation.css";

function AccordionCitation({
    listNum,
    alumnSearchQuery,
    publication,
    coauthors,
}) {
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
        /* remove NOT and associated name term from alumnSearchQuery */
        const splitAlumnSearchQuery = alumnSearchQuery.split(" ");
        let filteredAndSplitAlumnSearchQuery = [];

        for (
            let i = 0, skipNext = false;
            i < splitAlumnSearchQuery.length;
            i++
        ) {
            if (splitAlumnSearchQuery[i] === "NOT") {
                skipNext = true;
            }

            if (skipNext) {
                if (
                    splitAlumnSearchQuery[i] === "AND" ||
                    splitAlumnSearchQuery[i] === "OR"
                ) {
                    skipNext = false;
                    filteredAndSplitAlumnSearchQuery.push(
                        splitAlumnSearchQuery[i]
                    );
                }
            } else {
                filteredAndSplitAlumnSearchQuery.push(splitAlumnSearchQuery[i]);
            }
        }

        /* remove AND and OR from filteredAndSplitAlumnSearchQuery */
        let splitAlumnNames = [];
        let tempName = "";

        for (let i = 0; i < filteredAndSplitAlumnSearchQuery.length; i++) {
            let currentNameTerm = filteredAndSplitAlumnSearchQuery[i];

            if (currentNameTerm === "AND" || currentNameTerm === "OR") {
                if (tempName !== "") {
                    splitAlumnNames.push(tempName);
                    tempName = "";
                }
            } else {
                if (tempName !== "") {
                    tempName += ` ${currentNameTerm}`;
                } else {
                    tempName += `${currentNameTerm}`;
                }
            }
        }

        if (tempName !== "") {
            splitAlumnNames.push(tempName);
        }

        // get author last name
        const [authorLastName, authorRemainingInitials] = author.split(" ");
        const authorFirstInitial = authorRemainingInitials[0];

        const coauthorsLastNames = () => {
            const lastNames = coauthors.map((coauthor) => {
                const coauthorLastName = coauthor.split(" ");
                return coauthorLastName[coauthorLastName.length - 1];
            });
            return lastNames;
        };

        /* select appropriate class name */
        if (
            splitAlumnNames.includes(author) ||
            splitAlumnNames.includes(`${authorLastName} ${authorFirstInitial}`)
        ) {
            return "alumn";
        } else if (coauthorsLastNames().includes(authorLastName)) {
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
            <Accordion.Header className="accordion-citation-header">
                <div>{listNum + 1}.</div>
                <div className="ms-3">{title}</div>
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

export default React.memo(AccordionCitation);
