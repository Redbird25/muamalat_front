import React, {useState} from 'react';
import icon_category_1 from "../../assets/images/icon/favorites.svg";
import icon_category_2 from "../../assets/images/icon/fire.svg";
import icon_category_3 from "../../assets/images/icon/new.svg";
import icon_category_4 from "../../assets/images/icon/shop-bag.svg";
import icon_category_5 from "../../assets/images/icon/big-sale.svg";
import {get} from "lodash";
import {Swiper, SwiperSlide} from "swiper/react"
import {FreeMode} from "swiper";

const subcategory = [
  /*
  {
    name: "Все категории",
    id: 1,
  },*/
  {
    name: "Хит <br/> продаж",
    img: icon_category_1,
    id: 2,
  },
  {
    name: "Горящие <br/> товары",
    img: icon_category_2,
    id: 3,
  },
  {
    name: "Новинки",
    img: icon_category_3,
    id: 4,
  },
  {
    name: "Скидки",
    img: icon_category_4,
    id: 5,
  },
  {
    name: "Распродажа",
    img: icon_category_5,
    id: 6,
  }
];

const subCatalog = [
  {
    id: 1,
    name: "Все товары",
    type: "all"
  },
  {
    id: 2,
    name: "Скидки",
    type: "discount"
  },
  {
    id: 3,
    name: "Популярные",
    type: "popular"
  },
  {
    id: 4,
    name: "Cначала дешевле",
    type: "cheap"
  },
  {
    id: 5,
    name: "Сначала дороже",
    type: "expensive"
  },
  {
    id: 6,
    name: "По скидке",
    type: "on_discount"
  }
]
const Toolbar = ({className, position = "main", setParams, isParams}) => {
  const [subActive, setSubActive] = useState(2);
  const isMain = position === "main";
  /*const containerRef = useRef();
  
  const handleMouseDown = useCallback((e) => {
    const ele = containerRef.current;
    if (!ele) {
      return;
    }
    const startPos = {
      left: ele.scrollLeft,
      top: ele.scrollTop,
      x: e.clientX,
      y: e.clientY,
    };
    
    const handleMouseMove = (e) => {
      const dx = e.clientX - startPos.x;
      // const dy = e.clientY - startPos.y;
      // ele.scrollTop = startPos.top - dy;
      ele.scrollLeft = startPos.left - dx;
      updateCursor(ele);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      resetCursor(ele);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);
  
  const handleTouchStart = useCallback((e) => {
    const ele = containerRef.current;
    if (!ele) {
      return;
    }
    const touch = e.touches[0];
    const startPos = {
      left: ele.scrollLeft,
      top: ele.scrollTop,
      x: touch.clientX,
      y: touch.clientY,
    };
    
    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      const dx = touch.clientX - startPos.x;
      // const dy = touch.clientY - startPos.y;
      // ele.scrollTop = startPos.top - dy;
      ele.scrollLeft = startPos.left - dx;
      updateCursor(ele);
    };
    
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      resetCursor(ele);
    };
    
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  }, []);
  
  const updateCursor = (ele) => {
    if (ele.offsetWidth < 992) {
      ele.style.cursor = 'grabbing';
      ele.style.userSelect = 'none';
    }
  };
  
  const resetCursor = (ele) => {
    if (ele.offsetWidth < 992) {
      ele.style.cursor = 'grab';
      ele.style.removeProperty('user-select');
    }
  };*/
  
  
  return (
    <Swiper
      spaceBetween={isMain ? 0 : 30}
      slidesPerView={2}
      modules={[FreeMode]}
      freeMode
      className={`swiper-toolbar ${isMain ? "swiper-toolbar--main" : ""} ${className}`}
      breakpoints={{
        640: {
          slidesPerView: 1,
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
        isMain
          ? subcategory.map((item, number) => {
            const isActive = get(item, "id") === subActive;
            
            return (
              <SwiperSlide className={"h-auto"} key={number}>
                <div
                  className={`product-box h-100 justify-content-center flex-lg-nowrap flex-md-nowrap flex-wrap custom-shadow-2 toolbar-tab toolbar-tab--main ${isActive ? "active" : ""} px-3 w-100`}
                  onClick={() => setSubActive(get(item, "id"))}>
                  {
                    get(item, "img") && <img src={get(item, "img")}
                                             className="toolbar-tab__icon toolbar-tab__icon--main me-lg-2 mb-lg-0 mb-1"
                                             alt="icon"/>
                  }
                  <span className="toolbar-tab__label toolbar-tab__label--main w-100"
                        dangerouslySetInnerHTML={{__html: get(item, "name")}}/>
                </div>
              </SwiperSlide>
            )
          })
          : subCatalog.map((item, number) => <SwiperSlide className={"h-auto mt-2"}
                                                          key={number}>
            <div onClick={() => setParams(prevState => ({...prevState, type: get(item, "type")}))}
                 className={`product-box justify-content-center text-nowrap ${get(isParams, "type") === get(item, "type") ? "active" : ""} px-3 w-100`}>
              {get(item, "name")}
            </div>
          </SwiperSlide>)
      }
    
    </Swiper>
    /*<div className={`row scroll-none scroll-y ${className}`}
         ref={containerRef}
         onMouseDown={handleMouseDown}
         onTouchStart={handleTouchStart}
    >
      {
        position === "main"
          ? subcategory.map((item, number) => <div className="col-auto mt-2" key={number}>
            <div
              className={`product-box h-100 justify-content-center flex-lg-nowrap flex-wrap custom-shadow-2 ${get(item, "id") === subActive ? "active" : ""} px-3 w-100`}
              onClick={() => setSubActive(get(item, "id"))}>
              {
                get(item, "img") && <img src={get(item, "img")} className="me-lg-2 mb-lg-0 mb-1" alt="icon"/>
              }
              <span className={"w-100"} dangerouslySetInnerHTML={{__html: get(item, "name")}}/>
            </div>
          </div>)
          : subCatalog.map((item, number) => <div className="col-auto mt-2">
            <div onClick={() => setParams(prevState => ({...prevState, type: get(item, "type")}))}
                 className={`product-box ${get(isParams, "type") === get(item, "type") ? "active" : ""} px-3 w-100`}>
              {get(item, "name")}
            </div>
          </div>)
      }
    </div>*/
  );
};

export default Toolbar;
