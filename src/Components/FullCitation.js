import dashToDate from '../services/conversions'

function FullCitation({ ap_id, alumnName, publication, coauthors }) {

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
        source
    } = publication
    const displayDate = dashToDate(pubdate).split('-')[0] + " " + dashToDate(pubdate).split('-')[1]

    const decideClassName = (author) => {
        const [first, last] = alumnName.split(" ")
        const [authorLast, initials] = author.split(" ")
        const coauthorsLastNames = () => {
            let lastNames = coauthors.map(ca => {
                let splitName = ca.split(" ")
                return splitName[splitName.length - 1]
            })
            return lastNames
        }

        if (authorLast === last) {
            return 'alumn'
        } else if (coauthorsLastNames().includes(authorLast)) {
            return 'coauthor'
        } else {
            return 'non-alumn'
        }
    }

    const highlightAlumns = (authors) => {
        if (authors.length) {
            let authorsArray = authors.slice(0, authors.length - 1).map(author => <span className={decideClassName(author)}>{author + ", "}</span>)

            let author = authors[authors.length - 1]
            authorsArray = authorsArray.concat(<span className={decideClassName(author)}>{author}</span>)

            return authorsArray
        } else {
            return []
        }
    }

    return (
        <div className="publication-list">
            <p>{highlightAlumns(authors)}. {<a href={`https://pubmed.ncbi.nlm.nih.gov/${pmid}`} rel='noreferrer' target='_blank'>{title}</a>} {source}. {displayDate};{volume}:{pages}.{elocationid}. Epub {epubdate}. PMID: {pmid}; PMCID: {pmcid}.</p>
        </div>
    )
}

export default FullCitation