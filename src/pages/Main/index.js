import React, {useState} from 'react';
import {Link} from "react-router-dom";
import {Swiper, SwiperSlide} from "swiper/react"
import {EffectCreative, Autoplay, FreeMode} from 'swiper';
import slide_1 from "assets/images/slide-1.png"
import slide_2 from "assets/images/slide-2.png"

import slide_3 from "assets/images/slide-3.png"
import product_1 from "assets/images/product-1.png"
import product_2 from "assets/images/product-2.png"
import product_3 from "assets/images/product-3.png"
import product_4 from "assets/images/product-4.png"
import product_5 from "assets/images/product-5.png"
import product_6 from "assets/images/product-6.png"
import product_7 from "assets/images/product-7.png"
import product_8 from "assets/images/product-8.png"

// import icon_category_1 from "assets/images/icon/favorites.svg"
// import icon_category_2 from "assets/images/icon/fire.svg"
// import icon_category_3 from "assets/images/icon/new.svg"
// import icon_category_4 from "assets/images/icon/shop-bag.svg"
// import icon_category_5 from "assets/images/icon/big-sale.svg"


import banner_1 from "assets/images/icon/playstore.svg"
import banner_2 from "assets/images/icon/app-store.svg"
import banner_3 from "assets/images/phone-rounded.png"

import {get} from "lodash";
import {Empty, Pagination, ProductItem, Spinner} from "../../components";
import {LoadAll} from "../../schema/container";
import Toolbar from "../../components/Toolbar";

