import React, {useEffect, useState} from 'react';
import footer_icon from "assets/images/icon/logo-white.svg"
import {Link, useLocation, useNavigate} from "react-router-dom";
import {Responsive} from "../../../services/utils";
import {get} from "lodash";
import {ModalLoginRegister} from "../../../components";
import {useSelector} from "react-redux";

const Footer = ({setMobileMenu}) => {
  const {pathname} = useLocation();
  const {auth, system: {products}} = useSelector(state => state);
  const screenSize = Responsive();
  const navigate = useNavigate();
  const [isModal, setModal] = useState(false);
  
  useEffect(() => {
    if (isModal) {
      document.querySelector("html").classList.add("overflow-hidden", "h-100");
    } else {
      document.querySelector("html").classList.remove("overflow-hidden", "h-100");
    }
  }, [isModal])
  
  return (
    <>
      <footer className="mt-4 mt-md-5">
        <div className="container pb-5">
          <div className="row">
            <div className="col-12">
              <div className="footer custom-rounded-30">
                <div className="row">
                  <div
                    className="col-xxl-4 col-xl-3 col-md-6 order-xl-0 order-md-3 order-1 mt-xl-0 mt-4 d-flex flex-column align-items-start">
                    <img src={footer_icon} className="mb-auto" alt="logo"/>
                    
                    <p className="text-white-50 mb-0 d-xl-block d-none">Copyright © 2024</p>
                  </div>
                  
                  <div className="col-xxl-3 col-xl-3 col-md-6 order-xl-0 order-md-1 order-2 mt-xl-0 mt-4">
                    <div className="w-auto">
                      <p className="fs-20 fw-500 text-white">
                        Информация
                      </p>
                      <ul className="m-0 p-0">
                        <li className="mt-3">
                          <Link to="#" className="text-white-50 text-decoration-none footer-link-hover">О компании</Link>
                        </li>
                        
                        <li className="mt-3">
                          <Link to="#" className="text-white-50 text-decoration-none footer-link-hover">Вакансии</Link>
                        </li>
                        
                        <li className="mt-3">
                          <Link to="#" className="text-white-50 text-decoration-none footer-link-hover">Публичная оферта</Link>
                        </li>
                        
                        <li className="mt-3">
                          <Link to="/privacy-policy" className="text-white-50 text-decoration-none footer-link-hover">
                            Правила конфиденциальности
                          </Link>
                        </li>
                        
                        <li className="mt-3">
                          <Link to="#" className="text-white-50 text-decoration-none footer-link-hover">Возврат и обмен товаров</Link>
                        </li>
                        
                        <li className="mt-3">
                          <Link to="#" className="text-white-50 text-decoration-none footer-link-hover">Условия рассрочки</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div
                    className="col-xxl-3 col-xl-3 col-md-6 order-xl-0 order-md-2 order-3 mt-xl-0 mt-4 d-flex flex-column align-items-md-center">
                    <div className="w-auto">
                      <ul className="m-0 p-0">
                        <li className="mt-4">
                          <Link to="#" className="text-white-50 text-decoration-none footer-link-hover">Eco-frendly</Link>
                        </li>
                        
                        <li className="mt-3">
                          <Link to="#" className="text-white-50 text-decoration-none footer-link-hover">Политика обработки персональных
                            данных</Link>
                        </li>
                        
                        <li className="mt-3">
                          <Link to="#" className="text-white-50 text-decoration-none footer-link-hover">Оплата и Доставка товара</Link>
                        </li>
                        
                        <li className="mt-3">
                          <Link to="#" className="text-white-50 text-decoration-none footer-link-hover">Бонусы и акции</Link>
                        </li>
                        
                        <li className="mt-3">
                          <Link to="#" className="text-white-50 text-decoration-none footer-link-hover">Оферта для продавцов
                            товаров</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div
                    className="col-xxl-2 col-xl-3 col-md-6 order-xl-0 order-md-4 order-4 mt-xl-0 mt-4 d-flex flex-column align-items-center justify-content-center">
                    <div className="d-flex justify-content-evenly w-100">
                      <Link to="#"
                            className="btn d-flex align-items-center justify-content-center text-white rounded-circle bg-5f6d79 social-icon-hover"
                            style={{
                              width: 50,
                              height: 50
                            }}
                      >
                        <i className="fab fa-facebook"></i>
                      </Link>
                      
                      <Link to="#"
                            className="btn d-flex align-items-center justify-content-center text-white rounded-circle bg-5f6d79 social-icon-hover"
                            style={{
                              width: 50,
                              height: 50
                            }}
                      >
                        <i className="fab fa-instagram"></i>
                      </Link>
                      
                      <Link to="#"
                            className="btn d-flex align-items-center justify-content-center text-white rounded-circle bg-5f6d79 social-icon-hover"
                            style={{
                              width: 50,
                              height: 50
                            }}
                      >
                        <i className="fab fa-twitter"></i>
                      </Link>
                    </div>
                  
                  
                  </div>
                  
                  <p className="text-white-50 mb-0 d-xl-none order-5 text-center mt-4">Copyright © 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      {
        get(screenSize, "width") < 768
          ? <>
            <div className="mobile-footer">
              <div className={"container"}>
                <div
                  className="row">
                  <Link className={`mobile-footer_col text-212640 ${pathname === "/" ? "active" : ""} w-20`} to={"/"}>
                    <div className="mobile-footer_col__icon">
                      <i className="fi fi-rs-home fs-20 lh-20"/>
                    </div>
                    
                    Главная
                  </Link>
                  
                  <div className={`mobile-footer_col text-212640 ${pathname.includes("/catalog") ? "active" : ""} w-20`}
                       onClick={() => setMobileMenu(true)}>
                    <div className="mobile-footer_col__icon">
                      <i className="fi fi-sr-menu-burger fs-20 lh-20"/>
                    </div>
                    
                    Каталог
                  </div>
                  
                  
                  <Link className={`mobile-footer_col text-212640 ${pathname.includes("/basket") ? "active" : ""} w-20`}
                        to={"/basket"}>
                    <div className="mobile-footer_col__icon">
                      <i className="fi fi-rr-shopping-cart fs-20 lh-20"/>
                      
                      <span className={"mobile-footer_col__icon_number"}>
                  {products ? Object.values(products).filter(item => get(item, "cart")).length : 0}
                </span>
                    </div>
                    
                    Корзина
                  </Link>
                  
                  <Link
                    className={`mobile-footer_col text-212640 ${pathname.includes("/favourites") ? "active" : ""} w-20`}
                    to={"/favourites"}>
                    <div className="mobile-footer_col__icon">
                      <i className="fi fi-rr-search-heart fs-20 lh-20"/>
                      
                      <span className={"mobile-footer_col__icon_number"}>
                  {products ? Object.values(products).filter(item => get(item, "like")).length : 0}
                </span>
                    </div>
                    
                    Избранное
                  </Link>
                  <div
                    onClick={() => get(auth, "isAuthenticated")
                      ? navigate("/dashboard")
                      : setModal(!isModal)
                    }
                    className="mobile-footer_col w-20">
                    <div className="mobile-footer_col__icon">
                      <i className="fi fi-rr-user fs-20 lh-20"/>
                    </div>
                    
                    {
                      get(auth, "isAuthenticated")
                        ? parseInt(get(auth, "data.user.role_id")) === 3
                          ? "Client"
                          : "User"
                        : "Profil"
                    }
                  </div>
                </div>
              </div>
            </div>
            <ModalLoginRegister
              {...{
                isModal,
                setModal,
              }}
            />
          </>
          : null
      }
    
    </>
  );
};

export default Footer;
