import React, {useEffect, useMemo, useRef, useState} from "react";
import {Field, Form, Formik} from "formik";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import * as Yup from "yup";
import get from "lodash.get";
import {toast} from "react-toastify";
import ReactCodeInput from "react-code-input";
import filesize from "filesize";

import InputPhone from "../Fields/InputPhone";
import YandexMap from "../YandexMap";
import cart_company from "../../assets/images/cart_company.png";
import errorClass from "../../services/ErrorClass";
import {api} from "services";

const BUSINESS_TYPES = ["ООО", "ИП", "ЯТТ"];
const DOCUMENT_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const DOCUMENT_ALLOWED_EXT = ".jpg,.jpeg,.png";
const DOCUMENT_MAX_SIZE_MB = 5;
const DOCUMENT_MAX_SIZE = DOCUMENT_MAX_SIZE_MB * 1024 * 1024;
const VERIFICATION_ENABLED = true;

const stepsConfig = [
  {key: "personal", title: "Персональные данные"},
  {key: "business", title: "Данные бизнеса"},
  {key: "documents", title: "Документы"},
  {key: "account", title: "Счёт"},
  {key: "location", title: "Локация"},
  {key: "review", title: "Проверка"},
];

const DEFAULT_REGIONS = [
  {
    id: "tashkent_city",
    name_ru: "г. Ташкент",
    districts: [
      {id: "mirabad", name_ru: "Мирабадский район"},
      {id: "mirzo_ulugbek", name_ru: "Мирзо-Улугбекский район"},
      {id: "sergeli", name_ru: "Сергелийский район"},
      {id: "yunusabad", name_ru: "Юнусабадский район"},
      {id: "chilanzar", name_ru: "Чиланзарский район"},
      {id: "yakkasaray", name_ru: "Яккасарайский район"},
      {id: "olmazor", name_ru: "Олмазорский район"},
      {id: "ustep", name_ru: "Учтепинский район"},
      {id: "bektemir", name_ru: "Бектемирский район"}
    ]
  },
  {
    id: "tashkent_region",
    name_ru: "Ташкентская область",
    districts: [
      {id: "bekabad", name_ru: "Бекабадский район"},
      {id: "bostanlyk", name_ru: "Бостанлыкский район"},
      {id: "zangiata", name_ru: "Зангиатинский район"},
      {id: "yangiyol", name_ru: "Янгиюльский район"},
      {id: "nurafshan", name_ru: "г. Нурафшан"},
      {id: "kibray", name_ru: "Кибрайский район"},
      {id: "parkent", name_ru: "Паркентский район"},
      {id: "chinoz", name_ru: "Чинозский район"},
      {id: "angren", name_ru: "г. Ангрен"}
    ]
  },
  {
    id: "samarkand_region",
    name_ru: "Самаркандская область",
    districts: [
      {id: "samarkand_city", name_ru: "г. Самарканд"},
      {id: "bulungur", name_ru: "Булунгурский район"},
      {id: "payshanba", name_ru: "Пайарыкский район"},
      {id: "pastdargom", name_ru: "Пастдаргомский район"},
      {id: "urug", name_ru: "Ургутский район"},
      {id: "kattakurgan", name_ru: "Каттакурганский район"}
    ]
  },
  {
    id: "fergana_region",
    name_ru: "Ферганская область",
    districts: [
      {id: "fergana_city", name_ru: "г. Фергана"},
      {id: "kuvasay", name_ru: "г. Кувасай"},
      {id: "margilan", name_ru: "г. Маргилан"},
      {id: "kuva", name_ru: "Кувинский район"},
      {id: "rishtan", name_ru: "Риштанский район"},
      {id: "quvasoy", name_ru: "Кувасойский район"}
    ]
  },
  {
    id: "navoiy_region",
    name_ru: "Навоийская область",
    districts: [
      {id: "navoiy_city", name_ru: "г. Навои"},
      {id: "zarafshan", name_ru: "г. Зарафшан"},
      {id: "uchkuduk", name_ru: "Учкудукский район"},
      {id: "karmana", name_ru: "Карманинский район"}
    ]
  },
  {
    id: "bukhara_region",
    name_ru: "Бухарская область",
    districts: [
      {id: "bukhara_city", name_ru: "г. Бухара"},
      {id: "gazli", name_ru: "г. Газли"},
      {id: "karakul", name_ru: "Каракульский район"},
      {id: "ghijduvan", name_ru: "Гиждуванский район"},
      {id: "romitan", name_ru: "Ромитанский район"}
    ]
  }
];

const initialFormState = {
  personal: {
    surname: "",
    name: "",
    last_name: "",
    phone_number: "",
    identifier: "",
    userId: "",
  },
  business: {
    business_type: "ООО",
    legal_entity: "",
    company_inn: "",
    oked: "",
    phone_number2: "",
  },
  documents: {
    director_passport: null,
    license: null,
    appointing_director: null,
  },
  account: {
    account_name: "",
    bank_mfo: "",
    oked: "",
  },
  location: {
    region_id: "",
    region_name: "",
    district_id: "",
    district_name: "",
    address: "",
    house: "",
    map_lt: 41.311081,
    map_ln: 69.240562,
  },
};

const extractList = (payload) => {
  const raw = get(payload, "data", payload);
  const result = get(raw, "result", raw);
  const data = get(result, "data", result);
  return Array.isArray(data) ? data : Array.isArray(result) ? result : Array.isArray(raw) ? raw : [];
};

const mapBusinessType = (value = "") => {
  switch (value) {
    case "ООО":
      return "LIMITED_LIABILITY_COMPANY";
    case "ЯТТ":
      return "SOLE_PROPRIETORSHIP";
    case "ИП":
      return "SOLE_PROPRIETORSHIP";
    default:
      return "LIMITED_LIABILITY_COMPANY";
  }
};

const normalizeDigits = (value = "") => value.replace(/\D/g, "");
const extractLocalPhone = (value = "") => {
  const digits = normalizeDigits(value);
  if (!digits) {
    return "";
  }
  return digits.startsWith("998") ? digits.slice(3) : digits;
};
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
const formatPlainPhone = (value = "") => {
  const digits = normalizeDigits(value);
  if (!digits) {
    return "";
  }
  if (digits.startsWith("998")) {
    return `+${digits}`;
  }
  return `+998${digits}`;
};
const fileToLabel = (file) => {
  if (!file) {
    return "";
  }
  return `${file.name} (${filesize(file.size)})`;
};

