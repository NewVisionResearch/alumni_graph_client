export const filterValidPublications = (my_alumn_publications) => {
    return my_alumn_publications.filter(
        (my_alumn_publications) => my_alumn_publications.display === true
    );
};
