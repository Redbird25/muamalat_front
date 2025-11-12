import React, {useEffect, useState} from 'react';
import icon_1 from "assets/images/icon/shipment.svg";
import icon_2 from "assets/images/icon/fast-delivery.svg";
import icon_3 from "assets/images/icon/delivery.svg";
import icon_4 from "assets/images/icon/credit-card.svg";
import {Link, useNavigate} from "react-router-dom";
import InputPhone from "../../../components/Fields/InputPhone";
import {useDispatch} from "react-redux";
import ReactCodeInput from "react-code-input";
import {LOGIN} from "../../../redux/actions";
import {toast} from "react-toastify";
import {get} from "lodash";
import {api, session} from "services";

const LoginSaler = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [phoneCheck, setPhoneCheck] = useState(false);
  const [count, setCount] = useState(60);
  const [txId, setTxId] = useState("");
  const [sendLoading, setSendLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (!phoneCheck || count === 0) {
      return undefined;
    }
    const timerId = setInterval(() => {
      setCount(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timerId);
  }, [count, phoneCheck]);

  useEffect(() => {
    if (!phoneCheck) {
      setCount(60);
    }
  }, [phoneCheck]);

  const normalizeDigits = (value = "") => value.replace(/\D/g, "");

  const formatPhoneForApi = (value = "") => {
    const digits = normalizeDigits(value);
    if (!digits) {
      return "";
    }
    if (digits.startsWith("998")) {
      return `+${digits}`;
    }
    return `+998${digits}`;
  };

  const handleSendCode = async () => {
    const formatted = formatPhoneForApi(phone);
    if (!formatted || normalizeDigits(phone).length !== 9) {
      toast.error("Введите корректный номер телефона");
      return;
    }
    setSendLoading(true);
    try {
      const response = await api.customerAuth.startSeller({phoneNumber: formatted});
      const payload = get(response, "data", response);
      const startedTxId = get(payload, "txId") || get(payload, "data.txId") || get(payload, "result.txId");
      if (!startedTxId) {
        throw new Error("txId was not returned");
      }
      setTxId(startedTxId);
      setPhoneCheck(true);
      setCount(60);
      setCode("");
      toast.success("SMS код отправлен");
    } catch (error) {
      toast.error(get(error, "response.data.message") || "Не удалось отправить код");
    } finally {
      setSendLoading(false);
    }
  };

  const handleResend = async () => {
    if (!txId) {
      return;
    }
    setResendLoading(true);
    try {
      await api.customerAuth.resend({txId});
      setCount(60);
      toast.success("Код повторно отправлен");
    } catch (error) {
      toast.error(get(error, "response.data.message") || "Ошибка при повторной отправке");
    } finally {
      setResendLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!txId) {
      toast.error("Сначала запросите код подтверждения");
      return;
    }
    if (!code || code.length !== 5) {
      toast.error("Введите 5-значный код");
      return;
    }
    setVerifyLoading(true);
    try {
      const response = await api.customerAuth.verifySeller({txId, code});
      const payload = get(response, "data", response);
      const accessToken = get(payload, "accessToken", "");
      const refreshToken = get(payload, "refreshToken", "");
      const userId = get(payload, "userId", "");
      const phoneNumber = get(payload, "phoneNumber", formatPhoneForApi(phone));

      if (!accessToken || !refreshToken) {
        throw new Error("Token pair was not returned");
      }

      session.set("refreshToken", refreshToken);
      dispatch(LOGIN.success({
        token: accessToken,
        user: {
          id: userId,
          identifier: phoneNumber,
          phone_number: phoneNumber,
          role_id: 4
        }
      }));

      setCode("");
      setPhoneCheck(false);
      setTxId("");
      toast.success("Телефон подтверждён");
      navigate("/dashboard", {replace: true});
    } catch (error) {
      toast.error(get(error, "response.data.message") || "Не удалось подтвердить код");
    } finally {
      setVerifyLoading(false);
    }
  };
  
  return (
    <div className="container sales-login my-4 min-vh-50">
      <div className="row h-100">
        <div className="col-lg-7 mb-lg-0 mb-3">
          <div className="sales-login_left">
            <p className="fs-md-48 fs-30 fw-700 lh-lg-48 lh-30 text-212640 mb-2">
              Продавайте свои товары
              <br/>в Trast Muamalat!
            </p>
            
            <p className="fs-lg-24 fs-18 text-141316 lh-lg-31 lh-19">
              Разместите свои товары в магазине Trast Muamalat и увеличте свои продажи!
            </p>
            
            <button type="button" className="btn btn-menu w-lg-50 w-100 custom-rounded-8">
              <span className="bg-gradient-custom reverse custom-rounded-8"></span>
              <span className="position-relative custom-zindex-2 fw-700 fs-17">
                            Стать партнёром
                        </span>
            </button>
            
            
            <div className="row mt-4">
              <div className="col-lg-6 mb-lg-0 mb-3">
                <div className="h-100 p-md-4 p-0 custom-rounded-12">
                  <div className="row align-items-center">
                    <div className="col-auto">
                      <div className="bg-fcfcfc custom-rounded-15 position-relative"
                           style={{width: 64, height: 64}}
                      >
                        <img src={icon_1}
                             className="position-absolute top-50 start-50 translate-middle" alt="icon"/>
                      </div>
                    </div>
                    
                    <div className="col-8">
                      <p className="mb-0 text-141316 fw-600 lh-19">Больше не нужно ходить на базар</p>
                      <p className="mb-0 fs-14 text-a7a7a7 lh-17">У нас выгодные цены и доставка </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mb-lg-0 mb-3">
                <div className="h-100 p-md-4 p-0 custom-rounded-12">
                  <div className="row align-items-center">
                    <div className="col-auto">
                      <div className="bg-fcfcfc custom-rounded-15 position-relative"
                           style={{width: 64, height: 64}}
                      >
                        <img src={icon_2}
                             className="position-absolute top-50 start-50 translate-middle" alt="icon"/>
                      </div>
                    </div>
                    
                    <div className="col-8">
                      <p className="mb-0 text-141316 fw-600 lh-19">Быстрая доставка</p>
                      <p className="mb-0 fs-14 text-a7a7a7 lh-17">Наш сервис удивит вас</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mb-lg-0 mb-3">
                <div className="h-100 p-md-4 p-0 custom-rounded-12">
                  <div className="row align-items-center">
                    <div className="col-auto">
                      <div className="bg-fcfcfc custom-rounded-15 position-relative"
                           style={{width: 64, height: 64}}
                      >
                        <img src={icon_3}
                             className="position-absolute top-50 start-50 translate-middle" alt="icon"/>
                      </div>
                    </div>
                    
                    <div className="col-8">
                      <p className="mb-0 text-141316 fw-600 lh-19">Удобства для вас</p>
                      <p className="mb-0 fs-14 text-a7a7a7 lh-17">Быстро оформление и гарантия на возврать
                        в случае неисправности</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mb-lg-0 mb-3">
                <div className="h-100 p-md-4 p-0 custom-rounded-12">
                  <div className="row align-items-center">
                    <div className="col-auto">
                      <div className="bg-fcfcfc custom-rounded-15 position-relative"
                           style={{width: 64, height: 64}}
                      >
                        <img src={icon_4}
                             className="position-absolute top-50 start-50 translate-middle" alt="icon"/>
                      </div>
                    </div>
                    
                    <div className="col-8">
                      <p className="mb-0 text-141316 fw-600 lh-19">Рассрочка</p>
                      <p className="mb-0 fs-14 text-a7a7a7 lh-17">Без предоплат</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-5 mb-lg-0 mb-3">
          <div className="sales-login_right">
            <p className="fs-32 fw-700">Вход</p>
            
            {
              phoneCheck
                ? <div className="mb-4">
                  <label htmlFor="password_salesman" className="form-label mb-1 text-141316 fs-14 fw-600">Код из
                    SMS</label>

                  <ReactCodeInput
                    className={"d-flex align-items-center justify-content-evenly mt-5 mb-4 code-input-group"}
                    type='number'
                    name={"otp"}
                    fields={5}
                    inputMode={"numeric"}
                    value={code}
                    onChange={(value) => setCode(value)}
                  />

                  {
                    count === 0
                      ? <button
                        type="button"
                        className="btn btn-special focus-none hover-orange w-lg-100 cursor-pointer mb-3"
                        disabled={resendLoading}
                        onClick={handleResend}
                      >
                        {resendLoading ? "Отправляем…" : "Отправить повторно"}
                      </button>
                      : <p className="text-center text-334150">
                        Если код не придёт, можно получить новый <br/>через <span
                        id="phone-timer">{count}</span> сек
                      </p>
                  }
                </div>
                : <div className="mb-4">
                  <label htmlFor="phone_salesman" className="form-label mb-1 text-141316 fs-14 fw-600">Телефон</label>
                  <InputPhone
                    id={"phone_salesman"}
                    name="phone_salesman"
                    format="+998 ## ### ## ##"
                    className={`form-control custom-rounded-12 fs-14 text-334150 focus-none`}
                    type="tel"
                    style={{minHeight: 50}}
                    value={phone}
                    isNumericString
                    onValueChange={e => {
                      setPhone(e.value);
                    }}
                    allowEmptyFormatting
                    disabled={sendLoading}
                  />
                </div>
            }


            <button
              type="button"
              className={`btn btn-menu focus-none w-100 custom-rounded-8 ${sendLoading || verifyLoading ? "disabled" : ""}`}
              onClick={() => {
                if (phoneCheck) {
                  handleVerifyCode();
                } else {
                  handleSendCode();
                }
              }}
              disabled={sendLoading || verifyLoading}
            >
              <span className="bg-gradient-custom reverse custom-rounded-8"></span>
              <span className="position-relative custom-zindex-2 fw-700 fs-17">
                {
                  phoneCheck
                    ? (verifyLoading ? "Проверяем…" : "Войти")
                    : (sendLoading ? "Отправляем…" : "Получить код")
                }
              </span>
            </button>
            {/*<Link to={"#"} className="my-4 d-block text-center text-334150">
              Восстановить пароль
            </Link>*/}
            
            <hr/>
            
            <p className="fs-32 fw-700">У Вас нет учётной записи?</p>
            
            <Link to={"/seller-registration"}
                  className="btn focus-none border-212640 w-100 custom-rounded-8 fs-17 fw-700">
              Регистрация
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSaler;
