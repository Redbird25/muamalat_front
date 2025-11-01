import React, {useState} from 'react';
import {Link} from "react-router-dom";
import InputPhone from "../../../components/Fields/InputPhone";
import {get} from "lodash";
import {useSelector} from "react-redux";

const Account = () => {
  const {auth} = useSelector(state => state);
  
  const [{
    user_name,
    user_surname,
    user_sex,
    region_id,
    district_id,
    phone
  }, setUser] = useState({
    user_name: "",
    user_surname: "",
    user_sex: 0,
    region_id: "",
    district_id: "",
    phone: get(auth, 'data.user.phone_number') ? get(auth, 'data.user.phone_number', "").replace("998", "") : ""
  })
  
  return (
    <div>
      <nav className={"clear-before"} aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fs-14 fw-500">
            <Link className="text-75758b text-decoration-none"
                  to="/dashboard">Кабинет курьера</Link>
          </li>
          <li className="breadcrumb-item clear-before fs-14 fw-500 text-75758b active" aria-current="page">
            <i className="fas fa-chevron-right fs-12 me-1"/> Профиль
          </li>
        </ol>
      </nav>
      
      <div className="bg-white p-3 custom-rounded-12 border border-ebebeb">
        <p className={"fs-18 fw-600"}>Информация о пользователе</p>
        
        <div className="row">
          <div className="col-lg-4">
            <label htmlFor={"name"} className={"form-label"}>Имя</label>
            <input
              type={"text"}
              id={"name"}
              name={"name"}
              style={{
                minHeight: 50
              }}
              value={user_name}
              onChange={(e) => setUser(prevState => ({...prevState, user_name: e.target.value}))}
              placeholder={"Имя"}
              className={"form-control border-f0f1f2 custom-rounded-12 focus-none"}
            />
          </div>
          
          <div className="col-lg-4">
            <label htmlFor={"surname"} className={"form-label"}>Фамилия</label>
            <input
              type={"text"}
              id={"surname"}
              name={"surname"}
              style={{
                minHeight: 50
              }}
              value={user_surname}
              onChange={(e) => setUser(prevState => ({...prevState, user_surname: e.target.value}))}
              placeholder={"Фамилия"}
              className={"form-control border-f0f1f2 custom-rounded-12 focus-none"}
            />
          </div>
          
          <div className="col-lg-4">
            <label htmlFor={"sex"} className={"form-label"}>Пол</label>
            <div className="d-flex">
              <label
                htmlFor="sex"
                className="form-label position-relative w-auto custom-rounded-12 mb-0 d-flex align-items-center text-75758b fs-14"
                style={{minHeight: 50, padding: "0 12px 0 30px"}}
              >
                <input
                  type="radio"
                  checked={user_sex === 1}
                  name="sex"
                  id={"sex"}
                  onChange={() => setUser(prevState => ({...prevState, user_sex: 1}))}
                  className="form-check-input mt-0 rounded-circle position-absolute color-warning focus-none"
                  style={{left: 0, width: 20, height: 20}}
                />
                
                Мужчина
              </label>
              
              
              <label
                htmlFor="sex_1"
                className="form-label position-relative w-auto custom-rounded-12 mb-0 d-flex align-items-center text-75758b fs-14"
                style={{minHeight: 50, padding: "0 12px 0 30px"}}
              >
                <input
                  type="radio"
                  checked={user_sex === 2}
                  name="sex"
                  id={"sex_1"}
                  onChange={() => setUser(prevState => ({...prevState, user_sex: 2}))}
                  className="form-check-input mt-0 rounded-circle position-absolute color-warning focus-none"
                  style={{left: 0, width: 20, height: 20}}
                />
                
                Женщина
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-3 custom-rounded-12 border border-ebebeb mt-3">
        <p className={"fs-18 fw-600"}>Контакты и Адрес</p>
        
        <div className="row justify-content-center">
          <div className="col-lg-4">
            <label htmlFor={"region_id"} className={"form-label"}>Область*</label>
            <select
              id={"region_id"}
              name={"region_id"}
              style={{minHeight: 50}}
              value={region_id}
              onChange={(e) => setUser(prevState => ({...prevState, region_id: e.target.value}))}
              className={"form-select border-f0f1f2 custom-rounded-12 focus-none"}
            >
              <option value="">Выберите</option>
              <option value="1">Ташкент</option>
              <option value="2">Самарканд</option>
            </select>
          </div>
          
          <div className="col-lg-4">
            <label htmlFor={"district_id"} className={"form-label"}>Район*</label>
            <select
              id={"district_id"}
              name={"district_id"}
              style={{
                minHeight: 50
              }}
              value={district_id}
              onChange={(e) => setUser(prevState => ({...prevState, district_id: e.target.value}))}
              className={"form-select focus-none border-f0f1f2 custom-rounded-12"}
            >
              <option value="">Выберите</option>
              <option value="1">Юнусабад</option>
              <option value="2">Миробод</option>
            </select>
          </div>
          
          <div className="col-lg-4">
            <label htmlFor="user_phone" className="form-label">Номер телефона</label>
            <InputPhone
              id={"user_phone"}
              name="user_phone"
              format="+998 ## ### ## ##"
              disabled
              className={`form-control border-f0f1f2 custom-rounded-12 fs-14 text-334150 focus-none`}
              type="tel"
              style={{minHeight: 50}}
              value={phone}
              isNumericString
              onValueChange={e => setUser(prevState => ({...prevState, phone: e.value}))}
              allowEmptyFormatting
            />
          </div>
          
          <div className="col-lg-5">
            <button
              type={"button"}
              style={{minHeight: 43}}
              className={"btn bg-75758b px-4 fs-17 fw-600 custom-rounded-12 text-white mt-3 mb-3 focus-none w-100"}
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
