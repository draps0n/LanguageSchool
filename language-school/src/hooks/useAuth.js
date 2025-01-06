import AuthContext from "../context/AuthProvider";
import { useContext } from "react";

export const useAuth = () => {
  // Zwróc hook do przechowywania danych użytkownika
  return useContext(AuthContext);
};

export default useAuth;
