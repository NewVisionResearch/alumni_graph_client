export const filterValidPublications = (alumn) => {
    return alumn.my_alumn_publications.filter((ap) => ap.display === true);
};
