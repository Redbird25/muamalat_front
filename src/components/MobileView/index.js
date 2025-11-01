import React, {useEffect, useState} from 'react';
import logo from "../../assets/images/icon/logo.svg";
import {Link, useNavigate} from "react-router-dom";
import AsyncSelect2 from "../Fields/AsyncSelect2";
import {useSelector} from "react-redux";

const MobileView = (
  {
    region,
    setRegion,
    langs,
    lang,
    setLang
  }
) => {
  const navigate = useNavigate();
  const {system: {regions}} = useSelector(state => state);
  const [menuBar, setMenuBar] = useState(null);
  const [isCollapse, setCollapse] = useState("");
  
  useEffect(() => {
    window.addEventListener('scroll', function () {
      const mobileHeader = document.querySelector(".mobile-header")
      
      if (mobileHeader) {
        if (window.scrollY > 5) {
          mobileHeader.classList.add('active');
        } else {
          mobileHeader.classList.remove('active');
        }
      }
    });
  }, [])
  
  useEffect(() => {
    if (menuBar) {
      document.getElementById("main-body").classList.add("mobile-active");
      document.querySelector("html").classList.add("overflow-hidden", "h-100");
    } else {
      document.getElementById("main-body").classList.remove("mobile-active");
      document.querySelector("html").classList.remove("overflow-hidden", "h-100");
      setCollapse("");
    }
  }, [menuBar])
  
  return (
    <div className={`mobile-header ${menuBar ? "active-bar" : ""}`}>
      <div className={"container pt-4 h-100 d-flex flex-column"}>
        <div className="row justify-content-between">
          <div className="col-auto">
            <Link to="/" className="h-100">
              <img src={logo} className="w-100" alt="logo"/>
            </Link>
          </div>
          
          <div className="col-auto">
            <button
              style={{
                width: 55,
                height: 55
              }}
              className="btn bg-d9d9d9 custom-rounded-15 d-flex-center-center focus-none"
              onClick={() => isCollapse ? setCollapse("") : setMenuBar(!menuBar)}
            >
              {
                isCollapse
                  ? <i className={"fas fa-chevron-left lh-24 fs-24"}/>
                  : menuBar
                    ? <i className="fi fi-sr-cross lh-24 fs-24 mt-1"/>
                    : <i className="fi fi-rr-menu-burger lh-24 fs-24 mt-1"/>
              }
            
            
            </button>
          </div>
          {
            !menuBar
              ? <div className="col-12 mt-3">
                <AsyncSelect2
                  url={"/search"}
                  filterParams={(search) => {
                    return {
                      search: {name: search}
                    }
                  }}
                  isMulti={false}
                  isClearable
                  closeMenuOnSelect
                  classNamePrefix={"custom-react-select"}
                  className={"custom-react-select-easy "}
                  placeholder={"Поиск"}
                >
                
                </AsyncSelect2>
              </div>
              : null
          }
        
        </div>
        
        {
          menuBar
            ? <div className={"d-flex flex-column justify-content-between mt-5 flex-fill"}>
              {
                isCollapse === "region"
                  ? <ul
                    className={"ps-0"}
                  >
                    {
                      regions.map(({name_uz, id}, number) =>
                        <li
                          key={number}
                          onClick={() => {
                            setRegion(name_uz);
                            setCollapse("");
                          }}
                          className={`${region === name_uz ? "change-bg" : "bg-white"} p-3 custom-rounded-12 d-flex-between-center mb-3`}
                        >
                          <span className={`fs-14 fw-700 ${region === name_uz ? "text-white" : "text-greyscale800"}`}>{name_uz}</span>
                        </li>
                      )
                    }
                  </ul>
                  : isCollapse === "langs"
                    ? <ul
                      className={"ps-0"}>
                      {
                        Object.entries(langs).map(([k, v], number) =>
                          <li
                            key={number}
                            onClick={() => {
                              setCollapse("");
                              setLang(k);
                            }}
                            className={`${lang === k ? "change-bg" : "bg-white"}  p-3 custom-rounded-12 d-flex-between-center mb-3`}
                          >
                            <span className={`fs-14 fw-700 ${lang === k ? "text-white" : "text-greyscale800"}`}>{v}</span>
                          </li>
                        )
                      }
                    
                    </ul>
                    : <>
                      <ul className={"col-12 ps-0"}>
                        <li
                          className={"bg-white p-3 custom-rounded-12 d-flex-between-center mb-3"}
                          onClick={() => setCollapse("region")}
                        >
                          <div className={"d-flex-center-center"}>
                            <i className="fi fi-rs-home-location lh-16 me-3"/>
                            
                            <span className={"fs-14 fw-700 text-greyscale800"}>{region}</span>
                          </div>
                          
                          <i className={"fas fa-chevron-right"}/>
                        </li>
                        
                        <li
                          onClick={() => window.location.href = "tel:+998901234567"}
                          className={"bg-white p-3 custom-rounded-12 d-flex-between-center mb-3"}
                        >
                          <div className={"d-flex-center-center"}>
                            <i className="fi fi-rr-phone-call lh-16 me-3"/>
                            
                            <span className={"fs-14 fw-700 text-greyscale800"}>+998 90 123 45 67</span>
                          </div>
                          
                          <i className={"fas fa-chevron-right"}/>
                        </li>
                        
                        <li
                          onClick={() => {
                            navigate("/login");
                            setMenuBar(false);
                          }}
                          className={"bg-white p-3 custom-rounded-12 d-flex-between-center mb-3"}
                        >
                          <div className={"d-flex-center-center"}>
                            <i className="fi fi-rr-store-buyer me-3 fs-16 lh-16 text-gradient"/>
                            
                            <span className={"fs-14 fw-700 text-greyscale800"}>Кабинет продавца</span>
                          </div>
                          
                          <i className={"fas fa-chevron-right"}/>
                        </li>
                        {/*<li
                          className={"bg-white p-3 custom-rounded-12 d-flex-between-center mb-3"}
                        >
                          <div className={"d-flex-center-center"}>
                            <span className={"fs-14 fw-700 text-greyscale800"}>О нас</span>
                          </div>
                          
                          <i className={"fas fa-chevron-right"}/>
                        </li>*/}
                        
                        {/*<li
                          className={"bg-white p-3 custom-rounded-12 d-flex-between-center mb-3"}
                        >
                          <div className={"d-flex-center-center"}>
                            <span className={"fs-14 fw-700 text-greyscale800"}>Способы оплаты</span>
                          </div>
                          
                          <i className={"fas fa-chevron-right"}/>
                        </li>
                        
                        <li
                          className={"bg-white p-3 custom-rounded-12 d-flex-between-center mb-3"}
                        >
                          <div className={"d-flex-center-center"}>
                            <span className={"fs-14 fw-700 text-greyscale800"}>Партнёрам</span>
                          </div>
                          
                          <i className={"fas fa-chevron-right"}/>
                        </li>*/}
                      </ul>
                      
                      <div>
                        <span className={"fs-14 text-greyscale800"}>Язык</span>
                        <div
                          className={"bg-white p-3 custom-rounded-12 d-flex-between-center mb-4 mt-1"}
                          onClick={() => setCollapse("langs")}
                        >
                          <div className={"d-flex-center-center"}>
                            <i className="fi fi-rr-globe lh-16 me-3"/>
                            
                            <span className={"fs-14 fw-700 text-greyscale800"}>{langs[lang]}</span>
                          </div>
                          
                          <i className={"fas fa-chevron-right"}/>
                        </div>
                      </div>
                    </>
              }
            </div>
            : null
        }
      </div>
    </div>
  );
};

export default MobileView;