const Main = () => {
  const [page, setPage] = useState(1);
  const category = [
    {
      name: "Телефоны",
      img: product_1
    },
    {
      name: "Кондиционеры",
      img: product_2
    },
    {
      name: "Пылесосы",
      img: product_3
    },
    {
      name: "Холодильники",
      img: product_4
    },
    {
      name: "Ноутбуки",
      img: product_5
    },
    {
      name: "Телевизоры",
      img: product_6
    },
    {
      name: "Стиральные машины",
      img: product_7
    },
    {
      name: "Фены",
      img: product_8
    }
  ];
  
  return (
    <>
      <div className="main-header">
        <div className="container rounded-4">
          <div className="main-header_gradient">
            <Swiper
              modules={[EffectCreative, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              loop
              effect={"creative"}
              creativeEffect={{
                prev: {
                  shadow: true,
                  origin: "left center",
                  translate: ["-5%", 0, -200],
                  rotate: [0, 100, 0],
                },
                next: {
                  origin: "right center",
                  translate: ["5%", 0, -200],
                  rotate: [0, -100, 0],
                },
              }}
              autoplay={{
                delay: 5500,
                disableOnInteraction: false,
              }}
              grabCursor
              className="main-header_gradient__swiper rounded-4">
              <SwiperSlide>
                <img src={slide_1} className="w-100" alt="slide"/>
              </SwiperSlide>
              <SwiperSlide>
                <img src={slide_2} className="w-100" alt="slide"/>
              </SwiperSlide>
              <SwiperSlide>
                <img src={slide_3} className="w-100" alt="slide"/>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
      <div className="container d-flex flex-column">
        <div className="row justify-content-evenly justify-content-lg-start order-lg-1 order-2">
          <Swiper
            modules={[Autoplay, FreeMode]}
            spaceBetween={30}
            slidesPerView={2}
            loop
            grabCursor
            touchEventsTarget={'container'}
            speed={7000}
            freeMode={{
              enabled: true,
              momentum: true,
              momentumRatio: 0.45,
              momentumVelocityRatio: 0.45,
              momentumBounce: false,
              minimumVelocity: 0.02
            }}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
            }}
            className={"my-lg-4 my-0 main-products__swiper rounded-4"}
            breakpoints={{
              640: {
                slidesPerView: 2.5,
                spaceBetween: 15,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 25,
              },
              1024: {
                slidesPerView: 5.5,
                spaceBetween: 30,
              },
              1600: {
                slidesPerView: 7.5,
                spaceBetween: 30,
              }
            }}
          >
            {
              category.map(({name, img}, number) => <SwiperSlide key={number} className={"rounded-4"}>
                <Link to={"/category/"}
                      className={"pt-3 d-block text-decoration-none custom-rounded-30 hover-effect bg-white"}>
                  <p className="text-center mb-0 text-585858">{name}</p>
                  <img src={img} className="w-100 img-cover" alt="slide" height={141}/>
                </Link>
              </SwiperSlide>)
            }
          
          </Swiper>
        </div>
        
        <Toolbar className={"order-lg-2 order-1 my-lg-0 my-3 w-100"}/>
      </div>
      
      <div className="container mt-2">
        <div className="row my-2">
          <LoadAll
            url={"/products"}
            name={"mainProducts"}
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
                    ? <Spinner center/>
                    : isFetched && data.length
                      ? data.map((item, number) => <ProductItem key={number} {...{
                        item,
                        number,
                      }}/>)
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
          {/*{
            products.map((item, number) => <div key={number} className="w-xl-20 my-3 w-lg-33 w-md-50">
              <div className="custom-card">
                <div className="custom-card_img position-relative custom-zindex-4">
                  <div className="custom-card_img__left">
                    <span
                      className={`badge ${get(item, "articleClass") ?? "bg-f04e79"} rounded-pill px-3`}>{get(item, "article")}</span>
                  </div>
                  
                  <button
                    type="button"
                    className={`btn focus-none custom-card_img__top ${get(productCart, `${get(item, "id")}.like`) ? "active" : ""}`}
                    onClick={() => setProductCart(prevState => ({
                      ...prevState, [get(item, "id")]: {
                        like: !get(prevState, `${get(item, "id")}.like`),
                        equal: get(prevState, `${get(item, "id")}.equal`)
                      }
                    }))}>
                    <i className="fi fi-br-heart fs-22 lh-22"/>
                  </button>
                  <button
                    type="button"
                    className={`btn focus-none custom-card_img__bottom ${get(productCart, `${get(item, "id")}.equal`) ? "active" : ""}`}
                    onClick={() => setProductCart(prevState => ({
                      ...prevState, [get(item, "id")]: {
                        like: get(prevState, `${get(item, "id")}.like`),
                        equal: !get(prevState, `${get(item, "id")}.equal`)
                      }
                    }))}
                  >
                    <i className="fi fi-sr-equality fs-22 lh-22"/>
                  </button>
                  
                  <img src={get(item, "img")} alt="article"/>
                </div>
                
                <div className="px-2">
                  <p className="text-greyscale800 lh-20">
                    {get(item, "name")}
                  </p>
                  <div
                    className="border mb-2 fw-700 text-374957 w-content px-4 border-d6bb75 custom-card_discount rounded-pill">
                    {get(item, "plan")}
                  </div>
                  <div className="d-flex mb-2 align-items-center justify-content-between">
                    <span
                      className={`text-decoration-line-through ${get(item, "old_price") === "-" ? "invisible" : ""}`}>{get(item, "old_price")}</span>
                    <b
                      className={`text-ab904a ${get(item, "percent") === "-" ? "invisible" : ""}`}>{get(item, "percent")}</b>
                  </div>
                  
                  
                  <div className="d-flex align-items-center justify-content-between">
                    <b className="fs-24">{get(item, "price")}</b>
                    
                    <button type="button"
                            className="btn focus-none py-2 d-flex-align-center custom-card_img__cart"
                    >
                      <i className="fi fi-br-shopping-cart-add fs-22 lh-22"/>
                    </button>
                  </div>
                </div>
              </div>
            </div>)
          }*/}
        
        </div>
      </div>
      {/* Version 2 */}
      {/*<div className="container custom-rounded-30 bg-white px-md-4 py-md-3 mt-2">
        <div className={"row align-items-center justify-content-between"}>
          <div className="col-lg-3 fs-24 d-flex-align-center fw-700 mt-lg-0 mt-3">
            Лучшие предложения <i className="fi fi-rr-arrow-right text-d3B15e ms-3 lh-14"/>
          </div>
          
          <div className="col-lg-auto mt-lg-0 mt-3">
            <div className="row">
              {
                subcategory.map((item, number) => <div className="col-auto mt-2" key={number}>
                  <div
                    className={`product-box custom-shadow-2 ${get(item, "id") === subActive ? "active" : ""} px-3 w-100`}
                    onClick={() => setSubActive(get(item, "id"))}>
                    {
                      get(item, "img") && <img src={get(item, "img")} className="me-2" alt="icon"/>
                    }
                    <span dangerouslySetInnerHTML={{__html: get(item, "name")}}/>
                  </div>
                </div>)
              }
            </div>
          </div>
        </div>
        <div className="row">
          {
            products.map((item, number) => <div key={number} className="w-xl-20 my-3 w-lg-33 w-md-50">
              <div className="custom-card">
                <div className="custom-card_img position-relative custom-zindex-4">
                  <div className="custom-card_img__left">
                    <span
                      className={`badge ${get(item, "articleClass") ?? "bg-f04e79"} rounded-pill px-3`}>{get(item, "article")}</span>
                  </div>
                  
                  <button
                    type="button"
                    className={`btn focus-none custom-card_img__top ${get(productCart, `${get(item, "id")}.like`) ? "active" : ""}`}
                    onClick={() => setProductCart(prevState => ({
                      ...prevState, [get(item, "id")]: {
                        like: !get(prevState, `${get(item, "id")}.like`),
                        equal: get(prevState, `${get(item, "id")}.equal`)
                      }
                    }))}>
                    <i className="fi fi-br-heart fs-22 lh-22"/>
                  </button>
                  <button
                    type="button"
                    className={`btn focus-none custom-card_img__bottom ${get(productCart, `${get(item, "id")}.equal`) ? "active" : ""}`}
                    onClick={() => setProductCart(prevState => ({
                      ...prevState, [get(item, "id")]: {
                        like: get(prevState, `${get(item, "id")}.like`),
                        equal: !get(prevState, `${get(item, "id")}.equal`)
                      }
                    }))}
                  >
                    <i className="fi fi-sr-equality fs-22 lh-22"/>
                  </button>
                  
                  <img src={get(item, "img")} alt="article"/>
                </div>
                
                <div className="px-2">
                  <p className="text-greyscale800 lh-20">
                    {get(item, "name")}
                  </p>
                  <div
                    className="border mb-2 fw-700 text-374957 w-content px-4 border-d6bb75 custom-card_discount rounded-pill">
                    {get(item, "plan")}
                  </div>
                  <div className="d-flex mb-2 align-items-center justify-content-between">
                    <span
                      className={`text-decoration-line-through ${get(item, "old_price") === "-" ? "invisible" : ""}`}>{get(item, "old_price")}</span>
                    <b
                      className={`text-ab904a ${get(item, "percent") === "-" ? "invisible" : ""}`}>{get(item, "percent")}</b>
                  </div>
                  
                  
                  <div className="d-flex align-items-center justify-content-between">
                    <b className="fs-24">{get(item, "price")}</b>
                    
                    <button type="button"
                            className="btn focus-none py-2 d-flex-align-center custom-card_img__cart"
                    >
                      <i className="fi fi-br-shopping-cart-add fs-22 lh-22"/>
                    </button>
                  </div>
                </div>
              </div>
            </div>)
          }
          
          <Pagination
            className={'custom-style flex-wrap justify-content-center'}
            initialPage={1}
            pageCount={24 / 6}
            pageRange={1}
            marginPage={1}
            // onChange={n => setParams((prev) => ({...prev, page: n, loading: true}))}
          />
        
        </div>
      </div>*/}
      
      <div className="container mt-3 mb-4">
        <div className="bg-white overflow-hidden custom-rounded-30">
          <div className="row">
            <div className="col-lg-6 py-lg-0 p-4 d-flex flex-column align-items-center justify-content-center">
              <div>
                <p className="color-text-gradient fs-lg-48 fs-30 fw-700 mb-0">Trast Muamalat</p>
                <p className="fs-24 lh-24 mb-0">Всё необходимое всегда под рукой</p>
                
                <button className="btn p-0 mt-3 me-3 focus-none border-0">
                  <img src={banner_1} className="w-lg-auto w-100" alt="playstore"/>
                </button>
                <button className="btn p-0 mt-3 focus-none border-0">
                  <img src={banner_2} className="w-lg-auto w-100" alt="app-store"/>
                </button>
              </div>
            </div>
            <div className="col-lg-6 py-3">
              <img src={banner_3} className="w-lg-auto w-100" style={{transform: "translateY(16px)"}}
                   alt="rounded"/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
