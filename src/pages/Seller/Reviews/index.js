import React, {useState} from 'react';
import {Link} from "react-router-dom";
import {get} from "lodash";
import {Pagination} from "../../../components";

const Reviews = () => {
  const [isTab, setTab] = useState(1);
  
  const listTabs = [
    {
      name: "Все",
      id: 1
    },
    {
      name: "Новые",
      id: 2
    },
    {
      name: "Без ответа",
      id: 3
    },
    {
      name: "С ответом",
      id: 4
    }
  ]
  
  return (
    <>
      <p className="fs-32 text-greyscale800 fw-700">Отзывы</p>
      
      <nav className={"clear-before"} aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fs-14 fw-500">
            <Link className="text-75758b text-decoration-none"
                  to="/">Главная</Link>
          </li>
          <li className="breadcrumb-item clear-before fs-14 fw-500">
            <Link className="text-75758b text-decoration-none"
                  to="/dashboard"><i className="fas fa-chevron-right fs-12 me-1"/> Кабинет продавца</Link>
          </li>
          <li className="breadcrumb-item clear-before fs-14 fw-500 text-75758b active" aria-current="page">
            <i className="fas fa-chevron-right fs-12 me-1"/> Отзывы
          </li>
        </ol>
      </nav>
      
      
      <div
        className={"d-flex flex-wrap align-items-center justify-content-between"}
      >
        <ul
          className={"nav nav-tabs custom-tab-nav custom-rounded-12 bg-white review mb-md-4 mb-2"}
        >
          {
            listTabs.map((item, num) => {
              return <li
                className={"nav-item mb-md-0 mb-2"}
                key={num}
              >
                <button
                  type={"button"}
                  className={`nav-link border-0 ${isTab === get(item, "id", 1) ? "active" : ""}`}
                  onClick={() => setTab(get(item, "id", 1))}
                >
                  {get(item, "name", "-")}
                </button>
              </li>
            })
          }
        </ul>
      </div>
      
      <div
        className={"tab-content custom-tab-content mb-5"}
      >
        <div
          className={"tab-pane fade show active"}
        >
          <div
            className={"bg-white p-3 border border-e6e5ed custom-rounded-20"}
          >
            <div className="row">
              <div className="col-12 mt-3">
                {
                  [...Array(10).keys()].map(item =>
                    <div className={"border p-3 custom-rounded-12 mb-3"} key={item}>
                      <div className="row align-items-center">
                        <div
                          className="w-lg-15 w-sm-50 w-100 d-flex align-items-center justify-content-center border-a7a7a7 text-greyscale800 fs-14 text-center">
                          01.01.2025
                        </div>
                        
                        <div
                          className={"w-lg-50 border-start-lg border-a7a7a7 order-last d-flex-column-center order-lg-0 mt-lg-0 mt-2 min-h-70"}>
                          <div className="px-2">
                            <p className={"fs-14 text-greyscale800 mb-1"}>
                              Менга жуда ёқди
                              Смартфон Xiaomi 12T 8/128GB Silver
                            </p>
                            <div className="d-flex">
                              <i className="fi fi-sr-star color-text-gradient me-2"/>
                              <i className="fi fi-sr-star color-text-gradient me-2"/>
                              <i className="fi fi-sr-star color-text-gradient me-2"/>
                              <i className="fi fi-sr-star color-text-gradient me-2"/>
                              <i className="fi fi-sr-star text-d9d9d9"/>
                            </div>
                          </div>
                        </div>
                        
                        <div
                          className="w-lg-35 w-sm-50 w-100 d-flex align-items-center border-start-sm border-a7a7a7 text-greyscale800 fs-14 min-h-70">
                          <div className="px-2">
                            <p className="fs-14 fw-700 text-greyscale800 mb-1">Смартфон Xiaomi 12T
                              8/128GB Silver</p>
                            
                            <p className="fs-14 text-75758b mb-1">Смартфон Xiaomi 12T 8/128GB
                              Silver</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }
                <Pagination
                  className={'custom-style flex-wrap justify-content-lg-center'}
                  pageRange={1}
                  marginPage={1}
                  initialPage={1}
                  pageCount={Math.ceil(100 / 15)}
                  onChange={n => null}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reviews;
