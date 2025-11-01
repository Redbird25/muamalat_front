import React from 'react';
import {useImzo} from "../../components";
import MyForm from "schema/Form";
import Select, {components} from "react-select";
import get from "lodash.get";
import {ErrorMessage, Field} from "formik";
import dayjs from "dayjs";
import {useDispatch} from "react-redux";
import {LoadOne} from "../../schema/actions";
import {IMZOClient} from "../../components/useImzo/js/e-imzo-client";
import {LOGIN} from "../../redux/actions";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

const LoginSignIn = ({notUser = false}) => {
  const {data, isLoading} = useImzo();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const customFilter = (option, searchText) => {
    return !!option?.data?.v?.CN.toLowerCase().includes(searchText.toLowerCase()) || !!option?.data?.v?.O.toLowerCase().includes(searchText.toLowerCase());
  };
  
  const signSystem = (values, cb) => {
    let errorBrowserWS =
      "Brauzer WebSocket texnologiyasini ishlay olmadi Iltimos, brauzeringizning so'nggi versiyasini o'rnating.";
    let errorWrongPassword = "Parol noto'g'ri";
    
    let uiShowMessage = function (message) {
      alert(message);
    };
    
    dispatch(LoadOne.request({
        url: "/auth/e-imzo-challenge",
        name: "challenge",
        cb: {
          success: (res) => {
            IMZOClient.loadKey(
              values.key.v,
              function (id) {
                IMZOClient.createPkcs7(
                  id,
                  res.challenge,
                  null,
                  function (pkcs7) {
                    if (pkcs7) {
                      const data = {
                        pkcs7,
                        role: get(values, "role"),
                        serialNumber: get(values, "key.v.serialNumber"),
                        tin: get(values, "tin"),
                      };
                      dispatch(
                        LOGIN.request({
                          url: "/auth/e-imzo",
                          values: data,
                          cb: {
                            success: ({data}) => {
                              toast.success("Platformaga kirish amalga oshirildi !!!");
                              dispatch(LOGIN.success({
                                ...data,
                                user: {
                                  ...get(data, "user"),
                                },
                              }));
                              navigate("/dashboard", {replace: true})
                            },
                            error: (error) => {
                              toast.error(error)
                            },
                            finally: () => {
                              cb();
                            },
                          },
                        })
                      );
                    }
                  },
                  function (e, r) {
                    if (r) {
                      if (r.indexOf("BadPaddingException") !== -1) {
                        uiShowMessage(errorWrongPassword);
                      } else {
                        uiShowMessage(r);
                      }
                    } else {
                      uiShowMessage(errorBrowserWS);
                    }
                    if (e) window.wsError(e);
                    cb();
                  }
                );
              },
              function (e, r) {
                if (r) {
                  if (r.indexOf("BadPaddingException") !== -1) {
                    uiShowMessage(errorWrongPassword);
                  } else {
                    uiShowMessage(r);
                  }
                } else {
                  uiShowMessage(errorBrowserWS);
                }
                if (e) window.wsError(e);
                cb();
              }
            );
          },
          error: () => {
          },
          finally: () => {
          },
        },
      })
    );
  };
  
  return (
    <div className={"container"}>
      <div className="login">
        <MyForm
          className={"login-block"}
          fields={[
            {
              name: "type",
              value: notUser ? 3 : 1,
              type: "number",
              required: false
            },
            {
              name: "tin",
              value: 0,
              type: "number",
              required: false
            },
            {
              name: "key",
              value: "",
              type: "object",
              when: valField => {
                valField = valField.when(["type"], {
                  is: value => {
                    return (value && value === 2)
                  },
                  then: valField.required("Required"),
                  otherwise: valField
                });
                return valField
              },
            },
            {
              name: "login",
              value: "",
              when: valField => {
                valField = valField.when(["type"], {
                  is: value => {
                    return (value && value === 1)
                  },
                  then: valField.required("Required"),
                  otherwise: valField
                });
                return valField
              }
            },
            {
              name: "password",
              value: "",
              when: valField => {
                valField = valField.when(["type"], {
                  is: value => {
                    return (value && (value === 1 || value === 3))
                  },
                  then: valField.required("Required"),
                  otherwise: valField
                });
                return valField
              }
            },
            {
              name: "email",
              value: "",
              when: valField => {
                valField = valField.when(["type"], {
                  is: value => {
                    return (value && value === 3)
                  },
                  then: valField.required("Required"),
                  otherwise: valField
                });
                return valField
              }
            }
          ]}
          onSubmit={({values, setSubmitting}) => {
            if (get(values, "type") === 2) {
              signSystem(values, setSubmitting);
            } else {
              delete values["key"];
              delete values["tin"];
              
              if (get(values, "type") === 3) {
                delete values["login"]
              } else {
                delete values["email"]
              }
              dispatch(LOGIN.request({
                url: '/auth/login',
                values,
                cb: {
                  success: ({data}) => {
                    dispatch(LOGIN.success({
                      ...data,
                      user: {
                        ...get(data, "user"),
                      },
                    }));
                    toast.success("Platformaga kirish amalga oshirildi !!!");
                    setSubmitting(false);
                    navigate("/dashboard")
                  },
                  error: () => {
                    setSubmitting(false);
                    toast.error("Login yoki parol noto'g'ri");
                  },
                  finally: () => {
                  
                  },
                }
              }))
              
              
            }
          }}
        >
          {({values, errors, touched, setFieldValue, setFieldTouched, isSubmitting, resetForm}) => <>
            <p className={"login-block_entry"}>Kirish</p>
            <div className="login-block_switch">
              <button type={"button"} onClick={() => {
                resetForm();
                setFieldValue("type", 1)
              }}
                      className={`login-block_switch__btn ${get(values, "type") === 1 ? "active" : ""}`}>
                One ID
              </button>
              <button type={"button"} onClick={() => {
                resetForm();
                setFieldValue("type", 2)
              }}
                      className={`login-block_switch__btn ${get(values, "type") === 2 ? "active" : ""}`}>
                ERI
              </button>
              {
                notUser &&
                <button
                  type={"button"}
                  onClick={() => {
                    resetForm();
                    setFieldValue("type", 3)
                  }}
                  className={`login-block_switch__btn ${get(values, "type") === 3 ? "active" : ""}`}>
                  Email
                </button>
              }
            </div>
            
            <div className="login-block-panel">
              {
                get(values, "type") === 1 || get(values, "type") === 3
                  ? <>
                    <label htmlFor={get(values, "type") === 3 ? "email" : "login"} className={"form-label d-block mt-3"}>
                      {get(values, "type") === 3 ? "Email" : "Login"}
                    </label>
                    <Field
                      className={`form-control custom-rounded-8 ${get(errors, get(values, "type") === 3 ? "email" : "login") && get(touched, get(values, "type") === 3 ? "email" : "login") && 'is-invalid'}`}
                      name={get(values, "type") === 3 ? "email" : "login"}
                      id={get(values, "type") === 3 ? "email" : "login"}
                      type={get(values, "type") === 3 ? "email" : "text"}
                      value={get(values, "type") === 3 ? get(values, "email") : get(values, "login")}
                    />
                    <ErrorMessage
                      name={get(values, "type") === 3 ? "email" : "login"}
                      render={() => (
                        <span className={"fs-12 text-danger"}>
                          Majburiy
                        </span>
                      )}
                    />
                    
                    <label htmlFor={"password"} className={"form-label d-block mt-3"}>
                      Parol
                    </label>
                    <Field
                      className={`form-control custom-rounded-8 ${get(errors, "password") && get(touched, "password") && 'is-invalid'}`}
                      name={"password"}
                      id={"password"}
                      type={"password"}
                      autoComplete="off"
                      value={get(values, "password")}
                    />
                    <ErrorMessage
                      name={"password"}
                      render={() => (
                        <span className={"fs-12 text-danger"}>
                          Majburiy
                        </span>
                      )}
                    />
                  </>
                  : <>
                    {
                      isLoading || isSubmitting
                        ? <div className={"mt-3 text-center fs-40"}><i
                          className={"fa-solid fa-spinner-third fa-spin fa-spin-reverse"}/></div>
                        : <Select
                          inputClassName={"border border-danger custom-rounded-8"}
                          options={data}
                          className={`mt-3 custom-react-select-element ${get(errors, "key") && get(touched, "key") && 'is-invalid'}`}
                          classNamePrefix={"custom-react-select"}
                          isOptionDisabled={(option) =>
                            dayjs(option.v.validTo).diff(
                              dayjs(),
                              "day",
                              true
                            ) <= 0
                          }
                          getOptionValue={(option) => option.itemId}
                          getOptionLabel={({v}) => (
                            <div
                              disabled={
                                dayjs(v.validTo).diff(dayjs(), "day", true) <= 0
                              }
                              className={
                                dayjs(v.validTo).diff(dayjs(), "day", true) <= 0
                                  ? "bg-danger text-white p-2"
                                  : ""
                              }
                            >
                              <div>
                                <span style={{fontWeight: 700}}>
                                  Sertifikat raqami:{" "}
                                </span>
                                {v.serialNumber}
                              </div>
                              <div>
                                <span style={{fontWeight: 700}}>
                                  STIR:{" "}
                                </span>
                                {v.TIN}{" "}
                                <span style={{fontWeight: 700}}>
                                  {["2", "3"].includes(v.TIN.charAt(0))
                                    ? `Yuridik shaxs`
                                    : `Jismoniy shaxs`}
                                </span>
                              </div>
                              <div>
                                <span style={{fontWeight: 700}}>
                                  F.I.Sh.:{" "}
                                </span>
                                {v.CN}
                              </div>
                              {v.O ? (
                                <div>
                                  <span style={{fontWeight: 700}}>
                                    Tashkilot:{" "}
                                  </span>
                                  {v.O}
                                </div>
                              ) : null}
                              {v?.expired ? (
                                <div style={{color: "red"}}>
                                  Amal qilish muddati{" "}
                                  {v.validFrom.ddmmyyyy()} -{" "}
                                  {v.validTo.ddmmyyyy()} da tugagan
                                </div>
                              ) : (
                                <div>
                                  <span style={{fontWeight: 700}}>
                                    Amal qilish muddati:{" "}
                                  </span>{" "}
                                  {v.validFrom.ddmmyyyy()} -{" "}
                                  {v.validTo.ddmmyyyy()}
                                </div>
                              )}
                            </div>
                          )}
                          onChange={(option) => {
                            setFieldValue("key", option)
                            setFieldValue("tin", ["2", "3"].includes(option?.v?.TIN?.charAt(0)) ? 1 : 2)
                          }}
                          onBlur={() => setFieldTouched("key")}
                          filterOption={customFilter}
                          components={{
                            SingleValue: ({
                                            children,
                                            data: {v},
                                            ...props
                                          }) => {
                              return (
                                <components.SingleValue {...props}>
                                  {v.TIN} - {v.CN} - {v.O}
                                </components.SingleValue>
                              );
                            },
                          }}
                          placeholder={<><i
                            className={`fa-light fa-key me-2 ${get(errors, "key") && get(touched, "key") ? 'text-danger' : 'text-606E80'}`}/>
                            <span
                              className={"text-181D25"}>ERI kalitini tanlang</span></>}
                          isSearchable
                          isClearable
                          escapeClearsValue
                        />
                    }
                    
                    
                    {
                      get(values, "key") && <div className={"mt-3"}>
                        <p className={"mb-0 text-181D25 fs-18"}><b>{get(values, "key.v.CN")}</b></p>
                        <small className={"fs-15 text-606E80"}>F.I.O</small>
                        
                        <div className="row mt-3">
                          <div className="col-md-6 pe-md-2">
                            <div className={"custom-border-dashed rounded px-12 py-10 mb-3"}>
                              <p className={"mb-0 text-181D25 fs-15"}>{get(values, "key.v.PINFL")}</p>
                              <p className={"mb-0 text-929FB1 fs-15"}>️JSHSHIR/PINFL</p>
                            </div>
                          </div>
                          <div className="col-md-6 ps-md-2">
                            <div className={"custom-border-dashed rounded px-12 py-10 mb-3"}>
                              <p className={"mb-0 text-181D25 fs-15"}>{get(values, "key.v.TIN")}</p>
                              <p className={"mb-0 text-929FB1 fs-15"}>INN</p>
                            </div>
                          </div>
                          <div className="col-md-6 pe-md-2">
                            <div className={"custom-border-dashed rounded px-12 py-10 mb-3"}>
                              <p
                                className={"mb-0 text-181D25 fs-15"}>{dayjs(get(values, "key.v.validFrom")).format("DD.MM.YY")}-{dayjs(get(values, "key.v.validTo")).format("DD.MM.YY")}</p>
                              <p className={"mb-0 text-929FB1 fs-15"}>Amal qilish sanasi</p>
                            </div>
                          </div>
                          <div className="col-md-6 ps-md-2">
                            <div className={"custom-border-dashed rounded px-12 py-10 mb-3"}>
                              <p
                                className={"mb-0 text-181D25 fs-15"}>{["2", "3"].includes(get(values, "key.v.TIN").charAt(0)) ? "Yuridik shaxs" : "Jismoniy shaxs"}</p>
                              <p className={"mb-0 text-929FB1 fs-15"}>Shaxs</p>
                            </div>
                          </div>
                          
                          <div className="col-12">
                            <div className={"custom-border-dashed rounded px-12 py-10"}>
                              <p
                                className={"mb-0 text-181D25 fs-15"}>{get(values, "key.v.O")}</p>
                              <p className={"mb-0 text-929FB1 fs-15"}>Tashkilot</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                    
                    <div className="form-check mt-3">
                      <Field
                        id={"save"}
                        name={"save"}
                        className={"form-check-input rounded-2"}
                        style={{
                          width: 20,
                          height: 20,
                          marginTop: 2.5
                        }}
                        type={"checkbox"}
                      />
                      <label className="form-check-label ms-2" htmlFor={"save"}>
                        Saqlash
                      </label>
                    </div>
                  </>
              }
            </div>
            <button type={"submit"} disabled={isSubmitting}
                    className="btn btn-primary w-100 custom-rounded-8 mt-4 py-2 fs-15 fw-500">
              {
                get(values, "type") === 1
                  ? "ONE ID orqali tizimga kirish"
                  : "Kirish"
              }
              
              {isSubmitting ? <i className={"fa-regular fa-spinner fa-spin-pulse ms-2"}/> : null}
            </button>
          </>
          }
        
        </MyForm>
      </div>
    </div>
  );
};

export default LoginSignIn;