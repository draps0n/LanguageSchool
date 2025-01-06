import axios from "../api/axios";
import { useAuth } from "./useAuth";

const useRefreshToken = () => {
  // Hook do przechowywania danych użytkownika
  const { setUserData } = useAuth();

  // Funkcja do odświeżania tokena
  const refresh = async () => {
    // Odpytaj serwer o nowy token
    const response = await axios.get("/auth/refresh", {
      withCredentials: true,
    });

    // Zaktualizuj dane użytkownika o nowy token
    setUserData((prev) => ({
      ...prev,
      accessToken: response.data.accessToken,
    }));

    // Zwróć nowy token
    return response.data.accessToken;
  };

  // Zwróć funkcję do odświeżania tokena
  return refresh;
};

export default useRefreshToken;
