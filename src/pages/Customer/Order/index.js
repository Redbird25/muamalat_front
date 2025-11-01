import React from 'react';
import {Link} from "react-router-dom";
import phone_icon from "../../../assets/images/phone-cart.png";
import {Pagination} from "../../../components";

const Order = () => {
  return (
    <div
      className={"w-100"}
    >
      <p className="fs-32 text-greyscale800 fw-700">Заказы</p>
      <nav className={"clear-before"} aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fs-14 fw-500">
            <Link className="text-75758b text-decoration-none"
                  to="/dashboard">Кабинет покупателя</Link>
          </li>
          <li className="breadcrumb-item clear-before fs-14 fw-500 text-75758b active" aria-current="page">
            <i className="fas fa-chevron-right fs-12 me-1"/> Покупки
          </li>
          <li className="breadcrumb-item clear-before fs-14 fw-500 text-75758b active" aria-current="page">
            <i className="fas fa-chevron-right fs-12 me-1"/> Заказы
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
              <option value="" hidden>Способ оплаты</option>
              <option value="1">option 1</option>
              <option value="2">option 2</option>
            </select>
          </div>
          
          <div className="w-lg-25 d-flex mt-lg-0 mt-3">
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
              <table className={"table"}>
                <thead>
                <tr>
                  <th
                    style={{width: 40}}
                    className={"fs-14 text-75758b fw-500 align-middle text-center border-bottom-0 py-0 ps-0"}
                    scope="col">
                    <div style={{height: 70}}
                         className={"py-3 d-flex-center-center bg-f1f1f1 custom-rounded-12 px-1 mb-3"}>
                      №
                    </div>
                  </th>
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
                    style={{width: 200}}
                    className={"fs-14 text-75758b fw-500 align-middle text-center border-bottom-0 py-0 ps-0"}
                    scope="col">
                    <div style={{height: 70}}
                         className={"py-3 d-flex-center-center bg-f1f1f1 custom-rounded-12 px-1 mb-3"}>
                      Информация для заказа
                    </div>
                  </th>
                  
                  <th
                    style={{width: 130}}
                    className={"fs-14 text-75758b fw-500 align-middle text-center border-bottom-0 py-0 ps-0"}
                    scope="col">
                    <div style={{height: 70}}
                         className={"py-3 d-flex-center-center bg-f1f1f1 custom-rounded-12 px-1 mb-3"}>
                      Поставщик
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
                    style={{width: 70}}
                    className={"fs-14 text-75758b fw-500 align-middle text-center border-bottom-0 py-0 ps-0 lh-18"}
                    scope="col">
                    <div style={{height: 70}}
                         className={"py-3 d-flex-center-center bg-f1f1f1 custom-rounded-12 px-1 mb-3"}>
                      Cпособ <br/> оплаты
                    </div>
                  </th>
                  
                  <th
                    style={{width: 105}}
                    className={"fs-14 text-75758b fw-500 align-middle text-center border-bottom-0 py-0 ps-0 pe-0"}
                    scope="col">
                    <div style={{height: 70}}
                         className={"py-3 d-flex-center-center bg-f1f1f1 custom-rounded-12 px-1 mb-3"}>
                      Статус
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
                            height: 40
                          }}
                          className={"border-bottom-0 p-0"}>
                          <div
                            className={"mb-2 fs-12 fw-700 text-greyscale800 border h-100 border-end-0 d-flex-center-center custom-rounded-start-12 px-3 py-1"}
                          >
                            1
                          </div>
                        </td>
                        <td
                          style={{
                            height: 110
                          }}
                          className={"border-bottom-0 p-0"}>
                          <div
                            className={"mb-2 border h-100 border-start-0 border-end-0 d-flex-center-center px-3 py-1"}
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
                            className={"mb-2 border h-100 border-start-0 border-end-0 px-3 d-flex-column-center-center position-relative fs-12 text-greyscale800 text-center py-1"}
                          >
                            <div
                              style={{
                                width: 1
                              }}
                              className={"position-absolute start-0 h-80 bg-d9d9d9"}/>
                            <b>Волшебный чокер</b>
                            Дата: 02.04.2021
                          </div>
                        </td>
                        <td
                          style={{
                            height: 110
                          }}
                          className={"border-bottom-0 p-0"}>
                          <div
                            className={"mb-2 border h-100 border-start-0 border-end-0 px-3 text-center d-flex-center-center position-relative fs-12 text-greyscale800 py-1"}
                          >
                            <div
                              style={{
                                width: 1
                              }}
                              className={"position-absolute start-0 h-80 bg-d9d9d9"}/>
                            МЧЖ "Samsung Electronics CoLTD"
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
                            className={"mb-2 border h-100 border-start-0 px-3 d-flex-column-center-center position-relative fs-12 fw-700 text-greyscale800 custom-rounded-end-12 text-center py-1"}
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
                              className={`${item === 0 ? "bg-34c759" : item === 1 ? "bg-3d82c4" : item === 3 ? "bg-ef5c2c" : item === 4 ? "bg-f04e79" : "bg-75758b"} w-100 custom-rounded-8 text-nowrap d-flex-center-center text-white px-2`}>
                              {
                                item === 0
                                  ? "Принято"
                                  : item === 1
                                    ? "Курьер забрал"
                                    : item === 3
                                      ? "Курьер отменил"
                                      : item === 4
                                        ? "Клиент отменил"
                                        : "В обработке"
                              }
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className={"border-0"} colSpan={7}/>
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

export default Order;
