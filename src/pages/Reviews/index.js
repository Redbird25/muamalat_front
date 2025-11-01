import React from 'react';
import {Link} from "react-router-dom";

const Reviews = () => {
  return (
    <>
      <p className="fs-32 text-greyscale800 fw-700">Отзывы</p>
      
      <nav className={"clear-before"} aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fs-14 fw-500">
            <Link className="text-75758b text-decoration-none"
                  to="/dashboard">Кабинет продавца</Link>
          </li>
          <li className="breadcrumb-item clear-before fs-14 fw-500 text-75758b active" aria-current="page">
            <i className="fas fa-chevron-right fs-12 me-1"/> Отзывы
          </li>
        </ol>
      </nav>
    </>
  );
};

export default Reviews;
