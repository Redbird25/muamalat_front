import React, {useEffect, useState} from 'react';
import {Link, useLocation, useParams} from "react-router-dom";
import {get, isEmpty} from "lodash";

import {CatalogAside, Empty, Pagination, ProductItem, Spinner} from "../../components";
import {Swiper, SwiperSlide} from "swiper/react"
import slide_1 from "assets/images/household-appliances-big.png"
import slide_2 from "../../assets/images/phone-right.png";
import slide_3 from "../../assets/images/people.png";
import slide_4 from "../../assets/images/household-appliances-right.png";
import slide_5 from "../../assets/images/people-2.png";
import discount_1 from "../../assets/images/discount-product-1.png";
import discount_2 from "../../assets/images/discount-product-2.png";
import {LoadAll} from "../../schema/container";
import Toolbar from "../../components/Toolbar";

const CatalogSingle = () => {
  const [isParams, setParams] = useState({
    type: "all"
  });
  const [productCart, setProductCart] = useState(localStorage.getItem("product") ? JSON.parse(localStorage.getItem("product")) : {});
  const [page, setPage] = useState(1);
  const {id} = useParams();
  const {state} = useLocation();
  
  // noinspection DuplicatedCode
  useEffect(() => {
    let likeProduct = {};
    let cartProduct = {};
    let equalProduct = {};
    let cartProductCount = 0;
    let product = {};
    if (productCart) {
      Object.entries(productCart).forEach(([k, v]) => {
        product[k] = {
          like: get(v, "like"),
          cart: get(v, "cart"),
          equal: get(v, "equal"),
          quantity: get(v, "quantity", 1)
        };
        
        if (get(v, "like") && get(v, "id")) {
          likeProduct[k] = v;
        } else {
          delete likeProduct[k];
        }
        
        if (get(v, "cart")) {
          cartProduct[k] = v;
          cartProductCount += 1
        } else {
          delete cartProduct[k];
        }
        
        if (get(v, "equal")) {
          equalProduct[k] = v;
        } else {
          delete equalProduct[k];
        }
        
        if (!get(v, "like") && !get(v, "cart") && !get(v, "equal")) {
          delete product[k]
        }
        
        
      })
    }
    
    let cartCount = document.querySelector(`.count`);
    if (cartCount) {
      cartCount.setAttribute("data-not-count", cartProductCount);
    }
    localStorage.setItem("productLike", JSON.stringify(likeProduct));
    localStorage.setItem("productCart", JSON.stringify(cartProduct));
    localStorage.setItem("productEqual", JSON.stringify(equalProduct));
    localStorage.setItem("productCount", JSON.stringify(cartProductCount));
    localStorage.setItem("product", JSON.stringify(product));
    
  }, [productCart])
  
  return (
    <div className="container my-3">
      <nav className={"clear-before"} aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fs-14 fw-500">
            <Link className="text-75758b text-decoration-none"
                  to="/">Главная</Link>
          </li>
          <li className="breadcrumb-item clear-before fs-14 fw-500 text-75758b active"><i
            className="fas fa-chevron-right fs-12 me-1"/> {get(state, "catalog")}
          </li>
        </ol>
      </nav>
      
      <p className="fs-32 text-greyscale800 fw-700">Новая бытовая техника в новый дом!</p>
      
      <div className="row">
        <div className="col-lg-3 col-xl-2">
          <CatalogAside cat_id={get(state, "catalog_id")} isParams={isParams} setParams={setParams}/>
        </div>
        
        <div className="col-lg-9 col-xl-10 mt-lg-0 mt-3">
          <div className="special-item bg-acbae5 big">
            <p className="special-item_text left">
              Новая бытовая техника <br/>в новый дом!
            </p>
            
            
            <img src={slide_1}
                 className="position-absolute special-item_img  end-0 custom-zindex-1 bottom-0"
                 alt="special"/>
          </div>
          
          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            loop
            grabCursor
            breakpoints={{
              640: {
                slidesPerView: 1.5,
                spaceBetween: 15,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 25,
              },
              1024: {
                slidesPerView: 2.5,
                spaceBetween: 30,
              },
              1600: {
                slidesPerView: 3.5,
                spaceBetween: 30,
              }
            }}
            className="swiper mt-4 mb-4 main-products__swiper rounded-4"
          >
            <SwiperSlide className={"rounded-4"}>
              <Link className="custom-grid_item" to={"#"}>
                <div className="special-item bg-e5acac">
                  <p className="special-item_text right">
                    Часто <br/> покупают
                  </p>
                  
                  
                  <img src={slide_2}
                       className="position-absolute start-0 custom-zindex-1 bottom-0"
                       alt="special"/>
                </div>
              </Link>
            </SwiperSlide>
            <SwiperSlide className={"rounded-4"}>
              <Link className="custom-grid_item" to={"#"}>
                <div className="special-item bg-c3d4f6">
                  <p className="special-item_text right">
                    Новый сезон
                    <br/>
                    специально
                    <br/>
                    для Вас!
                  </p>
                  
                  
                  <img src={slide_3}
                       className="position-absolute start-0 custom-zindex-1 bottom-0"
                       alt="special"/>
                </div>
              </Link>
            </SwiperSlide>
            <SwiperSlide className={"rounded-4"}>
              <Link className="custom-grid_item" to={"#"}>
                <div className="special-item bg-b1f1d6">
                  <p className="special-item_text left">
                    Новая бытовая <br/> техника в <br/>
                    новый дом!
                  </p>
                  
                  
                  <img src={slide_4}
                       className="position-absolute end-0 custom-zindex-1 bottom-0"
                       alt="special"/>
                </div>
              </Link>
            </SwiperSlide>
            <SwiperSlide className={"rounded-4"}>
              <div className="special-item bg-f6f5c3">
                <p className="special-item_text left">
                  Новый сезон
                  <br/>
                  специально
                  <br/>
                  для Вас!
                </p>
                
                
                <img src={slide_5}
                     className="position-absolute end-0 custom-zindex-1 bottom-0"
                     alt="special"/>
              </div>
            </SwiperSlide>
          </Swiper>
          
          <Toolbar {...{
            className: "justify-content-evenly justify-content-lg-start",
            position: "catalog",
            setParams,
            isParams
          }}/>
          
          <LoadAll
            url={"/products"}
            name={"catalogProducts"}
            params={{
              page,
              perPage: 8,
              search_extra: {
                product_type_option_ids: [!isEmpty(get(isParams, "product_type_option")) ? Object.entries(get(isParams, "product_type_option")).map(([k, v]) => v ? k : null).filter(fil => fil) : null].flat(1),
                catalog_ids: [id]
              }
            }}
            onSuccess={(data) => {
              data.forEach(item => {
                if (productCart[get(item, "id")]) {
                  setProductCart(prevState => {
                    return {
                      ...prevState,
                      [get(item, "id")]: {
                        ...prevState[get(item, "id")],
                        ...item,
                      }
                    }
                  })
                }
              })
            }}
            onError={() => {
              
            }}
            onFinally={() => {
              
            }}
          >
            {({isFetched, data = [], meta = []}) => {
              return <div className={"row"}>
                {
                  !isFetched
                    ? <Spinner center/>
                    : isFetched && data.length
                      ? data.map((item, number) => {
                        if (number === 3)
                          return <React.Fragment key={number}>
                            <ProductItem col={25} {...{
                              item,
                              number,
                              setProductCart,
                              productCart
                            }}/>
                            <div className="col-md-6">
                              <img className="w-100 custom-rounded-30" src={discount_1} alt="discount"/>
                            </div>
                            
                            <div className="col-md-6 mt-md-0 mt-3">
                              <img className="w-100 custom-rounded-30" src={discount_2} alt="discount"/>
                            </div>
                          </React.Fragment>
                        else
                          return <ProductItem col={25} key={number} {...{
                            item,
                            number,
                            setProductCart,
                            productCart
                          }}/>
                      })
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
              
              </div>
            }}
          
          </LoadAll>
        </div>
      </div>
    </div>
  );
};

export default CatalogSingle;
