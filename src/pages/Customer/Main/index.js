import React, {useState} from 'react';
import {get} from "lodash";
import {Empty, ProductItem, Spinner} from "../../../components";
import {LoadAll} from "../../../schema/container";
import {Link} from "react-router-dom";

const Main = () => {
  const [productCart, setProductCart] = useState(localStorage.getItem("product") ? JSON.parse(localStorage.getItem("product")) : {});
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [viewed, setViewed] = useState({
    page: 1,
    last_page: 0
  })
  
  return (
    <div className={"w-100"}>
      <nav className={"clear-before mt-lg-0 mt-3"} aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fs-14 fw-500">
            <Link className="text-75758b text-decoration-none"
                  to="/dashboard">Кабинет покупателя</Link>
          </li>
          <li className="breadcrumb-item clear-before fs-14 fw-500 text-75758b active" aria-current="page">
            <i className="fas fa-chevron-right fs-12 me-1"/> Главная
          </li>
        </ol>
      </nav>
      
      <div className="row justify-content-between">
        <div className="col-auto">
          <p className="fs-32 text-greyscale800 fw-700">Рекомендуемые товары</p>
        </div>
        
        <div className="col-auto">
          <button
            style={{
              width: 55,
              height: 55,
              boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.11)"
            }}
            disabled={page === 1}
            type="button"
            className={"custom-rounded-12 border-0 focus-none bg-white me-3"}
            onClick={() => setPage(page - 1)}
          >
            <i className="fa-regular fa-arrow-left"/>
          </button>
          
          <button
            style={{
              width: 55,
              height: 55,
              boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.11)"
            }}
            disabled={lastPage === page}
            type="button"
            className={"custom-rounded-12 border-0 focus-none bg-white"}
            onClick={() => setPage(page + 1)}
          >
            <i className="fa-regular fa-arrow-right"/>
          </button>
        </div>
      </div>
      
      <div className="row">
        <LoadAll
          url={"/products"}
          name={"mainProducts"}
          params={{
            page,
            perPage: 8
          }}
          onSuccess={(data, meta) => {
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
            });
            
            setLastPage(Math.ceil(get(meta, 'total', 1) / 8));
          }}
          onError={() => {
          
          }}
          onFinally={() => {
          
          }}
        >
          {({isFetched, data = []}) => {
            return <>
              {
                !isFetched
                  ? <Spinner center/>
                  : isFetched && data.length
                    ? data.map((item, number) => <ProductItem key={number} {...{
                      item,
                      number,
                      setProductCart,
                      productCart,
                      col: 25
                    }}/>)
                    : <Empty className={"mb-3"} text={"Ma'lumot yo'q"}/>
              }
            </>
          }}
        
        </LoadAll>
      </div>
      
      <div className="row justify-content-between">
        <div className="col-auto">
          <p className="fs-32 text-greyscale800 fw-700">Вы просматривали</p>
        </div>
        
        <div className="col-auto">
          <button
            style={{
              width: 55,
              height: 55,
              boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.11)"
            }}
            disabled={get(viewed, "page") === 1}
            type="button"
            className={"custom-rounded-12 border-0 focus-none bg-white me-3"}
            onClick={() => setViewed(prevState => ({...prevState, page: get(viewed, "page") - 1}))}
          >
            <i className="fa-regular fa-arrow-left"/>
          </button>
          
          <button
            style={{
              width: 55,
              height: 55,
              boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.11)"
            }}
            disabled={get(viewed, "last_page") === get(viewed, "page")}
            type="button"
            className={"custom-rounded-12 border-0 focus-none bg-white"}
            onClick={() => setViewed(prevState => ({...prevState, page: get(viewed, "page") + 1}))}
          >
            <i className="fa-regular fa-arrow-right"/>
          </button>
        </div>
      </div>
      
      <div className="row">
        <LoadAll
          url={"/products"}
          name={"clientViewedProducts"}
          params={{
            page: get(viewed, "page"),
            perPage: 4
          }}
          onSuccess={(data, meta) => {
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
            });
            
            setViewed(prevState =>
              ({...prevState, last_page: Math.ceil(get(meta, 'total', 1) / 4)}));
          }}
          onError={() => {
          
          }}
          onFinally={() => {
          
          }}
        >
          {({isFetched, data = []}) => {
            return <>
              {
                !isFetched
                  ? <Spinner center/>
                  : isFetched && data.length
                    ? data.map((item, number) => <ProductItem key={number} {...{
                      item,
                      number,
                      setProductCart,
                      productCart,
                      col: 25
                    }}/>)
                    : <Empty className={"mb-3"} text={"Ma'lumot yo'q"}/>
              }
            </>
          }}
        
        </LoadAll>
      </div>
    </div>
  );
};

export default Main;
