import React, {useState} from 'react';
import {Link} from "react-router-dom";
import phone_icon from "../../../assets/images/phone-cart.png";
import {Pagination, Spinner} from "../../../components";
import {LoadAll} from "../../../schema/container";
import {get} from "lodash";
import {DELETE, METHOD} from "../../../schema/actions";
import {toast} from "react-toastify";
import {useDispatch} from "react-redux";

const Favourites = () => {
  const dispatch = useDispatch();
  const [isMeta, setMeta] = useState(null);
  const [page, setPage] = useState(1);

  return (
    <div
      className={"w-100"}
    >
      <p className="fs-32 text-greyscale800 fw-700">Избранные продукты</p>
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
            <i className="fas fa-chevron-right fs-12 me-1"/> Избранные продукты
          </li>
        </ol>
      </nav>

      <div className="bg-white p-3 custom-rounded-12">
        <div className="row">
          <div className="col-lg-10 pe-lg-0">
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

          <div className="col-lg-2">
            <button
              style={{
                minHeight: 41
              }}
              className={"btn bg-ebebeb focus-none hover-effect text-838383 h-100 fs-12 fw-600 w-100 border-0 custom-rounded-8"}
              type={"button"}
            >
              Поиск
            </button>
          </div>

          <div className="col-12">
            <div className="table-responsive mt-3">
              <table className={"table"}>
                <thead>
                <tr>
                  <th
                    style={{width: 100}}
                    className={"fs-14 text-75758b fw-500 align-middle text-center border-bottom-0 py-0 ps-0"}
                    scope={"col"}
                  >
                    <div style={{height: 42}}
                         className={"py-3 d-flex-center-center bg-f1f1f1 custom-rounded-12 px-1 mb-3"}>
                      Фото
                    </div>
                  </th>
                  <th
                    className={"fs-14 text-75758b fw-500 align-middle text-center border-bottom-0 py-0 ps-0"}
                    scope="col">
                    <div style={{height: 42}}
                         className={"py-3 d-flex-center-center bg-f1f1f1 custom-rounded-12 px-1 mb-3"}>
                      Информация для заказа
                    </div>
                  </th>
                  <th
                    width={245}
                    className={"fs-14 text-75758b fw-500 align-middle text-center border-bottom-0 py-0 ps-0 pe-0"}
                    scope="col"
                  >
                    <div style={{height: 42}}
                         className={"py-3 d-flex-center-center bg-f1f1f1 custom-rounded-12 px-1 mb-3"}>
                      Действия
                    </div>
                  </th>
                </tr>
                </thead>
                <tbody>
                <LoadAll
                  url={"/client/liked-products"}
                  name={"likeProductsClient"}
                  onSuccess={(data, meta) => {
                    setMeta(meta)
                  }}
                  params={{
                    perPage: 15,
                    page
                  }}
                >
                  {({isFetched, data = []}) => {
                    if (!isFetched)
                      return <tr>
                        <td colSpan={7} className={"border-0"}>
                          <Spinner center height/>
                        </td>
                      </tr>
                    else if (isFetched && data.length)
                      return data.map((item, number) => <React.Fragment key={number}>
                        <tr>
                          <td
                            style={{
                              height: 40
                            }}
                            className={"border-bottom-0 p-0"}>
                            <div
                              className={"mb-2 fs-12 fw-700 text-greyscale800 border h-100 border-end-0 d-flex-center-center custom-rounded-start-12 px-3 py-1"}
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
                              className={"mb-2 border h-100 border-start-0 custom-rounded-end-12 px-3 d-flex-center-center position-relative fs-12 fw-700 text-greyscale800 py-1"}
                            >
                              <div
                                style={{
                                  width: 1
                                }}
                                className={"position-absolute start-0 h-80 bg-d9d9d9"}/>
                              <button
                                type={"button"}
                                style={{
                                  height: 36
                                }}
                                className={`btn bg-f8f8f9 border-e5e7e9 focus-none custom-rounded-8 text-nowrap d-flex-center-center fw-600 me-2`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className={"me-2"} width="25" height="24"
                                     viewBox="0 0 25 24" fill="none">
                                  <path
                                    d="M18.0777 4.43152L16.0777 3.38197C14.3221 2.46066 13.4443 2 12.5 2C11.5557 2 10.6779 2.46066 8.92229 3.38197L8.60057 3.5508L17.5236 8.64967L21.5403 6.64132C20.8941 5.90949 19.8515 5.36234 18.0777 4.43152Z"
                                    fill="url(#paint0_linear_4911_12469)"/>
                                  <path
                                    d="M22.2484 7.96434L18.25 9.96353V13C18.25 13.4142 17.9142 13.75 17.5 13.75C17.0858 13.75 16.75 13.4142 16.75 13V10.7135L13.25 12.4635V21.904C13.9679 21.7252 14.7848 21.2965 16.0777 20.618L18.0777 19.5685C20.2294 18.4393 21.3052 17.8748 21.9026 16.8603C22.5 15.8458 22.5 14.5833 22.5 12.0585V11.9415C22.5 10.0489 22.5 8.86557 22.2484 7.96434Z"
                                    fill="url(#paint1_linear_4911_12469)"/>
                                  <path
                                    d="M11.75 21.904V12.4635L2.75164 7.96434C2.5 8.86557 2.5 10.0489 2.5 11.9415V12.0585C2.5 14.5833 2.5 15.8458 3.0974 16.8603C3.69479 17.8748 4.77062 18.4393 6.92228 19.5685L8.92229 20.618C10.2152 21.2965 11.0321 21.7252 11.75 21.904Z"
                                    fill="url(#paint2_linear_4911_12469)"/>
                                  <path
                                    d="M3.45969 6.64132L12.5 11.1615L15.9112 9.4559L7.02456 4.37785L6.92229 4.43152C5.14855 5.36234 4.1059 5.90949 3.45969 6.64132Z"
                                    fill="url(#paint3_linear_4911_12469)"/>
                                  <defs>
                                    <linearGradient id="paint0_linear_4911_12469" x1="2.5" y1="11.952" x2="22.5"
                                                    y2="11.952"
                                                    gradientUnits="userSpaceOnUse">
                                      <stop stopColor="#E2C881"/>
                                      <stop offset="1" stopColor="#8B6F2A"/>
                                    </linearGradient>
                                    <linearGradient id="paint1_linear_4911_12469" x1="2.5" y1="11.952" x2="22.5"
                                                    y2="11.952"
                                                    gradientUnits="userSpaceOnUse">
                                      <stop stopColor="#E2C881"/>
                                      <stop offset="1" stopColor="#8B6F2A"/>
                                    </linearGradient>
                                    <linearGradient id="paint2_linear_4911_12469" x1="2.5" y1="11.952" x2="22.5"
                                                    y2="11.952"
                                                    gradientUnits="userSpaceOnUse">
                                      <stop stopColor="#E2C881"/>
                                      <stop offset="1" stopColor="#8B6F2A"/>
                                    </linearGradient>
                                    <linearGradient id="paint3_linear_4911_12469" x1="2.5" y1="11.952" x2="22.5"
                                                    y2="11.952"
                                                    gradientUnits="userSpaceOnUse">
                                      <stop stopColor="#E2C881"/>
                                      <stop offset="1" stopColor="#8B6F2A"/>
                                    </linearGradient>
                                  </defs>
                                </svg>

                                Оформить заказ
                              </button>

                              <button
                                type="button"
                                style={{height: 36}}
                                className={"btn bg-f8f8f9 border-e5e7e9 focus-none custom-rounded-8 text-nowrap d-flex-center-center fw-600"}
                                onClick={() => {
                                  dispatch(METHOD.request({
                                    url: "/client/unlike-product",
                                    name: "clientAddProductUnLike",
                                    values: {
                                      product_id: get(item, "id")
                                    },
                                    cb: {
                                      success: () => {
                                        toast.success("Sevimlilardan o'chirildi", {
                                          position: "top-center",
                                          autoClose: 2000,
                                        });
                                        dispatch(DELETE.success({
                                          id: get(item, "id"),
                                          name: "likeProductsClient",
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
                                  }));
                                }}
                              >
                                {/*"fi-sr-heart" : "fi-br-heart"*/}
                                <i style={{
                                  background: "linear-gradient(#E2C881, #8B6F2A)",
                                  WebkitBackgroundClip: "text",
                                  backgroundClip: "text",
                                  WebkitTextFillColor: "transparent"
                                }} className="fi fi-sr-heart fs-22 lh-22"/>
                              </button>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className={"border-0"} colSpan={7}/>
                        </tr>
                      </React.Fragment>)
                    else
                      return <tr>
                        <td colSpan={7} className={"border-0 p-0"}>
                          <div className="row w-100 flex-column align-items-center justify-content-center min-vh-50">

                            <div className="col-auto">
                              <button
                                className={`btn focus-none btn-lg btn-d3B15e text-white custom-rounded-12`}>
                                <i className={`far fa-heart fs-18`}/>
                              </button>
                            </div>

                            <div className="col-auto mt-3">
                              <p
                                className="text-center lh-32 fs-32 fw-600">У вас нет избранных товаров</p>

                              <p
                                className="text-center fs-14 fw-600">Добавляйте товары в Избранное с помощью ❤️️</p>
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
                        </td>
                      </tr>
                  }}
                </LoadAll>
                </tbody>
                <tfoot>
                <tr>
                  <td colSpan={7} className={"border-0"}>
                    <Pagination
                      className={'custom-style flex-wrap justify-content-lg-center'}
                      pageRange={1}
                      marginPage={1}
                      initialPage={1}
                      pageCount={Math.ceil(get(isMeta, 'total', 1) / 15)}
                      onChange={n => setPage(n)}
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

export default Favourites;
