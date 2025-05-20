import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/", // <-- Your backend base URL
//   withCredentials: true, // if you're using cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