const CODE_INPUT_STYLE = {
  width: 52,
  height: 56,
  borderRadius: 12,
  border: "1px solid #d9d9d9",
  fontSize: 20,
  fontWeight: 600,
  lineHeight: "56px",
  textAlign: "center",
  color: "#212640",
  backgroundColor: "#fff",
};

const CODE_INPUT_INVALID_STYLE = {
  ...CODE_INPUT_STYLE,
  border: "1px solid #dc3545",
};

const personalSchema = Yup.object({
  surname: Yup.string().trim().required("Required"),
  name: Yup.string().trim().required("Required"),
  last_name: Yup.string().trim().required("Required"),
  phone_number: Yup.string()
    .matches(/^\d{9}$/, "Введите 9 цифр номера без кода страны")
    .required("Required"),
});

const businessSchema = Yup.object({
  business_type: Yup.string().oneOf(BUSINESS_TYPES).required("Required"),
  legal_entity: Yup.string().trim().min(3, "Минимум 3 символа").required("Required"),
  company_inn: Yup.string().matches(/^\d{9}$/, "ИНН должен содержать 9 цифр").required("Required"),
  oked: Yup.string().matches(/^\d{4,6}$/, "ОКЭД должен содержать 4-6 цифр").required("Required"),
  phone_number2: Yup.string()
    .matches(/^\d{9}$/, "Введите 9 цифр номера без кода страны")
    .required("Required"),
});

const fileSchema = Yup.mixed()
  .required("Required")
  .test("fileType", "Поддерживаются только JPG или PNG", value => !value || DOCUMENT_ALLOWED_TYPES.includes(value.type))
  .test("fileSize", `Размер файла не должен превышать ${DOCUMENT_MAX_SIZE_MB} МБ`, value => !value || value.size <= DOCUMENT_MAX_SIZE);

const documentsSchema = Yup.object({
  director_passport: fileSchema,
  license: fileSchema,
  appointing_director: fileSchema,
});

const accountSchema = Yup.object({
  account_name: Yup.string().trim().min(3, "Минимум 3 символа").required("Required"),
  bank_mfo: Yup.string().matches(/^\d{5}$/, "МФО содержит 5 цифр").required("Required"),
  oked: Yup.string().matches(/^\d{4,6}$/, "ОКЭД должен содержать 4-6 цифр").required("Required"),
});

const locationSchema = Yup.object({
  region_id: Yup.string().required("Required"),
  district_id: Yup.string().required("Required"),
  address: Yup.string().trim().required("Required"),
  house: Yup.string().trim().required("Required"),
  map_lt: Yup.number().required("Required"),
  map_ln: Yup.number().required("Required"),
});

const Stepper = ({current}) => (
  <div className="bg-white border border-bfbfda custom-rounded-12 p-3 mb-4">
    <div className="d-flex flex-wrap gap-3 align-items-center">
      {
        stepsConfig.map((step, index) => {
          const isActive = index === current;
          const isDone = index < current;
          const statusClass = isActive ? "text-212640" : isDone ? "text-212640" : "text-75758b";
          return (
            <div
              key={step.key}
              className={`d-flex align-items-center step-item flex-grow-1 ${statusClass}`}
              style={{
                minWidth: 180,
                gap: 12,
              }}
            >
              <span
                className={`d-inline-flex align-items-center justify-content-center fw-600 ${isActive || isDone ? "text-white bg-212640" : "text-75758b bg-ebebeb"}`}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                }}
              >
                {index + 1}
              </span>
              <span className={`fs-14 ${isActive ? "fw-600" : "fw-500"}`}>
                {step.title}
              </span>
              {
                index !== stepsConfig.length - 1
                  ? <span
                    className="flex-grow-1"
                    style={{
                      height: 2,
                      background: isDone ? "#212640" : "#E5E5F5",
                    }}
                  />
                  : null
              }
            </div>
          );
        })
      }
    </div>
  </div>
);

