import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {get} from "lodash";
import {LoadAll} from "../../schema/container";
import {CREATE, DELETE, LoadAll as LoadAllDispatch, METHOD} from "../../schema/actions";
import {Empty, Modal, Pagination, Spinner} from "../../components";
import InputPhone from "../../components/Fields/InputPhone";
import no_image from "assets/images/no-image.png"
import MyForm from "../../schema/Form";
import {Field} from "formik";
import SelectField from "../../components/Fields/Select";
import {useDispatch} from "react-redux";
import {toast} from "react-toastify";
import errorClass from "../../services/ErrorClass";
import CustomDocumentUploading from "../../components/CustomDocumentUploading";
import {serialize} from "object-to-formdata";
import {resolvePrimaryImageUrl} from "../../services/utils";

const Products = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [isTab, setTab] = useState(true);
  const [isModal, setModal] = useState(false);
  const [isLang, setLang] = useState(1);
  const [categories, setCategories] = useState([]);
  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [typeOptionID, setTypeOptionID] = useState(0);
  const [requestReset, setRequestReset] = useState(true);
  const [isFilter, setFiler] = useState({
      name: "",
      status: "",
      type: "",
      product: ""
    }
  );
  
  useEffect(() => {
    if (isModal) {
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
    }
  }, [dispatch, isModal]);
  
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
      <p className="fs-32 text-greyscale800 fw-700">Товары</p>
      
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
          <li className="breadcrumb-item clear-before fs-14 fw-500 text-75758b active" aria-current="page">
            <i className="fas fa-chevron-right fs-12 me-1"/> Товары
          </li>
        </ol>
      </nav>
      
      
      <div className="d-flex flex-wrap align-items-center justify-content-between">
        <ul className="nav nav-tabs custom-tab-nav admin">
          <li className="nav-item mb-md-4 mb-2">
            <button className={`nav-link border-0 ${isTab ? "active" : ""}`}
                    type="button"
                    onClick={() => setTab(true)}
                    style={{minWidth: 175}}>
              В Продаже
            </button>
          </li>
          <li className="nav-item mb-md-4 mb-2">
            <button className={`nav-link border-0 ${!isTab ? "active" : ""}`}
                    type="button"
                    onClick={() => setTab(false)}
                    style={{minWidth: 175}}>
              Архив
            </button>
          </li>
        </ul>
        
        <button
          /*onClick={() => setModal(true)}*/
          onClick={() => navigate("/dashboard/products/create")}
          type="button"
          className="btn btn-menu custom-rounded-12 focus-none h-100 w-lg-auto w-100 mb-3"
          style={{minWidth: 275}}
          data-bs-toggle="modal" data-bs-target="#addProduct">
          <span className="bg-gradient-custom reverse custom-rounded-12"/>
          <span
            className="position-relative d-flex align-items-center justify-content-center fs-16 fw-600 custom-zindex-2">
                                    Создать товар <i className="fal ms-2 fs-18 fa-plus"/>
                                </span>
        </button>
      </div>
      
      <div className="tab-content custom-tab-content mb-5">
        <div className={`tab-pane ${isTab ? "show active" : "fade"}`}>
          <div className="bg-white p-3 border border-e6e5ed custom-rounded-20">
            <div className="row">
              <div className="col-lg-3">
                <div className="input-group mb-3">
                                    <span
                                      className="input-group-text custom-rounded-start-12 border-f0f1f2 bg-transparent border-end-0"
                                      id="basic-addon1">
                                        <i className="far fa-search text-75758b"></i>
                                    </span>
                  <input type="text"
                         value={get(isFilter, "name")}
                         onChange={(e) => setFiler(prevState => ({...prevState, name: e.target.value}))}
                         className="form-control focus-none custom-rounded-end-12 text-75758b fw-500 border-f0f1f2 border-start-0"
                         placeholder="Поиск" aria-label="Username"
                         aria-describedby="basic-addon1"/>
                </div>
              </div>
              
              <div className="col-lg-3">
                <div className="mb-3">
                  <select
                    value={get(isFilter, "status")}
                    onChange={(e) => setFiler(prevState => ({...prevState, status: e.target.value}))}
                    className="form-select focus-none custom-rounded-12 text-75758b fw-500 border-f0f1f2">
                    <option value="" hidden>Статус</option>
                    <option value="1">Статус 1</option>
                    <option value="2">Статус 2</option>
                  </select>
                </div>
              </div>
              
              <div className="col-lg-3">
                <div className="mb-3">
                  <select
                    value={get(isFilter, "type")}
                    onChange={(e) => setFiler(prevState => ({...prevState, type: e.target.value}))}
                    className="form-select focus-none custom-rounded-12 text-75758b fw-500 border-f0f1f2">
                    <option value="" hidden>Тип продажи</option>
                    <option value="1">Тип продажи 1</option>
                    <option value="2">Тип продажи 2</option>
                  </select>
                </div>
              </div>
              
              <div className="col-lg-3">
                <div className="mb-3">
                  <select
                    value={get(isFilter, "product")}
                    onChange={(e) => setFiler(prevState => ({...prevState, product: e.target.value}))}
                    className="form-select focus-none custom-rounded-12 text-75758b fw-500 border-f0f1f2">
                    <option value="" hidden>Наличие товара</option>
                    <option value="1">Наличие товара 1</option>
                    <option value="2">Наличие товара 2</option>
                  </select>
                </div>
              </div>
            
            </div>
            <div className="row">
              <div className="w-xl-10 w-md-25 w-sm-50">
                <div
                  className="bg-f1f1f1 text-75758b d-flex align-items-center justify-content-center p-2 fs-14 fw-500 custom-rounded-12"
                  style={{minHeight: 44}}>
                  Фото
                </div>
              </div>
              
              <div className="w-xl-50 order-last order-xl-0 mt-xl-0 mt-2">
                <div
                  className="bg-f1f1f1 text-75758b d-flex align-items-center justify-content-center p-2 fs-14 fw-500 custom-rounded-12"
                  style={{minHeight: 44}}>
                  Информация
                </div>
              </div>
              
              <div className="w-xl-10 w-md-25 w-sm-50 mt-sm-0 mt-2">
                <div
                  className="bg-f1f1f1 text-75758b d-flex align-items-center justify-content-center p-2 fs-14 fw-500 custom-rounded-12"
                  style={{minHeight: 44}}>
                  Наличие
                </div>
              </div>
              <div className="w-xl-15 w-md-25 w-sm-50 mt-md-0 mt-2">
                <div
                  className="bg-f1f1f1 text-75758b d-flex align-items-center justify-content-center p-2 fs-14 fw-500 custom-rounded-12"
                  style={{minHeight: 44}}>
                  Цена
                </div>
              </div>
              <div className="w-xl-15 w-md-25 w-sm-50 mt-md-0 mt-2">
                <div
                  className="bg-f1f1f1 text-75758b d-flex align-items-center justify-content-center p-2 fs-14 fw-500 custom-rounded-12"
                  style={{minHeight: 44}}>
                  <i className="far fa-cog fs-22"/>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 mt-3">
                <LoadAll
                  url={"/products"}
                  name={"cabinetProducts"}
                  isActive={requestReset}
                  params={{
                    page,
                    perPage: 15
                  }}
                  onSuccess={() => {
                  
                  }}
                  onError={() => {
                  
                  }}
                  onFinally={() => {
                  
                  }}
                >
                  {({isFetched, data = [], meta = []}) => {
                    return <>
                      {
                        !isFetched
                          ? <Spinner center height parentHeight={"h-auto"}/>
                          : isFetched && data.length
                            ? data.map((item, number) => <div className="border p-3 custom-rounded-12 mb-3" key={number}>
                              <div className="row align-items-center">
                                <div className="w-xl-10 w-md-25 w-sm-50 min-h-70">
                                  <div className="p-2 custom-rounded-12">
                                    <img src={resolvePrimaryImageUrl(item) || no_image} className="w-100"
                                         alt="article"/>
                                  </div>
                                </div>
                                
                                <div className="w-xl-50 border-start-xl border-a7a7a7 order-last order-xl-0 mt-xl-0 mt-2">
                                  <div className="px-2">
                                    <p className="fs-14 fw-700 text-greyscale800 mb-1">{get(item, "name")}</p>
                                    
                                    <div className="row">
                                      <div className="col-lg-3 border-end border-f1f1f1">
                                        <span className="fs-12 text-greyscale800 d-block mb-1">Статус</span>
                                        
                                        {
                                          parseInt(get(item, "active")) === 1
                                            ? <span
                                              className="custom-rounded-8 bg-34c759 text-white text-center fs-12 fw-600 py-1 mt-1 d-block w-100">
                                                                    Активный
                                        </span>
                                            : <span
                                              className="custom-rounded-8 bg-34c759 text-white text-center fs-12 fw-600 py-1 mt-1 d-block w-100">
                                                                    {parseInt(get(item, "active"))}
                                        </span>
                                        }
                                      
                                      </div>
                                      
                                      <div className="col-lg-6 border-end border-f1f1f1">
                                        <span className="fs-12 text-greyscale800 d-block mb-1">Посмотреть</span>
                                        
                                        <div className="row">
                                          <div className="col-xxl-6 mb-xxl-0 mb-2">
                                            <Link to={`/product/${get(item, "id")}`}
                                                  className="custom-rounded-8 text-decoration-none hover-effect bg-f8f8f9 border-e5e7e9 border text-center text-334150 fs-12 fw-600 px-4 py-1 w-100 d-block">
                                              На сайте
                                            </Link>
                                          </div>
                                          
                                          <div className="col-xxl-6">
                                            <Link to={`/catalog/${get(item, "catalog_products.[0].sub_category_id")}`}
                                                  className="custom-rounded-8 text-decoration-none hover-effect bg-f8f8f9 border-e5e7e9 border text-center text-334150 fs-12 fw-600 px-4 py-1 w-100 d-block">
                                              В каталоге
                                            </Link>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="col-lg-3">
                                        <span className="fs-12 text-greyscale800 d-block mb-1">Категория</span>
                                        
                                        <Link to={`/catalog/${get(item, "catalog_products.[0].category.parent.id")}`}
                                              className="custom-rounded-8 text-decoration-none bg-f8f8f9 border-e5e7e9 border text-center hover-effect text-334150 fs-12 fw-600 py-1 w-100 d-block">
                                          {get(item, "catalog_products.[0].category.parent.name")}
                                        </Link>
                                      </div>
                                    </div>
                                  
                                  </div>
                                </div>
                                
                                <div
                                  className="w-xl-10 w-md-25 w-sm-50 border-top border-top-sm-0 border-start-sm d-flex align-items-center justify-content-center border-a7a7a7 text-greyscale800 fs-14 text-center min-h-70">
                                  <b>{get(item, "count")}</b>&nbsp;шт
                                </div>
                                
                                <div
                                  className="w-xl-15 w-md-25 w-sm-50 border-top border-top-sm-0 border-start-md d-flex align-items-center justify-content-center border-a7a7a7 text-greyscale800 fs-14 text-center min-h-70">
                                  <b><InputPhone value={get(item, "price")} thousandSeparator={" "} displayType={"text"}/></b>
                                </div>
                                
                                <div
                                  className="w-xl-15 w-md-25 w-sm-50 border-top border-top-sm-0 border-start-sm d-flex align-items-center justify-content-center border-a7a7a7 text-greyscale800 fs-14 text-center min-h-70">
                                  <button type="button" className="btn focus-none">
                                    <i className="fas fa-pen text-34c759"/>
                                  </button>
                                  <button type="button" className="btn focus-none mx-2">
                                    <i className="fi fi-sr-eye fs-17 text-3d82c4"/>
                                  </button>
                                  <button
                                    onClick={() => {
                                      dispatch(METHOD.request({
                                        url: `/seller/product-delete/${get(item, "id")}`,
                                        name: "deleteProduct",
                                        cb: {
                                          success: () => {
                                            dispatch(DELETE.success({
                                              id: get(item, "id"),
                                              name: "cabinetProducts",
                                            }));
                                          },
                                          error: (error) => {
                                            console.log(error)
                                          },
                                          finally: () => {
                                          
                                          }
                                        }
                                      }))
                                    }}
                                    type="button"
                                    className="btn focus-none">
                                    <i className="fi fi-sr-trash fs-17 text-f04e79"/>
                                  </button>
                                </div>
                              </div>
                            </div>)
                            : <Empty className={"mb-3"} text={"Ma'lumot yo'q"}/>
                      }
                      <Pagination
                        className={'custom-style flex-wrap justify-content-center'}
                        pageRange={1}
                        marginPage={1}
                        initialPage={page}
                        pageCount={Math.ceil(get(meta, 'total', 1) / 15)}
                        onChange={n => setPage(n)}
                      />
                    </>
                  }}
                </LoadAll>
              
              </div>
            </div>
          </div>
        </div>
        
        <div className={`tab-pane ${!isTab ? "show active" : "fade"}`}>
          <div className="bg-white p-3 border border-e6e5ed custom-rounded-20">
            <div className="row">
              <div className="col-lg-3">
                <div className="input-group mb-3">
                                    <span
                                      className="input-group-text custom-rounded-start-12 border-f0f1f2 bg-transparent border-end-0"
                                      id="basic-addon1">
                                        <i className="far fa-search text-75758b"></i>
                                    </span>
                  <input type="text"
                         value={get(isFilter, "name")}
                         onChange={(e) => setFiler(prevState => ({...prevState, name: e.target.value}))}
                         className="form-control focus-none custom-rounded-end-12 text-75758b fw-500 border-f0f1f2 border-start-0"
                         placeholder="Поиск" aria-label="Username"
                         aria-describedby="basic-addon1"/>
                </div>
              </div>
              
              <div className="col-lg-3">
                <div className="mb-3">
                  <select
                    value={get(isFilter, "status")}
                    onChange={(e) => setFiler(prevState => ({...prevState, status: e.target.value}))}
                    className="form-select focus-none custom-rounded-12 text-75758b fw-500 border-f0f1f2">
                    <option value="" hidden>Статус</option>
                    <option value="1">Статус 1</option>
                    <option value="2">Статус 2</option>
                  </select>
                </div>
              </div>
              
              <div className="col-lg-3">
                <div className="mb-3">
                  <select
                    value={get(isFilter, "type")}
                    onChange={(e) => setFiler(prevState => ({...prevState, type: e.target.value}))}
                    className="form-select focus-none custom-rounded-12 text-75758b fw-500 border-f0f1f2">
                    <option value="" hidden>Тип продажи</option>
                    <option value="1">Тип продажи 1</option>
                    <option value="2">Тип продажи 2</option>
                  </select>
                </div>
              </div>
              
              <div className="col-lg-3">
                <div className="mb-3">
                  <select
                    value={get(isFilter, "product")}
                    onChange={(e) => setFiler(prevState => ({...prevState, product: e.target.value}))}
                    className="form-select focus-none custom-rounded-12 text-75758b fw-500 border-f0f1f2">
                    <option value="" hidden>Наличие товара</option>
                    <option value="1">Наличие товара 1</option>
                    <option value="2">Наличие товара 2</option>
                  </select>
                </div>
              </div>
            
            </div>
            <div className="row">
              <div className="w-xl-10 w-md-25 w-sm-50">
                <div
                  className="bg-f1f1f1 text-75758b d-flex align-items-center justify-content-center p-2 fs-14 fw-500 custom-rounded-12"
                  style={{minHeight: 44}}>
                  Фото
                </div>
              </div>
              
              <div className="w-xl-50 order-last order-xl-0 mt-xl-0 mt-2">
                <div
                  className="bg-f1f1f1 text-75758b d-flex align-items-center justify-content-center p-2 fs-14 fw-500 custom-rounded-12"
                  style={{minHeight: 44}}>
                  Информация
                </div>
              </div>
              
              <div className="w-xl-10 w-md-25 w-sm-50 mt-sm-0 mt-2">
                <div
                  className="bg-f1f1f1 text-75758b d-flex align-items-center justify-content-center p-2 fs-14 fw-500 custom-rounded-12"
                  style={{minHeight: 44}}>
                  Наличие
                </div>
              </div>
              <div className="w-xl-15 w-md-25 w-sm-50 mt-md-0 mt-2">
                <div
                  className="bg-f1f1f1 text-75758b d-flex align-items-center justify-content-center p-2 fs-14 fw-500 custom-rounded-12"
                  style={{minHeight: 44}}>
                  Цена
                </div>
              </div>
              <div className="w-xl-15 w-md-25 w-sm-50 mt-md-0 mt-2">
                <div
                  className="bg-f1f1f1 text-75758b d-flex align-items-center justify-content-center p-2 fs-14 fw-500 custom-rounded-12"
                  style={{minHeight: 44}}>
                  <i className="far fa-cog fs-22"/>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 mt-3">
                <LoadAll
                  url={"/products"}
                  isActive={!isTab}
                  name={"cabinetProductsArchive"}
                  params={{
                    page,
                    perPage: 15,
                    extra: {
                      archive: true
                    }
                  }}
                  onSuccess={() => {
                  
                  }}
                  onError={() => {
                  
                  }}
                  onFinally={() => {
                  
                  }}
                >
                  {({isFetched, data = [], meta = []}) => {
                    return <>
                      {
                        !isFetched
                          ? <Spinner center height parentHeight={"h-auto"}/>
                          : isFetched && data.length
                            ? data.map((item, number) => <div className="border p-3 custom-rounded-12 mb-3" key={number}>
                              <div className="row align-items-center">
                                <div className="w-xl-10 w-md-25 w-sm-50 min-h-70">
                                  <div className="p-2 custom-rounded-12">
                                    <img src={resolvePrimaryImageUrl(item) || no_image} className="w-100"
                                         alt="article"/>
                                  </div>
                                </div>
                                
                                <div className="w-xl-50 border-start-xl border-a7a7a7 order-last order-xl-0 mt-xl-0 mt-2">
                                  <div className="px-2">
                                    <p className="fs-14 fw-700 text-greyscale800 mb-1">{get(item, "name")}</p>
                                    
                                    <div className="row">
                                      <div className="col-lg-3 border-end border-f1f1f1">
                                        <span className="fs-12 text-greyscale800 d-block mb-1">Статус</span>
                                        
                                        <span
                                          className="custom-rounded-8 bg-34c759 text-white text-center fs-12 fw-600 px-4 py-1 mt-2 d-block w-100">
                                                                    Активный
                                                                </span>
                                      </div>
                                      
                                      <div className="col-lg-6 border-end border-f1f1f1">
                                        <span className="fs-12 text-greyscale800 d-block mb-1">Посмотреть</span>
                                        
                                        <div className="row">
                                          <div className="col-xxl-6 mb-xxl-0 mb-2">
                                            <Link to={`/product/${get(item, "id")}`}
                                                  className="custom-rounded-8 text-decoration-none hover-effect bg-f8f8f9 border-e5e7e9 border text-center text-334150 fs-12 fw-600 px-4 py-1 w-100 d-block">
                                              На сайте
                                            </Link>
                                          </div>
                                          
                                          <div className="col-xxl-6">
                                            <Link to={`/catalog/${get(item, "catalog_products.[0].sub_category_id")}`}
                                                  className="custom-rounded-8 text-decoration-none hover-effect bg-f8f8f9 border-e5e7e9 border text-center text-334150 fs-12 fw-600 px-4 py-1 w-100 d-block">
                                              В каталоге
                                            </Link>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="col-lg-3">
                                        <span className="fs-12 text-greyscale800 d-block mb-1">Категория</span>
                                        
                                        <Link to={`/catalog/${get(item, "catalog_products.[0].category.parent.id")}`}
                                              className="custom-rounded-8 text-decoration-none bg-f8f8f9 border-e5e7e9 border text-center hover-effect text-334150 fs-12 fw-600 px-4 py-1 w-100 d-block">
                                          {get(item, "catalog_products.[0].category.parent.name")}
                                        </Link>
                                      </div>
                                    </div>
                                  
                                  </div>
                                </div>
                                
                                <div
                                  className="w-xl-10 w-md-25 w-sm-50 border-top border-top-sm-0 border-start-sm d-flex align-items-center justify-content-center border-a7a7a7 text-greyscale800 fs-14 text-center min-h-70">
                                  <b>{get(item, "count")}</b>&nbsp;шт
                                </div>
                                
                                <div
                                  className="w-xl-15 w-md-25 w-sm-50 border-top border-top-sm-0 border-start-md d-flex align-items-center justify-content-center border-a7a7a7 text-greyscale800 fs-14 text-center min-h-70">
                                  <b><InputPhone value={get(item, "price")} thousandSeparator={" "} displayType={"text"}/></b>
                                </div>
                                
                                <div
                                  className="w-xl-15 w-md-25 w-sm-50 border-top border-top-sm-0 border-start-sm d-flex align-items-center justify-content-center border-a7a7a7 text-greyscale800 fs-14 text-center min-h-70">
                                  <button type="button" className="btn focus-none">
                                    <i className="fas fa-pen text-34c759"/>
                                  </button>
                                  <button type="button" className="btn focus-none mx-2">
                                    <i className="fi fi-sr-eye fs-17 text-3d82c4"/>
                                  </button>
                                  <button
                                    onClick={() => {
                                      dispatch(METHOD.request({
                                        url: `/seller/product-delete/${get(item, "id")}`,
                                        name: "deleteProduct",
                                        cb: {
                                          success: () => {
                                            dispatch(DELETE.success({
                                              id: get(item, "id"),
                                              name: "cabinetProducts",
                                            }));
                                          },
                                          error: (error) => {
                                            console.log(error)
                                          },
                                          finally: () => {
                                          
                                          }
                                        }
                                      }))
                                    }}
                                    type="button"
                                    className="btn focus-none">
                                    <i className="fi fi-sr-trash fs-17 text-f04e79"/>
                                  </button>
                                </div>
                              </div>
                            </div>)
                            : <Empty className={"mb-3"} text={"Ma'lumot yo'q"}/>
                      }
                      <Pagination
                        className={'custom-style flex-wrap justify-content-center'}
                        pageRange={1}
                        marginPage={1}
                        initialPage={page}
                        pageCount={Math.ceil(get(meta, 'total', 1) / 15)}
                        onChange={n => setPage(n)}
                      />
                    </>
                  }}
                </LoadAll>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Modal
        isOpen={!!isModal}
        position={"center"}
        maxWidth={"1140px"}
        height={"calc(100% - 3.5rem)"}
        defaultHeight={"calc(100% - 3.5rem)"}
        width={"100%"}
        closeOnBack={false}
        modalPaddingAuto={false}
        onClose={() => {
          setModal(false);
        }}
      >
        <MyForm
          className="modal-content custom-rounded-30 mh-100"
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
              required: true
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
              max: 5,
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
            setRequestReset(false);
            dispatch(CREATE.request({
              url: "/seller/products/store",
              name: "productCreate",
              values: serialize(FormValues, {indices: true}),
              cb: {
                success: () => {
                  setModal(false);
                  setRequestReset(true);
                  resetForm()
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
              <div className="modal-header px-lg-4 border-bottom-0">
                <h1 className="modal-title fs-lg-32 fs-24 fw-700 text-greyscale800" id="addProductLabel">Добавление
                  товара</h1>
                <button onClick={() => setModal(false)} type="button"
                        className="btn-close custom-rounded-12 bg-e6e6e6 focus-none border me-1"
                        style={{
                          height: 55,
                          width: 55,
                          boxSizing: "border-box"
                        }}
                        data-bs-dismiss="modal"
                        aria-label="Close">
                </button>
              </div>
              <div className="modal-body px-lg-4 scroll-style" style={{overflowY: "auto"}}>
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
                        isDisabled={!get(values, "catalog_id") && !get(values, "category_id")}
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
                      
                      <div className="col-12">
                        <div className="bg-f1f1f1 p-3 custom-rounded-12 mb-3">
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
                          
                          <div className="mb-3">
                            <label htmlFor="product_price"
                                   className="form-label fs-14 fw-600 text-141316 mb-3">Количество</label>
                            <Field
                              className={`form-control border-f0f1f2 custom-rounded-12 focus-none ${errorClass(errors, touched, "price")}`}
                              component={InputPhone}
                              id={"count"}
                              name={"count"}
                              placeholder="Введите количество"
                              decimalScale={0}
                              thousandSeparator={" "}
                              allowLeadingZeros={true}
                              allowNegative={false}
                              isNumericString
                              onValueChange={(val) => {
                                setFieldValue(`count`, val.value);
                              }}
                              onBlur={() => setFieldTouched(`count`, true)}
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
                    
                    <div className="col-xl-5 mb-xl-0 mb-3">
                      <p className="fs-14 text-141316 mb-0"><b className="fs-16">Изображения</b> (макс. 5 шт)</p>
                      
                      <p className="text-141316 fs-12">Форматы jpg, png. Разрешение макс. 2000х1000 пикс.</p>
                      
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
                    <div className="col-xl-7 h-100">
                      <div className="row h-100">
                        {
                          [...Array(10).keys()].map(number => {
                            return <div key={number} className="w-lg-20 mb-lg-0 mb-3 h-100">
                              <div
                                className={`image-parent-product ${number <= 4 ? "mb-3" : ""} ${get(values, `product_images.[${number}]`, null) ? "bg-white" : "bg-d9d9d9"} position-relative h-100 p-2 d-flex align-items-center justify-content-center custom-rounded-12`}
                                style={{minHeight: 105}}>
                                <img
                                  className={`image-preview-product ${get(values, `product_images.[${number}]`, null) ? "w-100" : ""}`}
                                  src={get(values, `product_images.[${number}]`, null) ? URL.createObjectURL(get(values, `product_images.[${number}]`, null)) : no_image}
                                  alt="no-image"/>
                                {
                                  get(values, `product_images.[${number}]`, null)
                                    ? <button
                                      onClick={() => {
                                        const filtered = get(values, "product_images", []).filter((_, index) => number !== index);
                                        setFieldValue(`product_images`, filtered)
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
              </div>
              <div className="modal-footer">
                <button type="submit" disabled={isSubmitting}
                        className="btn btn-menu custom-rounded-12 focus-none h-100 w-lg-auto w-100 mb-3"
                        style={{minWidth: 300}}>
                  <span className="bg-gradient-custom reverse custom-rounded-12"/>
                  <span
                    className="position-relative d-flex align-items-center justify-content-center fs-17 fw-600 custom-zindex-2">
                                    Сохранить
                                </span>
                </button>
              </div>
            </>
          }}
        
        
        </MyForm>
      
      </Modal>
    </>
  );
};

export default Products;
