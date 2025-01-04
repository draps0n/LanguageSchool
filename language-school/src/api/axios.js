import axios from "axios";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

const instance = axios.create({
  baseURL: "http://localhost:5000",
});

const useAuthInterceptor = () => {
  const { userData } = useContext(AuthContext);

  instance.interceptors.request.use(
    (config) => {
      if (userData && userData.accessToken) {
        config.headers["Authorization"] = `Bearer ${userData.accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export default instance;

export { useAuthInterceptor };
