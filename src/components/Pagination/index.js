import React from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from "react-paginate";

const Pagination = (
  {
    pageCount,
    initialPage,
    pageRange,
    marginPage,
    onChange,
    className
  }
) => {
  return (
    <ReactPaginate
      pageCount={pageCount}
      marginPagesDisplayed={marginPage}
      pageRangeDisplayed={pageRange}
      forcePage={initialPage - 1}
      previousLabel={<i className="fa-regular fa-arrow-left"/>}
      nextLabel={<i className="fa-regular fa-arrow-right"/>}
      breakLabel={'...'}
      breakClassName={'page-item'}
      breakLinkClassName={'page-link custom-rounded-12 custom-shadow-2 text-secondary border-0 focus-none me-2'}
      containerClassName={`pagination ${className}`}
      pageClassName={'page-item rounded me-2'}
      pageLinkClassName={'page-link focus-none border-0 custom-shadow-2 custom-rounded-12'}
      activeLinkClassName={"bg-d6bb75"}
      previousClassName={'page-item me-2'}
      nextClassName={'page-item me-2'}
      previousLinkClassName={'page-link custom-shadow-2 border-0 custom-rounded-12 focus-none'}
      nextLinkClassName={'page-link custom-shadow-2 border-0 custom-rounded-12 focus-none'}
      onPageChange={i => onChange(i.selected + 1)}
    />
  );
};

Pagination.defaultProps = {
  pageCount: 10,
  initialPage: 1,
  pageRange: 2,
  marginPage: 3,
  onChange: () => {},
  className: ''
};

Pagination.propTypes = {
  pageCount: PropTypes.number.isRequired,
  initialPage: PropTypes.number.isRequired,
  pageRange: PropTypes.number,
  marginPage: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default Pagination;