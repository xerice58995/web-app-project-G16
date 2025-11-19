// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1", // matches Flask Blueprint url_prefix
});

export default api;
