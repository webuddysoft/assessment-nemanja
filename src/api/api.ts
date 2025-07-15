import axios from "axios";

const API = axios.create({
  baseURL: "https://rest-api-production-7e07.up.railway.app/",
});

export default API;