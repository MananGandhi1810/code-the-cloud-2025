import axios from "axios";
import { exists, get, set } from "./keyvalue-db.js";

const getAccessToken = async (code) => {
    return await axios.post(
        `https://github.com/login/oauth/access_token?client_id=${process.env.GH_CLIENT_ID}&client_secret=${process.env.GH_CLIENT_SECRET}&code=${code}`,
        {},
        {
            headers: {
                accept: "application/json",
            },
            validateStatus: false,
        },
    );
};

const getUserDetails = async (token) => {
    return await axios.get("https://api.github.com/user", {
        headers: {
            Authorization: "Bearer " + token,
            "X-OAuth-Scopes": "repo, user",
            "X-Accepted-OAuth-Scopes": "user",
        },
        validateStatus: false,
    });
};

const getUserEmails = async (token) => {
    return await axios.get("https://api.github.com/user/emails", {
        headers: {
            Authorization: "Bearer " + token,
            "X-OAuth-Scopes": "repo, user",
            "X-Accepted-OAuth-Scopes": "user",
        },
        validateStatus: false,
    });
};

const getUserRepositories = async (token) => {
    const response = await axios.get(
        "https://api.github.com/user/repos?per_page=1000",
        {
            headers: {
                Authorization: "Bearer " + token,
                "X-OAuth-Scopes": "repo, user",
                "X-Accepted-OAuth-Scopes": "user",
            },
            validateStatus: false,
        }
    );
    if (response.status >= 400 || !response.data) {
        return [];
    }
    const repositories = response.data.map((r) => ({
        name: r.full_name,
        url: r.clone_url,
    }));
    return repositories;
};


export {
    getAccessToken,
    getUserDetails,
    getUserEmails,
    getUserRepositories,
};