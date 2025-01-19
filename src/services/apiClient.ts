import axios from "axios";

const apiClient = axios.create({
  baseURL:
    "https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

export default apiClient;
