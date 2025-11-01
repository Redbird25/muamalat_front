import React, {useEffect, useState} from 'react';
import InputPhone from "../Fields/InputPhone";
import ReactCodeInput from "react-code-input";
import {CUSTOMER_AUTH_START, CUSTOMER_AUTH_VERIFY, CUSTOMER_AUTH_RESEND} from "../../redux/actions";
import icon_modal_1 from "../../assets/images/icon/shipment.svg";
import icon_modal_2 from "../../assets/images/icon/fast-delivery.svg";
import icon_modal_3 from "../../assets/images/icon/delivery.svg";
import icon_modal_4 from "../../assets/images/icon/credit-card.svg";
import {Modal} from "../index";
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import {get} from "lodash";
import {toast} from "react-toastify";
import {Responsive} from "../../services/utils";
import FavouritesAction from "../../redux/functions/favourites";

const ModalLoginRegister = ({
                              isModal,
                              setModal,
                            }) => {
  const screenSize = Responsive();
  const {pathname} = useLocation();
  const navigate = useNavigate();
  const {system: {products}, auth} = useSelector(state => state);
  const dispatch = useDispatch();
  const [sendCode, setSendCode] = useState(false);
  const [secretPhone, setSecretPhone] = useState("");
  const [code, setCode] = useState("");
  const [offer, setOffer] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [count, setCount] = useState(60);
  const [register, setRegister] = useState(false);
  const [liked_arr, setLiked] = useState([]);
  const [cart_arr, setCart] = useState([]);
  const [{user_name, user_surname, user_phone}, setFormUser] = useState({
    user_name: "",
    user_surname: "",
    user_phone: ""
  })

  useEffect(() => {
    const interval = count !== 0 && sendCode && setInterval(() => {
      setCount((prevCount) => prevCount - 1);
    }, 1000);

    if (!sendCode) {
      setCount(60);
    }

    return () => clearInterval(interval); // Cleanup function
  }, [count, sendCode]); // Empty dependency array ensures it runs only once

  useEffect(() => {
    if (isModal) {
      Object.entries(products).forEach(([k, v]) => {
        if (get(v, "cart")) {
          setCart(prevState => [...prevState, {
            product_id: k,
            count: get(products, `[${k}].quantity`, 1)
          }])
        }
        if (get(v, "like")) {
          setLiked(prevState => [...prevState, {
            product_id: k,
          }])
        }
      });
    }
  }, [isModal, products])


  const clearState = () => {
    setCode("");
    setOffer(false);
    setPhoneNumber("");
    setSendCode(false);
    setModal(false);
    setRegister(false);
    setSecretPhone("");
    setFormUser({
      user_name: "",
      user_surname: "",
      user_phone: ""
    });
    // Reset customer auth state
    dispatch({type: 'RESET_CUSTOMER_AUTH'});
  }

  return (
    <Modal
      isOpen={!!isModal}
      position={"center"}
      maxWidth={"1140px"}
      height={"auto"}
      defaultHeight={"auto"}
      width={"auto"}
      modalContentClass={"modal-content custom-rounded-20 shadow"}
      onClose={() => clearState()}
    >
      <div className="modal-body" style={{padding: "0 12px"}}>
        <div className="row">
          {
            sendCode
              ? <form id="phone-check" className="col-lg-6 p-md-6 p-3">
                <p className="text-greyscale800 fs-32 fw-700 lh-42">Введите код</p>
                <p>
                  Для подтверждения телефона отправили <br/>5-значный код на <b>+{secretPhone}
                </b>
                </p>
                <ReactCodeInput
                  className={"d-flex align-items-center justify-content-evenly mt-5 code-input-group"}
                  type='number'
                  name={"otp"}
                  fields={5}
                  inputMode={"numeric"}
                  onChange={(value) => setCode(value)}
                />
                <div className="my-4">
                  <button
                    type={"button"}
                    className="btn btn-menu focus-none h-100 w-100 custom-rounded-8"
                    style={{minHeight: 50}}
                    onClick={() => {
                      dispatch(CUSTOMER_AUTH_VERIFY.request({
                        txId: auth.customerAuth.txId,
                        code: code,
                        cb: {
                          success: (data) => {
                            // Обработка избранного и корзины
                            Object.values(products).forEach(item => {
                              FavouritesAction("allCart", get(item, "id"), dispatch, products, item);
                              FavouritesAction("allLike", get(item, "id"), dispatch, products, item);
                            });

                            clearState();
                            navigate(pathname === "/basket" ? "/basket-order" : "/dashboard", {
                              replace: true,
                              state: localStorage.getItem("productCart") ? JSON.parse(localStorage.getItem("productCart")) : {}
                            });
                          },
                          error: (error) => {
                            toast.error(get(error, "message") || "Неверный код");
                            setCode("");
                          }
                        }
                      }))
                    }}
                  >
                    <span className="bg-gradient-custom reverse custom-rounded-8"/>
                    <span className="position-relative custom-zindex-2">
                      Подвердить
                    </span>
                  </button>
                </div>

                {
                  count === 0
                    ? <button
                      onClick={() => {
                        dispatch(CUSTOMER_AUTH_RESEND.request({
                          txId: auth.customerAuth.txId,
                          cb: {
                            success: () => {
                              toast.success("SMS код отправлен повторно");
                              setCount(60);
                            },
                            error: (error) => {
                              toast.error(get(error, "message") || "Ошибка отправки SMS");
                              console.log(error)
                            }
                          }
                        }));
                      }}
                      type={"button"}
                      className="btn btn-special focus-none hover-orange w-lg-100 cursor-pointer">
                      Отправить повторно
                    </button>
                    : <p className="text-center text-334150">
                      Если код не придёт, можно получить новый <br/>через <span id="phone-timer">{count}</span> сек
                    </p>
                }


                <button type="button" className="btn custom-rounded-12 focus-none mt-4 flex-fill bg-f1f1f1"
                        style={{minHeight: 44}}
                        onClick={() => setSendCode(false)}>
                  <i className="far fa-chevron-left me-3"></i>

                  Назад
                </button>
              </form>
              : !register && <div className="col-lg-6 p-md-6 p-3" id="send-code">
              <p className="text-greyscale800 fs-32 fw-700 lh-42">Вход или создать личный кабинет</p>

              <div className="mb-4">
                <label htmlFor="phone_header" className="form-label mb-1 text-141316 fs-14 fw-600">Телефон</label>
                <InputPhone
                  id={"phone_header"}
                  name="phone_header"
                  format="+998 ## ### ## ##"
                  className={`form-control custom-rounded-12 fs-14 text-334150 focus-none`}
                  type="tel"
                  style={{minHeight: 50}}
                  value={phoneNumber}
                  isNumericString
                  onValueChange={e => {
                    setPhoneNumber(e.value)
                  }}
                  allowEmptyFormatting
                />
              </div>

              <div className="mb-4 position-relative">
                <input type="checkbox" name="user"
                       className="form-check-input radio-active rounded mt-0 position-absolute color-warning focus-none"
                       checked={offer}
                       onChange={(e) => setOffer(e.target.checked)}
                       id="user_1" style={{left: 20, top: 14, width: 20, height: 20}}
                />
                <label htmlFor="user_1"
                       className="form-label check-radio-active w-100 custom-rounded-12 border mb-0 d-flex align-items-center text-75758b fs-14 fw-600"
                       style={{minHeight: 75, padding: "6px 12px 6px 55px"}}
                >

                    <span className="d-flex w-100 justify-content-between">
                      <span className="d-block">
                        <span className="d-block fs-14 text-141316 fw-600">Публичная оферта</span>
                        <span className="d-block fs-12 text-334150 fw-normal">Подтверждаю ознакомление и согласие с условиями Публичной оферты</span>
                      </span>
                    </span>

                </label>
              </div>

              <div className="poistion-relative mb-4">
                <button
                  onClick={() => {
                    setRegister(true);
                  }}
                  type={"button"}
                  className="btn btn-special focus-none hover-orange w-lg-100 h-100 cursor-pointer">
                  Регистрация
                </button>
              </div>

              <div>
                <button className="btn btn-menu focus-none h-100 w-100 custom-rounded-8" id="send-phone"
                        onClick={() => {
                          dispatch(CUSTOMER_AUTH_START.request({
                            phoneNumber: `998${phoneNumber}`,
                            intent: "LOGIN",
                            cb: {
                              success: (data) => {
                                setSecretPhone(`998${phoneNumber}`);
                                setSendCode(true);
                              },
                              error: (error) => {
                                toast.error(get(error, "message") || "Ошибка отправки SMS");
                                console.log(error)
                              }
                            }
                          }));
                        }}
                        disabled={phoneNumber.length !== 9 || !offer}
                        style={{minHeight: 50}}>
                  <span className="bg-gradient-custom reverse custom-rounded-8"></span>
                  <span className="position-relative custom-zindex-2">
                      Получить код
                    </span>
                </button>
              </div>
            </div>
          }


          <div
            className={`col-lg-6 p-md-6 p-3 shadow border bg-efefef d-flex justify-content-center flex-column custom-rounded-${get(screenSize, "width") < 768 ? "bottom" : register ? "start" : "end"}-20`}>
            <button type="button" className="btn-close position-absolute focus-none"
                    style={{top: 20, right: 20}}
                    onClick={() => clearState()}
                    data-bs-dismiss="modal" aria-label="Close"></button>

            <div className="d-flex align-items-center">
              <div className="me-3">
                <div className="bg-white d-flex align-items-center justify-content-center custom-rounded-15"
                     style={{width: 64, height: 64}}
                >
                  <img src={icon_modal_1} alt="icon"/>
                </div>
              </div>

              <div>
                <p className="mb-0 text-141316 fw-600">Больше не нужно ходить на базар</p>
                <p className="mb-0 text-a7a7a7 fs-14">У нас выгодные цены и доставка до дома</p>
              </div>
            </div>

            <div className="d-flex align-items-center mt-4">
              <div className="me-3">
                <div className="bg-white d-flex align-items-center justify-content-center custom-rounded-15"
                     style={{width: 64, height: 64}}
                >
                  <img src={icon_modal_2} alt="icon"/>
                </div>
              </div>

              <div>
                <p className="mb-0 text-141316 fw-600">Быстрая доставка</p>
                <p className="mb-0 text-a7a7a7 fs-14">Наш сервис удивит вас</p>
              </div>
            </div>

            <div className="d-flex align-items-center mt-4">
              <div className="me-3">
                <div className="bg-white d-flex align-items-center justify-content-center custom-rounded-15"
                     style={{width: 64, height: 64}}
                >
                  <img src={icon_modal_3} alt="icon"/>
                </div>
              </div>

              <div>
                <p className="mb-0 text-141316 fw-600">Удобства для вас</p>
                <p className="mb-0 text-a7a7a7 fs-14">Быстро оформление и гарантия на возврать в случае
                  неисправности</p>
              </div>
            </div>

            <div className="d-flex align-items-center mt-4">
              <div className="me-3">
                <div className="bg-white d-flex align-items-center justify-content-center custom-rounded-15"
                     style={{width: 64, height: 64}}
                >
                  <img src={icon_modal_4} alt="icon"/>
                </div>
              </div>

              <div>
                <p className="mb-0 text-141316 fw-600">Рассрочка</p>
                <p className="mb-0 text-a7a7a7 fs-14">Без предоплат</p>
              </div>
            </div>
          </div>

          {
            (register && !sendCode) && <div className="col-lg-6 p-md-6 p-3">
              <p className="text-greyscale800 fs-32 fw-700 lh-42">Создать личный кабинет</p>
              <div className="mb-3">
                <label htmlFor="user_surname_register"
                       className="form-label mb-1 text-141316 fs-14 fw-600">Фамилия</label>
                <input
                  type="text"
                  className={`form-control focus-none custom-rounded-12`}
                  id={"user_surname_register"}
                  name={"user_surname_register"}
                  value={user_surname}
                  onChange={(e) => setFormUser(prevState => ({...prevState, user_surname: e.target.value}))}
                  placeholder="Введите фамилия"
                  style={{minHeight: 50}}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="user_name_register" className="form-label mb-1 text-141316 fs-14 fw-600">Имя</label>
                <input
                  type="text"
                  className={`form-control focus-none custom-rounded-12`}
                  id={"user_name_register"}
                  name={"user_name_register"}
                  value={user_name}
                  onChange={(e) => setFormUser(prevState => ({...prevState, user_name: e.target.value}))}
                  placeholder="Введите имя"
                  style={{minHeight: 50}}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="user_phone_register" className="form-label mb-1 text-141316 fs-14 fw-600">Телефон</label>
                <InputPhone
                  id={"user_phone_register"}
                  name="user_phone_register"
                  format="+998 ## ### ## ##"
                  className={`form-control custom-rounded-12 fs-14 text-334150 focus-none`}
                  type="tel"
                  style={{minHeight: 50}}
                  value={user_phone}
                  isNumericString
                  onValueChange={e => {
                    setFormUser(prevState => ({...prevState, user_phone: e.value}))
                  }}
                  allowEmptyFormatting
                />
              </div>

              <div className="mb-4 position-relative">
                <input type="checkbox" name="user"
                       className="form-check-input radio-active rounded mt-0 position-absolute color-warning focus-none"
                       checked={offer}
                       onChange={(e) => setOffer(e.target.checked)}
                       id="user_1" style={{left: 20, top: 14, width: 20, height: 20}}
                />
                <label htmlFor="user_1"
                       className="form-label check-radio-active w-100 custom-rounded-12 border mb-0 d-flex align-items-center text-75758b fs-14 fw-600"
                       style={{minHeight: 75, padding: "6px 12px 6px 55px"}}
                >

                    <span className="d-flex w-100 justify-content-between">
                      <span className="d-block">
                        <span className="d-block fs-14 text-141316 fw-600">Публичная оферта</span>
                        <span className="d-block fs-12 text-334150 fw-normal">Подтверждаю ознакомление и согласие с условиями Публичной оферты</span>
                      </span>
                    </span>

                </label>
              </div>

              <div>
                <button className="btn btn-menu focus-none h-100 w-100 custom-rounded-8"
                        onClick={() => {
                          dispatch(CUSTOMER_AUTH_START.request({
                            phoneNumber: `998${user_phone}`,
                            intent: "REGISTER",
                            firstName: user_name,
                            lastName: user_surname,
                            cb: {
                              success: (data) => {
                                setSecretPhone(`998${user_phone}`);
                                setSendCode(true);
                              },
                              error: (error) => {
                                toast.error(get(error, "message") || "Ошибка отправки SMS");
                                console.log(error)
                              }
                            }
                          }))
                        }}
                        disabled={user_name.length < 3 || user_surname.length < 3 || user_phone.length !== 9 || !offer}
                        style={{minHeight: 50}}>
                  <span className="bg-gradient-custom reverse custom-rounded-8"></span>
                  <span className="position-relative custom-zindex-2">
                      Получить код
                    </span>
                </button>
              </div>
            </div>
          }
        </div>
      </div>

    </Modal>
  );
};

export default ModalLoginRegister;
