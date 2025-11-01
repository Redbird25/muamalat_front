import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from "react-redux";
import icon_1 from "assets/images/icon/user-admin.svg"
import {get} from "lodash";

const DashboardHeader = () => {
  const {system: {regions}} = useSelector(state => state);
  const dropdownRef = useRef({});
  const dropdownLangRef = useRef({});
  const dropdownProfileRef = useRef({});
  const [isOpen, setOpen] = useState(false);
  const [langIsOpen, setLangOpen] = useState(false);
  const [profileIsOpen, setProfileOpen] = useState(false);
  const [region, setRegion] = useState("Toshkent");
  const [lang, setLang] = useState("uz");
  
  const langs = {
    uz: "O'zbekcha",
    ru: "Ruscha",
    en: "Inglizcha",
  };
  
  useEffect(() => {
    if (isOpen) {
      document.body.addEventListener('click', (event) => {
        if (get(dropdownRef, "current") && !event.composedPath().includes(get(dropdownRef, "current"))) {
          setOpen(false);
        }
      });
    }
    
    if (dropdownProfileRef) {
      document.body.addEventListener('click', (event) => {
        if (get(dropdownProfileRef, "current") && !event.composedPath().includes(get(dropdownProfileRef, "current"))) {
          setProfileOpen(false);
        }
      });
    }
    
    if (langIsOpen) {
      document.body.addEventListener('click', (event) => {
        if (get(dropdownLangRef, "current") && !event.composedPath().includes(get(dropdownLangRef, "current"))) {
          setLangOpen(false);
        }
      });
    }
  }, [isOpen, langIsOpen, profileIsOpen]);
  
  
  return (
    <header className="py-3">
      <div className="container">
        <div className="row flex-wrap-reverse justify-content-between">
          <div
            className="col-lg-7 d-flex align-items-center position-relative justify-content-lg-start justify-content-between mt-lg-0 mt-3">
            <div className="dropdown dropdown-select">
              <div
                className={`btn d-flex-align-center bg-e6e6e6 border-0 text-greyscale800 focus-none dropdown-toggle ${isOpen ? "show" : ""}`}
                ref={dropdownRef}
                onClick={() => setOpen(!isOpen)}
              >
                <i className="fi fi-rs-home-location lh-16"/> <span
                id="region-name">{region}</span>
              </div>
              
              <ul className={`dropdown-menu ${isOpen ? "show position-absolute m-0 top-0" : ""}`}
                  data-popper-placement="bottom-start">
                {
                  regions.map(({name_uz, id}, number) => <li key={number} onClick={() => setRegion(name_uz)}>
                    <div
                      className={`dropdown-item cursor-pointer lh-18 text-wrap ${region === name_uz ? "active" : ""}`}>{name_uz}</div>
                  </li>)
                }
              </ul>
            </div>
            
            <button
              className="btn d-lg-none ms-3 bg-e6e6e6 focus-none text-greyscale800 rounded-circle position-relative custom-zindex-2"
              id="mini-menu">
              <i className="fas fa-bars"></i>
            </button>
            
            <ul className="h-nav-custom" data-custom-target="mini-menu">
              <li className="h-nav-custom_i"><span className="h-nav-custom_i__l" href="#">О нас</span></li>
              <li className="h-nav-custom_i"><span className="h-nav-custom_i__l" href="#">Способы оплаты</span></li>
              <li className="h-nav-custom_i"><span className="h-nav-custom_i__l" href="#">Партнёрам</span></li>
            </ul>
          </div>
          
          <div className="col-lg-5 d-flex align-items-center justify-content-lg-end justify-content-between">
            <div className="d-inline-flex text-nowrap align-items-center ms-lg-3 mx-2">
              <a href="tel: +998 90 123 45 67" className={"text-decoration-none text-374957 lh-16"}>
                <i className="fi fi-rr-phone-call"/>
              </a>
              <a
                className="text-decoration-none d-xl-inline-block d-lg-none d-sm-inline-block d-none ms-2 fs-12 text-greyscale800"
                href="tel: +998 90 123 45 67">+998 90
                123 45 67</a>
            </div>
            
            <div className="dropdown dropdown-select ms-lg-4">
              <div
                className={`btn bg-e6e6e6 border-0 text-greyscale800 focus-none dropdown-toggle ${langIsOpen ? "show" : ""}`}
                ref={dropdownLangRef}
                onClick={() => setLangOpen(!langIsOpen)}
              >
                <i className="fi fi-rr-globe lh-16"/>
                <span id="lang-name">{langs[lang]}</span>
              </div>
              <ul className={`dropdown-menu ${langIsOpen ? "show position-absolute m-0 top-0" : ""}`}>
                {
                  Object.entries(langs).map(([k, v], number) => <li key={number} onClick={() => setLang(k)}>
                    <div className={`dropdown-item cursor-pointer text-wrap ${lang === k ? "active" : ""}`}>{v}</div>
                  </li>)
                }
              </ul>
            </div>
            
            <button
                className={`btn custom-rounded-30 bg-white border-d4d8e4 ms-lg-4 hover-effect-2 fw-700 fs-12 text-greyscale800 focus-none dropdown-toggle ${profileIsOpen ? "show" : ""} auto clear`}
                type="button"
              >
                <img src={icon_1} className="me-4" alt="icon"/>
                Мой профиль
              </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
