import React, {useState} from 'react';
import {get} from "lodash";
import {Link, useNavigate} from "react-router-dom";
import config from "../../config";
import InputPhone from "../../components/Fields/InputPhone";
import {useDispatch, useSelector} from "react-redux";
import {ModalLoginRegister, Spinner} from "../../components";
import {LoadOne} from "../../schema/container";
import {DELETE, METHOD, UPDATE} from "../../schema/actions";
import {toast} from "react-toastify";
import FavouritesAction from "../../redux/functions/favourites";
import RecommendProducts from "../../components/RecommendProducts";
import {LOGIN} from "../../redux/actions";

const BasketCart = () => {
  const dispatch = useDispatch();
  const {auth, system: {products}} = useSelector(state => state);
  const navigate = useNavigate();
  const [isAll, setAll] = useState(false);
  const [isModal, setModal] = useState(false);

  return (
    <div className="container my-3">
      <nav className={"clear-before"} aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fs-14 fw-500">
            <Link className="text-75758b text-decoration-none"
                  to="/">Главная</Link>
          </li>
          <li className="breadcrumb-item clear-before fs-14 fw-500 text-75758b active"><i
            className="fas fa-chevron-right fs-12 me-1"/> Корзина
          </li>
        </ol>
      </nav>

      <p
        className="fs-32 text-greyscale800 fw-700">Корзина&nbsp;{get(auth, "isAuthenticated") ? `(${parseInt(get(auth, "data.order.products_count", "0"))})` : Object.values(products).filter(item => get(item, "cart")).length === 0 ? "" : `(${Object.values(products).filter(item => get(item, "cart")).length})`}</p>


      {
        Object.values(products).filter(item => get(item, "cart")).length && !get(auth, "isAuthenticated")
          ? <div className="row mb-6">
            <div className="col-lg-8">
              <div className="bg-white custom-rounded-20 p-3">
                <div className="col-12 d-flex align-items-center flex-wrap">
                  <div className="form-check me-3 mb-3">
                    <input
                      onChange={(e) => setAll(e.target.checked)}
                      className="form-check-input color-warning focus-none" type="checkbox" value=""
                      id="flexCheckDefault"/>
                    <label className="form-check-label text-334150 fs-14" htmlFor="flexCheckDefault">
                      Выбрать все
                    </label>
                  </div>

                  <div
                    onClick={() => {
                      Object.values(products).filter(item => get(item, "cart")).forEach(item => {
                        FavouritesAction("allCart", get(item, "id"), dispatch, products, item)
                      });
                      setAll(false);
                    }}
                    className={`d-flex align-items-center mb-3 cursor-pointer ${isAll ? "cursor-pointer text-danger" : ""}`}>
                    <i className={`fi fi-rr-shopping-cart me-2 fs-18 lh-18`}/>
                    Удалить выбранное
                  </div>
                </div>

                {
                  Object.values(products).filter(item => get(item, "cart")).map((item, number) => {
                    return <div key={number} className={`col-12 ${number !== 0 ? "mt-3" : ""}`}>
                      <div className="border custom-rounded-12 p-3">
                        <div className="row">
                          <div className="col-xxl-1 col-xl-2 d-flex align-items-center justify-content-center">
                            <img className={"w-100"} src={config.FILE_ROOT + get(item, "main_image")} alt="phone"/>
                          </div>

                          <div className="col-xxl-10 mt-xl-0 mt-3 col-xl-10">
                            <div
                              className="d-flex align-items-center justify-content-between flex-xl-nowrap flex-md-wrap">
                              <p className="text-greyscale800 fs-20 fw-700 mb-1">{get(item, "name")}</p>

                              <p className="text-greyscale800 fs-20 fw-700 text-nowrap">
                                {/*<span
                                  className="text-decoration-line-through text-75758b fw-500 fs-16">3 340 000 сум</span>*/}
                                &nbsp;
                                <InputPhone value={get(item, "price")} thousandSeparator={" "} displayType={"text"}/> сум
                              </p>
                            </div>


                            <p className="text-75758b fw-500 mb-1">Код товара: {get(item, "id")}</p>

                            <div className="d-flex align-items-center justify-content-between">
                              <button
                                onClick={() => FavouritesAction("cart", get(item, "id"), dispatch, products, item)}
                                className="btn p-0 focus-none fs-14 text-334150 d-flex-align-center">
                                <i className="fi text-danger fi-rr-shopping-cart me-2 fs-18 lh-18"/>

                                Удалить
                              </button>


                              <div className="input-group w-auto">
                                <button
                                  type={"button"}
                                  className={`input-group-text cursor-pointer pe-0 bg-f8f8f9 custom-rounded-start-8 ${parseInt(get(products, `[${get(item, "id")}].quantity`, 1)) === 1 ? "disabled pe-none" : ""}`}
                                  onClick={() => {
                                    FavouritesAction("quantity-minus", get(item, "id"), dispatch, products, item);
                                    /*setProductCount(prevState => ({
                                      ...prevState, [get(item, "id")]: {
                                        product_id: get(item, "id"),
                                        quantity: parseInt(get(products, `[${get(item, "id")}].quantity`, 1)) === 1 ? 0 : parseInt(get(products, `[${get(item, "id")}].quantity`, 1)) - 1
                                      }
                                    }));*/
                                  }}>
                                  <i className="far fa-minus"/>
                                </button>
                                <input type="text"
                                       className="form-control focus-none bg-f8f8f9 border-start-0 border-end-0 p-0 text-center"
                                       value={get(products, `[${get(item, "id")}].quantity`, 1)}
                                       style={{maxWidth: 30}}
                                       readOnly/>
                                <span
                                  className={"input-group-text cursor-pointer ps-0 text-d3B15e bg-f8f8f9 custom-rounded-end-8"}
                                  onClick={() => {
                                    FavouritesAction("quantity-plus", get(item, "id"), dispatch, products, item);
                                    /*setProductCount(prevState => ({
                                      ...prevState, [get(item, "id")]: {
                                        product_id: get(item, "id"),
                                        quantity: parseInt(get(products, `[${get(item, "id")}].quantity`, 1)) + 1
                                      }
                                    }));*/
                                  }}>
                              <i className="far fa-plus"/>
                            </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  })
                }
              </div>
            </div>

            <div className="col-lg-4 mt-lg-0 mt-3">
              <div className="bg-white custom-rounded-20 p-3">
                <p className="fs-32 text-greyscale800 fw-700">Ваш заказ</p>

                <div className="row justify-content-between">
                  <div className="col-auto fs-16 fw-600">
                    Стоимость:
                  </div>

                  <div className="col-auto fs-18 fw-600">
                    <InputPhone
                      value={Object.values(products).filter(item => get(item, "cart")).reduce((acc, curr) => parseInt(acc) + (parseInt(get(curr, "price")) * parseInt(get(curr, "quantity", 1))), 0)}
                      thousandSeparator={" "} displayType={"text"}/>&nbsp;сум
                  </div>

                  <div className="col-12 my-3">
                    <div className="border-top border-e5e7e9"></div>
                  </div>


                  <div className="col-md-6 fs-16 fw-600">
                    Общая скидка
                  </div>

                  <div className="col-md-6 text-end fs-18 fw-600">
                    0 сум
                  </div>

                  <div className="col-md-6 mt-2 fs-16 fw-600">
                    Стоимость доставки:
                  </div>

                  <div className="col-md-6 mt-2 text-end fs-18 fw-600">
                    0 сум
                  </div>

                  <div className="col-12 my-3">
                    <div className="border-top border-e5e7e9"></div>
                  </div>

                  <div className="col-md-6 fs-16 fw-600">
                    Доставка:
                  </div>

                  <div className="col-md-6 text-end fs-18 fw-600">
                    Доставка курьером
                  </div>

                  <div className="col-md-6 mt-2 fs-24 fw-700">
                    Итого:
                  </div>

                  <div className="col-md-6 mt-2 text-end fs-24 fw-700">
                    <InputPhone
                      value={Object.values(products).filter(item => get(item, "cart")).reduce((acc, curr) => parseInt(acc) + (parseInt(get(curr, "price")) * parseInt(get(curr, "quantity", 1))), 0)}
                      thousandSeparator={" "} displayType={"text"}/>&nbsp;сум
                  </div>

                  <div className="col-12 mt-3">
                    <button
                      onClick={() => {
                        if (get(auth, "isAuthenticated") && parseInt(get(auth, "data.user.role_id")) === 3) {
                          navigate("/basket-order", {state: products});
                        } else {
                          setModal(true);
                        }
                      }}
                      className="btn btn-menu focus-none h-100 w-100 custom-rounded-8">
                      <span className="bg-gradient-custom reverse custom-rounded-8"/>
                      <span className="position-relative custom-zindex-2">
                                    Перейти к оформлению
                      </span>
                    </button>
                  </div>

                  <div className="col-12 fs-14 fw-500 text-334150 mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className={"me-2"} width="24" height="24" viewBox="0 0 24 24"
                         fill="none">
                      <path fillRule="evenodd" clipRule="evenodd"
                            d="M7 3C4.23858 3 2 5.23858 2 8V13C2 14.6967 2.84511 16.196 4.13736 17.1C4.04811 17.3841 4 17.6864 4 18C4 19.6569 5.34315 21 7 21C8.65685 21 10 19.6569 10 18H14C14 19.6569 15.3431 21 17 21C18.6569 21 20 19.6569 20 18H21C21.2652 18 21.5196 17.8946 21.7071 17.7071C21.8946 17.5196 22 17.2652 22 17V13C22 10.2386 19.7614 8 17 8L16 8C16 5.23858 13.7614 3 11 3H7ZM19.8293 12H16V10H17C18.3062 10 19.4175 10.8348 19.8293 12ZM16 18C16 17.4477 16.4477 17 17 17C17.5523 17 18 17.4477 18 18C18 18.5523 17.5523 19 17 19C16.4477 19 16 18.5523 16 18ZM6 18C6 17.4477 6.44772 17 7 17C7.55228 17 8 17.4477 8 18C8 18.5523 7.55228 19 7 19C6.44772 19 6 18.5523 6 18Z"
                            fill="#75758B"/>
                    </svg>
                    Служба доставки в течение 2-3 дней.
                  </div>
                </div>
              </div>
            </div>


          </div>
          : get(auth, "isAuthenticated")
            ? <div className={"row mb-6"}>
              <LoadOne
                url={"/client/basket-products"}
                name={"cartProductsClientBasket"}
                onSuccess={() => {
                }}
                onError={() => {

                }}
                onFinally={() => {

                }}
                params={{
                  perPage: 15
                }}
              >
                {({isFetched, data = {}}) => {
                  if (!isFetched)
                    return <Spinner center/>
                  else if (isFetched && get(data, "products", []).length)
                    return <>
                      <div className="col-lg-8">
                        <div className="bg-white custom-rounded-20 p-3">
                          <div className="col-12 d-flex align-items-center flex-wrap">
                            <div className="form-check me-3 mb-3">
                              <input
                                onChange={(e) => setAll(e.target.checked)}
                                className="form-check-input color-warning focus-none" type="checkbox" value=""
                                id="flexCheckDefault"/>
                              <label className="form-check-label text-334150 fs-14" htmlFor="flexCheckDefault">
                                Выбрать все
                              </label>
                            </div>

                            <div
                              onClick={() => {
                                get(data, "products", []).forEach(item => {
                                  dispatch(METHOD.request({
                                    url: "/client/remove-from-cart-product",
                                    name: "clientRemoveProductCart",
                                    values: {
                                      product_id: get(item, "id")
                                    },
                                    cb: {
                                      success: () => {
                                        dispatch(DELETE.success({
                                          id: get(item, "id"),
                                          objectInnerArray: "products",
                                          name: "cartProductsClientBasket"
                                        }));

                                        dispatch(LOGIN.success({
                                          update_login: true,
                                          count: 0
                                        }));

                                      },
                                      error: (error) => {
                                        console.log(error)
                                      },
                                      finally: () => {

                                      }
                                    }
                                  }))

                                })
                                toast.success("Savatchadan o'chirildi", {
                                  position: "top-center",
                                  autoClose: 2000,
                                });
                                setAll(false);
                              }}
                              className={`d-flex align-items-center mb-3 cursor-pointer ${isAll ? "cursor-pointer text-danger" : ""}`}>
                              <i className={`fi fi-rr-shopping-cart me-2 fs-18 lh-18`}/>
                              Удалить выбранное
                            </div>
                          </div>

                          {
                            get(data, "products", []).map((item, number) => {
                              return <div key={number} className={`col-12 ${number !== 0 ? "mt-3" : ""}`}>
                                <div className="border custom-rounded-12 p-3">
                                  <div className="row">
                                    <div className="col-xxl-1 col-xl-2 d-flex align-items-center justify-content-center">
                                      <img className={"w-100"} src={config.FILE_ROOT + get(item, "main_image")}
                                           alt="phone"/>
                                    </div>

                                    <div className="col-xxl-10 mt-xl-0 mt-3 col-xl-10">
                                      <div
                                        className="d-flex align-items-center justify-content-between flex-nowrap flex-md-wrap">
                                        <p className="text-greyscale800 fs-20 fw-700 mb-1">{get(item, "name")}</p>

                                        <p className="text-greyscale800 fs-20 fw-700">
                                          {/*<span
                                  className="text-decoration-line-through text-75758b fw-500 fs-16">3 340 000 сум</span>*/}
                                          &nbsp;
                                          <InputPhone value={get(item, "price")} thousandSeparator={" "}
                                                      displayType={"text"}/> сум
                                        </p>
                                      </div>


                                      <p className="text-75758b fw-500 mb-1">Код товара: {get(item, "id")}</p>

                                      <div className="d-flex align-items-center justify-content-between">
                                        <button
                                          onClick={() => {
                                            dispatch(METHOD.request({
                                              url: "/client/remove-from-cart-product",
                                              name: "clientRemoveProductCart",
                                              values: {
                                                product_id: get(item, "id")
                                              },
                                              cb: {
                                                success: () => {
                                                  toast.success("Savatchadan o'chirildi", {
                                                    position: "top-center",
                                                    autoClose: 2000,
                                                  });
                                                  dispatch(DELETE.success({
                                                    id: get(item, "id"),
                                                    objectInnerArray: "products",
                                                    name: "cartProductsClientBasket",
                                                  }));
                                                  dispatch(LOGIN.success({
                                                    update_login: true,
                                                    count: parseInt(get(auth, "data.order.products_count", "0")) - 1
                                                  }));

                                                },
                                                error: (error) => {
                                                  console.log(error)
                                                  toast.error("Xatolik yuz berdi!", {
                                                    position: "top-center",
                                                    autoClose: 2000
                                                  })
                                                },
                                                finally: () => {

                                                }
                                              }
                                            }))
                                          }}
                                          className="btn p-0 focus-none fs-14 text-334150 d-flex-align-center">
                                          <i className="fi text-danger fi-rr-shopping-cart me-2 fs-18 lh-18"/>

                                          Удалить
                                        </button>


                                        <div className="input-group w-auto">
                                          <button
                                            type={"button"}
                                            className={`input-group-text cursor-pointer pe-0 bg-f8f8f9 custom-rounded-start-8 ${parseInt(get(item, "count")) === 1 ? "disabled pe-none" : ""}`}
                                            onClick={() => {
                                              dispatch(METHOD.request({
                                                url: "/client/add-to-cart-product",
                                                name: "clientAddProductCart",
                                                values: {
                                                  product_id: get(item, "id"),
                                                  count: parseInt(get(item, "count")) - 1,
                                                },
                                                cb: {
                                                  success: () => {
                                                    dispatch(UPDATE.success({
                                                      id: get(item, "id"),
                                                      name: "cartProductsClientBasket",
                                                      objectInner: true,
                                                      data: {
                                                        products: get(data, "products", []).map(itm => {
                                                          itm["count"] = get(item, "id") === get(itm, "id") ? parseInt(get(itm, "count")) - 1 : parseInt(get(itm, "count"))
                                                          return {
                                                            ...itm
                                                          }
                                                        })
                                                      }
                                                    }));
                                                  },
                                                  error: (error) => {
                                                    console.log(error)
                                                  },
                                                  finally: () => {

                                                  }
                                                }
                                              }))
                                            }}>
                                            <i className="far fa-minus"/>
                                          </button>
                                          <input type="text"
                                                 className="form-control focus-none bg-f8f8f9 border-start-0 border-end-0 p-0 text-center"
                                                 value={parseInt(get(item, "count"))}
                                                 style={{maxWidth: 30}}
                                                 readOnly/>
                                          <span
                                            className={"input-group-text cursor-pointer ps-0 text-d3B15e bg-f8f8f9 custom-rounded-end-8"}
                                            onClick={() => {
                                              dispatch(METHOD.request({
                                                url: "/client/add-to-cart-product",
                                                name: "clientAddProductCart",
                                                values: {
                                                  product_id: get(item, "id"),
                                                  count: parseInt(get(item, "count")) + 1,
                                                },
                                                cb: {
                                                  success: () => {
                                                    dispatch(UPDATE.success({
                                                      id: get(item, "id"),
                                                      name: "cartProductsClientBasket",
                                                      objectInner: true,
                                                      data: {
                                                        products: get(data, "products", []).map(itm => {
                                                          itm["count"] = get(item, "id") === get(itm, "id") ? parseInt(get(itm, "count")) + 1 : parseInt(get(itm, "count"))
                                                          return {
                                                            ...itm
                                                          }
                                                        })
                                                      }
                                                    }));
                                                  },
                                                  error: (error) => {
                                                    console.log(error)
                                                  },
                                                  finally: () => {

                                                  }
                                                }
                                              }))
                                            }}>
                              <i className="far fa-plus"/>
                            </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            })
                          }
                        </div>
                      </div>

                      <div className="col-lg-4 mt-lg-0 mt-3">
                        <div className="bg-white custom-rounded-20 p-3">
                          <p className="fs-32 text-greyscale800 fw-700">Ваш заказ</p>

                          <div className="row justify-content-between">
                            <div className="col-auto fs-16 fw-600">
                              Стоимость:
                            </div>

                            <div className="col-auto fs-18 fw-600">
                              <InputPhone
                                value={get(data, "products", []).reduce((acc, curr) => parseInt(acc) + (parseInt(get(curr, "price")) * parseInt(get(curr, "count"))), 0)}
                                thousandSeparator={" "} displayType={"text"}/>&nbsp;сум
                            </div>

                            <div className="col-12 my-3">
                              <div className="border-top border-e5e7e9"></div>
                            </div>


                            <div className="col-md-6 fs-16 fw-600">
                              Общая скидка
                            </div>

                            <div className="col-md-6 text-end fs-18 fw-600">
                              0 сум
                            </div>

                            <div className="col-md-6 mt-2 fs-16 fw-600">
                              Стоимость доставки:
                            </div>

                            <div className="col-md-6 mt-2 text-end fs-18 fw-600">
                              0 сум
                            </div>

                            <div className="col-12 my-3">
                              <div className="border-top border-e5e7e9"></div>
                            </div>

                            <div className="col-md-6 fs-16 fw-600">
                              Доставка:
                            </div>

                            <div className="col-md-6 text-end fs-18 fw-600">
                              Доставка курьером
                            </div>

                            <div className="col-md-6 mt-2 fs-24 fw-700">
                              Итого:
                            </div>

                            <div className="col-md-6 mt-2 text-end fs-24 fw-700">
                              <InputPhone
                                value={get(data, "products", []).reduce((acc, curr) => parseInt(acc) + (parseInt(get(curr, "price")) * parseInt(get(curr, "count"))), 0)}
                                thousandSeparator={" "} displayType={"text"}/>&nbsp;сум
                            </div>

                            <div className="col-12 mt-3">
                              <button
                                onClick={() => {
                                  if (get(auth, "isAuthenticated") && parseInt(get(auth, "data.user.role_id")) === 3) {
                                    navigate("/basket-order");
                                  } else {
                                    setModal(true);
                                  }
                                }}
                                className="btn btn-menu focus-none h-100 w-100 custom-rounded-8">
                                <span className="bg-gradient-custom reverse custom-rounded-8"/>
                                <span className="position-relative custom-zindex-2">
                                    Перейти к оформлению
                      </span>
                              </button>
                            </div>

                            <div className="col-12 fs-14 fw-500 text-334150 mt-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className={"me-2"} width="24" height="24"
                                   viewBox="0 0 24 24"
                                   fill="none">
                                <path fillRule="evenodd" clipRule="evenodd"
                                      d="M7 3C4.23858 3 2 5.23858 2 8V13C2 14.6967 2.84511 16.196 4.13736 17.1C4.04811 17.3841 4 17.6864 4 18C4 19.6569 5.34315 21 7 21C8.65685 21 10 19.6569 10 18H14C14 19.6569 15.3431 21 17 21C18.6569 21 20 19.6569 20 18H21C21.2652 18 21.5196 17.8946 21.7071 17.7071C21.8946 17.5196 22 17.2652 22 17V13C22 10.2386 19.7614 8 17 8L16 8C16 5.23858 13.7614 3 11 3H7ZM19.8293 12H16V10H17C18.3062 10 19.4175 10.8348 19.8293 12ZM16 18C16 17.4477 16.4477 17 17 17C17.5523 17 18 17.4477 18 18C18 18.5523 17.5523 19 17 19C16.4477 19 16 18.5523 16 18ZM6 18C6 17.4477 6.44772 17 7 17C7.55228 17 8 17.4477 8 18C8 18.5523 7.55228 19 7 19C6.44772 19 6 18.5523 6 18Z"
                                      fill="#75758B"/>
                              </svg>
                              Служба доставки в течение 2-3 дней.
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  else
                    return <div className="row flex-column align-items-center justify-content-center min-vh-50">

                      <div className="col-auto">
                        <button
                          className={`btn focus-none btn-lg btn-e6e6e6 text-white custom-rounded-12`}>
                          <i className={`far fa-shopping-cart text-danger fs-18`}/>
                        </button>
                      </div>

                      <div className="col-auto mt-3">
                        <p
                          className="text-center lh-32 fs-32 fw-600">В корзине пусто</p>

                        <p
                          className="text-center fs-14 fw-600">Чтобы приобрести товары, добавьте их в корзину и оформите
                          заказ.️️</p>
                      </div>

                      <div className="col-auto">
                        <Link to={"/"} className="btn btn-menu focus-none h-100" style={{minWidth: 300}}>
                          <span className="bg-gradient-custom reverse"/>
                          <span className="position-relative custom-zindex-2">
                        К товарам
              <i className="far fa-long-arrow-alt-right ms-lg-2 ms-3"/>
            </span>
                        </Link>
                      </div>
                    </div>

                }}
              </LoadOne>
            </div>
            : <div className="row flex-column align-items-center justify-content-center min-vh-50">

              <div className="col-auto">
                <button
                  className={`btn focus-none btn-lg btn-e6e6e6 text-white custom-rounded-12`}>
                  <i className={`far fa-shopping-cart text-danger fs-18`}/>
                </button>
              </div>

              <div className="col-auto mt-3">
                <p
                  className="text-center lh-32 fs-32 fw-600">В корзине пусто</p>

                <p
                  className="text-center fs-14 fw-600">Чтобы приобрести товары, добавьте их в корзину и оформите
                  заказ.️️</p>
              </div>

              <div className="col-auto">
                <Link to={"/"} className="btn btn-menu focus-none h-100" style={{minWidth: 300}}>
                  <span className="bg-gradient-custom reverse"/>
                  <span className="position-relative custom-zindex-2">
                        К товарам
              <i className="far fa-long-arrow-alt-right ms-lg-2 ms-3"/>
            </span>
                </Link>
              </div>
            </div>
      }

      <RecommendProducts/>

      <ModalLoginRegister
        {...{
          isModal,
          setModal,
        }}
      />
    </div>
  );
};

export default BasketCart;
