import React from 'react';
import {Link} from "react-router-dom";
import {Pagination} from "../../../components";

const Reviews = () => {
  return (
    <div className={"w-100"}>
      <p className="fs-32 text-greyscale800 fw-700">Отзывы</p>
      
      <nav className={"clear-before"} aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fs-14 fw-500">
            <Link className="text-75758b text-decoration-none"
                  to="/dashboard">Кабинет покупателя</Link>
          </li>
          <li className="breadcrumb-item clear-before fs-14 fw-500 text-75758b active" aria-current="page">
            <i className="fas fa-chevron-right fs-12 me-1"/> Отзывы
          </li>
        </ol>
      </nav>
      
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
              />
            </div>
          </div>
          
          <div className="col-lg-3 mt-lg-0 mt-3 pe-lg-0">
            <select
              className={"form-select focus-none custom-rounded-12 border-f0f1f2"}
              style={{
                height: 41
              }}
            >
              <option value="" hidden>Выберите</option>
              <option value="1">Есть комментарии</option>
              <option value="2">Нет комментарии</option>
            </select>
          </div>
          
          <div className="col-lg-3 mt-lg-0 mt-3 pe-lg-0">
            <select
              className={"form-select focus-none custom-rounded-12 border-f0f1f2"}
              style={{
                height: 41
              }}
            >
              <option value="" hidden>Выберите</option>
              <option value="1">Поставщик</option>
              <option value="2">Магазин</option>
            </select>
          </div>
          
          <div className="col-lg-3 d-flex mt-lg-0 mt-3">
            <button
              style={{
                minHeight: 41
              }}
              className={"btn bg-ebebeb focus-none hover-effect text-838383 h-100 fs-12 fw-600 w-100 border-0 custom-rounded-8"}
              type={"button"}
            >
              Поиск
            </button>
            
            <button
              style={{
                minHeight: 41
              }}
              className={"btn bg-ebebeb focus-none hover-effect text-838383 h-100 fs-12 fw-600 w-100 border-0 custom-rounded-8 ms-2"}
              type={"button"}
            >
              Сброс
            </button>
          </div>
          
          <div className="col-12">
            <div className="table-responsive mt-3">
              <table className="table">
                <thead>
                <tr>
                  <th
                    width={100}
                    className={"border-bottom-0 p-0"}
                  />
                  <th
                    width={"50%"}
                    className={"border-bottom-0 p-0"}
                  />
                  <th
                    width={300}
                    className={"border-bottom-0 p-0"}
                  />
                </tr>
                </thead>
                <tbody>
                {
                  [...Array(5).keys()].map(item =>
                    <React.Fragment key={item}>
                      <tr>
                        <td
                          height={80}
                          className={"border-bottom-0 p-0"}>
                          <div
                            className={"mb-2 fs-12 text-greyscale800 border h-100 border-end-0 d-flex-center-center custom-rounded-start-12 px-3 py-1"}
                          >
                            01.01.2025
                          </div>
                        </td>
                        
                        <td
                          height={80}
                          className={"border-bottom-0 p-0"}>
                          <div
                            className={"mb-2 border h-100 border-start-0 border-end-0 px-3 d-flex-column-center position-relative fs-14 text-greyscale800 py-1"}
                          >
                            <div
                              style={{
                                width: 1
                              }}
                              className={"position-absolute start-0 h-80 bg-d9d9d9"}/>
                            Смартфон Xiaomi 12T 8/128GB Silver — отличный выбор в среднем ценовом сегменте. Модель
                            сочетает в
                            себе мощный процессор, качественный AMOLED-дисплей с частотой 120 Гц и быструю зарядку 120
                            Вт.
                            Камера на 108 Мп делает чёткие снимки при хорошем освещении, а стильный серебристый корпус
                            придаёт
                            устройству премиальный вид. Хороший баланс цены и характеристик.
                            
                            <div className="d-flex mt-2">
                              <i className="fi fi-sr-star color-text-gradient me-2"/>
                              <i className="fi fi-sr-star color-text-gradient me-2"/>
                              <i className="fi fi-sr-star color-text-gradient me-2"/>
                              <i className="fi fi-sr-star color-text-gradient me-2"/>
                              <i className="fi fi-sr-star text-d9d9d9"/>
                            </div>
                          </div>
                        </td>
                        
                        <td
                          height={80}
                          className={"border-bottom-0 p-0"}
                        >
                          <div
                            className={"mb-2 border h-100 border-start-0 custom-rounded-end-12 px-3 d-flex-column-center position-relative fs-12 text-greyscale800 py-1"}
                          >
                            <div
                              style={{
                                width: 1
                              }}
                              className={"position-absolute start-0 h-80 bg-d9d9d9"}/>
                            <b>Смартфон Xiaomi 12T 8/128GB Silver</b>
                            <span className={"text-75758b"}>BUKHUB-A23-ЧЁРТ-128</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className={"border-0"} colSpan={3}/>
                      </tr>
                      <tr>
                        <td
                          height={80}
                          className={"border-bottom-0 p-0"}>
                          <div
                            className={"mb-2 fs-12 text-greyscale800 border h-100 border-end-0 d-flex-center-center custom-rounded-start-12 px-3 py-1"}
                          >
                            01.01.2025
                          </div>
                        </td>
                        
                        <td
                          height={80}
                          className={"border-bottom-0 p-0"}>
                          <div
                            className={"mb-2 border h-100 border-start-0 border-end-0 px-3 d-flex-column-center position-relative fs-14 text-greyscale800 py-1"}
                          >
                            <div
                              style={{
                                width: 1
                              }}
                              className={"position-absolute start-0 h-80 bg-d9d9d9"}/>
                            Менга жуда ёқди Смартфон Xiaomi 12T 8/128GB Silver
                            
                            <div className="d-flex mt-2">
                              <i className="fi fi-sr-star color-text-gradient me-2"/>
                              <i className="fi fi-sr-star color-text-gradient me-2"/>
                              <i className="fi fi-sr-star color-text-gradient me-2"/>
                              <i className="fi fi-sr-star color-text-gradient me-2"/>
                              <i className="fi fi-sr-star text-d9d9d9"/>
                            </div>
                          </div>
                        </td>
                        
                        <td
                          height={80}
                          className={"border-bottom-0 p-0"}
                        >
                          <div
                            className={"mb-2 border h-100 border-start-0 custom-rounded-end-12 px-3 d-flex-column-center position-relative fs-12 text-greyscale800 py-1"}
                          >
                            <div
                              style={{
                                width: 1
                              }}
                              className={"position-absolute start-0 h-80 bg-d9d9d9"}/>
                            <b>Смартфон Xiaomi 12T 8/128GB Silver</b>
                            <span className={"text-75758b"}>BUKHUB-A23-ЧЁРТ-128</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className={"border-0"} colSpan={3}/>
                      </tr>
                    </React.Fragment>
                  )
                }
                </tbody>
                <tfoot>
                <tr>
                  <td colSpan={7} className={"border-0"}>
                    <Pagination
                      className={'custom-style flex-wrap justify-content-lg-center'}
                      pageRange={1}
                      marginPage={1}
                      initialPage={1}
                      pageCount={Math.ceil(120 / 15)}
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

export default Reviews;
