import React from 'react';
import {LoadAll} from "../../schema/container";
import {Empty, ProductItem, Spinner} from "../index";
import {useNavigate} from "react-router-dom";

const MyComponent = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="row justify-content-between">
        <div className="col-auto">
          <p className="fs-32 text-greyscale800 fw-700">Похожие товары</p>
        </div>
        <div className="col-auto">
          <button onClick={() => navigate("/")}
                  className="btn bg-white custom-rounded-12 focus-none py-2 text-greyscale800" style={{minWidth: 250}}>
            Посмотреть другие <i className="fas fa-chevron-right ms-3"></i>
          </button>
        </div>
      </div>
      
      <div className="row">
        <LoadAll
          url={"/products"}
          name={"mainProducts"}
          params={{
            page: 2,
            perPage: 5
          }}
          onSuccess={() => {
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
                  ? <Spinner center height/>
                  : isFetched && data.length
                    ? data.map((item, number) => <ProductItem key={number} {...{
                      item,
                      number,
                    }}/>)
                    : <Empty className={"mb-3"} text={"Ma'lumot yo'q"}/>
              }
            </>
          }}
        
        </LoadAll>
      </div>
    </>
  );
};

export default MyComponent;
