const baseUrl = process.env.REACT_APP_BASE_URL;

export const getProfile = (token) => {
    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    return fetch(`${baseUrl}/profile`, options);
};

export const deleteAlumn = (alumn_id, token) => {
    const options = {
        method: "DELETE",
        headers: {
            "content-type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    };

    return fetch(`${baseUrl}/alumns/${alumn_id}`, options);
};