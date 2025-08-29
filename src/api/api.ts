import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000", // 백엔드 서버 주소
  headers: {
    "Content-Type": "application/json",
  },
});