const PersonalStep = ({
  initialValues,
  onNext,
  verification,
  onStartVerification,
  onVerifyCode,
  onInvalidateVerification,
}) => {
  const [code, setCode] = useState("");

  useEffect(() => {
    setCode("");
  }, [initialValues.phone_number]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={personalSchema}
      enableReinitialize
      onSubmit={(values, helpers) => {
        if (VERIFICATION_ENABLED && !verification.verified) {
          toast.error("Подтвердите номер телефона перед продолжением");
          helpers.setSubmitting(false);
          return;
        }
        onNext(values);
      }}
    >
      {({values, errors, touched, setFieldValue, setFieldTouched, isSubmitting}) => {
        const digitsLength = normalizeDigits(values.phone_number).length;
        const canRequestCode = VERIFICATION_ENABLED && !verification.loadingStart
          && digitsLength === 9
          && values.name
          && values.surname
          && verification.countdown === 0;
        const canVerify = VERIFICATION_ENABLED && verification.txId && code.length === 5 && !verification.loadingVerify;

        const handlePlainChange = (field, value) => {
          setFieldValue(field, value);
          setFieldTouched(field, true, false);
          if (VERIFICATION_ENABLED && verification.verified) {
            onInvalidateVerification();
          }
        };

        return (
          <Form className="flex-fill">
            <div className="bg-white p-3 custom-rounded-12 border-ebebeb border mb-4">
              <p className="fs-18 fw-600">Персональные данные руководителя</p>
              <div className="row g-4">
                <div className="col-lg-6">
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex flex-column gap-2">
                      <label htmlFor="surname" className="form-label fs-14 text-141316 mb-0">Фамилия</label>
                      <input
                        id="surname"
                        name="surname"
                        type="text"
                        className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "surname")}`}
                        style={{minHeight: 50}}
                        value={values.surname}
                        onChange={(event) => handlePlainChange("surname", event.target.value)}
                      />
                    </div>
                    <div className="d-flex flex-column gap-2">
                      <label htmlFor="name" className="form-label fs-14 text-141316 mb-0">Имя</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "name")}`}
                        style={{minHeight: 50}}
                        value={values.name}
                        onChange={(event) => handlePlainChange("name", event.target.value)}
                      />
                    </div>
                    <div className="d-flex flex-column gap-2">
                      <label htmlFor="last_name" className="form-label fs-14 text-141316 mb-0">Отчество</label>
                      <input
                        id="last_name"
                        name="last_name"
                        type="text"
                        className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "last_name")}`}
                        style={{minHeight: 50}}
                        value={values.last_name}
                        onChange={(event) => handlePlainChange("last_name", event.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="d-flex flex-column gap-3 h-100">
                    <div className="d-flex flex-column gap-2">
                      <label htmlFor="phone_number" className="form-label fs-14 text-141316 mb-0">Телефон</label>
                      <InputPhone
                        id="phone_number"
                        name="phone_number"
                        format="+998 ## ### ## ##"
                        type="tel"
                        style={{minHeight: 50}}
                        className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "phone_number")}`}
                        value={values.phone_number}
                        allowEmptyFormatting
                        isNumericString
                        onValueChange={(val) => handlePlainChange("phone_number", val.value)}
                      />
                      <small className="text-75758b">
                        Укажите номер руководителя. На него будут приходить служебные уведомления.
                      </small>
                    </div>
                    {
                      VERIFICATION_ENABLED && (
                        <>
                          <div className="d-flex flex-column gap-2">
                            <label className="form-label fs-14 text-141316 mb-0">Подтверждение</label>
                            <button
                              type="button"
                              className={`btn btn-menu w-100 custom-rounded-12 focus-none ${!canRequestCode ? "disabled" : ""}`}
                              style={{minHeight: 50}}
                              disabled={!canRequestCode}
                              onClick={async () => {
                                const success = await onStartVerification({
                                  surname: values.surname,
                                  name: values.name,
                                  phone_number: values.phone_number,
                                  middle_name: values.last_name,
                                });
                                if (success) {
                                  setCode("");
                                }
                              }}
                            >
                              <span className="bg-gradient-custom reverse custom-rounded-12"/>
                              <span className="position-relative custom-zindex-2 fw-600 fs-17">
                                {verification.loadingStart ? "Отправляем…" : "Получить сообщение"}
                              </span>
                            </button>
                            {
                              verification.countdown > 0 && !verification.txId
                                ? <small className="text-75758b">
                                  Новый код можно запросить через {verification.countdown} сек.
                                </small>
                                : null
                            }
                            {
                              !verification.txId
                                ? <small className="text-75758b">
                                  Нажмите «Получить сообщение», чтобы получить код подтверждения.
                                </small>
                                : null
                            }
                          </div>
                          {
                            verification.txId
                              ? <div className="d-flex flex-column gap-2">
                                <label className="form-label fs-14 text-141316 mb-0">Код из SMS</label>
                                <ReactCodeInput
                                  type="number"
                                  fields={5}
                                  name="otp"
                                  inputMode="numeric"
                                  className="d-flex justify-content-start gap-2"
                                  inputStyle={CODE_INPUT_STYLE}
                                  inputStyleInvalid={CODE_INPUT_INVALID_STYLE}
                                  onChange={(value) => setCode(value)}
                                  value={code}
                                />
                                <button
                                  type="button"
                                  className={`btn btn-menu w-100 custom-rounded-12 focus-none ${!canVerify ? "disabled" : ""}`}
                                  style={{minHeight: 50}}
                                  disabled={!canVerify}
                                  onClick={async () => {
                                      const success = await onVerifyCode({
                                        code,
                                        phone_number: values.phone_number,
                                        surname: values.surname,
                                        name: values.name,
                                        last_name: values.last_name
                                      });
                                    if (success) {
                                      setCode("");
                                    }
                                  }}
                                >
                                  <span className="bg-gradient-custom reverse custom-rounded-12"/>
                                  <span className="position-relative custom-zindex-2 fw-600 fs-17">
                                    {verification.loadingVerify ? "Проверяем…" : "Подтвердить"}
                                  </span>
                                </button>
                                {
                                  verification.countdown > 0
                                    ? <small className="text-75758b">
                                      Новый код можно запросить через {verification.countdown} сек.
                                    </small>
                                    : null
                                }
                              </div>
                              : null
                          }
                        </>
                      )
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end mb-4">
              <button
                type="submit"
                className={`btn btn-menu custom-rounded-12 focus-none w-auto ${isSubmitting ? "disabled" : ""}`}
                style={{minWidth: 220, minHeight: 50}}
                disabled={isSubmitting}
              >
                <span className="bg-gradient-custom reverse custom-rounded-12"/>
                <span className="position-relative custom-zindex-2 fw-600 fs-17">
                  Далее
                </span>
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

const BusinessStep = ({initialValues, onNext, onBack}) => (
  <Formik
    initialValues={initialValues}
    validationSchema={businessSchema}
    enableReinitialize
    onSubmit={(values) => {
      onNext(values);
    }}
  >
    {({values, errors, touched, setFieldValue, setFieldTouched, isSubmitting}) => (
      <Form className="flex-fill">
        <div className="bg-white p-3 custom-rounded-12 border-ebebeb border mb-4">
          <p className="fs-18 fw-600">Данные вашего бизнеса</p>
          <div className="row g-3">
            <div className="col-lg-4 col-md-6">
              <div className="d-flex flex-column gap-2 h-100">
                <label htmlFor="business_type" className="form-label fs-14 text-141316 mb-0">Форма бизнеса</label>
                <Field
                  as="select"
                  id="business_type"
                  name="business_type"
                  className={`form-select border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "business_type")}`}
                  style={{minHeight: 50}}
                >
                  {
                    BUSINESS_TYPES.map(type => (
                      <option value={type} key={type}>{type}</option>
                    ))
                  }
                </Field>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="d-flex flex-column gap-2 h-100">
                <label htmlFor="legal_entity" className="form-label fs-14 text-141316 mb-0">Наименование юрлица</label>
                <input
                  id="legal_entity"
                  name="legal_entity"
                  type="text"
                  className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "legal_entity")}`}
                  style={{minHeight: 50}}
                  value={values.legal_entity}
                  onChange={(event) => {
                    setFieldValue("legal_entity", event.target.value);
                    setFieldTouched("legal_entity", true, false);
                  }}
                />
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="d-flex flex-column gap-2 h-100">
                <label htmlFor="company_inn" className="form-label fs-14 text-141316 mb-0">ИНН</label>
                <InputPhone
                  id="company_inn"
                  name="company_inn"
                  format="#########"
                  allowEmptyFormatting={false}
                  allowNegative={false}
                  allowLeadingZeros
                  isNumericString
                  className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "company_inn")}`}
                  style={{minHeight: 50}}
                  value={values.company_inn}
                  onValueChange={(val) => {
                    setFieldValue("company_inn", val.value);
                    setFieldTouched("company_inn", true, false);
                  }}
                />
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="d-flex flex-column gap-2 h-100">
                <label htmlFor="oked" className="form-label fs-14 text-141316 mb-0">Код ОКЭД</label>
                <InputPhone
                  id="oked"
                  name="oked"
                  format="######"
                  allowEmptyFormatting
                  allowNegative={false}
                  allowLeadingZeros
                  isNumericString
                  className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "oked")}`}
                  style={{minHeight: 50}}
                  value={values.oked}
                  onValueChange={(val) => {
                    setFieldValue("oked", val.value);
                    setFieldTouched("oked", true, false);
                  }}
                />
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="d-flex flex-column gap-2 h-100">
                <label htmlFor="phone_number2" className="form-label fs-14 text-141316 mb-0">Дополнительный номер телефона</label>
                <InputPhone
                  id="phone_number2"
                  name="phone_number2"
                  format="+998 ## ### ## ##"
                  allowEmptyFormatting
                  allowNegative={false}
                  allowLeadingZeros
                  isNumericString
                  className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "phone_number2")}`}
                  style={{minHeight: 50}}
                  value={values.phone_number2}
                  onValueChange={(val) => {
                    setFieldValue("phone_number2", val.value);
                    setFieldTouched("phone_number2", true, false);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn bg-75758b fw-600 text-white custom-rounded-12 focus-none"
            style={{minWidth: 180, minHeight: 50}}
            onClick={onBack}
          >
            Назад
          </button>
          <button
            type="submit"
            className={`btn btn-menu custom-rounded-12 focus-none w-auto ${isSubmitting ? "disabled" : ""}`}
            style={{minWidth: 220, minHeight: 50}}
            disabled={isSubmitting}
          >
            <span className="bg-gradient-custom reverse custom-rounded-12"/>
            <span className="position-relative custom-zindex-2 fw-600 fs-17">Далее</span>
          </button>
        </div>
      </Form>
    )}
  </Formik>
);

