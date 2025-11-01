import React from 'react';
import {Link} from "react-router-dom";
import SellerRegisterForm from "../../../components/SellerRegisterForm";

const Company = () => {
  return (
    <div className={"w-100"}>
      <p className="fs-32 text-greyscale800 fw-700">Компания</p>
      
      <nav className={"clear-before"} aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fs-14 fw-500">
            <Link className="text-75758b text-decoration-none"
                  to="/dashboard">Кабинет продавца</Link>
          </li>
          <li className="breadcrumb-item clear-before fs-14 fw-500 text-75758b active" aria-current="page">
            <i className="fas fa-chevron-right fs-12 me-1"/> Компания
          </li>
        </ol>
      </nav>
      
      <div className="row flex-lg-nowrap">
        <SellerRegisterForm/>
      </div>
    </div>
  );
};

export default Company;
