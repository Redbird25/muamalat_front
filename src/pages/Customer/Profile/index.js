import React from 'react';
import {Link} from "react-router-dom";
import MyForm from "../../../schema/Form";
import {Field} from "formik";
import {get} from "lodash";
import InputPhone from "../../../components/Fields/InputPhone";
import YandexMap from "../../../components/YandexMap";
import {useSelector} from "react-redux";

const Profile = () => {
  const {auth} = useSelector(state => state);
  
  return (
    <div className={"w-100"}>
      <nav className={"clear-before mt-lg-0 mt-3"} aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fs-14 fw-500">
            <Link className="text-75758b text-decoration-none"
                  to="/dashboard">Кабинет покупателя</Link>
          </li>
          <li className="breadcrumb-item clear-before fs-14 fw-500 text-75758b active" aria-current="page">
            <i className="fas fa-chevron-right fs-12 me-1"/> Профиль
          </li>
        </ol>
      </nav>
      <MyForm
        fields={[
          {
            name: "name",
            value: get(auth, "data.user_info.first_name", null) ?? "",
            required: true
          },
          {
            name: "surname",
            value: get(auth, "data.user_info.last_name", null) ?? "",
            required: true
          },
          {
            name: "sex",
            value: 0,
            type: "number",
            required: true
          },
          {
            name: "region_id",
            value: "",
            required: true
          },
          {
            name: "district_id",
            value: "",
            required: true
          },
          {
            name: "phone",
            value: get(auth, 'data.user.phone_number') ? get(auth, 'data.user.phone_number', "").replace("998", "") : "",
            required: true
          },
          {
            name: "address",
            value: "",
            required: true
          },
          {
            name: "map_lt",
            value: undefined,
            required: true
          },
          {
            name: "map_ln",
            value: undefined,
            required: true
          }
        ]}
        onSubmit={({values, setSubmitting})=> {

        }}
      >
        {({values, setFieldValue, isSubmitting}) => {
          return <React.Fragment>
            <div className={"bg-white border border-ebebeb custom-rounded-12 p-3"}>
              <p className={"fs-18 fw-600"}>Информация о пользователя</p>
              
              <div className="row">
                <div className="col-lg-4">
                  <label className={"form-label text-141316 fs-14"} htmlFor={"name"}>Имя</label>
                  <Field
                    style={{
                      height: 50
                    }}
                    className={"form-control focus-none border-f0f1f2 custom-rounded-12"}
                    name={"name"}
                    id={"name"}
                    placeholder={"Имя"}
                    value={get(values, "name")}
                  />
                </div>
                
                <div className="col-lg-4 mt-lg-0 mt-3">
                  <label className={"form-label text-141316 fs-14"} htmlFor={"surname"}>Фамилия</label>
                  <Field
                    style={{
                      height: 50
                    }}
                    className={"form-control focus-none border-f0f1f2 custom-rounded-12"}
                    name={"surname"}
                    id={"surname"}
                    placeholder={"Фамилия"}
                    value={get(values, "surname")}
                  />
                </div>
                
                <div className="col-lg-4 mt-lg-0 mt-3">
                  <label htmlFor={"sex"} className={"form-label"}>Пол</label>
                  
                  <div className="d-flex">
                    <label
                      htmlFor="sex"
                      className="form-label position-relative w-auto custom-rounded-12 mb-0 d-flex align-items-center text-75758b fs-14"
                      style={{minHeight: 50, padding: "0 12px 0 30px"}}
                    >
                      <Field
                        type="radio"
                        checked={get(values, "sex") === 1}
                        name="sex"
                        id={"sex"}
                        onChange={() => setFieldValue("sex", 1)}
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
                      <Field
                        type="radio"
                        checked={get(values, "sex") === 2}
                        name="sex"
                        id={"sex_1"}
                        onChange={() => setFieldValue("sex", 2)}
                        className="form-check-input mt-0 rounded-circle position-absolute color-warning focus-none"
                        style={{left: 0, width: 20, height: 20}}
                      />
                      
                      Женщина
                    </label>
                  </div>
                </div>
              </div>
            
            </div>
            
            <div className="bg-white border border-ebebeb custom-rounded-12 p-3 my-3">
              <p className={"fs-18 fw-600"}>Контакты и Адрес</p>
              
              <div className="row mb-3 justify-content-center">
                <div className="col-lg-4">
                  <label className={"form-label text-141316 fs-14"} htmlFor={"region_id"}>Область*</label>
                  <Field
                    style={{
                      height: 50
                    }}
                    as={"select"}
                    className={"form-select focus-none border-f0f1f2 custom-rounded-12"}
                    name={"region_id"}
                    id={"region_id"}
                    placeholder={"Имя"}
                    value={get(values, "region_id")}
                  >
                    <option value="">Выберите</option>
                    <option value="1">Ташкент</option>
                    <option value="2">Андижон</option>
                  </Field>
                </div>
                
                <div className="col-lg-4 mt-lg-0 mt-3">
                  <label className={"form-label text-141316 fs-14"} htmlFor={"district_id"}>Район*</label>
                  <Field
                    style={{
                      height: 50
                    }}
                    as={"select"}
                    className={"form-select focus-none border-f0f1f2 custom-rounded-12"}
                    name={"district_id"}
                    id={"district_id"}
                    placeholder={"Имя"}
                    value={get(values, "district_id")}
                  >
                    <option value="">Выберите</option>
                    <option value="1">Юнусабад</option>
                    <option value="2">Миробод</option>
                  </Field>
                </div>
                
                <div className="col-lg-4 mt-lg-0 mt-3">
                  <label className={"form-label text-141316 fs-14"} htmlFor={"phone"}>Номер телефона</label>
                  <Field
                    component={InputPhone}
                    id={"phone"}
                    name="phone"
                    format="+998 ## ### ## ##"
                    className={`form-control border-f0f1f2 custom-rounded-12 focus-none`}
                    disabled
                    type="tel"
                    style={{minHeight: 50}}
                    value={get(values, "phone")}
                    isNumericString
                    onValueChange={e => {
                      setFieldValue(prevState => ({...prevState, phone: e.value}))
                    }}
                    allowEmptyFormatting
                  />
                </div>
                
                <div className="col-12 mt-lg-0 mt-3">
                  <div className="mb-3">
                    <label className={"form-label text-141316 fs-14"} htmlFor={"address"}>Адрес</label>
                    <Field
                      style={{
                        height: 50
                      }}
                      className={"form-control focus-none border-f0f1f2 custom-rounded-12"}
                      name={"address"}
                      id={"address"}
                      placeholder={"Адрес"}
                      value={get(values, "address")}
                    />
                  </div>
                  
                  <YandexMap
                    lat={values["map_lt"]}
                    long={values["map_ln"]}
                    language={"ru"}
                    onClick={(coords) => {
                      setFieldValue('map_lt', coords[0])
                      setFieldValue('map_ln', coords[1])
                    }}
                  />
                </div>
                
                <div className="col-auto">
                  <button type="submit"
                          disabled={isSubmitting}
                          className={`btn btn-menu custom-rounded-12 focus-none mt-3 ${isSubmitting ? "disabled" : ""}`}
                          style={{minWidth: 270, minHeight: 50}}
                  >
                    <span className="bg-gradient-custom reverse custom-rounded-12"></span>
                    <span
                      className="position-relative d-flex align-items-center justify-content-center fs-17 fw-600 custom-zindex-2">
                      Сохранить
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </React.Fragment>
        }}
      </MyForm>
    
    </div>
  );
};

export default Profile;
