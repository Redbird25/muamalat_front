import React, {useState} from 'react';
import {Link} from "react-router-dom";
import {get} from "lodash";
import config from "../../config";
import InputPhone from "../../components/Fields/InputPhone";
// import card_1 from "assets/images/icon/card-1.svg"
// import card_2 from "assets/images/icon/card-2.svg"
// import card_3 from "assets/images/icon/card-3.svg"
// import card_4 from "assets/images/icon/card-4.svg"
import MyForm from "../../schema/Form";
import {Field} from "formik";
import errorClass from "../../services/ErrorClass";
import {CREATE} from "../../schema/actions";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {LoadOne} from "../../schema/container";
import {Spinner} from "../../components";
import RecommendProducts from "../../components/RecommendProducts";
import YandexMap from "../../components/YandexMap";
import {LOGIN} from "../../redux/actions";

const BasketOrder = () => {
  const {auth, system: {products}} = useSelector(state => state);
  const dispatch = useDispatch();
  const [countData, setCount] = useState(0);
  const [priceData, setPrice] = useState(0);
  const [isComplete, setComplete] = useState(false);

  return (
    <div className={"container mb-3"}>
      <nav className={"clear-before"} aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fs-14 fw-500">
            <Link className="text-75758b text-decoration-none"
                  to="/">Главная</Link>
          </li>
          <li className="breadcrumb-item clear-before fs-14 fw-500 text-75758b active">
            <Link className="text-75758b text-decoration-none"
                  to="/basket">
              <i
                className="fas fa-chevron-right fs-12 me-1"/> Корзина</Link>
          </li>
          <li className="breadcrumb-item clear-before fs-14 fw-500 text-75758b active"><i
            className="fas fa-chevron-right fs-12 me-1"/> Оформить заказ
          </li>
        </ol>
      </nav>


      {
        isComplete
          ? <div className={"min-vh-50 d-flex-column-center-center"}>

            <h1 className={"text-center lh-32 fs-32 fw-600"}>Заказ принята</h1>
            <p>Вы можете еще заказать мы будем рад принят ваш заказ ❤️️</p>

            <Link to={"/"} className="btn btn-menu focus-none h-100" style={{minWidth: 300}}>
              <span className="bg-gradient-custom reverse"/>
              <span className="position-relative custom-zindex-2">
                        К товарам
              <i className="far fa-long-arrow-alt-right ms-lg-2 ms-3"/>
            </span>
            </Link>

          </div>
          : <>
            <p className="fs-32 text-greyscale800 fw-700">Корзина
              ({!get(auth, "isAuthenticated") ? Object.values(products).filter(item => get(item, "cart")).length : countData})</p>
            <MyForm
              className="row mb-6"
              fields={[
                {
                  name: "user_name",
                  value: "",
                  required: true
                },
                {
                  name: "user_surname",
                  value: "",
                  required: true
                },
                {
                  name: "user_phone",
                  value: "",
                  required: true
                },
                {
                  name: "additional_phone_number",
                  value: "",
                  required: true
                },
                {
                  name: "user_type_delivery",
                  value: 1,
                  type: "number",
                  required: true
                },
                {
                  name: "user_region",
                  value: "",
                  required: true
                },
                {
                  name: "user_district",
                  value: "",
                  required: true
                },
                {
                  name: "user_address",
                  value: "",
                  required: true
                },
                {
                  name: "user_floor",
                  value: "",
                  required: false
                },
                {
                  name: "user_type_payment",
                  value: 1,
                  required: true
                },
                {
                  name: "map_lt",
                  value: undefined,
                  required: false,
                },
                {
                  name: "map_ln",
                  value: undefined,
                  required: false,
                },
              ]}
              onSubmit={({values, setSubmitting}) => {
                values = {
                  phone_number: get(values, "user_phone"),
                  additional_phone_number: get(values, "additional_phone_number"),
                  first_name: get(values, "user_name"),
                  last_name: get(values, "user_surname"),
                  order_type: get(values, "user_type_delivery"),
                  region_id: get(values, "user_region"),
                  district_id: get(values, "user_district"),
                  address: get(values, "user_address"),
                  floor: get(values, "user_floor"),
                  payment_type: get(values, "user_type_payment")
                }

                dispatch(CREATE.request({
                  url: "/client/create-order",
                  name: "createOrderClient",
                  values,
                  cb: {
                    success: () => {
                      setComplete(true);
                      dispatch(LOGIN.success({
                        update_login: true,
                        count: 0
                      }));
                    },
                    errors: (error) => {
                      toast.error(get(error, "message"), {
                        position: "top-right",
                        pauseOnHover: true
                      })
                    },
                    finally: () => {
                      setSubmitting(false);
                    }
                  }
                }))
              }}
            >
              {({values, touched, errors, setFieldValue, setFieldTouched, isSubmitting}) => {
                return <>
                  <div className="col-lg-8">
                    <div className="bg-white custom-rounded-20 p-3">
                      <div className="col-12">
                        <p className="fs-32 text-greyscale800 fw-700 mb-2">Оформить заказ ID: 1</p>

                        <p className="fw-500 text-75758b mb-0">Создано 12 декабря 2024 г. в 14:48</p>

                        <div className="border-top border-d4d8e4 my-3"></div>

                        <p className="fs-24 fw-700 text-greyscale800">Выбранные
                          товары&nbsp;({!get(auth, "isAuthenticated") ? Object.values(products).filter(item => get(item, "cart")).length : countData})</p>
                      </div>

                      {
                        Object.values(products).filter(item => get(item, "cart")).length && !get(auth, "isAuthenticated")
                          ? Object.values(products).filter(item => get(item, "cart")).map((item, number) => {
                            return <div key={number} className={`col-12 ${number !== 0 ? "mt-3" : ""}`}>
                              <div className="border custom-rounded-12 p-3">
                                <div className="row">
                                  <div className="col-xxl-1 col-xl-2 d-flex align-items-center justify-content-center">
                                    <img className={"w-100"} src={config.FILE_ROOT + get(item, "main_image")} alt="phone"/>
                                  </div>

                                  <div className="col-xxl-10 mt-xl-0 mt-3 col-xl-10">
                                    <div className="d-flex align-items-center justify-content-between flex-wrap">
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
                                  </div>
                                </div>
                              </div>
                            </div>
                          })
                          : <LoadOne
                            url={"/client/basket-products"}
                            name={"cartProductsClientOrder"}
                            params={{
                              perPage: 15
                            }}
                            onSuccess={(data) => {
                              setCount(get(data, "products", []).length)
                              setPrice(get(data, "products", []).reduce((acc, curr) => parseInt(acc) + (parseInt(get(curr, "price")) * parseInt(get(curr, "count"))), 0))
                            }}
                          >
                            {({isFetched, data = []}) => {
                              if (!isFetched)
                                return <Spinner center/>
                              else if (isFetched && get(data, "products", []).length)
                                return get(data, "products").map((item, number) => {
                                  return <div key={number} className={`col-12 ${number !== 0 ? "mt-3" : ""}`}>
                                    <div className="border custom-rounded-12 p-3">
                                      <div className="row">
                                        <div
                                          className="col-xxl-1 col-xl-2 d-flex align-items-center justify-content-center">
                                          <img className={"w-100"} src={config.FILE_ROOT + get(item, "main_image")}
                                               alt="phone"/>
                                        </div>

                                        <div className="col-xxl-10 mt-xl-0 mt-3 col-xl-10">
                                          <div className="d-flex align-items-center justify-content-between flex-wrap">
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
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                })
                              else
                                return "Ma'lumot topilmadi"
                            }}
                          </LoadOne>
                      }
                    </div>

                    <div
                      className="bg-white custom-rounded-20 p-3 mt-3"
                    >
                      <div className="d-flex align-items-center mb-2">
                        <div>
                          <div className="text-white mb-1 bg-374957 custom-rounded-4 text-center me-2 fs-14"
                               style={{
                                 width: 20,
                                 height: 20
                               }}
                          >
                            1
                          </div>
                        </div>

                        <p className="fs-20 mb-1 fw-600">Ваши данные</p>
                      </div>

                      <div className="row">
                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label htmlFor="user_name" className="form-label mb-1 text-141316 fs-14 fw-600">Имя&nbsp;<span
                              className={"text-danger"}>*</span></label>
                            <Field
                              type="text"
                              className={`form-control focus-none custom-rounded-12 ${errorClass(errors, touched, "user_name")}`}
                              id={"user_name"}
                              name={"user_name"}
                              value={get(values, "user_name")}
                              placeholder="Введите имя"
                              style={{minHeight: 50}}
                            />
                          </div>
                        </div>

                        <div className="col-xl-5 col-lg-6">
                          <div className="mb-3">
                            <label htmlFor="user_surname"
                                   className="form-label mb-1 text-141316 fs-14 fw-600">Фамилия <span
                              className={"text-danger"}>*</span></label>
                            <Field
                              type="text"
                              className={`form-control focus-none custom-rounded-12 ${errorClass(errors, touched, "user_surname")}`}
                              id={"user_surname"}
                              name={"user_surname"}
                              value={get(values, "user_surname")}
                              placeholder="Введите фамилия"
                              style={{minHeight: 50}}
                            />
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <label htmlFor="user_phone" className="form-label mb-1 text-141316 fs-14 fw-600">Телефон&nbsp;
                            <span
                              className={"text-danger"}>*</span></label>
                          <Field
                            className={`form-control custom-rounded-12 focus-none ${errorClass(errors, touched, "user_phone")}`}
                            component={InputPhone}
                            id={"user_phone"}
                            format={"+998 ## ### ## ##"}
                            type={"tel"}
                            name={"user_phone"}
                            value={get(values, "user_phone")}
                            placeholder="Телефон"
                            decimalScale={0}
                            allowLeadingZeros={true}
                            allowNegative={false}
                            isNumericString
                            allowEmptyFormatting
                            onValueChange={(val) => {
                              setFieldValue(`user_phone`, val.value);
                            }}
                            onBlur={() => setFieldTouched(`user_phone`, true)}
                            style={{minHeight: 50}}
                          />
                        </div>

                        <div className="col-lg-6 mt-lg-0 mt-3">
                          <label htmlFor="additional_phone_number" className="form-label mb-1 text-141316 fs-14 fw-600">Доп.
                            телефон&nbsp;<span
                              className={"text-danger"}>*</span></label>
                          <Field
                            className={`form-control custom-rounded-12 focus-none ${errorClass(errors, touched, "additional_phone_number")}`}
                            component={InputPhone}
                            id={"additional_phone_number"}
                            format={"+998 ## ### ## ##"}
                            type={"tel"}
                            name={"additional_phone_number"}
                            value={get(values, "additional_phone_number")}
                            placeholder="Телефон"
                            decimalScale={0}
                            allowLeadingZeros={true}
                            allowNegative={false}
                            isNumericString
                            allowEmptyFormatting
                            onValueChange={(val) => {
                              setFieldValue(`additional_phone_number`, val.value);
                            }}
                            onBlur={() => setFieldTouched(`additional_phone_number`, true)}
                            style={{minHeight: 50}}
                          />
                        </div>

                        <div className="col-12 mt-1">
                          <small className="fs-12 text-334150">
                            <svg style={{transform: "translateY(-2px)"}} xmlns="http://www.w3.org/2000/svg" width="16"
                                 height="16" viewBox="0 0 16 16"
                                 fill="none">
                              <path fillRule="evenodd" clipRule="evenodd"
                                    d="M1.33301 8.00004C1.33301 4.31814 4.31778 1.33337 7.99967 1.33337C11.6816 1.33337 14.6663 4.31814 14.6663 8.00004C14.6663 11.6819 11.6816 14.6667 7.99967 14.6667C4.31778 14.6667 1.33301 11.6819 1.33301 8.00004ZM7.99967 5.33337C8.36786 5.33337 8.66634 5.0349 8.66634 4.66671C8.66634 4.29852 8.36786 4.00004 7.99967 4.00004C7.63148 4.00004 7.33301 4.29852 7.33301 4.66671C7.33301 5.0349 7.63148 5.33337 7.99967 5.33337ZM7.99967 6.66671C8.36786 6.66671 8.66634 6.96518 8.66634 7.33337V11.3334C8.66634 11.7016 8.36786 12 7.99967 12C7.63148 12 7.33301 11.7016 7.33301 11.3334V8.00004C6.96482 8.00004 6.66634 7.70156 6.66634 7.33337C6.66634 6.96518 6.96482 6.66671 7.33301 6.66671H7.99967Z"
                                    fill="#39C7A5"/>
                            </svg>

                            Мы отправим статус доставки по SMS на этот номер, и курьер свяжется с этим номером,
                            когда товар будет доставлен.
                          </small>
                        </div>
                      </div>

                      <div className="d-flex align-items-center mt-4 mb-3">
                        <div>
                          <div className="text-white mb-1 bg-374957 custom-rounded-4 text-center me-2 fs-14"
                               style={{
                                 width: 20,
                                 height: 20
                               }}>
                            2
                          </div>
                        </div>

                        <p className="fs-20 mb-1 fw-600">Способ получения</p>
                      </div>

                      <div className="row">
                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label htmlFor="user_type_delivery_1"
                                   className="form-label position-relative w-100 custom-rounded-12 border mb-0 d-flex align-items-center text-75758b fs-14 fw-600"
                                   style={{minHeight: 50, padding: "6px 12px"}}
                            >
                              Доставка
                              <Field
                                type="radio"
                                name="user_type_delivery"
                                checked={get(values, "user_type_delivery") === 1}
                                value={get(values, "user_type_delivery")}
                                onChange={() => setFieldValue("user_type_delivery", 1)}
                                className="form-check-input radio-active mt-0 rounded position-absolute color-warning focus-none"
                                id="user_type_delivery_1"
                                style={{right: 15, width: 20, height: 20}}
                              />
                            </label>
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label htmlFor="user_type_delivery_2"
                                   className="form-label position-relative w-100 custom-rounded-12 border mb-0 d-flex align-items-center text-75758b fs-14 fw-600"
                                   style={{minHeight: 50, padding: "6px 12px"}}>
                              Самовывоз
                              <Field
                                type="radio"
                                name="user_type_delivery"
                                checked={get(values, "user_type_delivery") === 2}
                                value={get(values, "user_type_delivery")}
                                onChange={() => setFieldValue("user_type_delivery", 2)}
                                className="form-check-input radio-active rounded mt-0 position-absolute color-warning focus-none"
                                id="user_type_delivery_2" style={{right: 15, width: 20, height: 20}}
                              />
                            </label>
                          </div>
                        </div>

                        <p className="fw-600">Укажите адрес доставки</p>

                        <div className="col-lg-6 mb-3">
                          <label htmlFor={"user_region"} className="form-label mb-1 text-141316 fs-14 fw-600">Регион /
                            Область&nbsp;<span className={"text-danger"}>*</span></label>
                          <Field
                            as={"select"}
                            id={"user_region"}
                            name={"user_region"}
                            value={get(values, "user_region")}
                            className={`form-select focus-none custom-rounded-12 text-75758b fs-14 fw-500 ${errorClass(errors, touched, "user_region")}`}
                            style={{minHeight: 50}}
                          >
                            <option value="" hidden>
                              Город Ташкент
                            </option>
                            <option value="1">
                              1
                            </option>

                            <option value="2">
                              2
                            </option>
                          </Field>
                        </div>

                        <div className="col-lg-6 mb-3">
                          <label htmlFor={"user_district"} className="form-label mb-1 text-141316 fs-14 fw-600">Город /
                            Район&nbsp;<span className={"text-danger"}>*</span></label>
                          <Field
                            as={"select"}
                            id={"user_district"}
                            name={"user_district"}
                            value={get(values, "user_district")}
                            className={`form-select focus-none custom-rounded-12 text-75758b fs-14 fw-500 ${errorClass(errors, touched, "user_district")}`}
                            style={{minHeight: 50}}
                          >
                            <option value="" hidden>
                              Выберите
                            </option>
                            <option value="1">
                              1
                            </option>

                            <option value="2">
                              2
                            </option>
                          </Field>
                        </div>

                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label htmlFor="user_address" className="form-label mb-1 text-141316 fs-14 fw-600">Адрес&nbsp;
                              <span className={"text-danger"}>*</span></label>
                            <Field
                              type="text"
                              id={"user_address"}
                              name={"user_address"}
                              value={get(values, "user_address")}
                              className={`form-control focus-none custom-rounded-12 ${errorClass(errors, touched, "user_address")}`}
                              placeholder="Например, Юнусабад 13 квартал"
                              style={{minHeight: 50}}
                            />
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label htmlFor={"user_floor"}
                                   className="form-label mb-1 text-141316 fs-14 fw-600">Этаж</label>
                            <Field
                              type="text"
                              className={`form-control focus-none custom-rounded-12 ${errorClass(errors, touched, "user_floor")}`}
                              id={"user_floor"}
                              name={"user_floor"}
                              value={get(values, "user_floor")}
                              placeholder="Если есть"
                              style={{minHeight: 50}}
                            />
                          </div>
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
                        </div>
                      </div>

                      <div className="d-flex align-items-center mt-4 mb-3">
                        <div>
                          <div className="text-white mb-1 bg-374957 custom-rounded-4 text-center me-2 fs-14"
                               style={{width: 20, height: 20}}
                          >
                            3
                          </div>
                        </div>

                        <p className="fs-20 mb-1 fw-600">Выберите способ оплаты</p>
                      </div>

                      <div className="row">
                        <div className="col-12">
                          <div className="mb-3 position-relative">
                            <Field
                              type="radio"
                              name={"user_type_payment"}
                              checked={get(values, "user_type_payment") === 1}
                              className="form-check-input radio-active rounded mt-0 position-absolute color-warning focus-none"
                              id={"user_type_payment_2"}
                              onChange={() => setFieldValue("user_type_payment", 1)}
                              style={{left: 20, top: 20, width: 20, height: 20}}
                            />
                            <label htmlFor={"user_type_payment_2"}
                                   className="form-label check-radio-active w-100 custom-rounded-12 border mb-0 d-flex align-items-center text-75758b fs-14 fw-600"
                                   style={{minHeight: 75, padding: "6px 12px 6px 55px"}}>
                    <span className="d-flex w-100 justify-content-between">
                      <span className="d-block">
                        <span
                          className="d-block fs-14 text-141316 fw-600">Оплата при получении</span>
                        <span className="d-block fs-12 text-334150 fw-normal">Курьеру – только наличными и по QR-коду, в пунктах выдачи – наличными, по QR-коду и картой</span>
                      </span>
                    </span>
                            </label>
                          </div>
                          {/*<div className="mb-3 position-relative">
                            <Field
                              type="radio"
                              name={"user_type_payment"}
                              checked={get(values, "user_type_payment") === 2}
                              className="form-check-input radio-active rounded mt-0 position-absolute color-warning focus-none"
                              id={"user_type_payment_1"}
                              onChange={() => setFieldValue("user_type_payment", 2)}
                              style={{left: 20, top: 20, width: 20, height: 20}}
                            />
                            <label htmlFor={"user_type_payment_1"}
                                   className="form-label check-radio-active w-100 custom-rounded-12 border mb-0 d-flex align-items-center text-75758b fs-14 fw-600"
                                   style={{minHeight: 75, padding: "6px 12px 6px 55px"}}>
                    <span className="d-flex w-100 justify-content-between">
                      <span className="d-block">
                        <span className="d-block fs-14 text-141316 fw-600">Рассрочка от <span
                          className="color-text-gradient">Trast Muamalat</span></span>
                        <span className="d-flex justify-content-between">
                          <span
                            className="d-block fs-12 text-334150 fw-normal">Первый платёж</span>
                          <span className="d-block fs-12 text-334150 fw-normal">01 января</span>
                        </span>
                      </span>
                    </span>
                            </label>
                          </div>
                          <div className="mb-3 position-relative">
                            <Field
                              type="radio"
                              name={"user_type_payment"}
                              checked={get(values, "user_type_payment") === 3}
                              className="form-check-input radio-active rounded mt-0 position-absolute color-warning focus-none"
                              id={"user_type_payment_3"}
                              onChange={() => setFieldValue("user_type_payment", 3)}
                              style={{left: 20, top: 20, width: 20, height: 20}}
                            />
                            <label htmlFor={"user_type_payment_3"}
                                   className="form-label check-radio-active w-100 custom-rounded-12 border mb-0 d-flex align-items-center text-75758b fs-14 fw-600"
                                   style={{minHeight: 75, padding: "6px 12px 6px 55px"}}>
                    <span className="d-flex w-100 justify-content-between">
                      <span className="d-block">
                        <span className="d-block fs-14 text-141316 fw-600">Картой онлайн</span>
                        <span className="d-block fs-12 text-334150 fw-normal">UZCARD, HUMO, Visa, MasterCard</span>
                      </span>
                      <span className="d-block">
                        <img src={card_1} alt="card"/>
                        <img src={card_2} alt="card"/>
                        <img src={card_3} alt="card"/>
                        <img src={card_4} alt="card"/>
                      </span>
                    </span>
                            </label>
                          </div>*/}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 mt-lg-0 mt-3">
                    <div className="bg-white custom-rounded-20 p-3">
                      <p className="fs-32 text-greyscale800 fw-700">Детали вашего заказа</p>

                      <div className="row justify-content-between">
                        <div className="col-md-6 fs-16 fw-600">
                          Количество товара
                        </div>

                        <div className="col-md-6 text-end fs-18 fw-600">
                          {!get(auth, "isAuthenticated") ? Object.values(products).filter(item => get(item, "cart")) : countData} шт.
                        </div>

                        <div className="col-md-6 mt-2 fs-16 fw-600">
                          Общая цена
                        </div>

                        <div className="col-md-6 mt-2 text-end fs-18 fw-600">
                          <InputPhone
                            value={!get(auth, "isAuthenticated") ? Object.values(products).filter(item => get(item, "cart")).reduce((acc, curr) => parseInt(acc) + (parseInt(get(curr, "price")) * get(curr, "quantity", 1)), 0) : priceData}
                            thousandSeparator={" "} displayType={"text"}/>&nbsp;сум
                        </div>

                        <div className="col-md-6 mt-2 fs-16 fw-600">
                          Скидка:
                        </div>

                        <div className="col-md-6 mt-2 text-end fs-18 fw-600">
                          0 сум
                        </div>

                        <div className="col-md-6 mt-2 fs-16 fw-600">
                          Стоимость доставки:
                        </div>

                        <div className="col-md-6 mt-2 text-end fs-18 fw-600">
                          0 сум
                        </div>

                        <div className="col-12 my-3">
                          <div className="border-top border-e5e7e9"/>
                        </div>

                        <div className="col-md-6 fs-24 fw-700">
                          Итого:
                        </div>

                        <div className="col-md-6 text-end fs-24 fw-700">
                          <InputPhone
                            value={!get(auth, "isAuthenticated") ? Object.values(products).filter(item => get(item, "cart")).reduce((acc, curr) => parseInt(acc) + (parseInt(get(curr, "price")) * get(curr, "quantity", 1)), 0) : priceData}
                            thousandSeparator={" "} displayType={"text"}/>&nbsp;сум
                        </div>

                        {/*<div className="col-12 mt-3">
                          <button className="btn btn-menu focus-none h-100 disabled w-100 custom-rounded-8">
                            <span className="bg-gradient-custom reverse custom-rounded-8"/>
                            <span className="position-relative custom-zindex-2">
                                    Рассрочка от Trast Muamalat
                      </span>
                          </button>
                        </div>*/}

                        <div className="col-12 fs-14 fw-500 text-334150 mt-3">
                          <button
                            type={"submit"}
                            disabled={isSubmitting}
                            className="btn btn-374957 custom-rounded-8 w-100 h-100 focus-none"
                            style={{minHeight: 42}}
                          >
                            Оформить покупку
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              }}


            </MyForm>
          </>
      }

      <RecommendProducts/>

    </div>
  );
};

export default BasketOrder;
