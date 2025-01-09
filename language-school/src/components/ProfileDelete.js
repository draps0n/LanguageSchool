import React from "react";
import { useNavigate } from "react-router-dom";
import useAxiosAuth from "../hooks/useAxiosAuth";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";

function ProfileDelete() {
  const axios = useAxiosAuth();
  const navigate = useNavigate();
  const { setUserData } = useAuth();

  const deleteProfile = async () => {
    try {
      const response = await axios.delete("/users/profile");

      if (response.status === 200) {
        setUserData(null);
        toast.success("Twoje konto zostało usunięte.");
        navigate("/");
      } else {
        throw new Error("Nie udało się usunąć konta! Spróbuj ponownie.");
      }
    } catch (error) {
      if (error.response.status === 409) {
        toast.error("Prowadzisz zajęcia. Nie możesz usunąć konta.");
        navigate("/profile");
      } else {
        toast.error("Nie udało się usunąć konta! Spróbuj ponownie.");
      }
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <h2>Czy jesteś pewien, że chcesz usunąć swoje konto?</h2>
      <div className="button-panel">
        <button onClick={deleteProfile} className="small-button delete-button">
          Usuń
        </button>
        <button onClick={goBack} className="small-button">
          Anuluj
        </button>
      </div>
    </div>
  );
}

export default ProfileDelete;
