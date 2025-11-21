import React from 'react';
import {get} from "lodash";
import InputPhone from "../Fields/InputPhone";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {DELETE, METHOD, UPDATE} from "../../schema/actions";
import {toast} from "react-toastify";
import FavouritesAction from "../../redux/functions/favourites";
import {LOGIN} from "../../redux/actions";
import {resolvePrimaryImageUrl} from "../../services/utils";
import noImage from "../../assets/images/no-image.png";

const ProductItem = ({
                       item,
                       actionFrom = "main",
                       col = 20
                     }) => {
  const {auth, system: {products}} = useSelector(state => state);
  const {pathname} = useLocation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const imageSrc = resolvePrimaryImageUrl(item) || noImage;
  return (
    <div
      className={`w-xl-${col} my-3 w-lg-33 w-50`}>
      <div className="custom-card h-100 justify-content-between">
        <div className="custom-card_img position-relative custom-zindex-4">
          <div className="custom-card_img__left">
                    <span
                      className={`badge ${get(item, "articleClass") ?? "bg-f04e79"} rounded-pill px-3`}>{get(item, "article")}</span>
          </div>
          <button
            type="button"
            className={`btn focus-none custom-card_img__top ${(get(auth, "isAuthenticated") ? get(item, "favourite") : get(products, `${get(item, "id")}.like`)) ? "active" : ""}`}
            onClick={() => {
              if (get(auth, "isAuthenticated") && parseInt(get(auth, "data.user.role_id")) === 3) {
                if (get(item, "favourite")) {
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
                        if (actionFrom === "main" || pathname === "/favourites") {
                          dispatch(UPDATE.success({
                            id: get(item, "id"),
                            name: "mainProducts",
                            data: {
                              favourite: 0
                            }
                          }));
                        }

                        if (actionFrom === "like" || pathname === "/favourites") {
                          dispatch(DELETE.success({
                            id: get(item, "id"),
                            name: "likeProductsClient",
                          }));
                        }

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
                } else {
                  dispatch(METHOD.request({
                    url: "/client/like-product",
                    name: "clientAddProductLike",
                    values: {
                      product_id: get(item, "id")
                    },
                    cb: {
                      success: () => {
                        toast.success("Sevimlilarga qo'shildi", {
                          position: "top-center",
                          autoClose: 2000,
                        });
                        if (actionFrom === "main") {
                          dispatch(UPDATE.success({
                            id: get(item, "id"),
                            name: "mainProducts",
                            data: {
                              favourite: 1
                            }
                          }));
                        }

                        if (pathname === "/favourites") {
                          dispatch(UPDATE.success({
                            name: "likeProductsClient",
                            array: true,
                            arrayUpdate: true,
                            data: {
                              ...item,
                              favourite: 1
                            }
                          }));
                        }
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
                }
              } else {
                FavouritesAction("like", get(item, "id"), dispatch, products, item);
              }
            }}>
            <i className="fi fi-br-heart fs-md-22 lh-md-22 fs-15 lh-15"/>
          </button>
          <button
            type="button"
            className={`btn focus-none custom-card_img__compare ${(get(auth, "isAuthenticated") ? get(item, "equal") : get(products, `${get(item, "id")}.equal`)) ? "active" : ""}`}
            onClick={() => FavouritesAction("equal", get(item, "id"), dispatch, products, item)}
          >
            <i className="fi fi-sr-equality fs-md-22 lh-md-22 fs-15 lh-15"/>
          </button>
          <Link to={`/product/${get(item, "id")}`}>
            <img className={"product-image"}
                 src={imageSrc}
                 alt="article"/>
          </Link>
        </div>

        <div className="px-2">
          <p
            onClick={() => navigate(`/product/${get(item, "id")}`)}
            className="cursor-pointer product-title lh-20 text-two-line fs-lg-16 fs-14" style={{minHeight: 40}}>
            {get(item, "name")}
          </p>
          {
            get(item, "plan")
              ? <div
                onClick={() => navigate(`/product/${get(item, "id")}`)}
                className="cursor-pointer border mb-2 fw-700 text-374957 w-content px-4 border-d6bb75 custom-card_discount rounded-pill">
                {get(item, "plan")}
              </div>
              : null
          }
          <div className="d-flex mb-2 align-items-center justify-content-between">
            {get(item, "old_price") ? <span
              className={`text-decoration-line-through ${get(item, "old_price") === "-" ? "invisible" : ""}`}>{get(item, "old_price")}</span> : null}
            <b
              className={`text-ab904a ${get(item, "percent") === "-" ? "invisible" : ""}`}>{get(item, "percent")}</b>
          </div>


          <div className="d-flex align-items-center justify-content-between">
            <b className="fs-md-24 fs-15">
              <InputPhone value={get(item, "price")} thousandSeparator={" "} displayType={"text"}/>
            </b>

            <button type="button"
                    onClick={() => {
                      if (get(auth, "isAuthenticated") && parseInt(get(auth, "data.user.role_id")) === 3) {
                        if (get(item, "in_basket")) {
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
                                  autoClose: 1000,
                                });
                                if (actionFrom === "main") {
                                  dispatch(UPDATE.success({
                                    id: get(item, "id"),
                                    name: "mainProducts",
                                    data: {
                                      in_basket: 0
                                    }
                                  }));
                                }

                                if (actionFrom === "cart") {
                                  dispatch(DELETE.success({
                                    id: get(item, "id"),
                                    name: "cartProductsClient",
                                  }));
                                }

                                if (actionFrom === "like" || pathname === "/favourites") {
                                  dispatch(UPDATE.success({
                                    id: get(item, "id"),
                                    name: "likeProductsClient",
                                    data: {
                                      in_basket: 0
                                    }
                                  }));
                                }

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
                        } else {
                          dispatch(METHOD.request({
                            url: "/client/add-to-cart-product",
                            name: "clientAddProductCart",
                            values: {
                              product_id: get(item, "id"),
                              count: 1,
                            },
                            cb: {
                              success: () => {
                                toast.success("Savatchaga qo'shildi", {
                                  position: "top-center",
                                  autoClose: 1000,
                                });
                                if (actionFrom === "main") {
                                  dispatch(UPDATE.success({
                                    id: get(item, "id"),
                                    name: "mainProducts",
                                    data: {
                                      in_basket: 1
                                    }
                                  }));
                                }

                                if (actionFrom === "like" || pathname === "/favourites") {
                                  dispatch(UPDATE.success({
                                    id: get(item, "id"),
                                    name: "likeProductsClient",
                                    data: {
                                      in_basket: 1
                                    }
                                  }));
                                }

                                dispatch(LOGIN.success({
                                  update_login: true,
                                  count: parseInt(get(auth, "data.order.products_count", "0")) + 1
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
                        }
                      } else {
                        FavouritesAction("cart", get(item, "id"), dispatch, products, item);
                        /*setProductCart(prevState => ({
                          ...prevState, [get(item, "id")]: {
                            ...item,
                            like: get(prevState, `${get(item, "id")}.like`),
                            equal: get(prevState, `${get(item, "id")}.equal`),
                            cart: !get(prevState, `${get(item, "id")}.cart`)
                          }
                        }))*/
                      }
                    }}
                    className={`btn focus-none py-2 d-flex-align-center custom-card_img__cart ${(get(auth, "isAuthenticated") ? get(item, "in_basket") : get(products, `${get(item, "id")}.cart`)) ? "active" : ""}`}
            >
              <i className="fi fi-br-shopping-cart-add fs-22 lh-22"/>
            </button>
          </div>
          <div className="mt-2">
            <button
              type="button"
              className="btn btn-quick-buy w-100"
              onClick={() => {
                if (get(auth, "isAuthenticated") && parseInt(get(auth, "data.user.role_id")) === 3) {
                  dispatch(METHOD.request({
                    url: "/client/add-to-cart-product",
                    name: "clientAddProductCart",
                    values: { product_id: get(item, "id"), count: 1 },
                    cb: {
                      success: () => {
                        navigate('/basket-order', { replace: false });
                      },
                      error: () => {
                        toast.error("Xatolik yuz berdi!");
                      },
                      finally: () => {}
                    }
                  }));
                } else {
                  toast.info("Kirish yoki ro'yxatdan o'ting");
                }
              }}
            >
              Купить в один клик
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
