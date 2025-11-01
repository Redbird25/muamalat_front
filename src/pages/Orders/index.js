import React from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import phone_icon from "assets/images/phone-cart.png"
import {Pagination} from "../../components";

const Orders = () => {
  const {type} = useParams();
  const navigate = useNavigate();
  
  return (
    <div className={"w-100"}>
      <div className="d-flex justify-content-between align-items-center flex-wrap">
        <div>
          <p className="fs-32 text-greyscale800 fw-700">{type === "orders" ? "Список" : "Архив"} заказов</p>
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
                <i className="fas fa-chevron-right fs-12 me-1"/> Заказы
              </li>
            </ol>
          </nav>
        </div>
        
        {
          type === "orders"
            ? <button
              onClick={() => navigate("/dashboard/archive")}
              className={"btn bg-171725 custom-rounded-12 text-white focus-none fs-14 fw-600 px-4 w-md-auto w-100 mb-md-0 mb-3"}
              type={"button"}
            >
              <svg className={"me-2"} xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16"
                   fill="none">
                <path
                  d="M0.199219 2.59927C0.199219 1.84502 0.199219 1.4679 0.433533 1.23358C0.667848 0.999268 1.04497 0.999268 1.79922 0.999268H14.5992C15.3535 0.999268 15.7306 0.999268 15.9649 1.23358C16.1992 1.4679 16.1992 1.84502 16.1992 2.59927C16.1992 3.35351 16.1992 3.73064 15.9649 3.96495C15.7306 4.19927 15.3535 4.19927 14.5992 4.19927H1.79922C1.04497 4.19927 0.667848 4.19927 0.433533 3.96495C0.199219 3.73064 0.199219 3.35351 0.199219 2.59927Z"
                  fill="white"/>
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M14.6555 5.00078C14.7684 5.00082 14.8845 5.00087 15.0004 4.99927V8.60075C15.0004 11.6177 15.0004 13.1262 14.0631 14.0635C13.1259 15.0007 11.6174 15.0007 8.60039 15.0007H7.80039C4.7834 15.0007 3.27491 15.0007 2.33765 14.0635C1.40039 13.1262 1.40039 11.6177 1.40039 8.60075V4.99927C1.51629 5.00087 1.63238 5.00082 1.74531 5.00078H14.6555ZM5.80039 7.80073C5.80039 7.42798 5.80039 7.2416 5.86129 7.09459C5.94248 6.89856 6.09822 6.74283 6.29424 6.66163C6.44126 6.60073 6.62764 6.60073 7.00039 6.60073H9.40039C9.77314 6.60073 9.95952 6.60073 10.1065 6.66163C10.3026 6.74283 10.4583 6.89856 10.5395 7.09459C10.6004 7.2416 10.6004 7.42798 10.6004 7.80073C10.6004 8.17349 10.6004 8.35986 10.5395 8.50688C10.4583 8.7029 10.3026 8.85864 10.1065 8.93984C9.95952 9.00073 9.77314 9.00073 9.40039 9.00073H7.00039C6.62764 9.00073 6.44126 9.00073 6.29424 8.93984C6.09822 8.85864 5.94248 8.7029 5.86129 8.50688C5.80039 8.35986 5.80039 8.17349 5.80039 7.80073Z"
                      fill="white"/>
              </svg>
              
              Архив заказов
            </button>
            : null
        }
      
      </div>
      
      <div className="bg-white p-3 custom-rounded-12">
        <div className="row">
          <div className="col-lg-3 pe-lg-0">
            <div className="input-group h-100"
                 style={{
                   height: 41
                 }}
            >
              <label htmlFor={"search-order"}
                     className="input-group-text bg-transparent border-end-0 border-f0f1f2 custom-rounded-start-12"
                     id="search-input">
                <i className="fi fi-rr-search fs-18 lh-18 text-75758b"/>
              </label>
              
              <input type="text"
                     id={"search-order"}
                     className="form-control border-start-0 custom-rounded-end-12 border-f0f1f2 ps-0 focus-none"
                     placeholder="Поиск"
                     aria-label="Recipient's username" aria-describedby="search-input"/>
            </div>
          </div>
          
          <div className="col-lg-3 mt-lg-0 mt-3 pe-lg-0">
            <select
              className={"form-select focus-none custom-rounded-12 border-f0f1f2"}
              style={{
                height: 41
              }}
            >
              <option value="" hidden>Статус</option>
              <option value="1">В процессе</option>
              <option value="2">Новый</option>
            </select>
          </div>
          
          <div className="col-lg-3 mt-lg-0 mt-3 pe-lg-0">
            <select
              className={"form-select focus-none custom-rounded-12 border-f0f1f2"}
              style={{
                height: 41
              }}
            >
              <option value="" hidden>Тип продажи</option>
              <option value="1">option 1</option>
              <option value="2">option 2</option>
            </select>
          </div>
          
          <div className="col-lg-3 mt-lg-0 mt-3">
            <select
              className={"form-select focus-none custom-rounded-12 border-f0f1f2"}
              style={{
                height: 41
              }}
            >
              <option value="" hidden>Наличие товара</option>
              <option value="1">option 1</option>
              <option value="2">option 2</option>
            </select>
          </div>
          
          <div className="col-12">
            <div className="table-responsive mt-3">
              <table className={"table"}>
                <thead>
                <tr>
                  <th
                    style={{width: 100}}
                    className={"fs-14 text-75758b fw-500 align-middle text-center border-bottom-0 py-0 ps-0"}
                    scope="col">
                    <div style={{height: 70}}
                         className={"py-3 d-flex-center-center bg-f1f1f1 custom-rounded-12 px-1 mb-3"}>
                      Фото
                    </div>
                  </th>
                  <th
                    style={{width: 140}}
                    className={"fs-14 text-75758b fw-500 align-middle text-center border-bottom-0 py-0 ps-0"}
                    scope="col">
                    <div style={{height: 70}}
                         className={"py-3 d-flex-center-center bg-f1f1f1 custom-rounded-12 px-1 mb-3"}>
                      Детали заказа
                    </div>
                  </th>
                  <th
                    style={{width: 90}}
                    className={"fs-14 text-75758b fw-500 align-middle text-center border-bottom-0 py-0 ps-0"}
                    scope="col">
                    <div style={{height: 70}}
                         className={"py-3 d-flex-center-center bg-f1f1f1 custom-rounded-12 px-1 mb-3"}>
                      Наличие
                    </div>
                  </th>
                  <th
                    style={{width: 120}}
                    className={"fs-14 text-75758b fw-500 align-middle text-center border-bottom-0 py-0 ps-0"}
                    scope="col">
                    <div style={{height: 70}}
                         className={"py-3 d-flex-center-center bg-f1f1f1 custom-rounded-12 px-1 mb-3"}>
                      Клиент
                    </div>
                  </th>
                  <th
                    style={{minWidth: 130}}
                    className={"fs-14 text-75758b fw-500 align-middle text-center border-bottom-0 py-0 ps-0"}
                    scope="col">
                    <div style={{height: 70}}
                         className={"py-3 d-flex-center-center bg-f1f1f1 custom-rounded-12 px-1 mb-3"}>
                      Доставка
                    </div>
                  </th>
                  <th
                    style={{width: 70}}
                    className={"fs-14 text-75758b fw-500 align-middle text-center border-bottom-0 py-0 ps-0 lh-18"}
                    scope="col">
                    <div style={{height: 70}}
                         className={"py-3 d-flex-center-center bg-f1f1f1 custom-rounded-12 px-1 mb-3"}>
                      Cпособ <br/> оплаты
                    </div>
                  </th>
                  <th
                    style={{width: 120}}
                    className={"fs-14 text-75758b fw-500 align-middle text-center border-bottom-0 py-0 ps-0"}
                    scope="col">
                    <div style={{height: 70}}
                         className={"py-3 d-flex-center-center bg-f1f1f1 custom-rounded-12 px-1 mb-3"}>
                      Цена
                    </div>
                  </th>
                  <th
                    style={{width: 80}}
                    className={"fs-14 text-75758b fw-500 align-middle text-center border-bottom-0 py-0 ps-0"}
                    scope="col">
                    <div style={{height: 70}}
                         className={"py-3 d-flex-center-center bg-f1f1f1 custom-rounded-12 px-1 mb-3"}>
                      Дата
                    </div>
                  </th>
                  <th
                    style={{width: 105}}
                    className={"fs-14 text-75758b fw-500 align-middle text-center border-bottom-0 py-0 ps-0"}
                    scope="col">
                    <div style={{height: 70}}
                         className={"py-3 d-flex-center-center bg-f1f1f1 custom-rounded-12 px-1 mb-3"}>
                      Статус
                    </div>
                  </th>
                  <th
                    style={{width: 115}}
                    className={"fs-14 align-middle text-center border-bottom-0 py-0 ps-0 pe-0"} scope="col">
                    <div style={{height: 70}}
                         className={"py-3 d-flex-center-center bg-f1f1f1 custom-rounded-12 px-1 mb-3"}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                        <path
                          d="M12.708 8.32811C11.792 8.25111 10.92 8.65411 10.038 9.53711C8.404 11.1721 8.404 12.8291 10.038 14.4621C10.519 14.9441 11.277 15.6041 12.292 15.6721C13.258 15.7361 14.146 15.2801 14.962 14.4621C16.596 12.8281 16.595 11.1701 14.962 9.53711C14.481 9.05511 13.723 8.40511 12.708 8.32711V8.32811ZM13.548 13.0491C13.246 13.3511 12.781 13.7041 12.446 13.6781C12.184 13.6581 11.85 13.4461 11.453 13.0491C10.666 12.2621 10.556 11.8491 11.453 10.9511C11.744 10.6601 12.159 10.3211 12.514 10.3211C12.528 10.3211 12.542 10.3211 12.555 10.3221C12.817 10.3421 13.151 10.5541 13.548 10.9511C14.335 11.7381 14.445 12.1511 13.548 13.0491Z"
                          fill="#75758B"/>
                        <path
                          d="M23.4939 11.954C23.4999 10.748 23.0419 9.29198 20.9229 8.90398C20.8129 8.69398 20.6919 8.48298 20.5589 8.27098C21.6269 6.79198 21.5449 5.41998 20.3109 4.18598C19.0759 2.94998 17.7039 2.86898 16.2239 3.94098C16.0149 3.80898 15.8059 3.68898 15.5969 3.58098C15.2149 1.46898 13.7729 1.00098 12.5699 1.00098C10.8799 1.00098 9.79892 1.89198 9.48392 3.62498C9.27592 3.73398 9.06592 3.85498 8.85492 3.98698C7.38192 2.92298 6.00892 3.01398 4.76192 4.25898C3.51892 5.50298 3.42892 6.87698 4.48992 8.34998C4.35692 8.56198 4.23492 8.77298 4.12392 8.98298C2.39492 9.29898 1.51492 10.328 1.50592 12.046C1.49992 13.252 1.95792 14.708 4.07692 15.096C4.18692 15.306 4.30792 15.517 4.44192 15.729C3.37292 17.208 3.45492 18.58 4.68892 19.814C5.92392 21.05 7.29692 21.131 8.77592 20.059C8.98492 20.191 9.19392 20.311 9.40292 20.419C9.78492 22.531 11.2269 22.999 12.4299 22.999C14.1509 22.999 15.2009 22.108 15.5159 20.375C15.7239 20.266 15.9339 20.145 16.1449 20.013C17.6159 21.074 18.9849 20.981 20.2369 19.741C21.4889 18.501 21.5709 17.123 20.5099 15.649C20.6429 15.437 20.7649 15.226 20.8759 15.017C22.6049 14.701 23.4849 13.672 23.4939 11.954ZM20.1249 13.101C19.7609 13.132 19.4429 13.36 19.2959 13.694C19.0949 14.15 18.8129 14.628 18.4569 15.113C18.1749 15.498 18.2049 16.03 18.5279 16.382C19.6009 17.548 19.2409 17.909 18.8229 18.327C18.3879 18.763 18.0429 19.107 16.8799 18.031C16.5279 17.707 15.9969 17.677 15.6099 17.959C15.1269 18.313 14.6509 18.594 14.1939 18.793C13.8589 18.94 13.6309 19.258 13.5989 19.624C13.4809 20.994 12.9989 20.997 12.4419 20.999C11.8769 20.999 11.4239 21.005 11.3199 19.673C11.2909 19.302 11.0589 18.978 10.7169 18.832C10.2629 18.637 9.78992 18.36 9.31192 18.007C9.13492 17.876 8.92592 17.812 8.71792 17.812C8.47392 17.812 8.23092 17.901 8.03992 18.077C6.86092 19.164 6.50792 18.809 6.10092 18.401C5.69192 17.992 5.33892 17.638 6.42292 16.461C6.74792 16.108 6.77692 15.575 6.49092 15.189C6.13492 14.708 5.85592 14.234 5.66092 13.782C5.51492 13.441 5.19092 13.209 4.82192 13.18C3.49692 13.074 3.49892 12.625 3.50192 12.057C3.50492 11.476 3.50692 11.017 4.87092 10.899C5.23492 10.868 5.55292 10.64 5.69992 10.306C5.90192 9.84898 6.18392 9.37098 6.53892 8.88598C6.82092 8.50098 6.79092 7.96898 6.46792 7.61698C5.39492 6.45198 5.75592 6.09098 6.17292 5.67298C6.60792 5.23798 6.95292 4.89398 8.11592 5.96798C8.46792 6.29298 8.99892 6.32198 9.38492 6.03998C9.86892 5.68598 10.3449 5.40598 10.8019 5.20598C11.1369 5.05898 11.3649 4.74098 11.3969 4.37498C11.5149 3.00498 11.9969 3.00198 12.5539 2.99998C13.1269 3.00398 13.5719 2.99398 13.6759 4.32598C13.7049 4.69698 13.9369 5.02098 14.2789 5.16698C14.7329 5.36198 15.2059 5.63898 15.6839 5.99198C16.0689 6.27598 16.6029 6.24698 16.9549 5.92298C18.1339 4.83598 18.4859 5.19098 18.8939 5.59898C19.3029 6.00798 19.6569 6.36198 18.5719 7.53898C18.2469 7.89198 18.2179 8.42598 18.5029 8.81098C18.8589 9.29198 19.1379 9.76598 19.3329 10.218C19.4789 10.559 19.8029 10.791 20.1719 10.82C21.4969 10.926 21.4949 11.375 21.4919 11.943C21.4889 12.524 21.4869 12.983 20.1229 13.101H20.1249Z"
                          fill="#75758B"/>
                      </svg>
                    </div>
                  </th>
                </tr>
                </thead>
                <tbody>
                {
                  [...Array(10).keys()].map(item =>
                    <React.Fragment key={item}>
                      <tr>
                        <td
                          style={{
                            height: 110
                          }}
                          className={"border-bottom-0 p-0"}>
                          <div
                            className={"mb-2 border h-100 border-end-0 d-flex-center-center custom-rounded-start-12 px-3 py-1"}
                          >
                            <img src={phone_icon} alt="img_icon"/>
                          </div>
                        </td>
                        
                        <td
                          style={{
                            height: 110
                          }}
                          className={"border-bottom-0 p-0"}>
                          <div
                            className={"mb-2 border h-100 border-start-0 border-end-0 px-3 d-flex-center-center position-relative fs-12 fw-700 text-greyscale800 text-center py-1"}
                          >
                            <div
                              style={{
                                width: 1
                              }}
                              className={"position-absolute start-0 h-80 bg-d9d9d9"}/>
                            Волшебный чокер
                          </div>
                        </td>
                        
                        <td
                          style={{
                            height: 110
                          }}
                          className={"border-bottom-0 p-0"}>
                          <div
                            className={"mb-2 border h-100 border-start-0 border-end-0 px-3 d-flex-center-center position-relative fs-12 fw-700 text-greyscale800 py-1"}
                          >
                            <div
                              style={{
                                width: 1
                              }}
                              className={"position-absolute start-0 h-80 bg-d9d9d9"}/>
                            20 шт
                          </div>
                        </td>
                        
                        <td
                          style={{
                            height: 110
                          }}
                          className={"border-bottom-0 p-0"}>
                          <div
                            className={"mb-2 border h-100 border-start-0 border-end-0 px-3 text-center d-flex-column-center-center position-relative fs-12 text-greyscale800 py-1"}
                          >
                            <div
                              style={{
                                width: 1
                              }}
                              className={"position-absolute start-0 h-80 bg-d9d9d9"}/>
                            ФИО: <br/>Анвар Умаров
                            <br/>
                            <span className={"mt-1"}>
                        Номер телефона: <br/>+998990000000
                      </span>
                          </div>
                        </td>
                        
                        <td
                          style={{
                            height: 110
                          }}
                          className={"border-bottom-0 p-0"}>
                          <div
                            className={"mb-2 border h-100 border-start-0 border-end-0 px-3 d-flex-column-center-center position-relative fs-12 text-greyscale800 py-1"}
                          >
                            <div
                              style={{
                                width: 1
                              }}
                              className={"position-absolute start-0 h-80 bg-d9d9d9"}/>
                            <span>Тип доставки:</span>
                            <span>Платный</span>
                            
                            <div
                              style={{
                                background: "#eee",
                                textAlign: "center",
                                wordBreak: "break-word"
                              }}
                              className="p-1 custom-rounded-8 mt-1">
                              Адрес: Ташкент, Юнусободский район, 18 кв, 43-дом, 2-квартира
                            </div>
                          </div>
                        </td>
                        <td
                          style={{
                            height: 110
                          }}
                          className={"border-bottom-0 p-0"}>
                          <div
                            className={"mb-2 border h-100 border-start-0 border-end-0 px-3 d-flex-column-center-center position-relative fs-12 fw-700 text-greyscale800 text-center py-1"}
                          >
                            <div
                              style={{
                                width: 1
                              }}
                              className={"position-absolute start-0 h-80 bg-d9d9d9"}/>
                            Наличный расчет
                          </div>
                        </td>
                        <td
                          style={{
                            height: 110
                          }}
                          className={"border-bottom-0 p-0"}>
                          <div
                            className={"mb-2 border h-100 border-start-0 border-end-0 px-3 d-flex-column-center-center position-relative fs-12 text-greyscale800 text-center py-1"}
                          >
                            <div
                              style={{
                                width: 1
                              }}
                              className={"position-absolute start-0 h-80 bg-d9d9d9"}/>
                            Доставка: <br/>50000 cум
                            Цена товара: <br/>50000 сум
                            <b>
                              Итого: <br/>100000 сум
                            </b>
                          </div>
                        </td>
                        <td
                          style={{
                            height: 110
                          }}
                          className={"border-bottom-0 p-0"}>
                          <div
                            className={"mb-2 border h-100 border-start-0 border-end-0 px-3 d-flex-column-center-center position-relative fs-12 fw-700 text-greyscale800 text-center py-1"}
                          >
                            <div
                              style={{
                                width: 1
                              }}
                              className={"position-absolute start-0 h-80 bg-d9d9d9"}/>
                            21.05.2025
                          </div>
                        </td>
                        <td
                          style={{
                            height: 110
                          }}
                          className={"border-bottom-0 p-0"}>
                          <div
                            className={"mb-2 border h-100 border-start-0 border-end-0 px-3 d-flex-column-center-center position-relative fs-12 fw-700 text-greyscale800 text-center py-1"}
                          >
                            <div
                              style={{
                                width: 1
                              }}
                              className={"position-absolute start-0 h-80 bg-d9d9d9"}/>
                            <div
                              style={{
                                height: 22
                              }}
                              className={"bg-75758b w-100 custom-rounded-8 d-flex-center-center text-white px-2"}>
                              Завершено
                            </div>
                          </div>
                        </td>
                        <td
                          style={{
                            height: 110
                          }}
                          className={"border-bottom-0 p-0"}>
                          <div
                            className={"mb-2 border h-100 border-start-0 custom-rounded-end-12 px-3 d-flex-center-center position-relative fs-12 fw-700 text-greyscale800 py-1"}
                          >
                            <div
                              style={{
                                width: 1
                              }}
                              className={"position-absolute start-0 h-80 bg-d9d9d9"}/>
                            
                            <button
                              style={{
                                width: 36,
                                height: 36
                              }}
                              className={"btn focus-none border-e5e7e9 p-0 d-flex-center-center custom-rounded-8 bg-f8f8f9 me-2"}
                              type="button">
                              {
                                type === "orders"
                                  ? <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16"
                                         fill="none">
                                    <path
                                      d="M0.699219 2.59927C0.699219 1.84502 0.699219 1.4679 0.933533 1.23358C1.16785 0.999268 1.54497 0.999268 2.29922 0.999268H15.0992C15.8535 0.999268 16.2306 0.999268 16.4649 1.23358C16.6992 1.4679 16.6992 1.84502 16.6992 2.59927C16.6992 3.35351 16.6992 3.73064 16.4649 3.96495C16.2306 4.19927 15.8535 4.19927 15.0992 4.19927H2.29922C1.54497 4.19927 1.16785 4.19927 0.933533 3.96495C0.699219 3.73064 0.699219 3.35351 0.699219 2.59927Z"
                                      fill="#75758B"/>
                                    <path fillRule="evenodd" clipRule="evenodd"
                                          d="M15.1555 5.00078C15.2684 5.00082 15.3845 5.00087 15.5004 4.99927V8.60075C15.5004 11.6177 15.5004 13.1262 14.5631 14.0635C13.6259 15.0007 12.1174 15.0007 9.10039 15.0007H8.30039C5.2834 15.0007 3.77491 15.0007 2.83765 14.0635C1.90039 13.1262 1.90039 11.6177 1.90039 8.60075V4.99927C2.01629 5.00087 2.13238 5.00082 2.24531 5.00078H15.1555ZM6.30039 7.80073C6.30039 7.42798 6.30039 7.2416 6.36129 7.09459C6.44248 6.89856 6.59822 6.74283 6.79424 6.66163C6.94126 6.60073 7.12764 6.60073 7.50039 6.60073H9.90039C10.2731 6.60073 10.4595 6.60073 10.6065 6.66163C10.8026 6.74283 10.9583 6.89856 11.0395 7.09459C11.1004 7.2416 11.1004 7.42798 11.1004 7.80073C11.1004 8.17349 11.1004 8.35986 11.0395 8.50688C10.9583 8.7029 10.8026 8.85864 10.6065 8.93984C10.4595 9.00073 10.2731 9.00073 9.90039 9.00073H7.50039C7.12764 9.00073 6.94126 9.00073 6.79424 8.93984C6.59822 8.85864 6.44248 8.7029 6.36129 8.50688C6.30039 8.35986 6.30039 8.17349 6.30039 7.80073Z"
                                          fill="#75758B"/>
                                  </svg>
                                  : <svg xmlns="http://www.w3.org/2000/svg" width="21" height="18" viewBox="0 0 21 18"
                                         fill="none">
                                    <path
                                      d="M10.5709 2.18355L5.59302 6.60829C4.66244 7.43547 4.19715 7.84906 4.02568 8.33744C3.8751 8.76632 3.8751 9.23369 4.02568 9.66257C4.19715 10.1509 4.66244 10.5645 5.59302 11.3917L10.5709 15.8165C10.9931 16.1918 11.2043 16.3795 11.3836 16.3862C11.5394 16.3921 11.6891 16.3249 11.7882 16.2046C11.9023 16.0661 11.9023 15.7835 11.9023 15.2185V12.4286C14.3304 12.4286 16.895 13.2084 18.7676 14.5928C19.7425 15.3135 20.23 15.6739 20.4156 15.6596C20.5966 15.6458 20.7115 15.5751 20.8054 15.4198C20.9017 15.2604 20.8166 14.7625 20.6464 13.7667C19.5415 7.30056 15.0915 5.57143 11.9023 5.57143V2.78148C11.9023 2.21646 11.9023 1.93396 11.7882 1.79545C11.6891 1.67513 11.5394 1.60794 11.3836 1.61378C11.2043 1.62049 10.9931 1.80818 10.5709 2.18355Z"
                                      fill="#3D82C4"/>
                                    <path fillRule="evenodd" clipRule="evenodd"
                                          d="M7.91348 0.989665C7.63162 0.686132 7.15708 0.668556 6.85354 0.950408L1.63734 5.79403C0.6904 6.67333 0.152344 7.90721 0.152344 9.19943C0.152344 10.5616 0.750021 11.8553 1.78733 12.7382L6.87775 17.0711C7.19317 17.3396 7.66652 17.3016 7.935 16.9861C8.20348 16.6707 8.16543 16.1974 7.85001 15.9289L2.75959 11.596C2.0571 10.998 1.65234 10.122 1.65234 9.19943C1.65234 8.32431 2.01673 7.4887 2.65801 6.89322L7.87422 2.0496C8.17775 1.76775 8.19533 1.2932 7.91348 0.989665Z"
                                          fill="#3D82C4"/>
                                  </svg>
                              }
                            
                            </button>
                            
                            <button
                              style={{
                                width: 36,
                                height: 36
                              }}
                              className={"btn focus-none border-e5e7e9 p-0 d-flex-center-center custom-rounded-8 bg-f8f8f9"}
                              type="button">
                              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16"
                                   fill="none">
                                <path
                                  d="M14.4987 2.66666H12.432C12.1131 1.11572 10.7488 0.002 9.16534 0H7.832C6.24859 0.002 4.88428 1.11572 4.56534 2.66666H2.49869C2.1305 2.66666 1.83203 2.96513 1.83203 3.33331C1.83203 3.7015 2.1305 4 2.49869 4H3.16534V12.6667C3.16756 14.5067 4.65866 15.9978 6.49869 16H10.4987C12.3387 15.9978 13.8298 14.5067 13.832 12.6667V4H14.4987C14.8669 4 15.1653 3.70153 15.1653 3.33334C15.1653 2.96516 14.8669 2.66666 14.4987 2.66666ZM7.83203 11.3333C7.83203 11.7015 7.53356 12 7.16537 12C6.79716 12 6.49869 11.7015 6.49869 11.3333V7.33334C6.49869 6.96516 6.79716 6.66669 7.16534 6.66669C7.53353 6.66669 7.832 6.96516 7.832 7.33334V11.3333H7.83203ZM10.4987 11.3333C10.4987 11.7015 10.2002 12 9.83203 12C9.46384 12 9.16538 11.7015 9.16538 11.3333V7.33334C9.16538 6.96516 9.46384 6.66669 9.83203 6.66669C10.2002 6.66669 10.4987 6.96516 10.4987 7.33334V11.3333ZM5.94603 2.66666C6.22959 1.86819 6.98472 1.33434 7.83203 1.33331H9.16538C10.0127 1.33434 10.7678 1.86819 11.0514 2.66666H5.94603Z"
                                  fill="#F04E79"/>
                              </svg>
                            </button>
                          
                          </div>
                        </td>
                      
                      </tr>
                      <tr>
                        <td className={"border-0"} colSpan={10}/>
                      </tr>
                    </React.Fragment>
                  )
                }
                
                </tbody>
                <tfoot>
                <tr>
                  <td colSpan={10} className={"border-0"}>
                    <Pagination
                      className={'custom-style flex-wrap justify-content-lg-center'}
                      pageRange={1}
                      marginPage={1}
                      initialPage={1}
                      pageCount={Math.ceil(100 / 15)}
                      onChange={n => null}
                    />
                  </td>
                </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
