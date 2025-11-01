import React, {useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import phone_icon from "../../../assets/images/phone-cart.png";
import InputPhone from "../../../components/Fields/InputPhone";
import YandexMap from "../../../components/YandexMap";
import {Modal} from "../../../components";
import {useDispatch} from "react-redux";
import {METHOD} from "../../../schema/actions";
import {toast} from "react-toastify";

const View = () => {
  const navigate = useNavigate();
  const [isModal, setModal] = useState(false);
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const [isTextModal, setTextModal] = useState("");
  const {id} = useParams();

  return (
    <div className={"w-100"}>
      <nav className={"clear-before mt-lg-0 mt-3"} aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fs-14 fw-500">
            <Link className="text-75758b text-decoration-none"
                  to="/dashboard">Кабинет покупателя</Link>
          </li>
          <li className="breadcrumb-item clear-before fs-14 fw-500 text-75758b active" aria-current="page">
            <i className="fas fa-chevron-right fs-12 me-1"/> Покупки
          </li>
          <li className="breadcrumb-item clear-before fs-14 fw-500 text-75758b active" aria-current="page">
            <i className="fas fa-chevron-right fs-12 me-1"/> Заказы
          </li>
        </ol>
      </nav>

      <div className="bg-white px-3 pt-3 pb-4 custom-rounded-12 border border-ebebeb">
        <p className={"fs-14 text-141316 mb-0"}>Адрес покупателя</p>

        <p className={"fs-14 fw-700 text-171725"}>Республика Узбекистан, г. Ташкент, Учтепинский район, 7 проезд, 4
          тупик, 2-я дверь слева</p>

        <button
          type="button"
          className={`btn btn-menu custom-rounded-12 focus-none w-auto`}
          style={{minWidth: 275, height: 42}}
          onClick={() => setModal(1)}
        >
          <span className="bg-gradient-custom reverse custom-rounded-12"/>
          <span
            className="position-relative d-flex align-items-center justify-content-center fs-17 fw-600 custom-zindex-2">
                Показать на карте
            <svg className={"ms-2"} xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25"
                 fill="none">
              <path fillRule="evenodd" clipRule="evenodd"
                    d="M3.46447 21.0355C4.92893 22.5 7.28595 22.5 12 22.5C16.714 22.5 19.0711 22.5 20.5355 21.0355C22 19.5711 22 17.214 22 12.5C22 7.78595 22 5.42893 20.5355 3.96447C19.0711 2.5 16.714 2.5 12 2.5C7.28595 2.5 4.92893 2.5 3.46447 3.96447C2 5.42893 2 7.78595 2 12.5C2 17.214 2 19.5711 3.46447 21.0355ZM16.9348 8.69598L13.4227 17.8618C13.1045 18.6922 11.94 18.7192 11.6917 17.9019L10.6352 14.4249C10.553 14.1545 10.3455 13.947 10.0751 13.8648L6.5981 12.8083C5.78079 12.56 5.80779 11.3955 6.63824 11.0773L15.804 7.56521C16.5389 7.28361 17.2164 7.96107 16.9348 8.69598Z"
                    fill="white"/>
            </svg>
              </span>
        </button>
      </div>

      <div className="bg-white p-3 custom-rounded-12 border border-ebebeb mt-3">
        <div className="px-2">
          <div className="row">
            <div className="w-xl-35 w-lg-50">
              <div className="border border-ebebeb custom-rounded-12 p-3 h-100">
                <p className={"fs-18 fw-600 lh-24"}>Товары</p>

                <div className="d-flex flex-lg-nowrap flex-wrap">
                  <div
                    style={{
                      minWidth: 100
                    }}
                    className={"border border-ebebeb custom-rounded-12 d-flex-center-center py-3 px-2 w-lg-auto w-100"}>
                    <img src={phone_icon} alt="card"/>
                  </div>

                  <div className="px-lg-3 mt-lg-0 mt-3 w-100">
                    <p className={"lh-18"}>Телевизор LG 55UR81006LJ Smart</p>

                    <p className={"fs-xxl-24 fs-20 fw-700 lh-xxl-25 lh-21"}>
                      <InputPhone value={9_100_000} thousandSeparator={" "} displayType={"text"}/> сум
                    </p>
                  </div>
                </div>

                <div className="d-flex flex-lg-nowrap flex-wrap mt-3">
                  <div
                    style={{
                      minWidth: 100
                    }}
                    className={"border border-ebebeb custom-rounded-12 d-flex-center-center py-3 px-2 w-lg-auto w-100"}>
                    <img src={phone_icon} alt="card"/>
                  </div>

                  <div className="px-lg-3 mt-lg-0 mt-3 w-100">
                    <p className={"lh-18"}>Телевизор LG 55UR81006LJ Smart</p>

                    <p className={"fs-xxl-24 fs-20 fw-700 lh-xxl-25 lh-21"}>
                      <InputPhone value={9_100_000} thousandSeparator={" "} displayType={"text"}/> сум
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-xl-30 w-lg-50 px-lg-0 mt-lg-0 mt-3">
              <div className="border border-ebebeb custom-rounded-12 p-3 h-100">
                <p className={"fs-18 fw-600 lh-24 mb-0"}>Продавец</p>

                <p className={"fw-700 text-171725 my-2"}>Иван Иванов</p>

                <p className={"fs-14 text-171725 mb-0"}>Телефон номер:</p>
                <a className={"text-decoration-none text-171725 fs-14 fw-700 mb-2 d-block"}
                   href="tel: +998990070777">+998990070777</a>

                <p className={"fs-14 text-171725 mb-0"}>ИНН:</p>
                <p className={"fs-14 fw-700 text-171725"}>123132123</p>

                <p className={"fs-14 text-171725 mb-0"}>Код ОКЭД:</p>
                <p className={"fs-14 fw-700 text-171725"}>123132</p>
              </div>
            </div>

            <div className="w-xl-35 w-100 mt-xl-0 mt-3">
              <div className="border border-ebebeb custom-rounded-12 p-3 h-100">
                <p className={"fs-18 fw-600 lh-24"}>Адрес продавца</p>

                <YandexMap height={145}/>

                <p className={"fs-14 fw-500 text-75758b lh-18 mt-3"}>Республика Узбекистан, г. Ташкент, Учтепинский
                  район, 7 проезд, 4 тупик, 2-я дверь слева</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-3 custom-rounded-12 border border-ebebeb mt-3">
        <div className="px-2">
          <div className="row">
            <div className="w-xl-35 w-lg-50">
              <div className="border border-ebebeb custom-rounded-12 p-3 h-100">
                <p className={"fs-18 fw-600 lh-24"}>Товары</p>

                <div className="d-flex flex-lg-nowrap flex-wrap">
                  <div
                    style={{
                      minWidth: 100
                    }}
                    className={"border border-ebebeb custom-rounded-12 d-flex-center-center py-3 px-2 w-lg-auto w-100"}>
                    <img src={phone_icon} alt="card"/>
                  </div>

                  <div className="px-lg-3 mt-lg-0 mt-3 w-100">
                    <p className={"lh-18"}>Телевизор LG 55UR81006LJ Smart</p>

                    <p className={"fs-xxl-24 fs-20 fw-700 lh-xxl-25 lh-21"}>
                      <InputPhone value={9_100_000} thousandSeparator={" "} displayType={"text"}/> сум
                    </p>
                  </div>
                </div>

                <div className="d-flex flex-lg-nowrap flex-wrap mt-3">
                  <div
                    style={{
                      minWidth: 100
                    }}
                    className={"border border-ebebeb custom-rounded-12 d-flex-center-center py-3 px-2 w-lg-auto w-100"}>
                    <img src={phone_icon} alt="card"/>
                  </div>

                  <div className="px-lg-3 mt-lg-0 mt-3 w-100">
                    <p className={"lh-18"}>Телевизор LG 55UR81006LJ Smart</p>

                    <p className={"fs-xxl-24 fs-20 fw-700 lh-xxl-25 lh-21"}>
                      <InputPhone value={9_100_000} thousandSeparator={" "} displayType={"text"}/> сум
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-xl-30 w-lg-50 px-lg-0 mt-lg-0 mt-3">
              <div className="border border-ebebeb custom-rounded-12 p-3 h-100">
                <p className={"fs-18 fw-600 lh-24 mb-0"}>Продавец</p>

                <p className={"fw-700 text-171725 my-2"}>Иван Иванов</p>

                <p className={"fs-14 text-171725 mb-0"}>Телефон номер:</p>
                <a className={"text-decoration-none text-171725 fs-14 fw-700 mb-2 d-block"}
                   href="tel: +998990070777">+998990070777</a>

                <p className={"fs-14 text-171725 mb-0"}>ИНН:</p>
                <p className={"fs-14 fw-700 text-171725"}>123132123</p>

                <p className={"fs-14 text-171725 mb-0"}>Код ОКЭД:</p>
                <p className={"fs-14 fw-700 text-171725"}>123132</p>
              </div>
            </div>

            <div className="w-xl-35 w-100 mt-xl-0 mt-3">
              <div className="border border-ebebeb custom-rounded-12 p-3 h-100">
                <p className={"fs-18 fw-600 lh-24"}>Адрес продавца</p>

                <YandexMap height={145}/>

                <p className={"fs-14 fw-500 text-75758b lh-18 mt-3"}>Республика Узбекистан, г. Ташкент, Учтепинский
                  район, 7 проезд, 4 тупик, 2-я дверь слева</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-1 my-4">
        <div className="row justify-content-center">
          <div className="w-lg-30 mt-xxl-0 mt-3 w-xxl-20 pe-xxl-0">
            <button
              onClick={() => navigate(-1)}
              type={"button"}
              className={"btn text-nowrap w-100 bg-a7a7a7 text-white focus-none custom-rounded-8 fw-600 fs-17"}
            >
              Назад
            </button>
          </div>

          <div className="w-lg-30 mt-xxl-0 mt-3 w-xxl-20 pe-xxl-0">
            <button
              type={"button"}
              className={"btn text-nowrap w-100 bg-ef5c2c text-white focus-none custom-rounded-8 fw-600 fs-17"}
              onClick={() => setModal(3)}
            >
              Отклонить <svg className={"ms-2"} xmlns="http://www.w3.org/2000/svg" width="25" height="24"
                             viewBox="0 0 25 24" fill="none">
              <path
                d="M20.1505 7.61665L16.1918 4.05375C15.0639 3.03868 14.5 2.53114 13.8081 2.26562L13.7988 5.00011C13.7988 7.35713 13.7988 8.53564 14.5311 9.26787C15.2633 10.0001 16.4418 10.0001 18.7988 10.0001H22.3789C22.0164 9.29588 21.3672 8.71164 20.1505 7.61665Z"
                fill="white"/>
              <path fillRule="evenodd" clipRule="evenodd"
                    d="M10.7988 22H14.7988C18.5701 22 20.4557 22 21.6273 20.8284C22.7988 19.6569 22.7988 17.7712 22.7988 14V13.5629C22.7988 12.6901 22.7988 12.0344 22.7562 11.5001H18.7988L18.704 11.5001C17.6069 11.5002 16.6373 11.5003 15.8558 11.3952C15.0087 11.2813 14.1617 11.0198 13.4704 10.3285C12.7791 9.63726 12.5176 8.79028 12.4037 7.94316C12.2987 7.16164 12.2987 6.19207 12.2988 5.09497L12.3081 2.26057C12.3083 2.17813 12.3154 2.09659 12.3288 2.01666C11.9202 2 11.4346 2 10.8286 2C7.03752 2 5.14197 2 3.9704 3.17157C2.79883 4.34315 2.79883 6.22876 2.79883 10V14C2.79883 17.7712 2.79883 19.6569 3.9704 20.8284C5.14197 22 7.02759 22 10.7988 22ZM6.2685 14.4697C6.56139 14.1768 7.03626 14.1768 7.32916 14.4697L8.29883 15.4393L9.2685 14.4697C9.56139 14.1768 10.0363 14.1768 10.3292 14.4697C10.6221 14.7626 10.6221 15.2374 10.3292 15.5303L9.35949 16.5L10.3292 17.4697C10.6221 17.7626 10.6221 18.2374 10.3292 18.5303C10.0363 18.8232 9.56139 18.8232 9.2685 18.5303L8.29883 17.5607L7.32916 18.5303C7.03626 18.8232 6.56139 18.8232 6.2685 18.5303C5.9756 18.2374 5.9756 17.7626 6.2685 17.4697L7.23817 16.5L6.2685 15.5303C5.9756 15.2374 5.9756 14.7626 6.2685 14.4697Z"
                    fill="white"/>
            </svg>
            </button>
          </div>

          <div className="w-lg-30 mt-xxl-0 mt-3 w-xxl-20 pe-xxl-0">
            <button
              type={"button"}
              className={"btn text-nowrap w-100 bg-3d82c4 text-white focus-none custom-rounded-8 fw-600 fs-17"}
              disabled={isLoading}
              onClick={() => {
                setLoading(true);
                dispatch(METHOD.request({
                  url: `/driver/order/order-get/${id}`,
                  name: "orderDriverGet",
                  cb: {
                    success: () => {
                      toast.success("Товар забрал");
                      navigate(-1);
                    },
                    error: () => {

                    },
                    finally: () => {
                      setLoading(false);
                    }
                  }
                }));
              }}
            >
              Забрал заказ <svg className={"ms-2"} xmlns="http://www.w3.org/2000/svg" width="25" height="24"
                                viewBox="0 0 25 24" fill="none">
              <path
                d="M10.0644 8.73049L10.5789 10.5926C11.0639 12.3481 11.3064 13.2259 12.0194 13.6252C12.7323 14.0244 13.6374 13.7892 15.4474 13.3188L17.3673 12.8199C19.1774 12.3495 20.0824 12.1143 20.4941 11.4227C20.9057 10.7312 20.6632 9.85344 20.1782 8.09788L19.6638 6.2358C19.1788 4.48023 18.9363 3.60244 18.2233 3.20319C17.5103 2.80394 16.6052 3.03915 14.7952 3.50955L12.8753 4.00849C11.0652 4.47889 10.1602 4.71409 9.74856 5.40562C9.33692 6.09714 9.57943 6.97493 10.0644 8.73049Z"
                fill="white"/>
              <path
                d="M2.77749 5.24694C2.88823 4.84781 3.30157 4.61402 3.7007 4.72476L5.4044 5.19744C6.32129 5.45183 7.0469 6.15866 7.30003 7.07489L9.45106 14.8609L9.60935 15.4075C10.2425 15.6438 10.7863 16.0866 11.1314 16.6747L11.4414 16.579L20.3115 14.2739C20.7124 14.1697 21.1219 14.4102 21.2261 14.8111C21.3303 15.212 21.0897 15.6214 20.6888 15.7256L11.8515 18.0223L11.5228 18.1238C11.5161 19.3947 10.6392 20.5555 9.31236 20.9003C7.72189 21.3136 6.08709 20.3982 5.66092 18.8556C5.23476 17.313 6.17861 15.7274 7.76908 15.3141C7.8479 15.2936 7.92682 15.2764 8.0057 15.2623L5.85419 7.47433C5.74592 7.08242 5.42897 6.76092 5.00338 6.64284L3.29968 6.17016C2.90054 6.05942 2.66675 5.64608 2.77749 5.24694Z"
                fill="white"/>
            </svg>
            </button>
          </div>

          <div className="w-lg-30 mt-xxl-0 mt-3 w-xxl-20 pe-xxl-0">
            <button
              type={"button"}
              className={"btn text-nowrap w-100 bg-34c759 text-white focus-none custom-rounded-8 fw-600 fs-17"}
              disabled={isLoading}
              onClick={() => {
                setLoading(true);
                dispatch(METHOD.request({
                  url: `/driver/order/order-finish/${id}`,
                  name: "orderDriverFinish",
                  cb: {
                    success: () => {
                      toast.success("Товар доставил");
                      navigate(-1);
                    },
                    error: () => {

                    },
                    finally: () => {
                      setLoading(false);
                    }
                  }
                }));
              }}
            >
              Доставил заказ <svg className={"ms-2"} xmlns="http://www.w3.org/2000/svg" width="25" height="24"
                                  viewBox="0 0 25 24"
                                  fill="none">
              <path fillRule="evenodd" clipRule="evenodd"
                    d="M12.6992 22C7.98517 22 5.62815 22 4.16368 20.5355C2.69922 19.0711 2.69922 16.714 2.69922 12C2.69922 7.28595 2.69922 4.92893 4.16368 3.46447C5.62815 2 7.98517 2 12.6992 2C17.4133 2 19.7703 2 21.2348 3.46447C22.6992 4.92893 22.6992 7.28595 22.6992 12C22.6992 16.714 22.6992 19.0711 21.2348 20.5355C19.7703 22 17.4133 22 12.6992 22ZM16.7295 8.96967C17.0224 9.26256 17.0224 9.73744 16.7295 10.0303L11.7295 15.0303C11.4367 15.3232 10.9618 15.3232 10.6689 15.0303L8.66889 13.0303C8.376 12.7374 8.376 12.2626 8.66889 11.9697C8.96178 11.6768 9.43666 11.6768 9.72955 11.9697L11.1992 13.4393L15.6689 8.96967C15.9618 8.67678 16.4367 8.67678 16.7295 8.96967Z"
                    fill="white"/>
            </svg>
            </button>
          </div>

          <div className="w-lg-30 mt-xxl-0 mt-3 w-xxl-20">
            <button
              type={"button"}
              className={"btn text-nowrap w-100 bg-f04e79 text-white focus-none custom-rounded-8 fw-600 fs-17"}
              onClick={() => setModal(2)}
            >
              Клиент отменил <svg className={"ms-2"} xmlns="http://www.w3.org/2000/svg" width="25" height="24"
                                  viewBox="0 0 25 24"
                                  fill="none">
              <path fillRule="evenodd" clipRule="evenodd"
                    d="M22.9004 12C22.9004 17.5228 18.4232 22 12.9004 22C7.37754 22 2.90039 17.5228 2.90039 12C2.90039 6.47715 7.37754 2 12.9004 2C18.4232 2 22.9004 6.47715 22.9004 12ZM9.87002 8.96965C10.1629 8.67676 10.6378 8.67676 10.9307 8.96965L12.9004 10.9393L14.87 8.96967C15.1629 8.67678 15.6378 8.67678 15.9307 8.96967C16.2236 9.26256 16.2236 9.73744 15.9307 10.0303L13.961 12L15.9307 13.9696C16.2236 14.2625 16.2236 14.7374 15.9307 15.0303C15.6378 15.3232 15.1629 15.3232 14.87 15.0303L12.9004 13.0607L10.9307 15.0303C10.6378 15.3232 10.1629 15.3232 9.87004 15.0303C9.57715 14.7374 9.57715 14.2625 9.87004 13.9697L11.8397 12L9.87002 10.0303C9.57713 9.73742 9.57713 9.26254 9.87002 8.96965Z"
                    fill="white"/>
            </svg>
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={!!isModal}
        position={"center"}
        maxWidth={"520px"}
        height={"auto"}
        defaultHeight={"100%"}
        width={"auto"}
        onClose={() => {
          setModal(false);
          setTextModal("");
        }}
        modalPaddingAuto={false}
        modalContentClass={"modal-content custom-rounded-20 shadow"}
      >
        <div className="bg-white p-4 custom-rounded-20 border border-e5e7e9 w-100">
          <div className="text-end">
            <button
              type={"button"}
              className="btn focus-none"
              onClick={() => {
                setModal(false);
                setTextModal("");
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <g clipPath="url(#clip0_4958_28213)">
                  <path
                    d="M23.7068 0.292786C23.5193 0.105315 23.2649 0 22.9998 0C22.7346 0 22.4803 0.105315 22.2928 0.292786L11.9998 10.5858L1.70679 0.292786C1.51926 0.105315 1.26495 0 0.999786 0C0.734622 0 0.480314 0.105315 0.292786 0.292786C0.105315 0.480314 0 0.734622 0 0.999786C0 1.26495 0.105315 1.51926 0.292786 1.70679L10.5858 11.9998L0.292786 22.2928C0.105315 22.4803 0 22.7346 0 22.9998C0 23.2649 0.105315 23.5193 0.292786 23.7068C0.480314 23.8943 0.734622 23.9996 0.999786 23.9996C1.26495 23.9996 1.51926 23.8943 1.70679 23.7068L11.9998 13.4138L22.2928 23.7068C22.4803 23.8943 22.7346 23.9996 22.9998 23.9996C23.2649 23.9996 23.5193 23.8943 23.7068 23.7068C23.8943 23.5193 23.9996 23.2649 23.9996 22.9998C23.9996 22.7346 23.8943 22.4803 23.7068 22.2928L13.4138 11.9998L23.7068 1.70679C23.8943 1.51926 23.9996 1.26495 23.9996 0.999786C23.9996 0.734622 23.8943 0.480314 23.7068 0.292786Z"
                    fill="#A7A7A7"/>
                </g>
                <defs>
                  <clipPath id="clip0_4958_28213">
                    <rect width="24" height="24" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>
          {
            1 === isModal
              ? <>
                <p className={"fs-24 lh-32 fw-600 text-center"}>Адрес покупателя</p>

                <p className={"fs-14 fw-500 text-75758b lh-18"}>Республика Узбекистан, г. Ташкент, Учтепинский район, 7
                  проезд, 4 тупик, 2-я дверь слева</p>

                <YandexMap height={220}/>

                <div className="text-center">
                  <button
                    style={{
                      minWidth: 220,
                      height: 50,
                    }}
                    type={"button"}
                    className={"btn bg-ebebeb focus-none fs-17 fw-600 text-838383 custom-rounded-8 mt-3"}
                    onClick={() => {
                      setModal(false);
                      setTextModal("");
                    }}
                  >
                    Назад
                  </button>
                </div>
              </>
              : [2, 3].includes(isModal)
                ? <>
                  <p className={"fs-24 lh-32 fw-600 text-center"}>{2 === isModal ? "Клиент отменил" : "Отклонить"}</p>
                  <div className="my-3">
                    <label htmlFor="reason" className={"form-label"}>Причина</label>

                    <textarea
                      style={{
                        borderColor: "#E2C881"
                      }}
                      value={isTextModal}
                      onChange={(e)=> setTextModal(e.target.value)}
                      className={"form-control focus-none custom-rounded-12"}
                      name="reason"
                      id="reason"
                      cols="30"
                      rows="10"
                    >
                    
                    </textarea>
                  </div>

                  <div className="d-flex-between-center mt-5">
                    <button
                      style={{
                        minWidth: 220,
                        height: 50,
                      }}
                      type={"button"}
                      className={"btn bg-ebebeb focus-none fs-17 fw-600 text-838383 custom-rounded-8"}
                      onClick={() => {
                        setModal(false);
                        setTextModal("");
                      }}
                    >
                      Назад
                    </button>

                    <button
                      style={{
                        minWidth: 220,
                        height: 50,
                      }}
                      type={"button"}
                      className={"btn btn-menu focus-none custom-rounded-8"}
                      disabled={isLoading}
                      onClick={() => {
                        setLoading(true);
                        dispatch(METHOD.request({
                          url: `/driver/order/order-${2 === isModal ? "cancel" : "reject"}/${id}`,
                          name: "orderDriverCancelOrReject",
                          values: 2 === isModal ? {cancel_reson: isTextModal} : {reject_reason: isTextModal},
                          cb: {
                            success: () => {
                              setModal(false);
                              setTextModal("");
                              toast.success("Товар доставил");
                              navigate(-1);
                            },
                            error: () => {

                            },
                            finally: () => {
                              setLoading(false);
                            }
                          }
                        }));
                      }}
                    >
                      <span className="bg-gradient-custom reverse custom-rounded-8"/>
                      <span className="position-relative custom-zindex-2">
                        Сохранить
                      </span>
                    </button>
                  </div>
                </>
                : null

          }
        </div>
      </Modal>
    </div>
  );
};

export default View;
