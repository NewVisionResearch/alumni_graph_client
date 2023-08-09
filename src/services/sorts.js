const byCoAuthors = (array) => {
    return array.sort((a, b) => b.coauthors.length - a.coauthors.length);
};

const byDate = (array) => {
    return array.sort((a, b) => (new Date(b.publication.pubdate) - new Date(a.publication.pubdate)));
};

const sortByTwoFns = (outer, inner, array) => {
    return outer(inner(array));
};

const byName = (array) => {
    return array.sort((a, b) => {
        let aSplit = a.full_name.split(" ");
        let aLength = aSplit.length;
        let bSplit = b.full_name.split(" ");
        let bLength = bSplit.length;

        return aSplit[aLength - 1][0] > bSplit[bLength - 1][0] ? 1 : -1;
    });
};

const byLastName = (array) => {
    return array.sort((a, b) => a.full_name > b.full_name ? 1 : -1);
};

module.exports = { byCoAuthors, byDate, sortByTwoFns, byName, byLastName };