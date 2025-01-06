import useAuth from "./useAuth";
import axios from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";

const useAxiosAuth = () => {
  // Hook do przechowywania danych użytkownika
  const { userData } = useAuth();

  // Hook do odświeżania tokenu
  const refresh = useRefreshToken();

  useEffect(() => {
    // Interceptor do dodania tokenu do zapytania
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          // Dodanie tokenu do nagłówka zapytania
          config.headers["Authorization"] = `Bearer ${userData.accessToken}`;
        }

        if (!config.withCredentials) {
          // Dodanie informacji o tym, że zapytanie jest autoryzowane
          config.withCredentials = true;
        }

        // Zwróć zaktualizowany obiekt konfiguracji zapytania
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor do obsługi błędu 403 (brak dostępu)
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (
          error?.response?.status === 403 &&
          error.config &&
          !error.config.retry
        ) {
          // Oznaczenie zapytania jako wysłane ponownie
          error.config.retry = true;

          // Odśwież token
          try {
            const accessToken = await refresh();
            error.config.headers["Authorization"] = `Bearer ${accessToken}`;
          } catch (error) {
            // W przypadku błędu odświeżania tokena zwróć błąd
            return Promise.reject(error);
          }

          // Ponowne wysłanie zapytania z nowym tokenem
          return axios(error.config);
        }

        return Promise.reject(error);
      }
    );

    // Usunięcie interceptorów przy odmontowaniu komponentu używający tego hooka
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [userData, refresh]);

  return axios;
};

export default useAxiosAuth;
