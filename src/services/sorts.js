const byCoAuthors = (array) => {
    return array.sort((a, b) => b.coauthors.length - a.coauthors.length)
}

const byDate = (array) => {
    return array.sort((a, b) => (new Date(b.publication.pubdate) - new Date(a.publication.pubdate)))
}

const sortByTwoFns = (inner, outer, array) => {
    return outer(inner(array))
}

module.exports = { byCoAuthors, byDate, sortByTwoFns }