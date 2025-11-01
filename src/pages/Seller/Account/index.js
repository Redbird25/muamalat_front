import React from 'react';
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {get} from "lodash";

const Account = () => {
  const {auth} = useSelector(state => state);
  return (
    <div className={get(auth, "isAuthenticated") ? "" : "container"}>
      <p className="fs-32 text-greyscale800 fw-700">Открытие счёта</p>
      
      {
        get(auth, "isAuthenticated")
          ? <nav className={"clear-before"} aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item fs-14 fw-500">
                <Link className="text-75758b text-decoration-none"
                      to="/dashboard">Кабинет продавца</Link>
              </li>
              <li className="breadcrumb-item clear-before fs-14 fw-500 text-75758b active" aria-current="page">
                <i className="fas fa-chevron-right fs-12 me-1"/>
                <Link className="text-75758b text-decoration-none"
                      to="/dashboard/company"> Компания</Link>
              </li>
              
              <li className="breadcrumb-item clear-before fs-14 fw-500 text-75758b active" aria-current="page">
                <i className="fas fa-chevron-right fs-12 me-1"/> Открыть счёт
              </li>
            </ol>
          </nav>
          : null
      }
      
      
      <div className="border border-bfbfda bg-ebebeb py-3 px-4 custom-rounded-12 mb-3">
        <p className={"fs-18 fw-600 mb-0"}>'TECHNOLOGY COMMUNITY GROUP' MAS’ULIYATI CHEKLANGAN JAMIYAT</p>
        
        <p className={"fs-14 fw-700 text-greyscale800"}>309846134</p>
        
        <div className={"w-lg-80 mb-2"}>
          <label className={"form-label fs-14 text-141316"} htmlFor="legal_address">Юридический адрес</label>
          
          <input
            placeholder={"Юридический адрес"}
            type="text"
            className={"form-control border-f0f1f2 custom-rounded-12 focus-none"}
            style={{minHeight: 50}}
          />
        </div>
        
        <small className={"text-greyscale800 fs-14"}>Если адрес определился неверно, то укажите правильный</small>
      </div>
      
      <div className="border border-bfbfda bg-ebebeb py-3 px-4 custom-rounded-12 mb-3">
        <p className={"fs-18 fw-600 mb-0"}>Адрес компании</p>
        
        <p className={"fs-14 text-greyscale800"}>Укажите фактический адрес</p>
        
        <div className={"w-lg-80 mb-2"}>
          <input
            placeholder={"Фактический адрес"}
            type="text"
            className={"form-control border-f0f1f2 custom-rounded-12 focus-none"}
            style={{minHeight: 50}}
          />
        </div>
      </div>
      
      <div className="border border-bfbfda bg-ebebeb py-3 px-4 custom-rounded-12 mb-3">
        <p className={"fs-18 fw-600 mb-0"}>Тариф на обслуживание</p>
        
        <p className={"fs-14 text-greyscale800"}>Выберите тариф, который подходит вашему бизнесу.</p>
        
        <div className={"w-lg-80 mb-2"}>
          <select
            style={{minHeight: 50}}
            className={"form-select border-f0f1f2 custom-rounded-12 focus-none"}
          >
            <option value="">Выбрать тариф</option>
            <option value="1">Express</option>
            <option value="2">Standard</option>
          </select>
        </div>
      </div>
      
      <div
        className={"custom-rounded-12 p-3"}
        style={{
          background: "rgba(211, 177, 94, 0.08)",
          border: "1px solid rgba(211, 177, 94, 0.24)"
        }}>
        <div className="form-check">
          <input
            className="form-check-input color-warning focus-none" type="checkbox" value=""
            id="flexCheckDefault"/>
          <label className="form-check-label text-141316 fw-600 fs-14" htmlFor="flexCheckDefault">
            Один из учредителей не является резидентом РУз
          </label>
        </div>
      </div>
      
      <div className={"d-flex-between-center mt-4"}>
        {
          !get(auth, "isAuthenticated")
            ? <Link type="button"
                      className={`btn bg-75758b fw-600 d-flex-center-center custom-rounded-12 mb-4 text-white focus-none`}
                      style={{minWidth: 270, minHeight: 50}}
             to={"/seller-registration"}>
                Назад
            </Link>
            : null
        }
        
        <button type="button"
                className={`btn btn-menu custom-rounded-12 focus-none mb-4 w-auto`}
                style={{minWidth: 270, minHeight: 50}}
        >
          <span className="bg-gradient-custom reverse custom-rounded-12"></span>
          <span
            className="position-relative d-flex align-items-center justify-content-center fs-17 fw-600 custom-zindex-2">
                Продолжить
              </span>
        </button>
      </div>
    </div>
  );
};

export default Account;
