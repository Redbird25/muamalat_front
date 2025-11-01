import React from 'react';
import SellerRegisterForm from "components/SellerRegisterForm";

const RegistrationSaler = () => {
  return (
    <div className={"container"}>
      <div className="row flex-lg-nowrap">
        <SellerRegisterForm/>
        {/*<MyForm
          className={"flex-fill"}
          fields={[
            {
              name: "legal_entity",
              value: "",
              required: true
            },
            {
              name: "oked",
              value: "",
              min: 4,
              max: 6,
              required: true
            },
            {
              name: "company_inn",
              value: "",
              min: 9,
              max: 9,
              required: true
            },
            {
              name: "business_type",
              value: "",
              required: true
            },
            {
              name: "phone_number",
              value: "",
              required: true,
              onSubmitValue: phone => phone.replaceAll(" ", "").replace("+", "")
            },
            {
              name: "conclusion_date",
              value: "",
              required: false
            },
            {
              name: "agreement_num",
              value: "",
              max: 10,
              required: false
            },
            {
              name: "surname",
              value: "",
              required: true
            },
            {
              name: "name",
              value: "",
              required: true
            },
            {
              name: "last_name",
              value: "",
              required: true
            },
            {
              name: "passport_company",
              value: [],
              type: "array",
              min: 1,
              required: true
            },
            {
              name: "license_company",
              value: [],
              type: "array",
              min: 1,
              required: true
            },
            {
              name: "command_company",
              value: [],
              type: "array",
              min: 1,
              required: true
            },
            {
              name: "company_account",
              value: [
                {
                  account_name: "",
                  bank_mfo: "",
                  oked: "",
                  legal_entity: "",
                }
              ],
              min: 1,
              type: "arrayOfObject",
              obj: (Yup) => {
                return {
                  account_name: Yup.string().required("Required").min(3),
                  bank_mfo: Yup.string().min(5).max(5).required("Required"),
                  oked: Yup.string().min(4).max(6).required("Required"),
                  // legal_entity: Yup.string().required("Required").min(3),
                }
              },
              required: true
            }
          ]}
          onSubmit={({values, setSubmitting}) => {
            dispatch(CREATE.request({
              url: "/seller-registration",
              name: "registrationSeller",
              values,
              cb: {
                success: (data) => {
                  dispatch(LOGIN.success({
                    ...data
                  }));
                  navigate("/dashboard/personal", {replace: true})
                },
                errors: (error) => {
                  toast.error(get(error, "message"), {
                    position: "top-right",
                    pauseOnHover: true
                  })
                  setSubmitting(false)
                },
                finally: () => {
                  setSubmitting(false)
                }
              }
            }))
          }}
        >
          {({values, touched, errors, setFieldValue, setFieldTouched, isSubmitting}) => {
            const error = {
              company_inn: "ИНН",
              business_type: "Форма бизнеса",
              phone_number: "Телефон",
              phone_number2: "Дополнительный номер телефона",
              conclusion_date: "Договор - дата заклочения",
              agreement_num: "Договор - номер",
              surname: "Фамилия",
              name: "Имя",
              last_name: "Отчество",
              account_name: "Название счёта",
              bank_mfo: "Код банка (МФО)",
              oked: "Код ОКЭД",
              legal_entity: "Наименование юрлица",
              passport_company: "Копия паспорта директора-(Фото)",
              Required: "Обязательно",
            }
            if (isSubmitting) {
              if (!isEmpty(errors)) {
                Object.entries(errors).forEach(([k, v], number) => {
                  if (v && Array.isArray(v)) {
                    v.forEach((item, i_number) => {
                      if (item) {
                        Object.entries(item).forEach(([k2, v2], num) => {
                          toast.error(
                            <div>
                              <b>Счёт № ({i_number + 1}) {error[k2]}: {error[v2]}</b>
                            </div>, {
                              toastId: num + number
                            })
                        })
                      }
                    })
                  } else {
                    toast.error(<div>
                      <b>{error[k]}: Обязательно</b>
                    </div>, {
                      toastId: number
                    })
                  }
                })
              }
            }
            return <>
              <div
                className="bg-gradient-custom-2 border border-bfbfda d-flex align-items-center custom-rounded-12 px-4 py-3 mt-lg-0 mt-3 mb-4">
                <img src={happy_icon} className="me-3" alt="happy"/>
                
                <div>
                  <p className="fw-600 mb-0">Аккаунт активирован</p>
                  
                  <p className="mb-0">Создайте свой первый магазин и начните работу</p>
                  
                  <button type="button" className="btn btn-menu custom-rounded-12 focus-none h-100 w-auto mt-1"
                          style={{minWidth: 175, minHeight: 50}}
                  >
                    <span className="bg-gradient-custom reverse custom-rounded-12"></span>
                    <span
                      className="position-relative d-flex align-items-center justify-content-center fs-17 fw-600 custom-zindex-2">
                  Отправить
                </span>
                  </button>
                </div>
              </div>
              
              <div className="bg-white p-3 custom-rounded-12 border-ebebeb border mb-4">
                <p className="fs-18 fw-600">Данные вашего бизнеса</p>
                
                <div className="row">
                  <div className="col-lg-4 col-md-6">
                    <div className="mb-3">
                      <label htmlFor="business_type" className="form-label fs-14 text-141316">Форма бизнеса</label>
                      <Field
                        className={`form-select border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "business_type")}`}
                        id={"business_type"}
                        as={"select"}
                        name={"business_type"}
                        placeholder="Форма бизнеса"
                        onChange={(val) => {
                          setFieldValue(`business_type`, val.target.value);
                        }}
                        onBlur={() => setFieldTouched(`business_type`, true)}
                        style={{minHeight: 50}}
                      >
                        <option value="1">ООО</option>
                        <option value="2">ИП</option>
                        <option value="3">ЯТТ</option>
                      </Field>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="mb-3">
                      <label htmlFor="legal_entity" className="form-label fs-14 text-141316">Наименование юрлица</label>
                      <Field
                        className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "legal_entity")}`}
                        id={"legal_entity"}
                        name={"legal_entity"}
                        placeholder="Наименование юрлица"
                        onChange={(val) => {
                          setFieldValue(`legal_entity`, val.target.value);
                        }}
                        onBlur={() => setFieldTouched(`legal_entity`, true)}
                        style={{minHeight: 50}}
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="mb-3">
                      <label htmlFor="phone_number" className="form-label fs-14 text-141316">Телефон</label>
                      <Field
                        className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "phone_number")}`}
                        component={InputPhone}
                        id={"phone_number"}
                        format={"+998 ## ### ## ##"}
                        type={"tel"}
                        name={"phone_number"}
                        placeholder="Телефон"
                        decimalScale={0}
                        allowLeadingZeros={true}
                        allowNegative={false}
                        isNumericString
                        allowEmptyFormatting
                        onValueChange={(val) => {
                          setFieldValue(`phone_number`, val.value);
                        }}
                        value={get(values, "phone_number")}
                        disabled
                        onBlur={() => setFieldTouched(`phone_number`, true)}
                        style={{minHeight: 50}}
                      />
                      <small className={"text-danger lh-15 d-inline-block mt-1"}>Iltimos sms kod bilan nomeringizni
                        tasdiqlang!</small>
                      
                      {
                        !checkUser
                          ? <button
                            type="button"
                            onClick={() => {
                              dispatch(METHOD.request({
                                url: "/seller-send-sms",
                                name: "phoneSmsSend",
                                values: {
                                  phone_number: `${get(values, "phone_number").replaceAll(" ", "").replace("+", "")}`
                                },
                                cb: {
                                  success: () => {
                                    setModal(true);
                                  },
                                  error: () => {
                                  
                                  },
                                  finally: () => {
                                  
                                  }
                                }
                              }))
                            }}
                            disabled={get(values, "phone_number").trim().length < 17}
                            className={`btn btn-menu ${get(values, "phone_number").trim().length < 17 ? "disabled" : ""} custom-rounded-12 focus-none h-100 w-100 mt-3`}
                            style={{minWidth: 270, minHeight: 50}}
                          >
                            <span className="bg-gradient-custom reverse custom-rounded-12"/>
                            <span
                              className="position-relative d-flex align-items-center justify-content-center fs-17 fw-600 custom-zindex-2">
                          Отправить код
                        </span>
                          </button>
                          : null
                      }
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="mb-3">
                      <label htmlFor="company_inn" className="form-label fs-14 text-141316">ИНН</label>
                      <Field
                        className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "company_inn")}`}
                        component={InputPhone}
                        id={"company_inn"}
                        name={"company_inn"}
                        placeholder="ИНН"
                        decimalScale={0}
                        allowLeadingZeros={true}
                        allowNegative={false}
                        isNumericString
                        onValueChange={(val) => {
                          setFieldValue(`company_inn`, val.value);
                        }}
                        onBlur={() => setFieldTouched(`company_inn`, true)}
                        style={{minHeight: 50}}
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="mb-3">
                      <label htmlFor="oked" className="form-label fs-14 text-141316">Код ОКЭД</label>
                      <Field
                        className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "oked")}`}
                        component={InputPhone}
                        id={"oked"}
                        name={"oked"}
                        placeholder="Код ОКЭД"
                        decimalScale={0}
                        allowLeadingZeros={true}
                        allowNegative={false}
                        isNumericString
                        onValueChange={(val) => {
                          setFieldValue(`oked`, val.value);
                        }}
                        onBlur={() => setFieldTouched(`oked`, true)}
                        style={{minHeight: 50}}
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="mb-3">
                      <label htmlFor="phone_number2" className="form-label fs-14 text-141316">Дополнительный номер
                        телефона</label>
                      <Field
                        className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "phone_number2")}`}
                        component={InputPhone}
                        id={"phone_number2"}
                        format={"+998 ## ### ## ##"}
                        type={"tel"}
                        name={"phone_number2"}
                        placeholder="Телефон"
                        decimalScale={0}
                        allowLeadingZeros={true}
                        allowNegative={false}
                        isNumericString
                        allowEmptyFormatting
                        onValueChange={(val) => {
                          setFieldValue(`phone_number2`, val.value);
                        }}
                        value={get(values, "phone_number2")}
                        onBlur={() => setFieldTouched(`phone_number2`, true)}
                        style={{minHeight: 50}}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div
                className={`bg-white p-3 custom-rounded-12 border-ebebeb border mb-4`}>
                <p className="fs-18 fw-600">Персональные данные руководителя</p>
                
                <div className="row">
                  <div className="col-lg-4 col-md-6">
                    <div className="mb-3">
                      <label htmlFor="surname" className="form-label fs-14 text-141316">Фамилия</label>
                      <Field
                        className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "surname")}`}
                        id={"surname"}
                        name={"surname"}
                        placeholder="Фамилия"
                        onChange={(val) => {
                          setFieldValue(`surname`, val.target.value);
                        }}
                        onBlur={() => setFieldTouched(`surname`, true)}
                        style={{minHeight: 50}}
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label fs-14 text-141316">Имя</label>
                      <Field
                        className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "name")}`}
                        id={"name"}
                        name={"name"}
                        placeholder="Имя"
                        onChange={(val) => {
                          setFieldValue(`name`, val.target.value);
                        }}
                        onBlur={() => setFieldTouched(`name`, true)}
                        style={{minHeight: 50}}
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="mb-3">
                      <label htmlFor="last_name" className="form-label fs-14 text-141316">Отчество</label>
                      <Field
                        className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "last_name")}`}
                        id={"last_name"}
                        name={"last_name"}
                        placeholder="Отчество"
                        onChange={(val) => {
                          setFieldValue(`last_name`, val.target.value);
                        }}
                        onBlur={() => setFieldTouched(`last_name`, true)}
                        style={{minHeight: 50}}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div
                className={`bg-white p-3 custom-rounded-12 border-ebebeb border mb-4`}>
                <p className="fs-18 fw-600"> Документы</p>
                
                <div className="row justify-content-center">
                  <div className="col-lg-4 col-md-6">
                    <div className="bg-f1f1f1 px-md-3 pt-md-3 pb-md-4 p-3 custom-rounded-12">
                      <p className={"text-141316 fw-600 mb-0"}>Копия паспорта директора</p>
                      
                      {
                        get(values, "passport_company").length
                          ? <>
                            <div className={"mb-3 mt-2"} onClick={() => {
                              const link = document.createElement('a');
                              link.href = URL.createObjectURL(get(values, 'passport_company.[0]', 0));
                              link.setAttribute('target', '_blank');
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}>
                              <div className={"bg-white rounded-pill px-3 w-auto d-inline-block"}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16"
                                     fill="none">
                                  <path fillRule="evenodd" clipRule="evenodd"
                                        d="M6.25673 2.24166C8.21854 0.363782 11.3906 0.363782 13.3524 2.24166C15.3265 4.13135 15.3265 7.20457 13.3524 9.09425L8.0537 14.1663C6.66032 15.5 4.40989 15.5 3.01651 14.1663C1.6108 12.8207 1.6108 10.6297 3.01651 9.28409L8.23898 4.28506C9.06392 3.49541 10.3927 3.49542 11.2177 4.28506C12.0549 5.08651 12.0549 6.39536 11.2177 7.19681L5.95709 12.2323C5.7576 12.4233 5.4411 12.4164 5.25015 12.2169C5.0592 12.0174 5.06612 11.7009 5.2656 11.5099L10.5262 6.47442C10.9521 6.06672 10.9521 5.41515 10.5262 5.00745C10.0879 4.58795 9.36871 4.58795 8.93046 5.00745L3.708 10.0065C2.71364 10.9583 2.71364 12.4921 3.708 13.4439C4.71468 14.4075 6.35552 14.4075 7.36221 13.4439L12.6609 8.37186C14.2237 6.87593 14.2237 4.45998 12.6609 2.96405C11.0858 1.45632 8.52333 1.45632 6.94821 2.96405L2.67875 7.05085C2.47927 7.2418 2.16276 7.23488 1.97181 7.0354C1.78086 6.83592 1.78778 6.51941 1.98727 6.32846L6.25673 2.24166Z"
                                        fill="#1C274C"/>
                                </svg>
                                
                                <span className={"ms-2 fs-12 text-141316"}>
                              <b
                                className={"me-2 text-decoration-underline"}>{get(values, "passport_company.[0].name")}</b>
                                  
                                  {filesize(get(values, 'passport_company.[0].size', 0))}
                            </span>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => {
                                setFieldValue("passport_company", [])
                              }}
                              type={"button"}
                              style={{background: "#333"}}
                              className={"btn text-white fw-600 fs-17 custom-rounded-12 focus-none w-lg-auto h-100 w-100"}>
                              Удалить
                            </button>
                          </>
                          : <>
                            <p className={"text-141316 fs-12"}>Форматы : (jpeg, jpg, png)</p>
                            
                            <label htmlFor={"passport_company"}
                                   className="btn btn-menu custom-rounded-12 focus-none h-100 w-lg-auto w-100">
                              <span className="bg-gradient-custom reverse custom-rounded-12"/>
                              <span
                                className="position-relative d-flex align-items-center justify-content-center fs-17 fw-600 custom-zindex-2">
                            Загрузить <i className={"fas fa-plus ms-3"}/>
                        </span>
                              <Field
                                id={"passport_company"}
                                name={"passport_company"}
                                type={"file"}
                                value={""}
                                onChange={(e) => {
                                  const file = e.target.files;
                                  setFieldValue("passport_company", [get(file, "[0]")])
                                }}
                                onBlur={() => setFieldTouched("passport_company", true)}
                                accept={".jpg, .jpeg, .png"}
                                className={"w-0 h-0 visually-hidden"}
                              />
                            </label>
                          </>
                      }
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 mt-md-0 mt-3">
                    <div className="bg-f1f1f1 px-md-3 pt-md-3 pb-md-4 p-3 custom-rounded-12">
                      <p className={"text-141316 fw-600 mb-0"}>Лицензия компании</p>
                      {
                        get(values, "license_company").length
                          ? <>
                            <div className={"mb-3 mt-2"} onClick={() => {
                              const link = document.createElement('a');
                              link.href = URL.createObjectURL(get(values, 'license_company.[0]', 0));
                              link.setAttribute('target', '_blank');
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}>
                              <div className={"bg-white rounded-pill px-3 w-auto d-inline-block"}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16"
                                     fill="none">
                                  <path fillRule="evenodd" clipRule="evenodd"
                                        d="M6.25673 2.24166C8.21854 0.363782 11.3906 0.363782 13.3524 2.24166C15.3265 4.13135 15.3265 7.20457 13.3524 9.09425L8.0537 14.1663C6.66032 15.5 4.40989 15.5 3.01651 14.1663C1.6108 12.8207 1.6108 10.6297 3.01651 9.28409L8.23898 4.28506C9.06392 3.49541 10.3927 3.49542 11.2177 4.28506C12.0549 5.08651 12.0549 6.39536 11.2177 7.19681L5.95709 12.2323C5.7576 12.4233 5.4411 12.4164 5.25015 12.2169C5.0592 12.0174 5.06612 11.7009 5.2656 11.5099L10.5262 6.47442C10.9521 6.06672 10.9521 5.41515 10.5262 5.00745C10.0879 4.58795 9.36871 4.58795 8.93046 5.00745L3.708 10.0065C2.71364 10.9583 2.71364 12.4921 3.708 13.4439C4.71468 14.4075 6.35552 14.4075 7.36221 13.4439L12.6609 8.37186C14.2237 6.87593 14.2237 4.45998 12.6609 2.96405C11.0858 1.45632 8.52333 1.45632 6.94821 2.96405L2.67875 7.05085C2.47927 7.2418 2.16276 7.23488 1.97181 7.0354C1.78086 6.83592 1.78778 6.51941 1.98727 6.32846L6.25673 2.24166Z"
                                        fill="#1C274C"/>
                                </svg>
                                
                                <span className={"ms-2 fs-12 text-141316"}>
                              <b
                                className={"me-2 text-decoration-underline"}>{get(values, "license_company.[0].name")}</b>
                                  
                                  {filesize(get(values, 'license_company.[0].size', 0))}
                            </span>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => {
                                setFieldValue("license_company", [])
                              }}
                              type={"button"}
                              style={{background: "#333"}}
                              className={"btn text-white fw-600 fs-17 custom-rounded-12 focus-none w-lg-auto h-100 w-100"}>
                              Удалить
                            </button>
                          </>
                          : <>
                            <p className={"text-141316 fs-12"}>Форматы : (jpeg, jpg, png)</p>
                            
                            <label htmlFor={"license_company"}
                                   className="btn btn-menu custom-rounded-12 focus-none h-100 w-lg-auto w-100">
                              <span className="bg-gradient-custom reverse custom-rounded-12"/>
                              <span
                                className="position-relative d-flex align-items-center justify-content-center fs-17 fw-600 custom-zindex-2">
                            Загрузить <i className={"fas fa-plus ms-3"}/>
                        </span>
                              <Field
                                id={"license_company"}
                                name={"license_company"}
                                type={"file"}
                                value={""}
                                onChange={(e) => {
                                  const file = e.target.files;
                                  setFieldValue("license_company", [get(file, "[0]")])
                                }}
                                onBlur={() => setFieldTouched("license_company", true)}
                                accept={".jpg, .jpeg, .png"}
                                className={"w-0 h-0 visually-hidden"}
                              />
                            </label>
                          </>
                      }
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 mt-lg-0 mt-3">
                    <div className="bg-f1f1f1 px-md-3 pt-md-3 pb-md-4 p-3 custom-rounded-12">
                      <p className={"text-141316 fw-600 mb-0"}>Приказ о назначении директора</p>
                      {
                        get(values, "command_company").length
                          ? <>
                            <div className={"mb-3 mt-2"} onClick={() => {
                              const link = document.createElement('a');
                              link.href = URL.createObjectURL(get(values, 'command_company.[0]', 0));
                              link.setAttribute('target', '_blank');
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}>
                              <div className={"bg-white rounded-pill px-3 w-auto d-inline-block"}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16"
                                     fill="none">
                                  <path fillRule="evenodd" clipRule="evenodd"
                                        d="M6.25673 2.24166C8.21854 0.363782 11.3906 0.363782 13.3524 2.24166C15.3265 4.13135 15.3265 7.20457 13.3524 9.09425L8.0537 14.1663C6.66032 15.5 4.40989 15.5 3.01651 14.1663C1.6108 12.8207 1.6108 10.6297 3.01651 9.28409L8.23898 4.28506C9.06392 3.49541 10.3927 3.49542 11.2177 4.28506C12.0549 5.08651 12.0549 6.39536 11.2177 7.19681L5.95709 12.2323C5.7576 12.4233 5.4411 12.4164 5.25015 12.2169C5.0592 12.0174 5.06612 11.7009 5.2656 11.5099L10.5262 6.47442C10.9521 6.06672 10.9521 5.41515 10.5262 5.00745C10.0879 4.58795 9.36871 4.58795 8.93046 5.00745L3.708 10.0065C2.71364 10.9583 2.71364 12.4921 3.708 13.4439C4.71468 14.4075 6.35552 14.4075 7.36221 13.4439L12.6609 8.37186C14.2237 6.87593 14.2237 4.45998 12.6609 2.96405C11.0858 1.45632 8.52333 1.45632 6.94821 2.96405L2.67875 7.05085C2.47927 7.2418 2.16276 7.23488 1.97181 7.0354C1.78086 6.83592 1.78778 6.51941 1.98727 6.32846L6.25673 2.24166Z"
                                        fill="#1C274C"/>
                                </svg>
                                
                                <span className={"ms-2 fs-12 text-141316"}>
                              <b
                                className={"me-2 text-decoration-underline"}>{get(values, "command_company.[0].name")}</b>
                                  
                                  {filesize(get(values, 'command_company.[0].size', 0))}
                            </span>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => {
                                setFieldValue("command_company", [])
                              }}
                              type={"button"}
                              style={{background: "#333"}}
                              className={"btn text-white fw-600 fs-17 custom-rounded-12 focus-none w-lg-auto h-100 w-100"}>
                              Удалить
                            </button>
                          </>
                          : <>
                            <p className={"text-141316 fs-12"}>Форматы : (jpeg, jpg, png)</p>
                            
                            <label htmlFor={"command_company"}
                                   className="btn btn-menu custom-rounded-12 focus-none h-100 w-lg-auto w-100">
                              <span className="bg-gradient-custom reverse custom-rounded-12"/>
                              <span
                                className="position-relative d-flex align-items-center justify-content-center fs-17 fw-600 custom-zindex-2">
                            Загрузить <i className={"fas fa-plus ms-3"}/>
                        </span>
                              <Field
                                id={"command_company"}
                                name={"command_company"}
                                type={"file"}
                                value={""}
                                onChange={(e) => {
                                  const file = e.target.files;
                                  setFieldValue("command_company", [get(file, "[0]")])
                                }}
                                onBlur={() => setFieldTouched("command_company", true)}
                                accept={".jpg, .jpeg, .png"}
                                className={"w-0 h-0 visually-hidden"}
                              />
                            </label>
                          </>
                      }
                    </div>
                  </div>
                </div>
              </div>
              
              <div
                className={"custom-rounded-12"}
                style={{
                  padding: "24px 36px",
                  border: "1px solid #BFBFDA",
                  background: "linear-gradient(90deg, #E1E1E8 0%, #FFF 100%)",
                }}
              >
                <div className="row justify-content-between">
                  <div className="w-lg-45">
                    <p className={"fs-18 fw-600 mb-2"}>Счёт №1</p>
                    
                    <label htmlFor="account_name" className="form-label fs-14 text-141316">Название
                      счёта*</label>
                    <Field
                      className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, `company_account.${0}.account_name`)}`}
                      id={`company_account.${0}.account_name`}
                      name={`company_account.${0}.account_name`}
                      value={get(values, `company_account.${0}.account_name`)}
                      placeholder="Название счёта"
                      onChange={(val) => {
                        setFieldValue(`company_account.${0}.account_name`, val.target.value);
                      }}
                      onBlur={() => setFieldTouched(`company_account.${0}.account_name`, true)}
                      style={{minHeight: 50}}
                    />
                    
                    <div className="row justify-content-between mt-3">
                      <div className="col-lg-6 mb-lg-0 mb-3">
                        <label htmlFor="bank_mfo" className="form-label fs-14 text-141316">Код банка (МФО)</label>
                        <Field
                          className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, `company_account.${0}.bank_mfo`)}`}
                          component={InputPhone}
                          id={`company_account.${0}.bank_mfo`}
                          name={`company_account.${0}.bank_mfo`}
                          value={get(values, `company_account.${0}.bank_mfo`)}
                          placeholder="Код банка (МФО)"
                          decimalScale={0}
                          allowLeadingZeros={true}
                          allowNegative={false}
                          isNumericString
                          onValueChange={(val) => {
                            setFieldValue(`company_account.${0}.bank_mfo`, val.value);
                          }}
                          onBlur={() => setFieldTouched(`company_account.${0}.bank_mfo`, true)}
                          style={{minHeight: 50}}
                        />
                      </div>
                      
                      <div className="col-lg-6 mb-lg-0 mb-3">
                        <label htmlFor="oked_0" className="form-label fs-14 text-141316">Код
                          ОКЭД</label>
                        <Field
                          className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, `company_account.${0}.oked`)}`}
                          component={InputPhone}
                          placeholder="Код банка (ОКЭД)"
                          id={`company_account.${0}.oked`}
                          name={`company_account.${0}.oked`}
                          value={get(values, `company_account.${0}.oked`)}
                          decimalScale={0}
                          allowLeadingZeros={true}
                          allowNegative={false}
                          isNumericString
                          onValueChange={(val) => {
                            setFieldValue(`company_account.${0}.oked`, val.value);
                          }}
                          onBlur={() => setFieldTouched(`company_account.${0}.oked`, true)}
                          style={{minHeight: 50}}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <p
                    className={"text-141316 fw-700 w-lg-auto my-lg-0 my-3 d-flex align-items-center justify-content-center"}>или</p>
                  
                  <div
                    className="w-lg-45 custom-rounded-12 p-3 d-flex flex-column justify-content-center"
                    style={{
                      border: "1px solid #EBEBEB",
                      background: "linear-gradient(90deg, #B7B7FF 0%, #E5E5FF 100%)"
                    }}
                  >
                    <div className="row align-items-center">
                      <div className="w-lg-20 mb-lg-0 mb-3">
                        <img className={"w-100"} height={200} style={{objectFit: "contain"}} src={cart_company}
                             alt="cart"/>
                      </div>
                      
                      <div className="w-lg-80">
                        <p style={{letterSpacing: "-0.078px"}} className={"fs-20 fw-600 lh-26 mb-1"}>Торгуйте первый
                          месяц без комиссии</p>
                        
                        <p className={"fs-15 text-75758b"}>с расчётным счётом в Kapitalbank</p>
                        
                        <button
                          type={"button"}
                          className={"btn bg-white custom-rounded-8 fs-17 text-212640 fw-600 px-4"}
                          onClick={()=> navigate("/dashboard/company/create-account")}
                        >
                          Открыть счёт
                        </button>
                      </div>
                    </div>
                  
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-3 custom-rounded-12 border-ebebeb border my-4">
                <p className="fs-18 fw-600"> Локация</p>
                
                <div className="row">
                  <div className="col-xl-3 col-md-6 mb-3">
                    <label className={"form-label"} htmlFor="region_id">Область*</label>
                    
                    <Field
                      id={"region_id"}
                      name={"region_id"}
                      as={"select"}
                      style={{minHeight: 50}}
                      className={"form-select border-f0f1f2 custom-rounded-12 focus-none "}
                    >
                      <option value="">Выберите</option>
                      <option value="1">Ташкент</option>
                      <option value="2">Самарканд</option>
                    </Field>
                  </div>
                  
                  <div className="col-xl-3 col-md-6 mb-3">
                    <label className={"form-label"} htmlFor="district_id">Район*</label>
                    
                    <Field
                      id={"district_id"}
                      name={"district_id"}
                      as={"select"}
                      style={{minHeight: 50}}
                      className={"form-select border-f0f1f2 custom-rounded-12 focus-none "}
                    >
                      <option value="">Выберите</option>
                      <option value="1">Юнусабад</option>
                      <option value="2">Чиланзор</option>
                    </Field>
                  </div>
                  
                  <div className="col-xl-3 col-md-6 mb-3">
                    <label className={"form-label"} htmlFor="street">Улица / Населённый пункт</label>
                    <Field
                      id={"street"}
                      name={"street"}
                      type={"text"}
                      placeholder={"Улица"}
                      style={{minHeight: 50}}
                      className={"form-control border-f0f1f2 custom-rounded-12 focus-none"}
                    />
                  </div>
                  
                  <div className="col-xl-3 col-md-6 mb-3">
                    <label className={"form-label"} htmlFor="house">Дом</label>
                    <Field
                      id={"house"}
                      name={"house"}
                      type={"text"}
                      placeholder={"Дом"}
                      style={{minHeight: 50}}
                      className={"form-control border-f0f1f2 custom-rounded-12 focus-none"}
                    />
                  </div>
                  
                  <div className="col-12 text-center">
                    <YandexMap
                      lat={values["map_lt"]}
                      long={values["map_ln"]}
                      language={"ru"}
                      onClick={(coords) => {
                        setFieldValue('map_lt', coords[0])
                        setFieldValue('map_ln', coords[1])
                      }}
                    />
                    
                    <button
                      type={"button"}
                      style={{minHeight: 47}}
                      className={"btn bg-75758b px-4 fs-17 fw-600 custom-rounded-12 text-white mt-3 mb-3 focus-none"}
                      onClick={()=> navigate("/dashboard/company/commissioner")}
                    >
                      Пройти на страницу Комиссионер
                    </button>
                  </div>
                </div>
              </div>
              
              <div className={"text-end mt-4"}>
                <button type="submit"
                        disabled={!checkUser || isSubmitting}
                        className={`btn btn-menu custom-rounded-12 focus-none mb-4 w-auto ${isSubmitting ? "disabled" : ""}`}
                        style={{minWidth: 320, height: 50}}
                >
                  <span className="bg-gradient-custom reverse custom-rounded-12"/>
                  <span
                    className="position-relative d-flex align-items-center justify-content-center fs-17 fw-600 custom-zindex-2">
                Отправить для рассмотрение
              </span>
                </button>
              </div>
              
              <div className="bg-white p-3 custom-rounded-12 border-ebebeb border mb-4">
                <p className="fs-18 fw-600">Персональные данные</p>
                
                <div className="row">
                  <div className="col-lg-3 col-md-6">
                    <div className="mb-3">
                      <label htmlFor="surname" className="form-label fs-14 text-141316">Фамилия</label>
                      <Field
                        className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "surname")}`}
                        id={"surname"}
                        name={"surname"}
                        placeholder="Фамилия"
                        onChange={(val) => {
                          setFieldValue(`surname`, val.target.value);
                        }}
                        onBlur={() => setFieldTouched(`surname`, true)}
                        style={{minHeight: 50}}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label fs-14 text-141316">Имя</label>
                      <Field
                        className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "name")}`}
                        id={"name"}
                        name={"name"}
                        placeholder="Имя"
                        onChange={(val) => {
                          setFieldValue(`name`, val.target.value);
                        }}
                        onBlur={() => setFieldTouched(`name`, true)}
                        style={{minHeight: 50}}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="mb-3">
                      <label htmlFor="last_name" className="form-label fs-14 text-141316">Отчество</label>
                      <Field
                        className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "last_name")}`}
                        id={"last_name"}
                        name={"last_name"}
                        placeholder="Отчество"
                        onChange={(val) => {
                          setFieldValue(`last_name`, val.target.value);
                        }}
                        onBlur={() => setFieldTouched(`last_name`, true)}
                        style={{minHeight: 50}}
                      />
                    </div>
                  </div>
                  
                  <div className="col-lg-3 col-md-6">
                    <div className="mb-3">
                      <label htmlFor="phone_number" className="form-label fs-14 text-141316">Телефон</label>
                      <Field
                        className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "phone_number")}`}
                        component={InputPhone}
                        id={"phone_number"}
                        format={"+998 ## ### ## ##"}
                        type={"tel"}
                        name={"phone_number"}
                        placeholder="Телефон"
                        decimalScale={0}
                        allowLeadingZeros={true}
                        allowNegative={false}
                        isNumericString
                        allowEmptyFormatting
                        onValueChange={(val) => {
                          setFieldValue(`phone_number`, val.formattedValue);
                        }}
                        disabled={checkUser}
                        onBlur={() => setFieldTouched(`phone_number`, true)}
                        style={{minHeight: 50}}
                      />
                      <small className={"text-danger"}>Iltimos sms kod bilan nomeringizni tasdiqlang!</small>
                      {
                        !checkUser
                          ? <button
                            type="button"
                            onClick={() => {
                              dispatch(METHOD.request({
                                url: "/seller-send-sms",
                                name: "phoneSmsSend",
                                values: {
                                  phone_number: `${get(values, "phone_number").replaceAll(" ", "").replace("+", "")}`
                                },
                                cb: {
                                  success: () => {
                                    setModal(true);
                                  },
                                  error: () => {
                                  
                                  },
                                  finally: () => {
                                  
                                  }
                                }
                              }))
                            }}
                            disabled={get(values, "phone_number").trim().length < 17}
                            className={`btn btn-menu ${get(values, "phone_number").trim().length < 17 ? "disabled" : ""} custom-rounded-12 focus-none h-100 w-100 mt-3`}
                            style={{minWidth: 270, minHeight: 50}}
                          >
                            <span className="bg-gradient-custom reverse custom-rounded-12"/>
                            <span
                              className="position-relative d-flex align-items-center justify-content-center fs-17 fw-600 custom-zindex-2">
                          Отправить код
                        </span>
                          </button>
                          : null
                      }
                    
                    </div>
                  </div>
                </div>
              </div>
              
              <div
                className={`bg-white p-3 custom-rounded-12 border-ebebeb border mb-4`}>
                <p className="fs-18 fw-600">Договор</p>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="agreement_num" className="form-label fs-14 text-141316">Номер</label>
                      <Field
                        className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "agreement_num")}`}
                        component={InputPhone}
                        id={"agreement_num"}
                        name={"agreement_num"}
                        placeholder="Номер"
                        decimalScale={0}
                        allowLeadingZeros={true}
                        allowNegative={false}
                        isNumericString
                        onValueChange={(val) => {
                          setFieldValue(`agreement_num`, val.value);
                        }}
                        onBlur={() => setFieldTouched(`agreement_num`, true)}
                        style={{minHeight: 50}}
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="mb-3">
                      <p className="form-label fs-14 text-141316">Дата заклочения</p>
                      
                      <DatePicker
                        wrapperClassName={"w-100"}
                        selected={values["conclusion_date"]}
                        onChange={(date) => setFieldValue(`conclusion_date`, date)}
                        customInput={<div
                          style={{minHeight: 50}}
                          className={`form-control border-f0f1f2 custom-rounded-12 ${errorClass(errors, touched, "conclusion_date")} focus-none d-flex-between-center ${get(values, `conclusion_date`, "") ? "text-181D25" : "text-B0BECB"}`}>
                          {get(values, `conclusion_date`, "") ? dayjs(get(values, `conclusion_date`, "")).format("DD/MM/YYYY") : "Дата заклочения"}
                          <i
                            className={`hgi hgi-stroke hgi-calendar-03 text-929FB1 ${get(values, `conclusion_date`, "") ? "mr-30" : ""}`}/>
                        
                        </div>}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              
              <div
                className={`bg-white p-3 custom-rounded-12 border-ebebeb border mb-4`}>
                <p className="fs-18 fw-600">Реквизиты</p>
                
                <div className="row">
                  <div className="col-lg-3 col-md-6">
                    <div className="mb-3">
                      <label htmlFor="business_type" className="form-label fs-14 text-141316">Форма бизнеса</label>
                      <Field
                        className={`form-select border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "business_type")}`}
                        id={"business_type"}
                        as={"select"}
                        name={"business_type"}
                        placeholder="Форма бизнеса"
                        onChange={(val) => {
                          setFieldValue(`business_type`, val.target.value);
                        }}
                        onBlur={() => setFieldTouched(`business_type`, true)}
                        style={{minHeight: 50}}
                      >
                        <option value="" hidden>Форма бизнеса</option>
                        <option value="1">ООО</option>
                        <option value="2">ИП</option>
                        <option value="3">ЯТТ</option>
                      </Field>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="mb-3">
                      <label htmlFor="legal_entity" className="form-label fs-14 text-141316">Наименование юрлица</label>
                      <Field
                        className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "legal_entity")}`}
                        id={"legal_entity"}
                        name={"legal_entity"}
                        placeholder="Наименование юрлица"
                        onChange={(val) => {
                          setFieldValue(`legal_entity`, val.target.value);
                        }}
                        onBlur={() => setFieldTouched(`legal_entity`, true)}
                        style={{minHeight: 50}}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="mb-3">
                      <label htmlFor="company_inn" className="form-label fs-14 text-141316">ИНН</label>
                      <Field
                        className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "company_inn")}`}
                        component={InputPhone}
                        id={"company_inn"}
                        name={"company_inn"}
                        placeholder="ИНН"
                        decimalScale={0}
                        allowLeadingZeros={true}
                        allowNegative={false}
                        isNumericString
                        onValueChange={(val) => {
                          setFieldValue(`company_inn`, val.value);
                        }}
                        onBlur={() => setFieldTouched(`company_inn`, true)}
                        style={{minHeight: 50}}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="mb-3">
                      <label htmlFor="oked" className="form-label fs-14 text-141316">Код ОКЭД</label>
                      <Field
                        className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "oked")}`}
                        component={InputPhone}
                        id={"oked"}
                        name={"oked"}
                        placeholder="Код ОКЭД"
                        decimalScale={0}
                        allowLeadingZeros={true}
                        allowNegative={false}
                        isNumericString
                        onValueChange={(val) => {
                          setFieldValue(`oked`, val.value);
                        }}
                        onBlur={() => setFieldTouched(`oked`, true)}
                        style={{minHeight: 50}}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div
                className={`bg-white p-3 custom-rounded-12 border-ebebeb border mb-4`}>
                <p className="fs-18 fw-600 mb-0">Расчётные счета</p>
                <p className="fs-12">Можно добавить до 5 расчётных счетов</p>
                <FieldArray
                  name={"company_account"}
                  render={() => {
                    return <div className="p-3 border border-d9d9d9 custom-rounded-12">
                      <p className="fs-18 fw-600 mb-0">Счёт №1</p>
                      {
                        (
                          get(values, "company_account", []).length
                            ? get(values, "company_account", [])
                            : [""]
                        ).map((item, key) => (
                          <div className="row" key={key}>
                            <div className="col-lg-4 col-md-6 mb-lg-0 mb-3">
                              <label htmlFor="account_name" className="form-label fs-14 text-141316">Название
                                счёта</label>
                              <Field
                                className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, `company_account.${key}.account_name`)}`}
                                id={`company_account.${key}.account_name`}
                                name={`company_account.${key}.account_name`}
                                value={get(values, `company_account.${key}.account_name`)}
                                placeholder="Название счёта"
                                onChange={(val) => {
                                  setFieldValue(`company_account.${key}.account_name`, val.target.value);
                                }}
                                onBlur={() => setFieldTouched(`company_account.${key}.account_name`, true)}
                                style={{minHeight: 50}}
                              />
                            </div>
                            
                            <div className="col-lg-4 col-md-6 mb-lg-0 mb-3">
                              <label htmlFor="bank_mfo" className="form-label fs-14 text-141316">Код банка (МФО)</label>
                              <Field
                                className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, `company_account.${key}.bank_mfo`)}`}
                                component={InputPhone}
                                id={`company_account.${key}.bank_mfo`}
                                name={`company_account.${key}.bank_mfo`}
                                value={get(values, `company_account.${key}.bank_mfo`)}
                                placeholder="Код банка (МФО)"
                                decimalScale={0}
                                allowLeadingZeros={true}
                                allowNegative={false}
                                isNumericString
                                onValueChange={(val) => {
                                  setFieldValue(`company_account.${key}.bank_mfo`, val.value);
                                }}
                                onBlur={() => setFieldTouched(`company_account.${key}.bank_mfo`, true)}
                                style={{minHeight: 50}}
                              />
                            </div>
                            
                            <div className="col-lg-4 col-md-6 mb-lg-0 mb-3">
                              <label htmlFor="oked_0" className="form-label fs-14 text-141316">Код
                                ОКЭД</label>
                              <Field
                                className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, `company_account.${key}.oked`)}`}
                                component={InputPhone}
                                placeholder="Код банка (МФО)"
                                id={`company_account.${key}.oked`}
                                name={`company_account.${key}.oked`}
                                value={get(values, `company_account.${key}.oked`)}
                                decimalScale={0}
                                allowLeadingZeros={true}
                                allowNegative={false}
                                isNumericString
                                onValueChange={(val) => {
                                  setFieldValue(`company_account.${key}.oked`, val.value);
                                }}
                                onBlur={() => setFieldTouched(`company_account.${key}.oked`, true)}
                                style={{minHeight: 50}}
                              />
                            </div>
                            
                            <div className="col-lg-3 col-md-6 mb-lg-0 mb-3">
                              <label htmlFor="legal_entity_0" className="form-label fs-14 text-141316">Наименование
                                юрлица</label>
                              <Field
                                className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, `company_account.${key}.legal_entity`)}`}
                                id={`company_account.${key}.legal_entity`}
                                name={`company_account.${key}.legal_entity`}
                                value={get(values, `company_account.${key}.legal_entity`)}
                                placeholder="Наименование юрлица"
                                onChange={(val) => {
                                  setFieldValue(`company_account.${key}.legal_entity`, val.target.value);
                                }}
                                onBlur={() => setFieldTouched(`company_account.${key}.legal_entity`, true)}
                                style={{minHeight: 50}}
                              />
                            </div>
                          </div>
                        ))
                      }
                    
                    </div>
                  }}
                />
                
                
                {
                  checkUser
                    ? <button type="submit"
                              disabled={isSubmitting}
                              className={`btn btn-menu custom-rounded-12 focus-none h-100 w-auto mt-3 ${isSubmitting ? "disabled" : ""}`}
                              style={{minWidth: 270, minHeight: 50}}
                    >
                      <span className="bg-gradient-custom reverse custom-rounded-12"></span>
                      <span
                        className="position-relative d-flex align-items-center justify-content-center fs-17 fw-600 custom-zindex-2">
                Отправить
              </span>
                    </button>
                    : null
                }
              
              </div>
              
              <Modal
                isOpen={!!isModal}
                position={"center"}
                modalContentClass={"modal-content custom-rounded-20 shadow"}
                onClose={() => {
                  setCode("");
                  setModal(false);
                }}
              >
                <div className="modal-body" style={{padding: "0 12px"}}>
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
                        dispatch(METHOD.request({
                          url: "/seller-check-code",
                          name: "verificationCode",
                          values: {
                            phone_number: `${get(values, "phone_number").replaceAll(" ", "").replace("+", "")}`,
                            number: code
                          },
                          cb: {
                            success: () => {
                              setCheckUser(true);
                              setModal(false);
                              setCode("");
                            },
                            error: () => {
                            
                            },
                            finally: () => {
                            
                            }
                          }
                        }))
                      }}
                    >
                      <span className="bg-gradient-custom reverse custom-rounded-8"></span>
                      <span className="position-relative custom-zindex-2">
                      Подвердить
                    </span>
                    </button>
                  </div>
                  
                  <p className="text-center text-334150">
                    Если код не придёт, можно получить новый <br/>через <span id="phone-timer">{count}</span> сек
                  </p>
                </div>
              
              </Modal>
            </>
          }}
        
        </MyForm>*/}
      </div>
    
    </div>
  )
    ;
};

export default RegistrationSaler;