const DocumentsStep = ({initialValues, onNext, onBack}) => (
  <Formik
    initialValues={initialValues}
    validationSchema={documentsSchema}
    enableReinitialize
    onSubmit={(values) => onNext(values)}
  >
    {({values, errors, touched, setFieldValue, setFieldTouched, isSubmitting}) => {
      const handleFileSelect = (field, file) => {
        if (file && !DOCUMENT_ALLOWED_TYPES.includes(file.type)) {
          toast.error("Допустимые форматы: JPG, JPEG, PNG");
          return;
        }
        setFieldValue(field, file || null);
        setFieldTouched(field, true, false);
      };

      const renderFileInput = (field, label) => (
        <div className="col-lg-4 col-md-6">
          <div className="d-flex flex-column gap-2 h-100">
            <label className="form-label fs-14 text-141316 mb-0">{label}</label>
            <label htmlFor={field} className={`btn btn-menu custom-rounded-12 focus-none w-100 ${errorClass(errors, touched, field)}`}>
              <span className="bg-gradient-custom reverse custom-rounded-12"/>
              <span className="position-relative custom-zindex-2 fw-600 fs-16">
                {values[field] ? "Заменить файл" : "Загрузить"}
              </span>
            </label>
            <input
              id={field}
              type="file"
              accept={DOCUMENT_ALLOWED_EXT}
              className="visually-hidden"
              onChange={(event) => handleFileSelect(field, get(event, "currentTarget.files[0]", null))}
            />
            {
              values[field]
                ? <div className="fs-14 text-75758b">
                  {fileToLabel(values[field])}
                </div>
                : <div className="fs-13 text-75758b">
                  Форматы: jpg, jpeg, png
                </div>
            }
            {
              touched[field] && errors[field]
                ? <div className="fs-13 text-danger">Файл обязателен</div>
                : null
            }
          </div>
        </div>
      );

      return (
        <Form className="flex-fill">
          <div className="bg-white p-3 custom-rounded-12 border-ebebeb border mb-4">
            <p className="fs-18 fw-600">Документы</p>
            <div className="row g-3">
              {renderFileInput("director_passport", "Копия паспорта директора")}
              {renderFileInput("license", "Лицензия компании")}
              {renderFileInput("appointing_director", "Приказ о назначении директора")}
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn bg-75758b fw-600 text-white custom-rounded-12 focus-none"
              style={{minWidth: 180, minHeight: 50}}
              onClick={onBack}
            >
              Назад
            </button>
            <button
              type="submit"
              className={`btn btn-menu custom-rounded-12 focus-none w-auto ${isSubmitting ? "disabled" : ""}`}
              style={{minWidth: 220, minHeight: 50}}
              disabled={isSubmitting}
            >
              <span className="bg-gradient-custom reverse custom-rounded-12"/>
              <span className="position-relative custom-zindex-2 fw-600 fs-17">Далее</span>
            </button>
          </div>
        </Form>
      );
    }}
  </Formik>
);

