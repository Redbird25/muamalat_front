import React from 'react';
import {useNavigate} from "react-router-dom";
import logo from "assets/images/icon/logo.svg"

const NotFound = () => {
  const navigate = useNavigate();
  
  
  return (
    <div className={"custom-min-h-50-dvh d-flex-column-center-center my-4"}>
      <img src={logo} alt="logo"/>
      <h1 className={"fs-49 text-primary2 text-center mt-md-2 mt-3"}>Sahifa topilmadi :(</h1>
      <button type={"button"} className={"btn btn-menu mt-3"} onClick={() => navigate("/")}>
        <span className="bg-gradient-custom reverse"/>
        <span className="position-relative custom-zindex-2">
          Bosh sahifaga qaytish
        </span>
      </button>
    </div>
  );
};

export default NotFound;
