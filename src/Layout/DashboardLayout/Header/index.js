import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";
import logo from "assets/images/icon/logo.svg"
import {LoadAll} from "schema/actions";
import {get} from "lodash";

import {ModalLoginRegister} from "../../../components";
import {useDispatch, useSelector} from "react-redux";
import DashboardHeader from "../DashboardHeader";
import icon_2 from "../../../assets/images/icon/settings.svg";
import icon_4 from "../../../assets/images/icon/logout.svg";
import {LOGOUT} from "../../../redux/actions";
import {toast} from "react-toastify";
import {Responsive} from "../../../services/utils";
import MobileView from "../../../components/MobileView";

const Header = ({mobileMenu, setMobileMenu}) => {
  const screenSize = Responsive();
  const {auth, system: {products}} = useSelector(state => state);
  const {pathname} = useLocation();
  const dispatch = useDispatch();
  const {system: {regions}} = useSelector(state => state);
  const navigate = useNavigate();
  const dropdownRef = useRef({});
  const dropdownLangRef = useRef({});
  const dropdownProfileRef = useRef({});
  const menuContentRef = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const [isModal, setModal] = useState(false);
  const [isProfile, setProfile] = useState(false);
  const [menu, setMenu] = useState(false);
  const [category, setCategory] = useState([]);
  const [menuActive, setMenuActive] = useState(null);
  const [langIsOpen, setLangOpen] = useState(false);
  const [region, setRegion] = useState("Toshkent shahri");
  const [lang, setLang] = useState("uz");
  
  const menuIcons = {
    1: {
      name: "Электроника",
      icon: "fi-rr-smartphone",
      id: 1,
    },
    32: {
      name: "Компрьютерная техника",
      icon: "fi-rr-microchip",
      id: 32,
    },
    53: {
      name: "Телевизоры и аудиотехника",
      icon: "fi-rr-microwave",
      id: 53,
    },
    75: {
      name: "Климатическая техника",
      icon: "fi-rs-air-freshener",
      id: 75
    },
    106: {
      name: "Техника для дома",
      icon: "fi-rs-home",
      id: 106,
    },
    137: {
      name: "Офисная техника",
      icon: "fi-rs-inboxes",
      id: 137
    },
    168: {
      name: "Техника для кухни",
      icon: "fi-rs-oven",
      id: 168
    },
    199: {
      name: "Пасуда для дома",
      icon: "fi-rr-plate-eating",
      id: 199
    },
    230: {
      name: "Автотовары",
      icon: "fi-rr-taxi",
      id: 9,
    },
    261: {
      name: "Красота и здоровье",
      icon: "fi-rr-soap",
      id: 261,
    },
  }
  
  const langs = {
    uz: "O'zbekcha",
    ru: "Ruscha",
    en: "Inglizcha",
  };
  
  useEffect(() => {
    const mainBody = document.getElementById("main-body")
    if (pathname === "/" || pathname.includes("/dashboard")) {
      mainBody.classList.add("body-img")
    } else {
      mainBody.classList.remove("body-img")
    }
  }, [pathname]);
  
  useEffect(() => {
    if (isOpen) {
      const handleClick = (event) => {
        if (get(dropdownRef, "current") && !event.composedPath().includes(get(dropdownRef, "current"))) {
          setOpen(false);
        }
      };

      document.body.addEventListener('click', handleClick);
      return () => document.body.removeEventListener('click', handleClick);
    }
  }, [isOpen]);

  useEffect(() => {
    if (langIsOpen) {
      const handleClick = (event) => {
        if (get(dropdownLangRef, "current") && !event.composedPath().includes(get(dropdownLangRef, "current"))) {
          setLangOpen(false);
        }
      };

      document.body.addEventListener('click', handleClick);
      return () => document.body.removeEventListener('click', handleClick);
    }
  }, [langIsOpen]);

  useEffect(() => {
    if (isProfile) {
      const handleClick = (event) => {
        if (get(dropdownProfileRef, "current") && !event.composedPath().includes(get(dropdownProfileRef, "current"))) {
          setProfile(false);
        }
      };

      document.body.addEventListener('click', handleClick);
      return () => document.body.removeEventListener('click', handleClick);
    }
  }, [isProfile]);

  const closeMegaMenu = useCallback(() => {
    setMenu(false);
    const mainBody = document.getElementById("main-body");
    if (mainBody) {
      mainBody.classList.remove("active");
    }
    document.querySelectorAll(".btn-menu-in.active").forEach((item) => {
      setTimeout(() => {
        item.click();
      }, 400);
    });
  }, [setMenu]);

  useEffect(() => {
    if (!menu) {
      return undefined;
    }

    const handleClickOutside = (event) => {
      const toggleElement = document.getElementById("big-menu");
      const clickedInsideMenu = menuContentRef.current && menuContentRef.current.contains(event.target);
      const clickedToggle = toggleElement && toggleElement.contains(event.target);

      if (!clickedInsideMenu && !clickedToggle) {
        closeMegaMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menu, closeMegaMenu]);
  
  useEffect(() => {
    dispatch(LoadAll.request({
      url: "/categories",
      name: "categoriesAll",
      cb: {
        success: (data) => {
          const prepared = data.map(item => ({
            ...item,
            icon: get(menuIcons, `[${item.id}].icon`, 'fi fi-rr-menu-burger')
          }));
          setCategory(prepared);
          if (prepared && prepared.length && !menuActive) {
            setMenuActive(prepared[0]);
          }
        },
        error: () => {
        
        },
        finally: () => {
        
        }
      }
    }))
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  
  useEffect(() => {
    const bodyMain = document.getElementById("main-body");
    if (get(screenSize, "width") > 767) {
      if (bodyMain.classList.contains("mobile-active")) {
        bodyMain.classList.remove("mobile-active");
        document.querySelector("html").classList.remove("overflow-hidden", "h-100");
      }
    }
  }, [screenSize])
  
  return (
    <>
      {
        pathname.includes("/dashboard") && ![3, 5].includes(parseInt(get(auth, "data.user.role_id")))
          ? <DashboardHeader/>
          : get(screenSize, "width") > 767
            ? <>
              <div
                className={`main-menu ${menu ? "active" : ""}`}
                data-custom-target="big-menu"
              >
                <div className="main-menu-container" ref={menuContentRef}>
                  {/* Left column */}
                  <div>
                    <ul className="main-menu_list">
                        {
                          category.map((catItem, number) => {
                            const {name, icon, id} = catItem;
                            return <li key={number}>
                            <button
                              className={`btn w-100 d-flex-center-between btn-menu-in focus-none ${id === get(menuActive, "id") ? "active" : ""}`}
                              onClick={() => setMenuActive(catItem)}>
                      <span className={"d-flex-align-center"}>
                        <i className={`fi fs-22 lh-22 ${icon} me-2`}/>
                        
                        {name}
                      </span>
                              
                              <i className={"fas fa-chevron-right"}/>
                            </button>
                          </li>
                          })
                        }
                      
                      </ul>
                  </div>
                  {/* Right column */}
                  <div>
                    <div className="main-menu_view mt-lg-0 mt-3">
                        <p className="fs-22 fw-700 text-greyscale800">{get(menuActive, "name")}</p>
                        <div className="row mt-3 ms-lg-4">
                          {
                            get(menuActive, "sub_categories", []).map((item, number) =>
                              <div className="col-lg-4 mt-3" key={number}>
                                <p className="fs-18 fw-600 text-greyscale800 text-uppercase">{get(item, "name")}</p>
                                
                                <ul className="m-0 p-0">
                                  {
                                    get(item, "sub_categories", []).map((sub, numb) =>
                                      <Link to={`/catalog/${get(sub, "id")}`}
                                            state={{catalog: get(item, "name"), catalog_id: get(item, "id")}}
                                            onClick={() => {
                                              setMenu(false);
                                              document.getElementById("main-body").classList.remove("active");
                                            }}
                                            key={numb}
                                            className="text-greyscale800 d-block text-decoration-none fs-16 mt-2">
                                        {get(sub, "name")}
                                      </Link>)
                                  }
                                </ul>
                              </div>)
                          }
                        </div>
                    </div>
                  </div>
                  {/* Close button */}
                  <button
                    onClick={() => {
                      setMenu(false);
                      document.getElementById("main-body").classList.remove("active");
                    }}
                    className="btn bg-e6e6e6 custom-rounded-12 d-flex-center-center fs-25 focus-none"
                    style={{width: 55, height: 55, position: 'absolute', right: 28, top: 24}}>
                    <i className="fi fi-rr-cross fs-15 lh-15"/>
                  </button>
                </div>
              </div>
              <header className={"py-3"}>
                <div className="container">
                  <div className="row flex-wrap-reverse justify-content-between">
                    <div
                      className="col-lg-7 d-flex align-items-center position-relative justify-content-lg-start justify-content-between mt-lg-0 mt-3">
                      <div className="dropdown dropdown-select">
                        <div
                          className={`btn d-flex-align-center bg-e6e6e6 border-0 text-greyscale800 focus-none header-action-hover dropdown-toggle ${isOpen ? "show" : ""}`}
                          ref={dropdownRef}
                          onClick={() => setOpen(!isOpen)}
                        >
                          <i className="fi fi-rs-home-location lh-16 me-2"/> <span
                          id="region-name" className={"text-one-line"}>{region}</span>
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
                        <i className="fas fa-bars"/>
                      </button>
                      
                      {/*<ul className="h-nav-custom" data-custom-target="mini-menu">
                        <li className="h-nav-custom_i"><span className="h-nav-custom_i__l" href="#">О нас</span></li>
                        <li className="h-nav-custom_i"><span className="h-nav-custom_i__l" href="#">Способы оплаты</span>
                        </li>
                        <li className="h-nav-custom_i"><span className="h-nav-custom_i__l" href="#">Партнёрам</span></li>
                      </ul>*/}
                    </div>
                    
                    <div className="col-lg-5 d-flex align-items-center justify-content-lg-end justify-content-between">
                      <Link to={"/login"} type="button"
                            className="btn d-flex-align-center border-d4d8e4 bg-white text-one-line fw-700 text-greyscale800 focus-none custom-rounded-30 header-action-hover">
                        <i className="fi fi-rr-store-buyer me-2 fs-16 lh-16 text-gradient"/>
                        <span className={"fs-12"}>Кабинет продавца</span>
                      </Link>
                      
                      <div className="d-inline-flex align-items-center ms-lg-3 mx-2">
                        <a href="tel: +998 90 123 45 67" className={"text-decoration-none text-374957 lh-16 header-link-hover"}>
                          <i className="fi fi-rr-phone-call"/>
                        </a>
                        <a
                          className="text-decoration-none d-xl-inline-block d-lg-none d-sm-inline-block d-none ms-2 fs-12 text-greyscale800 header-link-hover"
                          href="tel: +998 90 123 45 67">+998 90
                          123 45 67</a>
                      </div>
                      
                      <div className="dropdown dropdown-select ms-lg-4">
                        <div
                          className={`btn bg-e6e6e6 border-0 text-greyscale800 focus-none header-action-hover dropdown-toggle ${langIsOpen ? "show" : ""}`}
                          ref={dropdownLangRef}
                          onClick={() => setLangOpen(!langIsOpen)}
                        >
                          <i className="fi fi-rr-globe lh-16"/>
                          <span id="lang-name">{langs[lang]}</span>
                        </div>
                        <ul className={`dropdown-menu ${langIsOpen ? "show position-absolute m-0 top-0" : ""}`}>
                          {
                            Object.entries(langs).map(([k, v], number) => <li key={number} onClick={() => setLang(k)}>
                              <div
                                className={`dropdown-item cursor-pointer text-wrap ${lang === k ? "active" : ""}`}>{v}</div>
                            </li>)
                          }
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="row mx-sm-0 bg-white py-2 custom-rounded-18 h-bar-custom mt-3">
                    <div className="h-bar-custom_i">
                      <Link to="/" className="h-100">
                        <img src={logo} className="w-100" alt="logo"/>
                      </Link>
                    </div>
                    
                    <div className="h-bar-custom_i">
                      <button className="btn btn-menu-2 d-flex-center-center focus-none w-100" id="big-menu"
                              onClick={() => {
                                setMenu(true);
                                document.getElementById("main-body").classList.add("active");
                              }}>
                        <i className="fi fi-rr-menu-burger me-3 lh-16"/>
                        <span className="fw-700 fs-20">
                        Katalog
                    </span>
                      </button>
                    </div>
                    
                    <div className="h-bar-custom_i mt-xl-0 mt-3" style={{height: 48}}>
                      <div className="input-group h-100 mb-3">
                        <input type="text"
                               className="form-control border-2 border-end-0 focus-none border-d3B15e custom-rounded-start-12"
                               placeholder="Поиск"
                               aria-label="Recipient's username" aria-describedby="search-input"/>
                        <button type="button"
                                className="input-group-text border-2 border-start-0 bg-custom-gradient text-white justify-content-center custom-rounded-end-12 border-d3B15e"
                                style={{width: 56}}
                                id="search-input">
                          <i className="fi fi-rr-search fs-22 lh-22"/>
                        </button>
                      </div>
                    </div>
                    
                    <div className="h-bar-custom_i invisible">
                      <button type="button"
                              className="btn focus-none btn-menu-2 d-flex-center-center min w-lg-100 h-100">
                        <i className="fi fi-rr-chart-histogram fs-22 lh-22"/>
                      </button>
                    </div>
                    
                    <div className="h-bar-custom_i">
                      <Link to="/favourites" type="button"
                            className="btn focus-none btn-menu-2 d-flex-center-center min w-lg-100 h-100">
                        <i className="fi fi-rr-heart fs-22 lh-22"/>
                      </Link>
                    </div>
                    
                    <div
                      className={`h-bar-custom_i`}>
                      <button type="button"
                              onClick={() => get(auth, "isAuthenticated")
                                ? navigate("/dashboard")
                                : setModal(!isModal)
                              }
                              data-bs-toggle="modal" data-bs-target="#exampleModal"
                              className="btn focus-none text-nowrap d-flex-center-center btn-menu-2 auto w-lg-100 h-100">
                        <i className="fi fi-rr-user me-3 fs-22 lh-22"/>
                        <span className="fw-700 fs-14" style={{letterSpacing: "-0.078px"}}>
                        {
                          get(auth, "isAuthenticated")
                            ? parseInt(get(auth, "data.user.role_id")) === 3
                              ? "Client"
                              : "User"
                            : "Profil"
                        }
                      </span>
                      </button>
                      
                      <ul
                        className={`dropdown-menu bg-white dropdown-menu-end ${isProfile ? "show position-absolute m-0" : ""}`}
                        style={isProfile ? {transform: "translate(-92px, 42px)", inset: "0px auto auto 0px"} : null}>
                        <li>
                          <Link className="dropdown-item mb-2 fs-14 fw-500" to={"#"}>
                            <img src={icon_2} className="me-2" alt="icon"/>
                            Управление аккаунтом
                          </Link>
                        </li>
                        <li>
                          <button
                            type={"button"}
                            className="dropdown-item fs-14 fw-500"
                            onClick={() => {
                              dispatch(LOGOUT.request({
                                cb: {
                                  success: () => {
                                    setProfile(false);
                                    toast.success("Platfordan chiqish amalga oshirildi!");
                                  },
                                  error: (error) => {
                                    toast.error(get(error, "message"));
                                  },
                                  finally: () => {
                                  
                                  }
                                }
                              }))
                            }}
                          >
                            <img src={icon_4} className="me-2" alt="icon"/>
                            Выйти из системы
                          </button>
                        </li>
                      </ul>
                    </div>
                    <div className="h-bar-custom_i" style={{height: 48}}>
                      <Link to="/basket"
                            className="btn btn-menu-2 auto count d-flex-center-center text-nowrap start focus-none w-lg-100 h-100 position-relative"
                            data-not-count={get(auth, "isAuthenticated", null) ? get(auth, "data.order.products_count") : products ? Object.values(products).filter(item => get(item, "cart")).length : 0}>
                        <i className="fi fi-rr-shopping-cart fs-22 lh-22 me-2"/>
                        <span className="fw-700 fs-14" style={{letterSpacing: "-0.078px"}}>
                          Savatcha
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              
              </header>
              
              <ModalLoginRegister
                {...{
                  isModal,
                  setModal,
                }}
              />
            </>
            : <>
              <div className={`mobile-main-menu ${mobileMenu ? "active" : ""}`}>
                <div className="d-flex-between-center">
                  <span className={"fs-24 fw-700 text-greyscale800"}>Каталог</span>
                  
                  <button
                    style={{
                      width: 55,
                      height: 55
                    }}
                    onClick={() => menuActive ? setMenuActive(null) : setMobileMenu(false)}
                    type={"button"}
                    className="btn bg-d9d9d9 custom-rounded-15 d-flex-center-center focus-none">
                    {
                      menuActive
                        ? <i className={"fas fa-chevron-left lh-24 fs-24 mt-1"}/>
                        : <i className={"fi fi-sr-cross lh-24 fs-24 mt-1"}/>
                    }
                  
                  </button>
                </div>
                
                <ul className={"main-menu_list mt-3"}>
                  {
                    !menuActive && category.map(({name, icon, id}, number) => <li key={number}>
                      <button
                        className={`btn w-100 d-flex-center-between btn-menu-in focus-none ${id === get(menuActive, "id") ? "active" : ""}`}
                        onClick={() => setMenuActive(({id, name}))}>
                      <span className={"d-flex-align-center"}>
                        <i className={`fi fs-22 lh-22 ${icon} me-2`}/>
                        
                        {name}
                      </span>
                        
                        <i className={"fas fa-chevron-right"}/>
                      </button>
                    </li>)
                  }
                  
                  {
                    menuActive
                      ? <>
                        <p className="fs-24 fw-700 text-greyscale800 text-center">{get(menuActive, "name")}</p>
                        
                        {
                          get(category.find(item => get(item, "id") === get(menuActive, "id")), "sub_categories", []).map((item, number) =>
                            <div className="mt-3" key={number}>
                              <p className="fs-18 fw-600 text-greyscale800 text-uppercase">{get(item, "name")}</p>
                              
                              <ul className="p-0">
                                {
                                  get(item, "sub_categories", []).map((sub, numb) =>
                                    <Link to={`/catalog/${get(sub, "id")}`}
                                          state={{catalog: get(item, "name"), catalog_id: get(item, "id")}}
                                          onClick={() => {
                                            setMenu(false);
                                            setMobileMenu(false);
                                            setMenuActive(null);
                                            document.getElementById("main-body").classList.remove("active");
                                          }}
                                          key={numb}
                                          className="text-greyscale800 d-block text-decoration-none fs-16 mt-2">
                                      {get(sub, "name")}
                                    </Link>)
                                }
                              </ul>
                            </div>)
                        }
                      </>
                      : null
                  }
                </ul>
              </div>
              <MobileView {...{
                region,
                setRegion,
                langs,
                lang,
                setLang,
                setMobileMenu
              }}/>
            </>
      }
    </>
  );
};

export default Header;
