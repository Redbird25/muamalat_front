import React, {useState} from 'react';
import {Link} from "react-router-dom";
import CanvasChart from "../../components/CanvasChart";

const Dashboard = () => {
  const [isSelect, setSelect] = useState("1");
  
  return (
    <>
      <p className="fs-32 text-greyscale800 fw-700">Кабинет продавца</p>
      
      <nav className={"clear-before"} aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fs-14 fw-500">
            <Link className="text-75758b text-decoration-none"
                  to="/">Главная</Link>
          </li>
          <li className="breadcrumb-item clear-before fs-14 fw-500 text-75758b active" aria-current="page">
            <i className="fas fa-chevron-right fs-12 me-1"/> Кабинет продавца
          </li>
        </ol>
      </nav>
      
      <div className="row">
        <div className="col-xxl-3 col-md-6 mb-xxl-0 mb-3">
          <div className="bg-white h-100 border p-lg-4 border-e5e7e9 shadow-sm custom-rounded-12 p-3">
            <div className="d-flex-align-center text-171725 fw-600">
              <i className="fi fi-sr-coins fs-24 lh-18 me-3 color-text-gradient mt-1"/>
              
              Доход
            </div>
            
            <div className="my-2 d-flex align-items-center">
              <span className="fs-28 text-171725 fw-600 d-inline-block me-3">$27 632</span>
              
              <span className="text-34c759 fw-600">+2.5% <i className="far fa-arrow-up ms-2"/></span>
            </div>
            
            <p className="fs-14 text-696974 mb-0">
              Compared to ($21340 last year)
            </p>
          </div>
        </div>
        
        <div className="col-xxl-3 col-md-6 mb-xxl-0 mb-3">
          <div className="bg-white h-100 border p-lg-4 border-e5e7e9 shadow-sm custom-rounded-12 p-3">
            <div className="d-flex-align-center text-171725 fw-600">
              <i className="fi fi-sr-marketplace-alt fs-24 lh-18 me-3 color-text-gradient mt-1"/>
              
              Заказы
            </div>
            
            <div className="my-2 d-flex align-items-center">
              <span className="fs-28 text-171725 fw-600 d-inline-block me-3">122</span>
              
              <span className="text-f04e79 fw-600">-10.5% <i className="far fa-arrow-down ms-2"/></span>
            </div>
            
            <p className="fs-14 text-696974 mb-0">
              Compared to ($21340 last year)
            </p>
          </div>
        </div>
        
        <div className="col-xxl-3 col-md-6 mb-xxl-0 mb-3">
          <div className="bg-white h-100 border p-lg-4 border-e5e7e9 shadow-sm custom-rounded-12 p-3">
            <div className="d-flex-align-center text-171725 fw-600">
              <i className="fi fi-sr-ranking-stars fs-24 lh-18 me-3 color-text-gradient mt-1"/>
              
              Рейтинг
            </div>
            
            <div className="my-2 d-flex align-items-center">
              <span className="fs-28 text-171725 fw-600 d-inline-block me-3">122</span>
              
              <span className="text-f04e79 fw-600">-10.5% <i className="far fa-arrow-down ms-2"/></span>
            </div>
            
            <p className="fs-14 text-696974 mb-0">
              Compared to ($21340 last year)
            </p>
          </div>
        </div>
        
        <div className="col-xxl-3 col-md-6 mb-xxl-0 mb-3">
          <div className="bg-white h-100 border p-lg-4 border-e5e7e9 shadow-sm custom-rounded-12 p-3">
            <div className="d-flex-align-center text-171725 fw-600">
              <i className="fi fi-sr-dolly-flatbed-alt fs-24 lh-18 me-3 color-text-gradient mt-1"/>
              
              Склад
            </div>
            
            <div className="my-2 d-flex align-items-center">
              <span className="fs-28 text-171725 fw-600 d-inline-block me-3">$27 632</span>
              
              <span className="text-34c759 fw-600">+2.5% <i className="far fa-arrow-up ms-2"/></span>
            </div>
            
            <p className="fs-14 text-696974 mb-0">
              Compared to ($21340 last year)
            </p>
          </div>
        </div>
      </div>
      
      <p className="fs-14 text-141316 fw-600 mt-lg-4 mt-3">График продаж</p>
      
      <div className="row justify-content-center">
        <div className="col-xl-4 col-md-6 mb-xl-0 mb-3">
          <div className="bg-white h-100 border p-lg-4 border-e5e7e9 shadow-sm custom-rounded-12 p-3">
            <div className="text-a7a7a7 fw-600">
              <span className="text-171725">Выручка</span> сегодня
            </div>
            
            <span className="fs-28 mt-2 text-171725 fw-600 d-inline-block">21 108 700</span>
            <span className="fs-16 text-34c759 fw-600 d-block">+5 319 400 (+2.5%) <i
              className="fas fa-question-circle text-a7a7a7 ms-2" data-bs-toggle="tooltip"
              data-bs-placement="right" data-bs-title="Tooltip on right"></i></span>
            
            
            <div className="mt-2">
              <div className="d-inline-block me-3">
                <span className="text-696974 d-block fs-12 mb-1">Вчера</span>
                <span className="text-171725 d-block fs-14 fw-700">15 789 300</span>
              </div>
              
              <div className="d-inline-block">
                <span className="text-696974 d-block fs-12 mb-1">За январь</span>
                <span className="text-171725 d-block fs-14 fw-700">35 789 300</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-4 col-md-6 mb-xl-0 mb-3">
          <div className="bg-white h-100 border p-lg-4 border-e5e7e9 shadow-sm custom-rounded-12 p-3">
            <div className="text-a7a7a7 fw-600">
              <span className="text-171725">Прибыль</span> сегодня
            </div>
            
            <span className="fs-28 mt-2 text-171725 fw-600 d-inline-block">19 654 120</span>
            <span className="fs-16 text-34c759 fw-600 d-block">+5 319 400 (+2.5%) <i
              className="fas fa-question-circle text-a7a7a7 ms-2" data-bs-toggle="tooltip"
              data-bs-placement="right" data-bs-title="Tooltip on right"></i></span>
            
            
            <div className="mt-2">
              <div className="d-inline-block me-3">
                <span className="text-696974 d-block fs-12 mb-1">Вчера</span>
                <span className="text-171725 d-block fs-14 fw-700">15 789 300</span>
              </div>
              
              <div className="d-inline-block">
                <span className="text-696974 d-block fs-12 mb-1">За январь</span>
                <span className="text-171725 d-block fs-14 fw-700">35 789 300</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-4 col-md-6 mb-xl-0 mb-3">
          <div className="bg-white h-100 border p-lg-4 border-e5e7e9 shadow-sm custom-rounded-12 p-3">
            <div className="text-a7a7a7 fw-600">
              <span className="text-171725">Возвраты</span> сегодня
            </div>
            
            <span className="fs-28 mt-2 text-171725 fw-600 d-inline-block">0</span>
            <span className="fs-16 text-34c759 fw-600 d-block">0 (0%) <i
              className="fas fa-question-circle text-a7a7a7 ms-2" data-bs-toggle="tooltip"
              data-bs-placement="right" data-bs-title="Tooltip on right"></i></span>
            
            
            <div className="mt-2">
              <div className="d-inline-block me-3">
                <span className="text-696974 d-block fs-12 mb-1">Вчера</span>
                <span className="text-171725 d-block fs-14 fw-700">15 789 300</span>
              </div>
              
              <div className="d-inline-block">
                <span className="text-696974 d-block fs-12 mb-1">За январь</span>
                <span className="text-171725 d-block fs-14 fw-700">35 789 300</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <p className="fs-14 text-141316 fw-600 mt-lg-4 mt-3">График продаж</p>
      
      <div className="row">
        <div className="col-12 mb-5">
          <div className="bg-white p-lg-4 p-3 custom-rounded-12">
            <div className="position-relative w-100 mb-xl-3 mb-5">
              <div className="position-absolute fw-600 text-171725 top-0 start-0 custom-zindex-4">График продаж</div>
              
              <div className="position-absolute fw-600 text-171725 top-0 end-0 custom-zindex-4"
                   style={{minWidth: 230}}
              >
                <select value={isSelect}
                        onChange={(e)=> setSelect(e.target.value)}
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
    </>
  );
};

export default Dashboard;
