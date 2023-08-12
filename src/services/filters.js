export const filterValidPublications = (alumn) => {
    return alumn.my_lab_alumn_publications.filter(
        (ap) => ap.publication.display === true
    );
};