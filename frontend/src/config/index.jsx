const { default: axios } = require("axios");


export const BASE_URL = "https://social-media-9cpt.onrender.com";

export const clientServer = axios.create({
    baseURL : BASE_URL,
})