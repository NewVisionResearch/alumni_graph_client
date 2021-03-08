const byCoAuthors = (array) => {
    return array.sort((a, b) => b.coauthors.length - a.coauthors.length)
}

const byDate = (array) => {
    return array.sort((a, b) => (new Date(b.publication.pubdate) - new Date(a.publication.pubdate)))
}

const sortByTwoFns = (inner, outer, array) => {
    return outer(inner(array))
}

const byName = (array) => {
    return array.sort((a, b) => a.full_name > b.full_name ? 1 : -1)
}

module.exports = { byCoAuthors, byDate, sortByTwoFns, byName }