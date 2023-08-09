const baseUrl = process.env.REACT_APP_BASE_URL;

export const register = (labInfo) => {
    const { email, name, labName, phoneNumber, howToUse, labUrl } = labInfo;

    let requestObj = {
        request: {
            lab_name: labName.trim(),
            name: name.trim(),
            email: email.trim(),
            phone_number: phoneNumber,
            how_to_use: howToUse,
            lab_url: labUrl,
        },
    };

    return fetch(`${baseUrl}/requests`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(requestObj),
    });
};

export const login = (adminInfo) => {
    const { email, password } = adminInfo;

    let adminObj = {
        admin: {
            email: email,
            password: password,
        },
    };

    return fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(adminObj),
    });
};
