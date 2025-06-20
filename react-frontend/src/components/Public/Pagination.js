import React from 'react';
import { Link } from 'react-router-dom';

const Pagination = ({ 
  currentPage, 
  totalItems, 
  itemsPerPage, 
  onPageChange 
}) => {
  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Create page numbers array
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <ul className="back-pagination">
      {/* Previous button */}
      {currentPage > 1 && (
        <li className="back-prev">
          <Link 
            to="#" 
            onClick={(e) => {
              e.preventDefault();
              onPageChange(currentPage - 1);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </Link>
        </li>
      )}

      {/* Page numbers */}
      {pageNumbers.map(number => (
        <li key={number} className={currentPage === number ? "active" : ""}>
          <Link 
            to="#" 
            onClick={(e) => {
              e.preventDefault();
              onPageChange(number);
            }}
          >
            {number}
          </Link>
        </li>
      ))}

      {/* Next button */}
      {currentPage < totalPages && (
        <li className="back-next">
          <Link 
            to="#" 
            onClick={(e) => {
              e.preventDefault();
              onPageChange(currentPage + 1);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </li>
      )}
    </ul>
  );
};

export default Pagination;