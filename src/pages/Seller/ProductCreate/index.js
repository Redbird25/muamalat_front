import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import MyForm from "../../../schema/Form";
import {get} from "lodash";
import {CREATE, LoadAll as LoadAllDispatch} from "../../../schema/actions";
import {serialize} from "object-to-formdata";
import {toast} from "react-toastify";
import errorClass from "../../../services/ErrorClass";
import {Field} from "formik";
import SelectField from "../../../components/Fields/Select";
import InputPhone from "../../../components/Fields/InputPhone";
import CustomDocumentUploading from "../../../components/CustomDocumentUploading";
import no_image from "../../../assets/images/no-image.png";
import {useDispatch} from "react-redux";

const ProductCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLang, setLang] = useState(1);
  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [typeOptionID, setTypeOptionID] = useState(0);
  const [categories, setCategories] = useState([]);
  const [isDeleteActive, setDeleteActive] = useState(-1);
  
  useEffect(() => {
    dispatch(LoadAllDispatch.request({
      url: "/categories",
      name: "productCategoriesSelect",
      cb: {
        success: (data) => {
          setCategories(data)
        },
        error: (error) => {
          toast.error(error)
        },
        finally: () => {
        
        }
      }
    }));
  }, [dispatch]);
  
  useEffect(() => {
    if (typeOptionID) {
      dispatch(LoadAllDispatch.request({
        url: `/products-types/${typeOptionID}`,
        name: "productCategoriesSelect",
        cb: {
          success: (data) => {
            setCategoriesOptions(data)
          },
          error: (error) => {
            toast.error(error)
          },
          finally: () => {
          
          }
        }
      }));
    }
  }, [dispatch, typeOptionID]);
  
  return (
    <>
      <p className="fs-32 text-greyscale800 fw-700">Добавить товар</p>
      
      <nav className={"clear-before"} aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fs-14 fw-500">
            <Link className="text-75758b text-decoration-none"
                  to="/">Главная</Link>
          </li>
          <li className="breadcrumb-item clear-before fs-14 fw-500">
            <Link className="text-75758b text-decoration-none"
                  to="/dashboard"><i className="fas fa-chevron-right fs-12 me-1"/> Кабинет продавца</Link>
          </li>
          <li className="breadcrumb-item clear-before fs-14 fw-500">
            <Link className="text-75758b text-decoration-none"
                  to="/dashboard/products"><i className="fas fa-chevron-right fs-12 me-1"/> Товары</Link>
          </li>
          <li className="breadcrumb-item clear-before fs-14 fw-500 text-75758b active" aria-current="page">
            <i className="fas fa-chevron-right fs-12 me-1"/> Добавить
          </li>
        </ol>
      </nav>
      
      <div>
        
        <MyForm
          style={{
            padding: "16px 12px"
          }}
          className="border-ebebeb border bg-white custom-rounded-12 mh-100"
          fields={[
            {
              name: "name_ru",
              value: "",
              required: true
            },
            {
              name: "name_uz",
              value: "",
              required: true
            },
            {
              name: "description_ru",
              value: "",
              required: true
            },
            {
              name: "description_uz",
              value: "",
              required: true
            },
            {
              name: "price",
              value: "",
              required: true
            },
            {
              name: "catalog_id",
              value: "",
              type: "object",
              required: true,
              onSubmitValue: obj => get(obj, "id", null)
            },
            {
              name: "category_id",
              value: "",
              type: "object",
              required: true,
              onSubmitValue: obj => get(obj, "id", null)
            },
            {
              name: "sub_category_id",
              value: "",
              type: "object",
              required: true,
              onSubmitValue: obj => get(obj, "id", null)
            },
            {
              name: "count",
              value: "",
              when: valField => {
                valField = valField.when(["product_availability"], {
                  is: value => {
                    return (!value || parseInt(value) === 2)
                  },
                  then: valField.required("Required"),
                  otherwise: valField
                });
                return valField
              },
            },
            {
              name: "product_type_option_ids",
              value: [],
              type: "array",
              min: 1,
              required: true
            },
            /*{
              name: "type_sales",
              value: 1,
              type: "number",
              required: true
            },
            {
              name: "type_payments",
              value: 1,
              type: "number",
              required: true
            },*/
            {
              name: "product_images",
              value: [],
              type: "array",
              min: 1,
              max: 10,
              required: true
            },
            {
              name: "product_availability",
              value: "",
              required: true
            }
          ]}
          onSubmit={({values, setSubmitting, resetForm}) => {
            if (get(values, "product_images", []).length > 5) {
              get(values, "product_images", []).slice(0, 5)
            }
            const FormValues = {
              ...values,
              main_image: get(values, "product_images.[0]", []),
              product_images: get(values, "product_images", []),
              product_type_option_ids: get(values, "product_type_option_ids", []).flat(1)
            }
            dispatch(CREATE.request({
              url: "/seller/products/store",
              name: "productCreate",
              values: serialize(FormValues, {indices: true}),
              cb: {
                success: () => {
                  resetForm();
                  toast.success("Tovar qo'shildi!")
                  navigate("/dashboard/products")
                },
                errors: (error) => {
                  toast.error(get(error, "message"), {
                    position: "top-right",
                    pauseOnHover: true
                  })
                },
                finally: () => {
                  setSubmitting(false)
                }
              }
            }))
          }}
        >
          {({values, touched, errors, setFieldValue, setFieldTouched, isSubmitting}) => {
            return <>
              <div className="p-3 bg-f1f1f1 custom-rounded-12 mb-3">
                <div className="bg-white custom-rounded-12 d-inline-block mb-3">
                  <button type="button"
                          className={`btn focus-none px-3 custom-rounded-12 ${isLang === 1 ? "text-white bg-374957" : `${errorClass(errors, touched, "name_uz", true) || errorClass(errors, touched, "description_uz", true) ? "text-danger" : "text-75758b"}`} fs-14 fw-500 me-2`}
                          onClick={() => setLang(1)}
                          style={{
                            minHeight: 42
                          }}
                  >
                    Ўзбек тилида
                  </button>
                  <button type="button"
                          className={`btn focus-none px-3 custom-rounded-12 ${isLang === 2 ? "text-white bg-374957" : `${errorClass(errors, touched, "name_ru", true) || errorClass(errors, touched, "description_ru", true) ? "text-danger" : "text-75758b"}`} fs-14 fw-500`}
                          onClick={() => setLang(2)}
                          style={{
                            minHeight: 42
                          }}
                  >
                    На русском
                  </button>
                </div>
                
                
                {
                  isLang === 1
                    ? <>
                      <div className="mb-3">
                        <label htmlFor="name_uz" className="form-label fs-14 fw-600 text-141316">Название</label>
                        <Field
                          className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "name_uz")}`}
                          id={"name_uz"}
                          name={"name_uz"}
                          placeholder="Введите название товара"
                          onChange={(val) => {
                            setFieldValue(`name_uz`, val.target.value);
                          }}
                          onBlur={() => setFieldTouched(`name_uz`, true)}
                          style={{minHeight: 50}}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="description_uz" className="form-label fs-14 fw-600 text-141316">Описание
                          товара</label>
                        <Field
                          as={"textarea"}
                          className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "description_uz")}`}
                          id={"description_uz"}
                          name={"description_uz"}
                          rows="3"
                          placeholder="Введите описание товара"
                          onChange={(val) => {
                            setFieldValue(`description_uz`, val.target.value);
                          }}
                          onBlur={() => setFieldTouched(`description_uz`, true)}
                          style={{minHeight: 50}}
                        ></Field>
                      </div>
                    </>
                    : <>
                      <>
                        <div className="mb-3">
                          <label htmlFor="name_ru" className="form-label fs-14 fw-600 text-141316">Название</label>
                          <Field
                            className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "name_ru")}`}
                            id={"name_ru"}
                            name={"name_ru"}
                            placeholder="Введите название товара"
                            onChange={(val) => {
                              setFieldValue(`name_ru`, val.target.value);
                            }}
                            onBlur={() => setFieldTouched(`name_ru`, true)}
                            style={{minHeight: 50}}
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="description_ru" className="form-label fs-14 fw-600 text-141316">Описание
                            товара</label>
                          <Field
                            as={"textarea"}
                            className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "description_ru")}`}
                            id={"description_ru"}
                            name={"description_ru"}
                            rows="3"
                            placeholder="Введите описание товара"
                            onChange={(val) => {
                              setFieldValue(`description_ru`, val.target.value);
                            }}
                            onBlur={() => setFieldTouched(`description_ru`, true)}
                            style={{minHeight: 50}}
                          ></Field>
                        </div>
                      </>
                    </>
                }
              
              
              </div>
              
              <div className="row">
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label htmlFor="catalog_id" className="form-label fs-14 fw-600 text-141316">Категория</label>
                    <Field
                      name={"catalog_id"}
                      inputId={"catalog_id"}
                      id={"catalog_id"}
                      component={SelectField}
                      isMulti={false}
                      className={`custom-react-select-easy ${errorClass(errors, touched, "catalog_id")}`}
                      classNamePrefix={"custom-react-select"}
                      onChange={obj => {
                        setFieldValue('catalog_id', obj);
                        setFieldValue('category_id', null);
                        setFieldValue('sub_category_id', null);
                      }}
                      isSearchable
                      closeMenuOnSelect
                      placeholder={"Выберите арктикул"}
                      options={categories}
                      optionLabel={"name"}
                      optionValue={"id"}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="category_id" className="form-label fs-14 fw-600 text-141316">Суб-категория</label>
                    <Field
                      name={"category_id"}
                      inputId={"category_id"}
                      id={"category_id"}
                      isDisabled={!get(values, "catalog_id")}
                      component={SelectField}
                      isMulti={false}
                      className={`custom-react-select-easy ${errorClass(errors, touched, "catalog_id")}`}
                      classNamePrefix={"custom-react-select"}
                      onChange={obj => {
                        setFieldValue('category_id', obj);
                        setFieldValue('sub_category_id', null);
                        setTypeOptionID(get(obj, "id"));
                      }}
                      isSearchable
                      closeMenuOnSelect
                      placeholder={"Выберите категорию"}
                      options={get(categories.find(({id}) => id === get(values, "catalog_id.id")), "sub_categories")}
                      optionLabel={"name"}
                      optionValue={"id"}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="sub_category_id"
                           className="form-label fs-14 fw-600 text-141316">Производитель</label>
                    <Field
                      name={"sub_category_id"}
                      inputId={"sub_category_id"}
                      id={"sub_category_id"}
                      isDisabled={!get(values, "catalog_id") || !get(values, "category_id")}
                      component={SelectField}
                      isMulti={false}
                      className={`custom-react-select-easy ${errorClass(errors, touched, "catalog_id")}`}
                      classNamePrefix={"custom-react-select"}
                      onChange={obj => {
                        setFieldValue('sub_category_id', obj);
                      }}
                      isSearchable
                      closeMenuOnSelect
                      placeholder={"Выберите производитель"}
                      options={get(get(categories.find(({id}) => id === get(values, "catalog_id.id")), "sub_categories", []).find(({id}) => id === get(values, "category_id.id")), "sub_categories")}
                      optionLabel={"name"}
                      optionValue={"id"}
                    />
                  </div>
                  {
                    get(values, "sub_category_id.id") && categoriesOptions.map((item, number) => {
                      return <div className="mb-3" key={number}>
                        <label htmlFor="product_type_option_ids"
                               className="form-label fs-14 fw-600 text-141316">{get(item, "name")}</label>
                        <Field
                          name={`product_type_option_ids.[${number}]`}
                          inputId={`product_type_option_ids.[${number}]`}
                          id={`product_type_option_ids.[${number}]`}
                          component={SelectField}
                          isMulti={true}
                          className={`custom-react-select-easy ${errorClass(errors, touched, "product_type_option_ids")}`}
                          classNamePrefix={"custom-react-select"}
                          onChange={obj => {
                            setFieldValue(`product_type_option_ids.[${number}]`, obj.map(({id}) => id));
                          }}
                          isSearchable
                          closeMenuOnSelect
                          placeholder={"Выберите производитель"}
                          options={get(item, "product_type_options", [])}
                          optionLabel={"name"}
                          optionValue={"id"}
                        />
                      </div>
                    })
                  }
                
                </div>
                
                <div className="col-lg-6">
                  <div className="row">
                    {/*<div className="col-xl-6">
                        <label className="form-label fs-14 fw-600 text-141316">Тип продаж</label>
                        <div className="mb-3">
                          <label htmlFor="type_sales_1"
                                 className="form-label position-relative w-100 custom-rounded-12 border mb-0 d-flex align-items-center text-75758b fs-14 fw-600"
                                 style={{minHeight: 50, padding: "6px 12px"}}
                          >
                            Производитель
                            <Field type="radio"
                                   checked={get(values, "type_sales") === 1}
                                   name="type_sales"
                                   id={"type_sales_1"}
                                   onChange={() => setFieldValue("type_sales", 1)}
                                   className="form-check-input radio-active mt-0 rounded-circle position-absolute color-warning focus-none"
                                   style={{right: 15, width: 20, height: 20}}
                            />
                          </label>
                        
                        
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="type_sales_2"
                                 className="form-label position-relative w-100 custom-rounded-12 border mb-0 d-flex align-items-center text-75758b fs-14 fw-600"
                                 style={{minHeight: 50, padding: "6px 12px"}}>
                            Только оптом
                            <Field type="radio"
                                   checked={get(values, "type_sales") === 2}
                                   name="type_sales"
                                   onChange={() => setFieldValue("type_sales", 2)}
                                   className="form-check-input radio-active mt-0 rounded-circle position-absolute color-warning focus-none"
                                   id="type_sales_2" style={{right: 15, width: 20, height: 20}}/>
                          </label>
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="type_sales_3"
                                 className="form-label position-relative w-100 custom-rounded-12 border mb-0 d-flex align-items-center text-75758b fs-14 fw-600"
                                 style={{minHeight: 50, padding: "6px 12px"}}>
                            Оптом и в розницу
                            <Field type="radio"
                                   checked={get(values, "type_sales") === 3}
                                   name="type_sales"
                                   onChange={() => setFieldValue("type_sales", 3)}
                                   className="form-check-input radio-active mt-0 rounded-circle position-absolute color-warning focus-none"
                                   id="type_sales_3" style={{right: 15, width: 20, height: 20}}/>
                          </label>
                        </div>
                      </div>
                      
                      <div className="col-xl-6">
                        <label className="form-label fs-14 fw-600 text-141316">Способ оплаты</label>
                        <div className="mb-3">
                          <label htmlFor="type_payments_1"
                                 className="form-label position-relative w-100 custom-rounded-12 border mb-0 d-flex align-items-center text-75758b fs-14 fw-600"
                                 style={{minHeight: 50, padding: "6px 12px"}}>
                            Наличные
                            <Field type="radio"
                                   checked={get(values, "type_payments") === 1}
                                   name="type_payments"
                                   onChange={() => setFieldValue("type_payments", 1)}
                                   className="form-check-input radio-active rounded-circle mt-0 position-absolute color-warning focus-none"
                                   id="type_payments_1" style={{right: 15, width: 20, height: 20}}/>
                          </label>
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="type_payments_2"
                                 className="form-label position-relative w-100 custom-rounded-12 border mb-0 d-flex align-items-center text-75758b fs-14 fw-600"
                                 style={{minHeight: 50, padding: "6px 12px"}}>
                            Оплата через Payme
                            <Field type="radio"
                                   name="type_payments"
                                   checked={get(values, "type_payments") === 2}
                                   onChange={() => setFieldValue("type_payments", 2)}
                                   className="form-check-input radio-active rounded-circle mt-0 position-absolute color-warning focus-none"
                                   id="type_payments_2" style={{right: 15, width: 20, height: 20}}/>
                          </label>
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="type_payments_3"
                                 className="form-label position-relative w-100 custom-rounded-12 border mb-0 d-flex align-items-center text-75758b fs-14 fw-600"
                                 style={{minHeight: 50, padding: "6px 12px"}}>
                            Оплата через Click
                            <Field type="radio"
                                   name="type_payments"
                                   checked={get(values, "type_payments") === 3}
                                   onChange={() => setFieldValue("type_payments", 3)}
                                   className="form-check-input radio-active rounded-circle mt-0 position-absolute color-warning focus-none"
                                   id="type_payments_3" style={{right: 15, width: 20, height: 20}}/>
                          </label>
                        </div>
                      </div>*/}
                    <div className="col-lg-8">
                      <div className="mb-3">
                        <label htmlFor="product_price"
                               className="form-label fs-14 fw-600 text-141316">Наличие</label>
                        <Field
                          className={`form-select border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "product_availability")}`}
                          id={"product_availability"}
                          name={"product_availability"}
                          placeholder="Введите количество"
                          value={get(values, "product_availability")}
                          onChange={(e) => {
                            setFieldValue("product_availability", e.target.value);
                            if (parseInt(e.target.value) === 2) {
                              setFieldValue(`count`, "0");
                            }
                          }}
                          as={"select"}
                          onBlur={() => setFieldTouched("product_availability")}
                          style={{minHeight: 50}}
                        >
                          <option value="" hidden>Выберите</option>
                          <option value="1">В наличии</option>
                          <option value="2">Нет в наличии</option>
                        </Field>
                      </div>
                    </div>
                    
                    <div className="col-lg-4 ps-lg-0">
                      <div className="mb-3">
                        <label htmlFor={"count"}
                               className="form-label fs-14 fw-600 text-141316">Остатки</label>
                        <Field
                          className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "count")}`}
                          component={InputPhone}
                          id={"count"}
                          name={"count"}
                          placeholder="0"
                          decimalScale={0}
                          value={get(values, "count")}
                          thousandSeparator={" "}
                          allowLeadingZeros={false}
                          disabled={parseInt(get(values, "product_availability")) === 2}
                          allowNegative={false}
                          isNumericString
                          onValueChange={(val) => {
                            setFieldValue(`count`, val.value);
                          }}
                          onBlur={() => setFieldTouched(`count`, true)}
                          style={{
                            minHeight: 50,
                            border: "1px solid #E4C87C",
                            backgroundColor: "#F6E3AF"
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-12 mt-lg-2 mt-3">
                      <div className="bg-f1f1f1 px-3 pt-3 pb-4 custom-rounded-12 mb-3 mt-3">
                        <div className="mb-3">
                          <label htmlFor="product_price" className="form-label fs-14 fw-600 text-141316 mb-3">Цена
                            товара</label>
                          <Field
                            className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "price")}`}
                            component={InputPhone}
                            id={"price"}
                            name={"price"}
                            placeholder="Введите цену товара"
                            decimalScale={0}
                            thousandSeparator={" "}
                            allowLeadingZeros={true}
                            allowNegative={false}
                            isNumericString
                            onValueChange={(val) => {
                              setFieldValue(`price`, val.value);
                            }}
                            onBlur={() => setFieldTouched(`price`, true)}
                            style={{minHeight: 50}}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-f1f1f1 custom-rounded-12 mb-3">
                <div className="row">
                  <div className="col-xl-6 mb-xl-0 mb-3 d-flex flex-column justify-content-between">
                    <div>
                      <p className="fs-14 text-141316 mb-0"><b className="fs-16 fw-600">Изображения</b> (макс. 10 шт)
                      </p>
                      
                      <p className={"fs-12 lh-15 text-838383 my-2"}>
                        Загрузите максимальное количество фотографий к товарам Чем больше фотографий товара тем больше
                        заинтересованность потенциальных покупателей Первое фото будет основной фотографией товара
                      </p>
                      
                      <p className={"fs-12 text-141316 lh-15"}>
                        Загружено {get(values, "product_images", []).length} /10
                        <br/>
                        Формат JPG, JPEG, PNG, GIF, WEBP, TIF, TIFF
                        <br/>
                        Рекомендуемый размер: 1000x800px
                        <br/>
                        Максимальный размер файла до 10 МБ
                      </p>
                    </div>
                    
                    <Field
                      text={"Загрузить"}
                      id={"product_images"}
                      component={CustomDocumentUploading}
                      classValidInput={errorClass(errors, touched, `product_images`)}
                      classValidBtn={errorClass(errors, touched, `product_images`, true) ? "border-danger bg-danger" : ""}
                      icon={<i className="hgi hgi-stroke hgi-file-01"/>}
                      fileLink={get(values, `product_images`)}
                      fileName={get(values, `product_images`)}
                      inputName={`product_images`}
                      formats={"image/*"}
                      isMulti={true}
                      showPreview={false}
                      onChange={files => {
                        setFieldValue(`product_images`, files)
                      }}
                      values={values}
                    />
                  </div>
                  <div className="col-xl-6 h-100">
                    <div className="row gx-3 h-100">
                      {
                        [...Array(10).keys()].map(number => {
                          return <div key={number} className="w-lg-20 mb-lg-0 mb-3 h-100">
                            <div
                              onClick={() => {
                                if (isDeleteActive === number) {
                                  setDeleteActive(-1);
                                } else {
                                  setDeleteActive(number);
                                }
                              }}
                              className={`image-parent-product ${number <= 4 ? "mb-3" : ""} ${get(values, `product_images.[${number}]`, null) ? "bg-white" : "bg-d9d9d9"} position-relative h-100 p-2 d-flex align-items-center justify-content-center custom-rounded-12`}
                              style={{
                                minHeight: 105,
                                border: isDeleteActive === number ? "2px solid #E2C881" : "unset"
                              }}>
                              <img
                                className={`image-preview-product ${get(values, `product_images.[${number}]`, null) ? "w-100" : ""}`}
                                src={get(values, `product_images.[${number}]`, null) ? URL.createObjectURL(get(values, `product_images.[${number}]`, null)) : no_image}
                                alt="no-image"/>
                              {
                                get(values, `product_images.[${number}]`, null) && isDeleteActive === number
                                  ? <button
                                    onClick={() => {
                                      const filtered = get(values, "product_images", []).filter((_, index) => number !== index);
                                      setDeleteActive(-1);
                                      setFieldValue(`product_images`, filtered);
                                    }}
                                    type="button"
                                    className={`btn image-remove-product p-0 ${get(values, `product_images.[${number}]`, null) ? "" : "d-none"} text-danger me-1 mb-1 position-absolute bottom-0 end-0 rounded-circle bg-white shadow`}
                                    style={{width: 25, height: 25}}
                                  >
                                    <i className="far fa-trash-alt fs-12"/>
                                  </button>
                                  : null
                              }
                            </div>
                          </div>
                        })
                      }
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <button type="submit" disabled={isSubmitting}
                        className="btn btn-menu custom-rounded-8 focus-none h-100 w-lg-auto w-100 mb-3"
                        style={{minWidth: 300, minHeight: 50}}>
                  <span className="bg-gradient-custom reverse custom-rounded-8"/>
                  <span
                    className="position-relative d-flex align-items-center justify-content-center fs-17 fw-600 custom-zindex-2">
                    Сохранить
                  </span>
                </button>
              </div>
            </>
          }}
        
        
        </MyForm>
      
      </div>
    </>
  );
};

export default ProductCreate;
