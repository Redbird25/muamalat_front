import React, {useState} from 'react';
import {Link} from "react-router-dom";
import phone_icon from "assets/images/phone-cart.png"
import InputPhone from "../../../components/Fields/InputPhone";
import CanvasChart from "../../../components/CanvasChart";

const Dashboard = () => {
  const [isSelect, setSelect] = useState("1");
  
  return (
    <>
      <nav className={"clear-before mt-3 "} aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fs-14 fw-500">
            <Link className="text-75758b text-decoration-none"
                  to="/dashobard">Кабинет курьера</Link>
          </li>
          <li className="breadcrumb-item clear-before fs-14 fw-500 text-75758b active" aria-current="page">
            <i className="fas fa-chevron-right fs-12 me-1"/> Главная
          </li>
        </ol>
      </nav>
      
      <div className="bg-white p-3 border border-ebebeb custom-rounded-12">
        <p className={"fs-18 fw-600 lh-24"}>Активные заказы</p>
        
        <div className="px-3 pt-3 pb-5 border border-ebebeb custom-rounded-12">
          <p className={"fs-18 fw-600 lh-24"}>Заказ №123</p>
          
          <div className="row justify-content-between align-items-start">
            <div className="col-lg-8">
              <div className="row">
                <div className="col-xl-6">
                  <div className="row">
                    <div className="col-xxl-3 col-xl-4 col-lg-6">
                      <div
                        className={"border border-ebebeb custom-rounded-12 d-flex-center-center py-3 px-2"}>
                        <img src={phone_icon} alt="card"/>
                      </div>
                    </div>
                    
                    <div className="col-xxl-7 col-xl-8 col-lg-6 mt-lg-0 mt-3">
                      <div className="px-3">
                        <p className={"lh-18"}>Телевизор LG 55UR81006LJ Smart</p>
                        
                        <p className={"fs-xxl-24 fs-20 fw-700 lh-xxl-25 lh-21"}>
                          <InputPhone value={9_100_000} thousandSeparator={" "} displayType={"text"}/> сум
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-xl-6 mt-xl-0 mt-3">
                  <div className="row">
                    <div className="col-xxl-3 col-xl-4 col-lg-6">
                      <div
                        className={"border border-ebebeb custom-rounded-12 d-flex-center-center py-3 px-2"}>
                        <img src={phone_icon} alt="card"/>
                      </div>
                    </div>
                    
                    <div className="col-xxl-7 col-xl-8 col-lg-6 mt-lg-0 mt-3">
                      <div className="px-3">
                        <p className={"lh-18"}>Телевизор LG 55UR81006LJ Smart</p>
                        
                        <p className={"fs-xxl-24 fs-20 fw-700 lh-xxl-25 lh-21"}>
                          <InputPhone value={9_100_000} thousandSeparator={" "} displayType={"text"}/> сум
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4">
              <button type={"button"}
                      className={`btn btn-menu custom-rounded-12 focus-none w-100 mt-3`}
              >
                <span className="bg-gradient-custom reverse custom-rounded-12"/>
                <span
                  className="position-relative d-flex align-items-center justify-content-center fs-17 fw-600 custom-zindex-2">
                  Подробно
                </span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="px-3 pt-3 pb-5 border border-ebebeb custom-rounded-12 mt-3">
          <p className={"fs-18 fw-600 lh-24"}>Заказ №123</p>
          
          <div className="row justify-content-between align-items-start">
            <div className="col-lg-8">
              <div className="row">
                <div className="col-xl-6">
                  <div className="row">
                    <div className="col-xxl-3 col-xl-4 col-lg-6">
                      <div
                        className={"border border-ebebeb custom-rounded-12 d-flex-center-center py-3 px-2"}>
                        <img src={phone_icon} alt="card"/>
                      </div>
                    </div>
                    
                    <div className="col-xxl-7 col-xl-8 col-lg-6 mt-lg-0 mt-3">
                      <div className="px-3">
                        <p className={"lh-18"}>Телевизор LG 55UR81006LJ Smart</p>
                        
                        <p className={"fs-xxl-24 fs-20 fw-700 lh-xxl-25 lh-21"}>
                          <InputPhone value={9_100_000} thousandSeparator={" "} displayType={"text"}/> сум
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4">
              <button type={"button"}
                      className={`btn btn-menu custom-rounded-12 focus-none w-100 mt-3`}
              >
                <span className="bg-gradient-custom reverse custom-rounded-12"/>
                <span
                  className="position-relative d-flex align-items-center justify-content-center fs-17 fw-600 custom-zindex-2">
                  Подробно
                </span>
              </button>
            </div>
          </div>
        </div>
      
      
      </div>
      
      <div className="bg-white p-3 custom-rounded-20 my-3">
        <div className="row">
          <div className="col-12 mb-5">
            <div className="bg-white p-lg-4 p-3 custom-rounded-12">
              <div className="position-relative w-100 mb-xl-3 mb-5">
                <div className="position-absolute fw-600 text-171725 top-0 start-0 custom-zindex-4">График продаж</div>
                
                <div className="position-absolute fw-600 text-171725 top-0 end-0 custom-zindex-4"
                     style={{minWidth: 230}}
                >
                  <select value={isSelect}
                          onChange={(e) => setSelect(e.target.value)}
                          className="form-select focus-none custom-rounded-12 text-75758b fw-500 border-f0f1f2">
                    <option value="1">За 12 месяцев</option>
                    <option value="2">За 6 месяцев</option>
                    <option value="3">За 3 месяцев</option>
                  </select>
                </div>
              </div>
              <CanvasChart/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
