import React, {useEffect, useState} from 'react';
import {Collapse, Spinner} from "../index";
import {get} from "lodash";
import {LoadAll} from "../../schema/actions";
import {useDispatch} from "react-redux";

const CatalogAside = ({cat_id, isParams, setParams}) => {
  const dispatch = useDispatch();
  const [isFilter, setFilter] = useState([]);
  const [isCollapse, setCollapse] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [rangeInput, setRangeInput] = useState({
    start: "0",
    end: "100000000"
  });
  
  useEffect(() => {
    setLoading(true);
    dispatch(LoadAll.request({
      url: `/products-types/${cat_id}`,
      name: "categoriesAll",
      cb: {
        success: (data) => {
          setFilter(data)
          data.forEach(item => setCollapse(prevState => ({...prevState, [get(item, "id")]: true})))
        },
        error: () => {
        
        },
        finally: () => {
          setLoading(false);
        }
      }
    }));
  }, [cat_id, dispatch]);
  
  useEffect(() => {
      const rangevalue =
        document.querySelector(".slider-container .price-slider");
      /*const rangevalue2 =
        document.querySelector(".price-slider-2");
      const rangevalue3 =
        document.querySelector(".price-slider-3");*/
      const rangeInputvalue =
        document.querySelectorAll(".range-input input");

      let priceGap = 500;

      const priceInputvalue =
        document.querySelectorAll(".price-field");
      for (let i = 0; i < rangeInputvalue.length; i++) {
        let minValState =
          parseInt(rangeInputvalue[0].value);
        let maxValState =
          parseInt(rangeInputvalue[1].value);
        
        if ((maxValState - minValState) < priceGap) {
          if (i === 0) {
            rangeInputvalue[0].value = maxValState - priceGap;
            priceInputvalue[0].firstElementChild.textContent = maxValState - priceGap;
          } else {
            rangeInputvalue[1].value = minValState + priceGap;
            priceInputvalue[1].firstElementChild.textContent = minValState + priceGap;
          }
        } else {
          priceInputvalue[0].firstElementChild.textContent = minValState;
          priceInputvalue[1].firstElementChild.textContent = maxValState;
          rangevalue.style.left =
            `${(minValState / rangeInputvalue[0].max) * 100}%`;
          /*rangevalue2.style.left =
            `${(minValState / rangeInputvalue[0].max) * 100}%`;*/
          priceInputvalue[0].style.left =
            `${((minValState / rangeInputvalue[0].max) * 100) - 10}%`;
          rangevalue.style.right =
            `${100 - (maxValState / rangeInputvalue[1].max) * 100}%`;
          /*rangevalue3.style.right =
              `${100 - (maxValState / rangeInputvalue[1].max) * 100}%`;*/
          priceInputvalue[1].style.right =
            `${100 - ((maxValState / rangeInputvalue[1].max) * 100)}%`;
        }
        
        rangeInputvalue[i].addEventListener("input", e => {
          let minVal =
            parseInt(rangeInputvalue[0].value);
          let maxVal =
            parseInt(rangeInputvalue[1].value);
          
          
          let diff = maxVal - minVal
          if (diff < priceGap) {
            if (e.target.className === "min-range") {
              rangeInputvalue[0].value = maxVal - priceGap;
              priceInputvalue[0].firstElementChild.textContent = maxVal - priceGap;
            } else {
              rangeInputvalue[1].value = minVal + priceGap;
              priceInputvalue[1].firstElementChild.textContent = minVal + priceGap;
            }
          } else {
            // Update price inputs and range progress
            priceInputvalue[0].firstElementChild.textContent = minVal;
            priceInputvalue[1].firstElementChild.textContent = maxVal;
            rangevalue.style.left =
              `${(minVal / rangeInputvalue[0].max) * 100}%`;
            /*rangevalue2.style.left =
              `${(minVal / rangeInputvalue[0].max) * 100}%`;*/
            priceInputvalue[0].style.left =
              `${((minVal / rangeInputvalue[0].max) * 100) - 10}%`;
            rangevalue.style.right =
              `${100 - (maxVal / rangeInputvalue[1].max) * 100}%`;
            /*rangevalue3.style.right =
              `${100 - (maxVal / rangeInputvalue[1].max) * 100}%`;*/
            priceInputvalue[1].style.right =
              `${100 - ((maxVal / rangeInputvalue[1].max) * 100)}%`;
          }
        });
        
        rangeInputvalue[i].addEventListener("mouseover", () => {
          priceInputvalue[i].style.opacity = 1
        })
        
        rangeInputvalue[i].addEventListener("mouseout", () => {
          priceInputvalue[i].style.opacity = 0
        })
      }
  }, [rangeInput]);
  
  
  return (
    <aside className="bg-white p-3 border custom-rounded-12">
      <div className="accordion">
        {
          isLoading
            ? <Spinner type={"roller"} height/>
            : isFilter.map((item, number) => {
              return <React.Fragment key={number}>
                <div className="accordion-item  border-0">
                  <h2 className="accordion-header">
                    <button
                      className={`accordion-button custom-target p-0 btn focus-none ${get(isCollapse, get(item, "id")) ? "collapsed" : ""}`}
                      type="button"
                      onClick={() => setCollapse(prevState => ({
                        ...prevState,
                        [get(item, "id")]: !get(isCollapse, get(item, "id"))
                      }))}
                    >
                      {get(item, "name")}
                    </button>
                  </h2>
                </div>
                <Collapse className={"accordion-collapse border-0"} classNameChildren={"accordion-body px-1 border-0"}
                          isOpen={get(isCollapse, get(item, "id"))}>
                  <ul className="list-group aside">
                    {
                      get(item, "product_type_options", []).map((itm, num) => {
                        return <li className="list-group-item px-0 border-0" key={num}>
                          <input
                            className="form-check-input custom-color focus-none me-1"
                            onChange={(e) => {
                              setParams(prevState => ({
                                ...prevState,
                                product_type_option: {
                                  ...get(prevState, "product_type_option"),
                                  [get(itm, "id")]: e.target.checked
                                }
                              }));
                            }}
                            type="checkbox"
                            id={get(itm, "id")}
                          />
                          <label className="text-75758b fw-500" htmlFor={get(itm, "id")}>{get(itm, "name")}</label>
                        </li>
                      })
                    }
                  
                  </ul>
                </Collapse>
              </React.Fragment>
            })
        }
        <div className="accordion-item border-0">
          <h2 className="accordion-header" id="aside-three">
            <button className="accordion-button custom-target p-0 btn focus-none" type="button"
                    data-bs-toggle="collapse" data-bs-target="#asideCollapseThree"
                    aria-expanded="true" aria-controls="asideCollapseThree">
              Ценовой диапазон
            </button>
          </h2>
          <div id="asideCollapseThree" className="accordion-collapse border-0 collapse show"
               aria-labelledby="aside-three">
            <div className="accordion-body px-1 border-0">
              <div className="price-input-container">
                <div className="price-input">
                  <div className="price-field custom-rounded-7" style={{opacity: 0}}>
                    <span>0</span>
                    
                    <div className="position-absolute"
                         style={{bottom: -12, pointerEvents: "none"}}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="8" viewBox="0 0 24 8"
                           fill="none">
                        <path
                          d="M18.5 -0.000905991L6.5 -0.000905466L10.9 5.86635C11.7 6.93313 13.3001 6.93312 14.1001 5.86633L18.5 -0.000905991Z"
                          fill="url(#paint0_linear_1627_882)"/>
                        <defs>
                          <linearGradient id="paint0_linear_1627_882" x1="12.5" y1="8" x2="12.5"
                                          y2="-0.000905728" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#E2C881"/>
                            <stop offset="1" stopColor="#8B6F2A"/>
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                  <div className="price-field custom-rounded-8" style={{opacity: 0}}>
                    <span>6500</span>
                    
                    <div className="position-absolute"
                         style={{bottom: -12, pointerEvents: "none"}}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="8" viewBox="0 0 24 8"
                           fill="none">
                        <path
                          d="M18.5 -0.000905991L6.5 -0.000905466L10.9 5.86635C11.7 6.93313 13.3001 6.93312 14.1001 5.86633L18.5 -0.000905991Z"
                          fill="url(#paint0_linear_1627_882)"/>
                        <defs>
                          <linearGradient id="paint0_linear_1627_882" x1="12.5" y1="8" x2="12.5"
                                          y2="-0.000905728" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#E2C881"/>
                            <stop offset="1" stopColor="#8B6F2A"/>
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                
                </div>
                {/*<div className="price-slider-2 position-relative" style={{height: 1}}/>*/}
                {/*<div className="price-slider-3 position-relative" style={{height: 1}}/>*/}
                <div className="slider-container">
                  <div className="price-slider">
                  </div>
                </div>
              </div>
              
              <div className="range-input">
                <div className="w-100">
                  <span className="range-input-min custom-zindex-2 start-0">{get(rangeInput, "start")}</span>
                  <span className="range-input-max custom-zindex-2 end-0">{get(rangeInput, "end")}</span>
                </div>
                <input type="range"
                       className="min-range"
                       min="0"
                       max="100000000"
                       value={get(rangeInput, "start")}
                       onChange={(e) => setRangeInput(prevState => ({...prevState, start: e.target.value}))}
                       step="1"/>
                <input type="range"
                       data-bs-toggle="tooltip" data-bs-placement="top" title="Tooltip on top"
                       className="max-range"
                       min="0"
                       max="100000000"
                       value={get(rangeInput, "end")}
                       onChange={(e) => setRangeInput(prevState => ({...prevState, end: e.target.value}))}
                       step="1"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    
    </aside>
  );
};

export default CatalogAside;
