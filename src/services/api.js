const baseUrl = process.env.REACT_APP_BASE_URL;

const headersWithToken = {
    "content-type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
};

const headersWithoutToken = {
    "content-type": "application/json",
    Accept: "application/json",
};

export const fetchGraphPublications = (labId, signal) => {
    return fetch(`${baseUrl}/graphs/${labId}`, { signal });
};

export const fetchAlumnById = (alumnId, signal) => {
    return fetch(`${baseUrl}/alumns/${alumnId}`, { signal });
};

export const fetchAlumns = (alumnObj) => {
    const options = {
        method: "POST",
        headers: headersWithToken,
        body: JSON.stringify(alumnObj),
    };

    return fetch(`${baseUrl}/alumns`, options);
};

export const fetchAlumnsIndex = (labId) => {
    const options = {
        method: "GET",
        headers: headersWithToken,
    };

    return fetch(`${baseUrl}/alumns/${labId}/index`, options);
};

export const deleteAlumn = (alumn_id) => {
    const options = {
        method: "DELETE",
        headers: headersWithToken,
    };

    return fetch(`${baseUrl}/alumns/${alumn_id}`, options);
};

export const updateSearchNamesForAlumn = (alumnId, bodyObj) => {
    const options = {
        method: "PATCH",
        headers: headersWithToken,
        body: JSON.stringify(bodyObj),
    };

    return fetch(`${baseUrl}/alumns/${alumnId}`, options);
};

export const refetchAlumnPublications = (alumnId) => {
    const options = {
        method: "GET",
        headers: headersWithToken,
    };

    return fetch(`${baseUrl}/alumns/${alumnId}/refetch`, options);
};

export const fetchAlumnNameQuerySearchResults = (alumnNameQuery, signal) => {
    const options = {
        method: "GET",
        headers: headersWithToken,
        signal,
    };

    return fetch(`${baseUrl}/alumns/${alumnNameQuery}/search`, options);
};

export const patchLabPublication = (labPublicationId, bodyObj) => {
    const options = {
        method: "PATCH",
        headers: headersWithToken,
        body: JSON.stringify(bodyObj),
    };

    return fetch(`${baseUrl}/lab_publications/${labPublicationId}`, options);
};

export const patchLabAlumnPublication = (bodyObj) => {
    const options = {
        method: "PATCH",
        headers: headersWithToken,
        body: JSON.stringify(bodyObj),
    };

    return fetch(`${baseUrl}/lab_alumn_publications`, options);
};

export const getProfile = (token, signal) => {
    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        signal,
    };

    return fetch(`${baseUrl}/profile`, options);
};

export const passwordReset = (token, passwordObj) => {
    const options = {
        method: "POST",
        headers: headersWithoutToken,
        body: JSON.stringify(passwordObj),
    };

    return fetch(`${baseUrl}/password-reset/${token}/update`, options);
};

export const passwordResetRequest = (emailObj) => {
    let options = {
        method: "POST",
        headers: headersWithoutToken,
        body: JSON.stringify(emailObj),
    };

    return fetch(`${baseUrl}/password-reset/request`, options);
};

export const approveRequest = (token, signal) => {
    const options = {
        method: "POST",
        headers: headersWithoutToken,
        signal,
    };

    return fetch(`${baseUrl}/requests/${token}/approve`, options);
};

export const denyRequest = (token, signal) => {
    const options = {
        method: "POST",
        headers: headersWithoutToken,
        signal,
    };

    return fetch(`${baseUrl}/requests/${token}/deny`, options);
};

export const getAdminStatus = (signal) => {
    const options = {
        method: "GET",
        headers: headersWithToken,
        signal,
    };

    return fetch(`${baseUrl}/admins/check_admin_status`, options);
};

export const getAdmins = () => {
    const options = {
        method: "GET",
        headers: headersWithToken,
    };

    return fetch(`${baseUrl}/admins/get_admins`, options);
};
