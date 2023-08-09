const baseUrl = process.env.REACT_APP_BASE_URL;

export const getProfile = (token) => {
    return fetch(`${baseUrl}/profile`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};