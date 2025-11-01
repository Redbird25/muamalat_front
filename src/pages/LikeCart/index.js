import React from 'react';
import {Link} from "react-router-dom";
import {ProductItem, Spinner} from "../../components";
import {get} from "lodash";
import {useSelector} from "react-redux";
import {LoadAll} from "../../schema/container";
import RecommendProducts from "../../components/RecommendProducts";

const LikeCart = () => {
  const {auth, system: {products}, schema: {likeProductsClient}} = useSelector(state => state);

  return (
    <div className="container my-3">
      <nav className={"clear-before"} aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fs-14 fw-500">
            <Link className="text-75758b text-decoration-none"
                  to="/">Главная</Link>
          </li>
          <li className="breadcrumb-item clear-before fs-14 fw-500 text-75758b active"><i
            className="fas fa-chevron-right fs-12 me-1"/> Избранное
          </li>
        </ol>
      </nav>

      <p className="fs-32 text-greyscale800 fw-700">Избранное
        &nbsp;{get(auth, "isAuthenticated") ? `(${get(likeProductsClient, "data", []).length})` : Object.values(products).filter(item => get(item, "like")).length === 0 ? "" : `(${Object.values(products).filter(item => get(item, "like")).length})`}
      </p>
      {
        Object.values(products).filter(item => get(item, "like")).length && !get(auth, "isAuthenticated")
          ? <div className="row">
            {Object.values(products).filter(item => get(item, "like")).map((item, number) => {
              return <ProductItem key={number} {...{item, number}}/>
            })}
          </div>
          : get(auth, "isAuthenticated")
            ? <div className="row">
              <LoadAll
                url={"/client/liked-products"}
                name={"likeProductsClient"}
                onSuccess={() => {
                }}
                onError={() => {

                }}
                onFinally={() => {

                }}
                params={{
                  perPage: 15
                }}
              >
                {({isFetched, data = []}) => {
                  if (!isFetched)
                    return <Spinner center/>
                  else if (isFetched && data.length)
                    return data.map((item, number) => <ProductItem key={number} {...{
                        item,
                        number,
                        actionFrom: "like"
                      }}/>
                    )
                  else
                    return <div className="row flex-column align-items-center justify-content-center min-vh-50">

                      <div className="col-auto">
                        <button
                          className={`btn focus-none btn-lg btn-d3B15e text-white custom-rounded-12`}>
                          <i className={`far fa-heart fs-18`}/>
                        </button>
                      </div>

                      <div className="col-auto mt-3">
                        <p
                          className="text-center lh-32 fs-32 fw-600">У вас нет избранных товаров</p>

                        <p
                          className="text-center fs-14 fw-600">Добавляйте товары в Избранное с помощью ❤️️</p>
                      </div>

                      <div className="col-auto">
                        <Link to={"/"} className="btn btn-menu focus-none h-100" style={{minWidth: 300}}>
                          <span className="bg-gradient-custom reverse"/>
                          <span className="position-relative custom-zindex-2">
                        К товарам
              <i className="far fa-long-arrow-alt-right ms-lg-2 ms-3"/>
            </span>
                        </Link>
                      </div>
                    </div>
                }}
              </LoadAll>
            </div>
            : <div className="row flex-column align-items-center justify-content-center min-vh-50">

              <div className="col-auto">
                <button
                  className={`btn focus-none btn-lg btn-d3B15e text-white custom-rounded-12`}>
                  <i className={`far fa-heart fs-18`}/>
                </button>
              </div>

              <div className="col-auto mt-3">
                <p
                  className="text-center lh-32 fs-32 fw-600">У вас нет избранных товаров</p>

                <p
                  className="text-center fs-14 fw-600">Добавляйте товары в Избранное с помощью ❤️️</p>
              </div>

              <div className="col-auto">
                <Link to={"/"} className="btn btn-menu focus-none h-100" style={{minWidth: 300}}>
                  <span className="bg-gradient-custom reverse"/>
                  <span className="position-relative custom-zindex-2">
                        К товарам
              <i className="far fa-long-arrow-alt-right ms-lg-2 ms-3"/>
            </span>
                </Link>
              </div>
            </div>
      }

      {
        get(auth, "isAuthenticated") && get(likeProductsClient, "data", []).length
          ? <RecommendProducts/>
          : null
      }

    </div>
  );
};

export default LikeCart;
