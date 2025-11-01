import React, {useState} from 'react';
import InputPhone from "../../../components/Fields/InputPhone";
import {METHOD} from "../../../schema/actions";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {LOGIN} from "../../../redux/actions";

const IsLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [{phone, code, check}, setLogin] = useState({
    phone: "",
    code: "",
    check: false
  });
  
  return (
    <div
      className={"container my-5"}>
      <div className="bg-white d-flex-column-center-center custom-rounded-32 custom-min-h-50-dvh">
        <div className="w-xl-30 w-lg-50 h-100 d-flex-column-center-center">
          <h1 className={"text-gradient fw-700"}>Авторизация</h1>
          
          {
            check
              ? <div className="mb-3 w-100">
                <label htmlFor="code" className="form-label">Код</label>
                <InputPhone
                  id={"code"}
                  name="code"
                  className={`form-control custom-rounded-12 fs-14 text-334150 focus-none`}
                  type="tel"
                  style={{minHeight: 50}}
                  value={code}
                  isNumericString
                  onValueChange={e => {
                    setLogin(prev => ({...prev, code: e.value}))
                  }}
                  allowEmptyFormatting
                />
              </div>
              : <div className="mb-3 w-100">
                <label htmlFor="phone_number" className="form-label">Телефон номер</label>
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
                    setLogin(prev => ({...prev, phone: e.value}))
                  }}
                  allowEmptyFormatting
                />
              </div>
          }
          
          <button
            type="button"
            onClick={() => {
              if (check) {
                dispatch(METHOD.request({
                  url: "/check-code",
                  name: "phoneSmsCode",
                  values: {
                    phone_number: `+998${phone}`,
                    number: code
                  },
                  cb: {
                    success: (data) => {
                      dispatch(LOGIN.success({
                        ...data
                      }));
                      navigate("/dashboard", {replace: true})
                    },
                    error: () => {
                    
                    },
                    finally: () => {
                    
                    }
                  }
                }))
              } else {
                dispatch(METHOD.request({
                  url: "/send-sms",
                  name: "phoneSmsSend",
                  values: {
                    phone_number: `+998${phone}`
                  },
                  cb: {
                    success: () => {
                      setLogin(prev => ({...prev, check: true}))
                    },
                    error: () => {
                    
                    },
                    finally: () => {
                    
                    }
                  }
                }));
              }
            }}
            disabled={phone.trim().length < 9}
            className={`btn btn-menu ${phone.trim().length < 9 ? "disabled" : ""} custom-rounded-12 focus-none h-100 w-auto mt-3`}
            style={{minWidth: 270, minHeight: 50}}
          >
            <span className="bg-gradient-custom reverse custom-rounded-12"/>
            <span
              className="position-relative d-flex align-items-center justify-content-center fs-17 fw-600 custom-zindex-2">
              {
                check
                  ? "Вход"
                  : "Отправить код"
              }
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IsLogin;
