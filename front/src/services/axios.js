import axios from "axios";
import UserService from "./UserService";

const axiosInstance = axios.create(
  {
    baseURL: process.env.REACT_APP_BASE_URL,
  }
);

axiosInstance.interceptors.request.use((config) => {
  if (UserService.isLoggedIn()) {
    const cb = () => {
      config.headers.Authorization = `Bearer ${UserService.getToken()}`;
      return Promise.resolve(config);
    };
    return UserService.updateToken(cb);
  }
});

export default axiosInstance;