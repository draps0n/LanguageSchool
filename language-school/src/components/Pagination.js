import React from "react";
import "../styles/Pagination.css";

function Pagination({ currentPage, totalPages, setCurrentPage }) {
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
        Poprzednia
      </button>
      <button onClick={nextPage} disabled={currentPage === totalPages}>
        Następna
      </button>
    </div>
  );
}

export default Pagination;