const AccountStep = ({initialValues, onNext, onBack, onOpenAccount}) => (
  <Formik
    initialValues={initialValues}
    validationSchema={accountSchema}
    enableReinitialize
    onSubmit={(values) => onNext(values)}
  >
    {({values, errors, touched, setFieldValue, setFieldTouched, isSubmitting}) => (
      <Form className="flex-fill">
        <div className="bg-white p-3 custom-rounded-12 border-ebebeb border mb-4">
          <p className="fs-18 fw-600 mb-3 mb-lg-4">Счёт №1</p>
          <div className="row g-4 align-items-stretch">
            <div className="col-12 col-lg-5 order-1">
              <div className="d-flex flex-column gap-3">
                <div className="d-flex flex-column gap-2">
                  <label htmlFor="account_name" className="form-label fs-14 text-141316 mb-0">Название счёта</label>
                  <input
                    id="account_name"
                    name="account_name"
                    type="text"
                    className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "account_name")}`}
                    style={{minHeight: 50}}
                    value={values.account_name}
                    onChange={(event) => {
                      setFieldValue("account_name", event.target.value);
                      setFieldTouched("account_name", true, false);
                    }}
                  />
                </div>
                <div className="d-flex flex-column gap-2">
                  <label htmlFor="bank_mfo" className="form-label fs-14 text-141316 mb-0">Код банка (МФО)</label>
                  <InputPhone
                    id="bank_mfo"
                    name="bank_mfo"
                    format="#####"
                    allowEmptyFormatting
                    allowLeadingZeros
                    allowNegative={false}
                    isNumericString
                    className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "bank_mfo")}`}
                    style={{minHeight: 50}}
                    value={values.bank_mfo}
                    onValueChange={(val) => {
                      setFieldValue("bank_mfo", val.value);
                      setFieldTouched("bank_mfo", true, false);
                    }}
                  />
                </div>
                <div className="d-flex flex-column gap-2">
                  <label htmlFor="oked_acc" className="form-label fs-14 text-141316 mb-0">Код ОКЭД</label>
                  <InputPhone
                    id="oked_acc"
                    name="oked"
                    format="######"
                    allowEmptyFormatting
                    allowLeadingZeros
                    allowNegative={false}
                    isNumericString
                    className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "oked")}`}
                    style={{minHeight: 50}}
                    value={values.oked}
                    onValueChange={(val) => {
                      setFieldValue("oked", val.value);
                      setFieldTouched("oked", true, false);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-1 order-2 d-flex justify-content-center align-items-center mb-3 mb-lg-0">
              <div className="account-step-divider">
                <span className="text-uppercase">или</span>
              </div>
            </div>
            <div className="col-12 col-lg-6 order-3">
              <div className="account-step-banner custom-rounded-12 h-100 px-4 py-4 d-flex flex-column flex-lg-row gap-3 gap-lg-4 justify-content-between align-items-center align-items-lg-stretch">
                <div className="account-step-banner__content d-flex flex-column gap-3 align-items-center align-items-lg-start text-center text-lg-start w-100">
                  <div>
                    <p className="fs-20 fw-600 mb-1 text-212640">
                      Торгуйте первый месяц без комиссии
                    </p>
                    <p className="fs-15 text-75758b mb-0">
                      с расчётным счётом в Kapitalbank
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn bg-white custom-rounded-8 fs-17 text-212640 fw-600 px-4 account-step-banner__btn"
                    onClick={onOpenAccount}
                  >
                    Открыть счёт
                  </button>
                </div>
                <div className="account-step-banner__media flex-grow-1 d-flex justify-content-center justify-content-lg-end align-items-center h-100 w-100">
                  <img
                    src={cart_company}
                    alt="banner"
                    className="account-step-banner__img"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn bg-75758b fw-600 text-white custom-rounded-12 focus-none"
            style={{minWidth: 180, minHeight: 50}}
            onClick={onBack}
          >
            Назад
          </button>
          <button
            type="submit"
            className={`btn btn-menu custom-rounded-12 focus-none w-auto ${isSubmitting ? "disabled" : ""}`}
            style={{minWidth: 220, minHeight: 50}}
            disabled={isSubmitting}
          >
            <span className="bg-gradient-custom reverse custom-rounded-12"/>
            <span className="position-relative custom-zindex-2 fw-600 fs-17">Далее</span>
          </button>
        </div>
      </Form>
    )}
  </Formik>
);

const LocationStep = ({
  initialValues,
  onNext,
  onBack,
  regions,
  regionsLoading,
  districts,
  districtsLoading,
  onRegionChange,
  language = "ru",
}) => (
  <Formik
    initialValues={initialValues}
    validationSchema={locationSchema}
    enableReinitialize
    onSubmit={(values) => {
      const regionOption = regions.find(item => `${item.id}` === `${values.region_id}`);
      const districtOption = districts.find(item => `${item.id}` === `${values.district_id}`);
      onNext({
        ...values,
        region_name: regionOption?.name_ru || regionOption?.name_uz || regionOption?.name || regionOption?.title || "",
        district_name: districtOption?.name_ru || districtOption?.name_uz || districtOption?.name || districtOption?.title || "",
        map_lt: Number(values.map_lt),
        map_ln: Number(values.map_ln),
      });
    }}
  >
    {({values, errors, touched, setFieldValue, setFieldTouched, isSubmitting}) => (
      <Form className="flex-fill">
        <div className="bg-white p-3 custom-rounded-12 border-ebebeb border mb-4">
          <p className="fs-18 fw-600">Локация</p>
          <div className="row g-3">
            <div className="col-xl-3 col-md-6">
              <div className="d-flex flex-column gap-2 h-100">
                <label className="form-label mb-0" htmlFor="region_id">Область*</label>
                <select
                  id="region_id"
                  name="region_id"
                  className={`form-select border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "region_id")}`}
                  style={{minHeight: 50}}
                  value={values.region_id}
                  onChange={(event) => {
                    const regionId = event.target.value;
                    setFieldValue("region_id", regionId);
                    setFieldValue("district_id", "");
                    setFieldTouched("region_id", true, false);
                    onRegionChange(regionId);
                  }}
                  disabled={regionsLoading}
                >
                <option value="">
                  {regionsLoading ? "Загружаем области…" : "Выберите область"}
                </option>
                {
                  regions.map(region => (
                    <option key={region.id} value={region.id}>
                      {region.name_ru || region.name_uz || region.name || region.title}
                    </option>
                    ))
                  }
                </select>
                {
                  regionsLoading
                    ? <small className="text-75758b">Загружаем список областей…</small>
                    : null
                }
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="d-flex flex-column gap-2 h-100">
                <label className="form-label mb-0" htmlFor="district_id">Район*</label>
                <select
                  id="district_id"
                  name="district_id"
                  className={`form-select border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "district_id")}`}
                  style={{minHeight: 50}}
                  value={values.district_id}
                  onChange={(event) => {
                    setFieldValue("district_id", event.target.value);
                    setFieldTouched("district_id", true, false);
                  }}
                  disabled={!values.region_id || districtsLoading}
                >
                <option value="">Выберите район</option>
                  {
                    districts.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name_ru || item.name_uz || item.name || item.title}
                      </option>
                    ))
                  }
              </select>
              {
                districtsLoading
                  ? <small className="text-75758b">Загружаем районы…</small>
                  : null
              }
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="d-flex flex-column gap-2 h-100">
                <label className="form-label mb-0" htmlFor="address">Улица / Населённый пункт</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "address")}`}
                  style={{minHeight: 50}}
                  value={values.address}
                  onChange={(event) => {
                    setFieldValue("address", event.target.value);
                    setFieldTouched("address", true, false);
                  }}
                />
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="d-flex flex-column gap-2 h-100">
                <label className="form-label mb-0" htmlFor="house">Дом</label>
                <input
                  id="house"
                  name="house"
                  type="text"
                  className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "house")}`}
                  style={{minHeight: 50}}
                  value={values.house}
                  onChange={(event) => {
                    setFieldValue("house", event.target.value);
                    setFieldTouched("house", true, false);
                  }}
                />
              </div>
            </div>
            <div className="col-12">
              <div className="custom-rounded-12 overflow-hidden border border-ebebeb">
                <YandexMap
                  lat={Number(values.map_lt)}
                  long={Number(values.map_ln)}
                  language={language}
                  onClick={(coords) => {
                    setFieldValue("map_lt", coords[0]);
                    setFieldValue("map_ln", coords[1]);
                  }}
                />
              </div>
              <p className="mt-2 fs-13 text-75758b">
                Нажмите на карту, чтобы отметить фактическое расположение вашего бизнеса.
              </p>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn bg-75758b fw-600 text-white custom-rounded-12 focus-none"
            style={{minWidth: 180, minHeight: 50}}
            onClick={onBack}
          >
            Назад
          </button>
          <button
            type="submit"
            className={`btn btn-menu custom-rounded-12 focus-none w-auto ${isSubmitting ? "disabled" : ""}`}
            style={{minWidth: 220, minHeight: 50}}
            disabled={isSubmitting}
          >
            <span className="bg-gradient-custom reverse custom-rounded-12"/>
            <span className="position-relative custom-zindex-2 fw-600 fs-17">Далее</span>
          </button>
        </div>
      </Form>
    )}
  </Formik>
);

const ReviewRow = ({label, value}) => (
  <div className="d-flex justify-content-between align-items-center border-bottom border-ebebeb py-2 gap-3">
    <span className="text-75758b">{label}</span>
    <span className="fw-600 text-212640 text-end text-break">{value || "—"}</span>
  </div>
);

const ReviewStep = ({data, onBack, onEditStep, onSubmit, submitting}) => {
  const {personal, business, documents, account, location} = data;
  const locationSummary = `${location.address || ""} ${location.house || ""}`.trim();
  const editButtonClass = "btn btn-link text-decoration-none p-0 fs-14 fw-500 text-212640";

  return (
    <div className="flex-fill">
      <div className="bg-white p-3 custom-rounded-12 border-ebebeb border mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <p className="fs-18 fw-600 mb-0">Персональные данные</p>
          <button className={editButtonClass} type="button" onClick={() => onEditStep("personal")}>
            Изменить
          </button>
        </div>
        <ReviewRow label="Фамилия" value={personal.surname}/>
        <ReviewRow label="Имя" value={personal.name}/>
        <ReviewRow label="Отчество" value={personal.last_name}/>
        <ReviewRow label="Телефон" value={formatPlainPhone(personal.phone_number)}/>
      </div>

      <div className="bg-white p-3 custom-rounded-12 border-ebebeb border mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <p className="fs-18 fw-600 mb-0">Данные бизнеса</p>
          <button className={editButtonClass} type="button" onClick={() => onEditStep("business")}>
            Изменить
          </button>
        </div>
        <ReviewRow label="Форма бизнеса" value={business.business_type}/>
        <ReviewRow label="Наименование юрлица" value={business.legal_entity}/>
        <ReviewRow label="ИНН" value={business.company_inn}/>
        <ReviewRow label="Код ОКЭД" value={business.oked}/>
        <ReviewRow label="Доп. номер" value={formatPlainPhone(business.phone_number2)}/>
      </div>

      <div className="bg-white p-3 custom-rounded-12 border-ebebeb border mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <p className="fs-18 fw-600 mb-0">Документы</p>
          <button className={editButtonClass} type="button" onClick={() => onEditStep("documents")}>
            Изменить
          </button>
        </div>
        <ReviewRow label="Паспорт директора" value={fileToLabel(documents.director_passport)}/>
        <ReviewRow label="Лицензия компании" value={fileToLabel(documents.license)}/>
        <ReviewRow label="Приказ о назначении" value={fileToLabel(documents.appointing_director)}/>
      </div>

      <div className="bg-white p-3 custom-rounded-12 border-ebebeb border mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <p className="fs-18 fw-600 mb-0">Счёт</p>
          <button className={editButtonClass} type="button" onClick={() => onEditStep("account")}>
            Изменить
          </button>
        </div>
        <ReviewRow label="Название счёта" value={account.account_name}/>
        <ReviewRow label="Код банка (МФО)" value={account.bank_mfo}/>
        <ReviewRow label="Код ОКЭД" value={account.oked}/>
      </div>

      <div className="bg-white p-3 custom-rounded-12 border-ebebeb border mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <p className="fs-18 fw-600 mb-0">Локация</p>
          <button className={editButtonClass} type="button" onClick={() => onEditStep("location")}>
            Изменить
          </button>
        </div>
        <ReviewRow label="Область" value={location.region_name || location.region_id}/>
        <ReviewRow label="Район" value={location.district_name || location.district_id}/>
        <ReviewRow label="Адрес" value={locationSummary}/>
        <ReviewRow label="Координаты" value={`${location.map_lt?.toFixed(6)}, ${location.map_ln?.toFixed(6)}`}/>
      </div>

      <div className="d-flex justify-content-between">
        <button
          type="button"
          className="btn bg-75758b fw-600 text-white custom-rounded-12 focus-none"
          style={{minWidth: 180, minHeight: 50}}
          onClick={onBack}
        >
          Назад
        </button>
        <button
          type="button"
          className={`btn btn-menu custom-rounded-12 focus-none w-auto ${submitting ? "disabled" : ""}`}
          style={{minWidth: 260, minHeight: 50}}
          disabled={submitting}
          onClick={onSubmit}
        >
          <span className="bg-gradient-custom reverse custom-rounded-12"/>
          <span className="position-relative custom-zindex-2 fw-600 fs-17">
            {submitting ? "Отправляем…" : "Отправить для рассмотрения"}
          </span>
        </button>
      </div>
    </div>
  );
};

const mapStepKeyToIndex = () => {
  const map = {};
  stepsConfig.forEach((item, idx) => {
    map[item.key] = idx;
  });
  return map;
};

const SellerRegisterForm = () => {
  const navigate = useNavigate();
  const {auth} = useSelector(state => state);
  const [currentStep, setCurrentStep] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [verificationState, setVerificationState] = useState({
    txId: "",
    loadingStart: false,
    loadingVerify: false,
    verified: false,
  });
  const [tokens, setTokens] = useState(null);
  const [verificationMeta, setVerificationMeta] = useState({});
  const [regions, setRegions] = useState(DEFAULT_REGIONS);
  const [regionsLoading, setRegionsLoading] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [districtsLoading, setDistrictsLoading] = useState(false);
  const districtsCacheRef = useRef({});
  const [submitting, setSubmitting] = useState(false);

  const [formState, setFormState] = useState(() => {
    const phone = extractLocalPhone(get(auth, "data.user.phone_number", ""));
    const phone2 = extractLocalPhone(get(auth, "data.user.phone_number2", ""));
    return {
      personal: {
        ...initialFormState.personal,
        surname: get(auth, "data.user.surname", ""),
        name: get(auth, "data.user.name", ""),
        last_name: get(auth, "data.user.last_name", ""),
        phone_number: phone,
      },
      business: {
        ...initialFormState.business,
        phone_number2: phone2,
      },
      documents: {...initialFormState.documents},
      account: {...initialFormState.account},
      location: {...initialFormState.location},
    };
  });

  const stepIndexMap = useMemo(mapStepKeyToIndex, []);

  useEffect(() => {
    let isMounted = true;
    const loadRegions = async () => {
      setRegionsLoading(true);
      try {
        const response = await api.request.get("/api/v1/geo/regions");
        const list = extractList(response);
        if (isMounted && Array.isArray(list) && list.length) {
          setRegions(list);
          list.forEach(region => {
            if (region && Array.isArray(region.districts) && region.districts.length) {
              districtsCacheRef.current[region.id] = region.districts;
            }
          });
        }
      } catch (error) {
        if (isMounted) {
          console.warn("Failed to load regions from API, falling back to embedded list", error);
          setRegions(DEFAULT_REGIONS);
          DEFAULT_REGIONS.forEach(region => {
            if (Array.isArray(region.districts)) {
              districtsCacheRef.current[region.id] = region.districts;
            }
          });
        }
      } finally {
        if (isMounted) {
          setRegionsLoading(false);
        }
      }
    };
    loadRegions();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const regionId = formState.location.region_id;
    if (regionId) {
      handleRegionChange(regionId, {skipReset: true});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.location.region_id]);

  useEffect(() => {
    if (!countdown) {
      return undefined;
    }
    const timer = setInterval(() => {
      setCountdown(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const invalidateVerification = () => {
    setVerificationState({
      txId: "",
      loadingStart: false,
      loadingVerify: false,
      verified: false,
    });
    setTokens(null);
    setVerificationMeta({});
    setCountdown(0);
  };

  const handleStartVerification = async ({surname, name, phone_number, middle_name}) => {
    if (!surname || !name || !phone_number) {
      toast.error("Заполните ФИО и номер телефона");
      return false;
    }
    setVerificationState(prev => ({...prev, loadingStart: true}));
    try {
      const response = await api.customerAuth.startSeller({
        phoneNumber: formatPhoneForApi(phone_number)
      });
      const payload = get(response, "data", response);
      const txId = get(payload, "txId") || get(payload, "data.txId") || get(payload, "result.txId") || "";
      if (!txId) {
        throw new Error("txId not returned");
      }
      setVerificationState(prev => ({
        ...prev,
        txId,
        loadingStart: false,
        verified: false,
      }));
      setCountdown(60);
      toast.success("Код отправлен на указанный номер");
      return true;
    } catch (error) {
      setVerificationState(prev => ({...prev, loadingStart: false}));
      toast.error(get(error, "response.data.message", "Не удалось отправить код"));
      return false;
    }
  };

  const handleVerifyCode = async ({code, phone_number, surname, name, last_name}) => {
    if (!verificationState.txId) {
      toast.error("Сначала запросите код подтверждения");
      return false;
    }
    if (!code || code.length !== 5) {
      toast.error("Введите 5-значный код");
      return false;
    }
    setVerificationState(prev => ({...prev, loadingVerify: true}));
    try {
      const response = await api.customerAuth.verifySeller({
        txId: verificationState.txId,
        code,
      });
      const result = get(response, "data", response);
      const accessToken = get(result, "accessToken", "");
      const refreshToken = get(result, "refreshToken", "");
      if (!accessToken || !refreshToken) {
        throw new Error("Token pair not returned");
      }
      setTokens({
        accessToken,
        refreshToken,
      });
      setVerificationMeta({
        identifier: get(result, "phoneNumber", ""),
        userId: get(result, "userId", ""),
      });
      setVerificationState(prev => ({
        ...prev,
        loadingVerify: false,
        verified: true,
      }));

      const profilePayload = {
        firstName: name || formState.personal.name || "",
        lastName: surname || formState.personal.surname || "",
        middleName: last_name || formState.personal.last_name || ""
      };

      if (profilePayload.firstName && profilePayload.lastName) {
        try {
          await api.customerAuth.fillProfile({
            accessToken,
            profile: profilePayload
          });
        } catch (profileError) {
          console.error("Failed to fill seller profile", profileError);
        }
      }

      toast.success("Телефон успешно подтверждён");
      return true;
    } catch (error) {
      setVerificationState(prev => ({...prev, loadingVerify: false}));
      toast.error(get(error, "response.data.message", "Не удалось подтвердить код"));
      return false;
    }
  };

  const goToStep = (stepKey) => {
    const idx = stepIndexMap[stepKey];
    if (typeof idx === "number") {
      setCurrentStep(idx);
    }
  };

  const updateSection = (key, values) => {
    setFormState(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        ...values,
      },
    }));
    setCurrentStep(prev => Math.min(prev + 1, stepsConfig.length - 1));
  };

  const handleRegionChange = async (regionId, {skipReset = false} = {}) => {
    if (!regionId) {
      setDistricts([]);
      return;
    }
    if (!skipReset) {
      setDistricts([]);
    }
    if (districtsCacheRef.current[regionId]) {
      setDistricts(districtsCacheRef.current[regionId]);
      return;
    }
    setDistrictsLoading(true);
    try {
      const regionFromState = regions.find(item => `${item.id}` === `${regionId}`);
      if (regionFromState && Array.isArray(regionFromState.districts) && regionFromState.districts.length) {
        districtsCacheRef.current[regionId] = regionFromState.districts;
        setDistricts(regionFromState.districts);
        return;
      }
      const response = await api.request.get(`/api/v1/geo/regions/${regionId}/districts`);
      const list = extractList(response);
      if (Array.isArray(list) && list.length) {
        districtsCacheRef.current[regionId] = list;
        setDistricts(list);
      } else {
        const fallbackRegion = DEFAULT_REGIONS.find(item => `${item.id}` === `${regionId}`);
        const fallbackList = fallbackRegion?.districts || [];
        districtsCacheRef.current[regionId] = fallbackList;
        setDistricts(fallbackList);
      }
    } catch (error) {
      const fallbackRegion = DEFAULT_REGIONS.find(item => `${item.id}` === `${regionId}`);
      const fallbackList = fallbackRegion?.districts || [];
      if (!fallbackList.length) {
        toast.error(get(error, "response.data.message", "Не удалось загрузить районы"));
      }
      districtsCacheRef.current[regionId] = fallbackList;
      setDistricts(fallbackList);
    } finally {
      setDistrictsLoading(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (!tokens?.accessToken) {
      toast.error("Подтвердите номер телефона для продолжения");
      goToStep("personal");
      return;
    }
    setSubmitting(true);
    try {
      const merchantPayload = {
        legalName: formState.business.legal_entity || "",
        type: mapBusinessType(formState.business.business_type),
        taxpayerIdentificationNumber: formState.business.company_inn || "",
        ifut: formState.business.oked || "",
        phoneNumber: formState.business.phone_number2
          ? formatPhoneForApi(formState.business.phone_number2)
          : formatPhoneForApi(formState.personal.phone_number),
        accountName: formState.account.account_name || "",
        mfoBankCode: formState.account.bank_mfo || "",
        ifutBankCode: formState.account.oked || "",
        location: {
          region: formState.location.region_name || formState.location.region_id || "",
          district: formState.location.district_name || formState.location.district_id || "",
          street: formState.location.address || "",
          building: formState.location.house || ""
        }
      };

      const submitInfoResponse = await api.merchant.submitInfo({
        accessToken: tokens.accessToken,
        payload: merchantPayload
      });
      const merchantData = get(submitInfoResponse, "data", submitInfoResponse);
      const merchantId = get(merchantData, "id");

      if (!merchantId) {
        throw new Error("Merchant ID not returned");
      }

      const documentFiles = [];
      const documentTypes = [];

      if (formState.documents.director_passport) {
        documentFiles.push(formState.documents.director_passport);
        documentTypes.push("PASSPORT_OF_DIRECTOR");
      }
      if (formState.documents.license) {
        documentFiles.push(formState.documents.license);
        documentTypes.push("BUSINESS_LICENSE");
      }
      if (formState.documents.appointing_director) {
        documentFiles.push(formState.documents.appointing_director);
        documentTypes.push("APPOINTMENT_ORDER_OF_DIRECTOR");
      }

      if (documentFiles.length) {
        await api.merchant.submitDocs({
          accessToken: tokens.accessToken,
          merchantId,
          files: documentFiles,
          types: documentTypes
        });
      }

      toast.success("Заявка отправлена на рассмотрение");
      setCurrentStep(0);
      setFormState(prev => ({
        personal: {...initialFormState.personal},
        business: {...initialFormState.business},
        documents: {...initialFormState.documents},
        account: {...initialFormState.account},
        location: {...initialFormState.location},
      }));
      invalidateVerification();
      try {
        await api.sellerProfile.get({accessToken: tokens.accessToken});
      } catch (profileError) {
        console.warn("Не удалось обновить профиль продавца", profileError);
      }
      navigate("/dashboard", {replace: true});
    } catch (error) {
      toast.error(get(error, "response.data.message", "Не удалось отправить заявку"));
    } finally {
      setSubmitting(false);
    }
  };

  const verificationInfo = {
    ...verificationState,
    countdown,
  };

  const stepProps = {
    personal: {
      initialValues: formState.personal,
      onNext: (values) => {
        updateSection("personal", {
          ...values,
          identifier: verificationMeta.identifier || "",
          userId: verificationMeta.userId || "",
        });
      },
      verification: verificationInfo,
      onStartVerification: handleStartVerification,
      onVerifyCode: handleVerifyCode,
      onInvalidateVerification: invalidateVerification,
    },
    business: {
      initialValues: formState.business,
      onBack: () => setCurrentStep(prev => Math.max(prev - 1, 0)),
      onNext: (values) => updateSection("business", values),
    },
    documents: {
      initialValues: formState.documents,
      onBack: () => setCurrentStep(prev => Math.max(prev - 1, 0)),
      onNext: (values) => updateSection("documents", values),
    },
    account: {
      initialValues: formState.account,
      onBack: () => setCurrentStep(prev => Math.max(prev - 1, 0)),
      onNext: (values) => updateSection("account", values),
      onOpenAccount: () => navigate("/create-account"),
    },
    location: {
      initialValues: formState.location,
      onBack: () => setCurrentStep(prev => Math.max(prev - 1, 0)),
      onNext: (values) => updateSection("location", values),
      regions,
      regionsLoading,
      districts,
      districtsLoading,
      onRegionChange: handleRegionChange,
      language: get(auth, "data.user.language", "ru"),
    },
    review: {
      data: formState,
      onBack: () => setCurrentStep(prev => Math.max(prev - 1, 0)),
      onEditStep: goToStep,
      onSubmit: handleSubmitForReview,
      submitting,
    },
  };

  const currentStepKey = stepsConfig[currentStep].key;

  return (
    <div className="flex-fill">
      <Stepper current={currentStep}/>
      {currentStepKey === "personal" && <PersonalStep {...stepProps.personal} />}
      {currentStepKey === "business" && <BusinessStep {...stepProps.business} />}
      {currentStepKey === "documents" && <DocumentsStep {...stepProps.documents} />}
      {currentStepKey === "account" && <AccountStep {...stepProps.account} />}
      {currentStepKey === "location" && <LocationStep {...stepProps.location} />}
      {currentStepKey === "review" && <ReviewStep {...stepProps.review} />}
    </div>
  );
};

export default SellerRegisterForm;
