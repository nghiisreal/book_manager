/* eslint-disable react/prop-types */
/* eslint-disable multiline-ternary */
/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable space-before-function-paren */
/* eslint-disable prettier/prettier */
import React from 'react';

function Pagination(props) {
  const { currentPage, totalPages, handlePageChange } = props;
  const maxPagesToShow = 5; // Số lượng trang tối đa được hiển thị
  const pages = [];

  // Tính toán các trang cần hiển thị
  for (let i = 1; i <= totalPages; i++) {
    const distanceFromCurrentPage = Math.abs(i - currentPage);
    const isNearCurrentPage = distanceFromCurrentPage <= maxPagesToShow - 2;
    const isCurrentPage = i === currentPage;
    if (isCurrentPage || isNearCurrentPage) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div>
      <nav aria-label="Page navigation example">
        <ul className="pagination" style={{ marginBottom: 0 }}>
          <li className={currentPage === 1 ? 'page-item disabled' : 'page-item'}>
            <a
              className="page-link"
              href={`#page=${currentPage - 1}`}
              onClick={() => handlePageChange(currentPage - 1)}>
              Previous
            </a>
          </li>
          {pages.map((pageNumber, index) => {
            const isEllipsis = pageNumber === '...';
            return (
              <li
                key={index}
                className={
                  isEllipsis
                    ? 'page-item disabled'
                    : currentPage === pageNumber
                    ? 'page-item active'
                    : 'page-item'
                }>
                <a
                  className="page-link"
                  href={`#page=${pageNumber}`}
                  onClick={() => !isEllipsis && handlePageChange(pageNumber)}>
                  {pageNumber}
                </a>
              </li>
            );
          })}
          <li className={currentPage === totalPages ? 'page-item disabled' : 'page-item'}>
            <a
              className="page-link"
              href={`#page=${currentPage + 1}`}
              onClick={() => handlePageChange(currentPage + 1)}>
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
export default React.memo(Pagination);
