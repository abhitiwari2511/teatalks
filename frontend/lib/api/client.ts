import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const client = axios.create({
    baseURL,
    withCredentials: true,
})

export default client;