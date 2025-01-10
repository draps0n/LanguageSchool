import React from "react";
import { useTranslation } from "react-i18next";
import "../styles/Pagination.css";

function Pagination({ currentPage, totalPages, setCurrentPage }) {
  const { t } = useTranslation();

  // Funkcja do obsługi przycisku "Następna"
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Funkcja do obsługi przycisku "Poprzednia"
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="pagination">
      <button onClick={prevPage} disabled={currentPage === 1}>
        {t("previous")}
      </button>
      <button onClick={nextPage} disabled={currentPage === totalPages}>
        {t("next")}
      </button>
    </div>
  );
}

export default Pagination;
