import React, {useEffect, useMemo, useState} from 'react';
import {Swiper, SwiperSlide} from "swiper/react"
import {FreeMode, Thumbs} from 'swiper';
import {Link, useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {LoadOne, METHOD, UPDATE} from "../../schema/actions";
import {get} from "lodash";
import config from "../../config";
// import logo_text from "assets/images/icon/logo-text.svg"
import InputPhone from "../../components/Fields/InputPhone";
import {toast} from "react-toastify";
import FavouritesAction from "../../redux/functions/favourites";
import {LOGIN} from "../../redux/actions";
import RecommendProducts from "../../components/RecommendProducts";
import {ModalLoginRegister} from "../../components";
import ReactImageMagnify from "react-image-magnify";

const ProductSingle = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const {auth, system: {products}} = useSelector(state => state);
  const dispatch = useDispatch();
  const [isDetails, setDetails] = useState();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  // const [isProgress, setProgress] = useState(0);
  const [isTab, setTab] = useState(1);
  const [isModal, setModal] = useState(false);
  const [showAllSpecifications, setShowAllSpecifications] = useState(false);

  useEffect(() => {
    dispatch(LoadOne.request({
      url: `/product/${id}`,
      name: "productDetails",
      cb: {
        success: (data) => {
          setDetails(data)
        },
        error: (error) => {
          console.log(error)
        },
        finally: () => {

        }
      }
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id]);

  const attributeGroups = useMemo(() => {
    if (!isDetails) {
      return [];
    }

    const groups = [];

    const normalizeOption = (option, index, groupKey) => {
      if (!option) {
        return null;
      }

      if (typeof option === 'string') {
        const trimmed = option.trim();
        return {
          id: `${groupKey}-${index}`,
          label: trimmed,
          value: trimmed,
          hex: trimmed.startsWith('#') ? trimmed : undefined,
        };
      }

      const id = option.id ?? option.value_id ?? option.attribute_value_id ?? option.code ?? option.value ?? `${groupKey}-${index}`;
      const label = option.label ?? option.name ?? option.value ?? option.translation ?? option.title ?? '';
      const hex = option.hex ?? option.color ?? option.code ?? (typeof option.value === 'string' && option.value.startsWith('#') ? option.value : undefined);
      const image = option.image ?? option.preview ?? option.thumbnail;

      return {
        id: `${groupKey}-${id}`,
        label,
        value: option.value ?? option.slug ?? option.code ?? option.name ?? label,
        hex,
        image,
      };
    };

    const pushGroup = (key, group, indexHint) => {
      if (!group) {
        return;
      }

      const rawOptions = Array.isArray(group.options)
        ? group.options
        : Array.isArray(group.values)
          ? group.values
          : Array.isArray(group.items)
            ? group.items
            : Array.isArray(group.choices)
              ? group.choices
              : [];

      const options = rawOptions
        .map((option, optionIndex) => normalizeOption(option, optionIndex, key ?? `group-${indexHint}`))
        .filter(Boolean);

      if (!options.length) {
        return;
      }

      const title = group.title ?? group.name ?? group.label ?? group.attribute_name ?? group.display_name ?? '';
      const typeCandidate = (group.type ?? title ?? '').toString().toLowerCase();
      const type = typeCandidate.includes('цвет') || typeCandidate.includes('color') ? 'color' : group.type ?? 'text';

      groups.push({
        key: key ?? group.key ?? group.slug ?? group.id ?? `group-${indexHint}`,
        title: title || 'Характеристика',
        type,
        options,
      });
    };

    const rawAttributes = get(isDetails, 'product.attributes') ?? get(isDetails, 'attributes');

    if (Array.isArray(rawAttributes)) {
      rawAttributes.forEach((group, index) => pushGroup(group?.key ?? group?.slug ?? `group-${index}`, group, index));
    } else if (rawAttributes && typeof rawAttributes === 'object') {
      Object.entries(rawAttributes).forEach(([key, value], index) => {
        if (value && typeof value === 'object') {
          pushGroup(key, value, index);
        }
      });
    }

    const rawColors = get(isDetails, 'product.colors') ?? get(isDetails, 'colors');
    if (Array.isArray(rawColors) && rawColors.length && !groups.some(group => group.type === 'color')) {
      const options = rawColors
        .map((color, index) => normalizeOption(color, index, 'color'))
        .filter(Boolean);

      if (options.length) {
        groups.unshift({
          key: 'color',
          title: 'Цвет',
          type: 'color',
          options,
        });
      }
    }

    if (!groups.length) {
      return [
        {
          key: 'color',
          title: 'Цвет',
          type: 'color',
          options: [
            {id: 'color-default-1', label: 'Синий', value: '#2264bf', hex: '#2264bf'},
            {id: 'color-default-2', label: 'Серый', value: '#585858', hex: '#585858'},
            {id: 'color-default-3', label: 'Чёрный', value: '#2b2b2b', hex: '#2b2b2b'},
          ],
        },
        {
          key: 'attribute_1',
          title: 'ОЗУ',
          type: 'text',
          options: [
            {id: 'attribute_1-12', label: '12 ГБ', value: '12'},
          ],
        },
        {
          key: 'attribute_2',
          title: 'Память',
          type: 'text',
          options: [
            {id: 'attribute_2-1tb', label: '1 ТБ', value: '1TB'},
            {id: 'attribute_2-256', label: '256 ГБ', value: '256GB'},
            {id: 'attribute_2-512', label: '512 ГБ', value: '512GB'},
          ],
        }
      ];
    }

    return groups;
  }, [isDetails]);

  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    setSelectedOptions(prevState => {
      const nextState = {...prevState};
      let changed = false;

      attributeGroups.forEach(group => {
        const hasOptions = Array.isArray(group.options) && group.options.length;

        if (!hasOptions) {
          if (nextState[group.key]) {
            delete nextState[group.key];
            changed = true;
          }
          return;
        }

        if (!group.options.some(option => option.id === nextState[group.key])) {
          nextState[group.key] = group.options[0].id;
          changed = true;
        }
      });

      Object.keys(nextState).forEach(key => {
        if (!attributeGroups.some(group => group.key === key)) {
          delete nextState[key];
          changed = true;
        }
      });

      return changed ? nextState : prevState;
    });
  }, [attributeGroups]);

  const handleSelectOption = (groupKey, optionId) => {
    setSelectedOptions(prev => {
      if (prev[groupKey] === optionId) {
        return prev;
      }
      return {
        ...prev,
        [groupKey]: optionId,
      };
    });
  };

  const colorGroups = attributeGroups.filter(group => group.type === 'color');
  const otherAttributeGroups = attributeGroups.filter(group => group.type !== 'color');

  useEffect(() => {
    setShowAllSpecifications(false);
  }, [isDetails]);

  const specifications = useMemo(() => {
    const fallback = [
      'Фронтальная камера: 32 Мп',
      'Основная камера: 50 Мп',
      'Тип матрицы: AMOLED',
      'Тип экрана: AMOLED',
      'Процессор: Snapdragon',
      'Быстрая зарядка: Есть',
    ];

    const rawSpecs = get(isDetails, 'product.specifications') ?? get(isDetails, 'specifications') ?? fallback;

    const normalizeValue = (value) => {
      if (value == null) {
        return '';
      }
      if (Array.isArray(value)) {
        return value.map(normalizeValue).filter(Boolean).join(', ');
      }
      if (typeof value === 'object') {
        const name = value.name ?? value.label ?? value.title ?? '';
        const val = value.value ?? value.content ?? value.text ?? '';
        const combined = `${name}${name && val ? ': ' : ''}${normalizeValue(val)}`;
        return combined.trim();
      }
      return String(value).trim();
    };

    const specsArray = () => {
      if (Array.isArray(rawSpecs)) {
        return rawSpecs
          .map((item) => {
            if (typeof item === 'string') {
              return item.trim();
            }
            if (item && typeof item === 'object') {
              const left = item.name ?? item.label ?? item.title ?? item.key ?? '';
              const right = normalizeValue(item.value ?? item.content ?? item.text ?? item.description);
              const combined = `${left}${left && right ? ': ' : ''}${right}`;
              return combined.trim();
            }
            return '';
          })
          .filter(Boolean);
      }

      if (rawSpecs && typeof rawSpecs === 'object') {
        return Object.entries(rawSpecs)
          .map(([key, value]) => {
            const normalizedValue = normalizeValue(value);
            const normalizedKey = normalizeValue(key);
            if (!normalizedValue && !normalizedKey) {
              return '';
            }
            return `${normalizedKey}${normalizedKey && normalizedValue ? ': ' : ''}${normalizedValue}`.trim();
          })
          .filter(Boolean);
      }

      return fallback;
    };

    const prepared = specsArray();
    return prepared.length ? prepared : fallback;
  }, [isDetails]);

  const specificationsToShow = useMemo(() => {
    const limit = 5;
    if (showAllSpecifications) {
      return specifications;
    }
    return specifications.slice(0, limit);
  }, [specifications, showAllSpecifications]);

  const hasMoreSpecifications = specifications.length > 5;

  return (
    <div className="container mb-3">
      <nav className={"clear-before"} aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fs-14 fw-500">
            <Link className="text-75758b text-decoration-none"
                  to="/">Главная</Link>
          </li>
          <li className="breadcrumb-item clear-before fs-14 fw-500 text-75758b active" aria-current="page">
            <i className="fas fa-chevron-right fs-12 me-1"/> Смартфоны
          </li>
          <li className="breadcrumb-item clear-before fs-14 fw-500 text-75758b active" aria-current="page">
            <i className="fas fa-chevron-right fs-12 me-1"/> Телефон
          </li>
        </ol>
      </nav>

      <div className="row align-items-center justify-content-between">
        <div className="col-auto mb-lg-0 mb-3">
          <p className="fs-32 text-greyscale800 fw-700">{get(isDetails, "product.name")}</p>

          <p><i className="fal fa-star text-d6bb75 me-1"></i> <span
            className="fs-14 fw-500 text-greyscale800">4.6&nbsp;</span>
            <i className="far fa-horizontal-rule fa-rotate-90 fs-10 text-d4d8e4"/>&nbsp;<span
              className="fs-14 text-75758b fw-500">12 отзывов</span></p>
        </div>

        <div className="col-auto mb-lg-0 mb-3">
          <button
            className={`btn bg-white btn-activator focus-none border custom-rounded-15 me-2 ${get(products, `${get(isDetails, "product.id")}.equal`) ? "active" : ""}`}
            style={{
              width: 50,
              height: 50
            }}
            onClick={() => {

            }}
          >
            <i className="fi fi-sr-equality fs-22 lh-22"/>
          </button>

          <button
            className={`btn bg-white btn-activator d-inline-flex align-items-center justify-content-center focus-none border custom-rounded-15 ${get(products, `${get(isDetails, "product.id")}.like`) ? "active" : ""}`}
            style={{
              width: 50,
              height: 50
            }}

            onClick={() => {
              if (get(auth, "isAuthenticated") && parseInt(get(auth, "data.user.role_id")) === 3) {
                if (get(isDetails, "product.favourite")) {
                  dispatch(METHOD.request({
                    url: "/client/unlike-product",
                    name: "clientAddProductUnLike",
                    values: {
                      product_id: get(isDetails, "product.id")
                    },
                    cb: {
                      success: () => {
                        toast.success("Sevimlilardan o'chirildi", {
                          position: "top-center",
                          autoClose: 2000,
                        });
                        dispatch(UPDATE.success({
                          id: get(isDetails, "product.id"),
                          name: "mainProducts",
                          data: {
                            favourite: 0
                          }
                        }));
                      },
                      error: (error) => {
                        console.log(error)
                        toast.error("Xatolik yuz berdi!", {
                          position: "top-center",
                          autoClose: 2000
                        })
                      },
                      finally: () => {

                      }
                    }
                  }));
                } else {
                  dispatch(METHOD.request({
                    url: "/client/like-product",
                    name: "clientAddProductLike",
                    values: {
                      product_id: get(isDetails, "product.id")
                    },
                    cb: {
                      success: () => {
                        toast.success("Sevimlilarga qo'shildi", {
                          position: "top-center",
                          autoClose: 2000,
                        });
                        dispatch(UPDATE.success({
                          id: get(isDetails, "product.id"),
                          name: "mainProducts",
                          data: {
                            favourite: 1
                          }
                        }));
                      },
                      error: (error) => {
                        console.log(error)
                        toast.error("Xatolik yuz berdi!", {
                          position: "top-center",
                          autoClose: 2000
                        })
                      },
                      finally: () => {

                      }
                    }
                  }));
                }
              } else {
                FavouritesAction("like", get(isDetails, "product.id"), dispatch, products, get(isDetails, "product"));
              }
            }}
          >
            <i
              className={`fi ${get(products, `${get(isDetails, "product.id")}.like`) ? "fi-sr-heart" : "fi-br-heart"} fs-22 lh-22`}/>
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-6 mb-xl-0 mb-3">
          <Swiper
            loop={true}
            spaceBetween={10}
            thumbs={{swiper: thumbsSwiper}}
            modules={[FreeMode, Thumbs]}
            className="mySwiper2"
          >
            {
              (
                get(isDetails, "product.images", []).length
                  ? get(isDetails, "product.images", []) :
                  [{image: get(isDetails, "product.main_image")}]
              ).map((item, number) => {
                const relativeImage = get(item, "image");
                const imageSrc = relativeImage ? (config.FILE_ROOT ? `${config.FILE_ROOT}${relativeImage}` : relativeImage) : '';
                const fallbackRelativeImage = get(isDetails, 'product.main_image');
                const fallbackSrc = fallbackRelativeImage ? (config.FILE_ROOT ? `${config.FILE_ROOT}${fallbackRelativeImage}` : fallbackRelativeImage) : '';
                const displaySrc = imageSrc || fallbackSrc;
                return <SwiperSlide key={number}>
                  <div
                    className="bg-white custom-rounded-20 p-3 h-100 border-e6e5ed d-flex align-items-center justify-content-center border"
                  >
                    {
                      displaySrc
                        ? (
                          <div style={{width: '100%', maxWidth: 360}}>
                            <ReactImageMagnify
                              {...{
                                smallImage: {
                                  alt: get(isDetails, 'product.name', 'product-image'),
                                  isFluidWidth: true,
                                  src: displaySrc,
                                },
                                largeImage: {
                                  src: displaySrc,
                                  width: 720,
                                  height: 720,
                                },
                                enlargedImagePosition: 'over',
                                isHintEnabled: true,
                                hintTextMouse: 'Удерживайте для увеличения',
                                hintTextTouch: 'Нажмите для увеличения',
                                lensStyle: { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
                                className: 'w-100',
                                enlargedImageContainerDimensions: {
                                  width: '120%',
                                  height: '120%'
                                },
                              }}
                            />
                          </div>
                        )
                        : <img src={displaySrc} style={{maxWidth: 360, width: '100%', height: 'auto'}} alt="swipe"/>
                    }
                  </div>
                </SwiperSlide>
              })
            }
          </Swiper>
          <Swiper
            onSwiper={setThumbsSwiper}
            // loop={true}
            spaceBetween={15}
            slidesPerView={2.2}
            breakpoints={{
              640: {
                slidesPerView: 2.2,
                spaceBetween: 15,
              },
              768: {
                slidesPerView: 3.2,
                spaceBetween: 15,
              },
              1024: {
                slidesPerView: 5.2,
                spaceBetween: 15,
              },
              1600: {
                slidesPerView: 7.4,
                spaceBetween: 15,
              }
            }}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Thumbs]}
            className="mySwiper mt-3"
          >
            {
              (
                get(isDetails, "product.images", []).length
                  ? get(isDetails, "product.images", [])
                  : [{image: get(isDetails, "product.main_image")}]
              ).map((item, number) => {
                const relativeThumb = get(item, "image");
                const thumbSrc = relativeThumb ? (config.FILE_ROOT ? `${config.FILE_ROOT}${relativeThumb}` : relativeThumb) : '';
                return <SwiperSlide key={number}>
                  <div
                    className="bg-white swiper-slide-box custom-rounded-12 d-flex align-items-center justify-content-center"
                    style={{minHeight: 80}}
                  >
                    <img src={thumbSrc} height={51} alt="swipe"/>
                  </div>
                </SwiperSlide>
              })
            }
          </Swiper>
        </div>

        <div className="col-xl-3 col-lg-6 mb-lg-0 mb-3">
          <div className="row">
            {
              colorGroups.map(group => (
                <React.Fragment key={group.key}>
                  <div className="col-lg-2 text-greyscale800 d-flex align-items-center">
                    {group.title}
                  </div>
                  <div className="col-lg-10 d-flex flex-wrap">
                    {
                      group.options.map(option => {
                        const isActive = selectedOptions[group.key] === option.id;
                        const backgroundColor = option.hex ?? option.value;
                        const swatchStyle = {
                          width: 30,
                          height: 30,
                          backgroundColor: backgroundColor ?? 'transparent',
                          backgroundImage: option.image ? `url(${option.image})` : undefined,
                          backgroundSize: option.image ? 'cover' : undefined,
                          backgroundPosition: option.image ? 'center' : undefined,
                        };

                        return (
                          <div
                            key={option.id}
                            className={`color-detail p-1 me-2 ${isActive ? 'active' : ''}`}
                            role="button"
                            tabIndex={0}
                            onClick={() => handleSelectOption(group.key, option.id)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                handleSelectOption(group.key, option.id);
                              }
                            }}
                          >
                            <div className="shadow rounded-circle" style={swatchStyle}/>
                          </div>
                        );
                      })
                    }
                  </div>

                  <div className="col-12 my-3">
                    <div className="border-top"/>
                  </div>
                </React.Fragment>
              ))
            }

            {
              otherAttributeGroups.map(group => (
                <React.Fragment key={group.key}>
                  <div className="col-lg-2 text-greyscale800 d-flex align-items-center">
                    {group.title}
                  </div>
                  <div className="col-lg-10 d-flex flex-wrap">
                    {
                      group.options.map(option => {
                        const isActive = selectedOptions[group.key] === option.id;
                        return (
                          <div
                            key={option.id}
                            data-attribute={group.key}
                            className={`p-1 attribute-detail me-2 ${isActive ? 'active' : ''}`}
                            role="button"
                            tabIndex={0}
                            onClick={() => handleSelectOption(group.key, option.id)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                handleSelectOption(group.key, option.id);
                              }
                            }}
                          >
                            <div className="d-flex align-items-center justify-content-center text-greyscale800 custom-rounded-5"
                                 style={{minWidth: 75, height: 40}}
                            >
                              {option.label ?? option.value}
                            </div>
                          </div>
                        );
                      })
                    }
                  </div>

                  <div className="col-12 my-3">
                    <div className="border-top"/>
                  </div>
                </React.Fragment>
              ))
            }

            <div className="col-12">

              <p className="text-greyscale800 fs-18 fw-500 lh-20">Характеристики</p>


              <ul className="specification-list mb-1">
                {
                  specificationsToShow.map((item, index) => (
                    <li key={index} className="specifications">
                      {item}
                    </li>
                  ))
                }
              </ul>

              {
                hasMoreSpecifications
                  ? (
                    <button
                      type="button"
                      className="ms-3 ps-3 py-0 btn focus-none text-b68308 w-auto"
                      onClick={() => setShowAllSpecifications(prev => !prev)}
                    >
                      {showAllSpecifications ? 'Свернуть' : 'Посмотреть все'}
                    </button>
                  )
                  : null
              }
            </div>

            <div className="col-12 my-3">
              <div className="border-top"></div>
            </div>

            <div className="col-12">
              <p className="text-greyscale800 fs-18 fw-500 lh-20">Получить в г. Ташкент</p>

              <div className="d-flex">
                <div style={{minWidth: 35}}>
                  <i className="far fa-truck fs-18 mt-1"></i>
                </div>
                <div className="d-flex align-items-start justify-content-between w-100">
                  <div>
                    <p className="mb-0 text-b68308 fs-14">Курьером</p>
                    <p className="mb-0 text-374957 fs-14">послезавтра (Вс, 15 декабря)</p>
                  </div>
                  <p>бесплатно</p>
                </div>
              </div>

              <div className="d-flex mt-3">
                <div style={{minWidth: 35}}>
                  <i className="fal fa-map-marker-alt fs-18 ms-1 mt-1"></i>
                </div>
                <div className="d-flex align-items-start justify-content-between w-100">
                  <div>
                    <p className="mb-0 text-b68308 fs-14">Забрать в магазине</p>
                    <p className="mb-0 text-374957 fs-14">сегодня</p>
                  </div>
                  <p>бесплатно</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-6 mb-lg-0 mb-3">
          <div className="bg-white p-4 border custom-rounded-20 mb-4">
            <p className="text-141316 fs-24 fw-700 mb-0"><InputPhone value={get(isDetails, "product.price")}
                                                                     thousandSeparator={" "} displayType={"text"}/> сум
            </p>
            <p>{get(isDetails, "product.count") ? `Осталось всего ${get(isDetails, "product.count")}` : "Нет в наличии"}</p>

            <button type="button"
                    onClick={() => {
                      if (get(auth, "isAuthenticated") && parseInt(get(auth, "data.user.role_id")) === 3) {
                        if (get(isDetails, "product.in_basket")) {
                          dispatch(METHOD.request({
                            url: "/client/remove-from-cart-product",
                            name: "clientRemoveProductCart",
                            values: {
                              product_id: get(isDetails, "product.id")
                            },
                            cb: {
                              success: () => {
                                toast.success("Savatchadan o'chirildi", {
                                  position: "top-center",
                                  autoClose: 1000,
                                });
                                dispatch(UPDATE.success({
                                  id: get(isDetails, "product.id"),
                                  name: "mainProducts",
                                  data: {
                                    in_basket: 0
                                  }
                                }));

                                dispatch(LOGIN.success({
                                  update_login: true,
                                  count: parseInt(get(auth, "data.order.products_count", "0")) - 1
                                }));
                              },
                              error: (error) => {
                                console.log(error)
                                toast.error("Xatolik yuz berdi!", {
                                  position: "top-center",
                                  autoClose: 2000
                                })
                              },
                              finally: () => {

                              }
                            }
                          }))
                        } else {
                          dispatch(METHOD.request({
                            url: "/client/add-to-cart-product",
                            name: "clientAddProductCart",
                            values: {
                              product_id: get(isDetails, "product.id"),
                              count: 1,
                            },
                            cb: {
                              success: () => {
                                toast.success("Savatchaga qo'shildi", {
                                  position: "top-center",
                                  autoClose: 1000,
                                });
                                dispatch(UPDATE.success({
                                  id: get(isDetails, "product.id"),
                                  name: "mainProducts",
                                  data: {
                                    in_basket: 1
                                  }
                                }));
                                dispatch(LOGIN.success({
                                  update_login: true,
                                  count: parseInt(get(auth, "data.order.products_count", "0")) + 1
                                }));
                              },
                              error: (error) => {
                                console.log(error)
                                toast.error("Xatolik yuz berdi!", {
                                  position: "top-center",
                                  autoClose: 2000
                                })
                              },
                              finally: () => {

                              }
                            }
                          }))
                        }
                      } else {
                        FavouritesAction("cart", get(isDetails, "product.id"), dispatch, products, get(isDetails, "product"));
                      }
                    }}
                    className={`btn btn-menu ${get(products, `${get(isDetails, "product.id")}.cart`) ? "active" : ""} custom-rounded-15 focus-none h-100 w-100 mb-3`}
                    style={{minHeight: 50}}>
              <span className="bg-gradient-custom reverse custom-rounded-15"/>
              <span
                className="position-relative d-flex align-items-center justify-content-center fs-16 fw-600 custom-zindex-2">
                {get(products, `${get(isDetails, "product.id")}.cart`) ? "Убрать из " : "Добавить в "}корзину
                <i className="fi fi-rr-shopping-cart-add fs-19 lh-19 ms-2"/>
              </span>
            </button>

            <button type="button"
                    className="btn focus-none custom-rounded-15 text-greyscale800 fw-600 w-100 bg-e6e6e6 mb-2"
                    onClick={() => {
                      if (get(auth, "isAuthenticated") && parseInt(get(auth, "data.user.role_id")) === 3) {
                        dispatch(METHOD.request({
                          url: "/client/add-to-cart-product",
                          name: "clientAddProductCart",
                          values: {
                            product_id: get(isDetails, "product.id"),
                            count: 1,
                          },
                          cb: {
                            success: () => {
                              dispatch(UPDATE.success({
                                id: get(isDetails, "product.id"),
                                name: "mainProducts",
                                data: {
                                  in_basket: 1
                                }
                              }));
                              dispatch(LOGIN.success({
                                update_login: true,
                                count: parseInt(get(auth, "data.order.products_count", "0")) + 1
                              }));
                              navigate("/basket-order");
                            },
                            error: (error) => {
                              console.log(error)
                              toast.error("Xatolik yuz berdi!", {
                                position: "top-center",
                                autoClose: 2000
                              })
                            },
                            finally: () => {

                            }
                          }
                        }))

                      } else {
                        setModal(true);
                      }
                    }}
                    style={{minHeight: 50}}>
              Купить сейчас
            </button>
          </div>

          {/*<div className="bg-white p-4 border custom-rounded-20">
            <p className="text-greyscale800 fs-14 fw-700 mb-0">Рассрочка на 12 месяцев</p>


            <div className="progress custom-rounded-21 position-relative mt-5" style={{overflow: "unset", height: 8}}>
              <div className="progress-bar custom-rounded-21" id="progress-sale"
                   style={{background: "linear-gradient(90deg, #E2C881 0%, #8B6F2A 100%)", width: `${isProgress}%`}}
                   role="progressbar" aria-label="Basic example"
                   aria-valuenow="75"
                   aria-valuemin="0" aria-valuemax="100"/>

              <div onClick={() => setProgress(0)}
                   className="position-absolute d-flex flex-column align-items-center cursor-pointer"
                   data-pointer-progress="1" data-progress-target="0%" style={{bottom: "-2px", left: 0}}>
                <span className="text-75758b fs-12 fw-600 mb-1">3</span>

                <span className="d-block rounded-circle active" style={{width: 12, height: 12}}/>
              </div>

              <div onClick={() => setProgress(22)}
                   className="position-absolute d-flex flex-column align-items-center cursor-pointer"
                   data-pointer-progress="2" data-progress-target="22%" style={{bottom: "-2px", left: "20%"}}>
                <span className="text-75758b fs-12 fw-600 mb-1">6</span>

                <span className={`d-block rounded-circle ${isProgress >= 20 ? "active" : ""}`}
                      style={{width: 12, height: 12}}/>
              </div>

              <div onClick={() => setProgress(42)}
                   className="position-absolute d-flex flex-column align-items-center cursor-pointer"
                   data-pointer-progress="3" data-progress-target="42%" style={{bottom: "-2px", left: "40%"}}>
                <span className="text-75758b fs-12 fw-600 mb-1">9</span>

                <span className={`d-block rounded-circle ${isProgress >= 40 ? "active" : ""}`}
                      style={{width: 12, height: 12}}/>
              </div>

              <div onClick={() => setProgress(62)}
                   className="position-absolute d-flex flex-column align-items-center cursor-pointer"
                   data-pointer-progress="4" data-progress-target="62%" style={{bottom: "-2px", left: "60%"}}>
                <span className="text-75758b fs-12 fw-600 mb-1">12</span>

                <span className={`d-block rounded-circle ${isProgress >= 60 ? "active" : ""}`}
                      style={{width: 12, height: 12}}/>
              </div>

              <div onClick={() => setProgress(82)}
                   className="position-absolute d-flex flex-column align-items-center cursor-pointer"
                   data-pointer-progress="5" data-progress-target="82%" style={{bottom: "-2px", left: "80%"}}>
                <span className="text-75758b fs-12 fw-600 mb-1">15</span>

                <span className={`d-block rounded-circle ${isProgress >= 80 ? "active" : ""}`}
                      style={{width: 12, height: 12}}/>
              </div>

              <div onClick={() => setProgress(100)}
                   className="position-absolute d-flex flex-column align-items-center cursor-pointer"
                   data-pointer-progress="6" data-progress-target="100%" style={{bottom: "-2px", left: "97%"}}>
                <span className="text-75758b fs-12 fw-600 mb-1">18</span>

                <span className={`d-block rounded-circle ${isProgress === 100 ? "active" : ""}`}
                      style={{width: 12, height: 12}}/>
              </div>
            </div>

            <div
              className="custom-rounded-15 bg-e6e6e6 px-3 py-2 mt-4 border border-d4d8e4 d-flex align-items-center justify-content-between">
              <img src={logo_text} alt=""/>


              <div className="text-greyscale800 fs-14 fw-600">
                672 898 сум/мес
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-between fs-14 text-75758b mt-3">
              <span>Того за 12 месяцев</span>

              <span>8 074 776 сум</span>
            </div>

            <button type="button" className="btn btn-menu custom-rounded-15 focus-none h-100 w-100 mt-4"
                    style={{minHeight: 50}}>
              <span className="bg-gradient-custom reverse custom-rounded-15"/>
              <span
                className="position-relative d-flex align-items-center justify-content-center fs-16 gw-600 custom-zindex-2">
                                    Оформить
                                </span>
            </button>
          </div>*/}
        </div>
      </div>

      <ul className="nav nav-tabs custom-tab-nav">
        <li className="nav-item mb-4" role="presentation">
          <button className={`nav-link ${isTab === 1 ? "active" : ""}`}
                  onClick={() => setTab(1)}
                  type="button"
          >Описание продукта
          </button>
        </li>
        <li className="nav-item mb-4" role="presentation">
          <button className={`nav-link ${isTab === 2 ? "active" : ""}`}
                  onClick={() => setTab(2)}
                  type="button"
          >Характеристики
          </button>
        </li>
        <li className="nav-item mb-4" role="presentation">
          <button className={`nav-link ${isTab === 3 ? "active" : ""}`}
                  onClick={() => setTab(3)}
                  type="button"
          >Отзывы
          </button>
        </li>
      </ul>

      <div className="tab-content custom-tab-content mb-5">
        <div className={`tab-pane ${isTab === 1 ? "show active" : "fade"}`}>
          <div className="bg-white p-3 border border-e6e5ed custom-rounded-20">
            <p className="fs-24 text-greyscale800 fw-700">Описание продукта</p>

            <p className="text-334150 fs-14">
              {get(isDetails, "product.description")}
            </p>
          </div>
        </div>

        <div className={`tab-pane ${isTab === 2 ? "show active" : "fade"}`}>
          <div className="bg-white p-3 border border-e6e5ed custom-rounded-20">
            <p className="fs-24 text-greyscale800 fw-700">Основные характеристики</p>

            <div className="row">
              <div className="col-lg-6 border-end-lg border-bottom-lg-0 border-bottom pe-lg-4 pb-lg-0 pb-4">
                {
                  [...Array(10).keys()].map(item => {
                    return <div className="d-flex align-items-center flex-lg-nowrap flex-wrap mb-2" key={item}>
                      <p className="text-nowrap mb-0 fs-14 fw-500">Комбинированная</p>
                      <div className="flex-fill mx-2" style={{borderTop: "2px dotted #A7A7A7"}}/>
                      <p className="text-nowrap mb-0 fs-14 fw-500">Общий тип плиты</p>
                    </div>
                  })
                }
              </div>
              <div className="col-lg-6 border-end-lg border-bottom-lg-0 border-bottom pe-lg-4 pb-lg-0 pb-4">
                {
                  [...Array(10).keys()].map(item => {
                    return <div className="d-flex align-items-center flex-lg-nowrap flex-wrap mb-2" key={item}>
                      <p className="text-nowrap mb-0 fs-14 fw-500">Комбинированная</p>
                      <div className="flex-fill mx-2" style={{borderTop: "2px dotted #A7A7A7"}}/>
                      <p className="text-nowrap mb-0 fs-14 fw-500">Общий тип плиты</p>
                    </div>
                  })
                }
              </div>
            </div>
          </div>
        </div>

        <div className={`tab-pane ${isTab === 3 ? "show active" : "fade"}`}>
          <div className="">
            <p className="fs-24 text-greyscale800 fw-700">Отзывы</p>

            <div className="row flex-wrap-reverse">
              <div className="col-lg-8">
                <div className="bg-white p-3 custom-rounded-20 mt-4">
                  <p className="fs-20 fw-600 text-334150 mb-1">Akmaljon</p>

                  <div className="d-flex mb-3">
                    <i className="fas fa-star text-ffc100 me-2"></i>
                    <i className="fas fa-star text-ffc100 me-2"></i>
                    <i className="fas fa-star text-ffc100 me-2"></i>
                    <i className="far fa-star text-ffc100 me-2"></i>
                    <i className="far fa-star text-ffc100"></i>
                  </div>

                  <p className="fs-14 text-334150 mb-1">
                    Благодаря новым контурным краям, новой кнопке действия, мощной модернизации камеры,
                    а также
                    прочному и легкому корпусу из титана A17 Pro обеспечивает производительность нового
                    уровня и
                    мобильные игры.
                  </p>

                  <p className="fs-14 text-334150 text-end mb-0">
                    18 октябрь 2024 г. 11:22
                  </p>
                </div>

                <div className="bg-white p-3 custom-rounded-20 mt-4">
                  <p className="fs-20 fw-600 text-334150 mb-1">Akmaljon</p>

                  <div className="d-flex mb-3">
                    <i className="fas fa-star text-ffc100 me-2"></i>
                    <i className="fas fa-star text-ffc100 me-2"></i>
                    <i className="fas fa-star text-ffc100 me-2"></i>
                    <i className="fas fa-star text-ffc100 me-2"></i>
                    <i className="fas fa-star text-ffc100"></i>
                  </div>

                  <p className="fs-14 text-334150 mb-1">
                    Благодаря новым контурным краям, новой кнопке действия, мощной модернизации камеры,
                    а также
                    прочному и легкому корпусу из титана A17 Pro обеспечивает производительность нового
                    уровня и
                    мобильные игры.
                  </p>

                  <p className="fs-14 text-334150 text-end mb-0">
                    18 октябрь 2024 г. 11:22
                  </p>
                </div>

                <div className="bg-white p-3 custom-rounded-20 mt-4">
                  <p className="fs-20 fw-600 text-334150 mb-1">Akmaljon</p>

                  <div className="d-flex mb-3">
                    <i className="fas fa-star text-ffc100 me-2"></i>
                    <i className="fas fa-star text-ffc100 me-2"></i>
                    <i className="fas fa-star text-ffc100 me-2"></i>
                    <i className="fas fa-star text-ffc100 me-2"></i>
                    <i className="fas fa-star text-ffc100"></i>
                  </div>

                  <p className="fs-14 text-334150 mb-1">
                    Благодаря новым контурным краям, новой кнопке действия, мощной модернизации камеры,
                    а также
                    прочному и легкому корпусу из титана A17 Pro обеспечивает производительность нового
                    уровня и
                    мобильные игры.
                  </p>

                  <p className="fs-14 text-334150 text-end mb-0">
                    18 октябрь 2024 г. 11:22
                  </p>
                </div>

                <div className="bg-white p-3 custom-rounded-20 mt-4">
                  <p className="fs-20 fw-600 text-334150 mb-1">Akmaljon</p>

                  <div className="d-flex mb-3">
                    <i className="fas fa-star text-ffc100 me-2"></i>
                    <i className="fas fa-star text-ffc100 me-2"></i>
                    <i className="fas fa-star text-ffc100 me-2"></i>
                    <i className="fas fa-star text-ffc100 me-2"></i>
                    <i className="fas fa-star text-ffc100"></i>
                  </div>

                  <p className="fs-14 text-334150 mb-1">
                    Благодаря новым контурным краям, новой кнопке действия, мощной модернизации камеры,
                    а также
                    прочному и легкому корпусу из титана A17 Pro обеспечивает производительность нового
                    уровня и
                    мобильные игры.
                  </p>

                  <p className="fs-14 text-334150 text-end mb-0">
                    18 октябрь 2024 г. 11:22
                  </p>
                </div>

                <div className="bg-white p-3 custom-rounded-20 mt-4">
                  <p className="fs-20 fw-600 text-334150 mb-1">Akmaljon</p>

                  <div className="d-flex mb-3">
                    <i className="fas fa-star text-ffc100 me-2"></i>
                    <i className="fas fa-star text-ffc100 me-2"></i>
                    <i className="fas fa-star text-ffc100 me-2"></i>
                    <i className="fas fa-star text-ffc100 me-2"></i>
                    <i className="fas fa-star text-ffc100"></i>
                  </div>

                  <p className="fs-14 text-334150 mb-1">
                    Благодаря новым контурным краям, новой кнопке действия, мощной модернизации камеры,
                    а также
                    прочному и легкому корпусу из титана A17 Pro обеспечивает производительность нового
                    уровня и
                    мобильные игры.
                  </p>

                  <p className="fs-14 text-334150 text-end mb-0">
                    18 октябрь 2024 г. 11:22
                  </p>
                </div>

                <button type="button"
                        className="bg-white fs-14 text-greyscale800 fw-500 w-100 custom-rounded-12 mt-4 btn text-center focus-none">
                  Посмотреть еще (14) <i className="far fa-chevron-right ms-2"></i>
                </button>
              </div>

              <div className="col-lg-4">
                <div className="bg-white border border-e6e5ed p-3 custom-rounded-20 mt-4">
                  <div className="d-flex align-items-center mb-3">
                    <p className="fs-42 fw-700 text-greyscale800 mb-0 mt-1">5.0</p>

                    <div className="ms-3">
                      <p className="fs-14 fw-500 text-greyscale800 mb-1">Otzivlar (7)</p>

                      <div className="d-flex">
                        <i className="fas fa-star text-ffc100 me-2"></i>
                        <i className="fas fa-star text-ffc100 me-2"></i>
                        <i className="fas fa-star text-ffc100 me-2"></i>
                        <i className="fas fa-star text-ffc100 me-2"></i>
                        <i className="fas fa-star text-ffc100"></i>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center justify-content-between">
                    <span className="text-334150 fs-14 fw-500">5 звезда</span>

                    <span className="text-334150 fs-14 fw-500">7</span>
                  </div>

                  <div className="custom-rounded-5 bg-d3B15e w-100 mb-3" style={{height: 12}}/>

                  <div className="d-flex align-items-center justify-content-between">
                    <span className="text-334150 fs-14 fw-500">4 звезда</span>

                    <span className="text-334150 fs-14 fw-500">0</span>
                  </div>

                  <div className="custom-rounded-5 bg-f4f6f6 mb-3" style={{height: 12}}/>

                  <div className="d-flex align-items-center justify-content-between">
                    <span className="text-334150 fs-14 fw-500">3 звезда</span>

                    <span className="text-334150 fs-14 fw-500">0</span>
                  </div>

                  <div className="custom-rounded-5 bg-f4f6f6 mb-3" style={{height: 12}}/>

                  <div className="d-flex align-items-center justify-content-between">
                    <span className="text-334150 fs-14 fw-500">2 звезда</span>

                    <span className="text-334150 fs-14 fw-500">0</span>
                  </div>

                  <div className="custom-rounded-5 bg-f4f6f6 mb-3" style={{height: 12}}/>

                  <div className="d-flex align-items-center justify-content-between">
                    <span className="text-334150 fs-14 fw-500">1 звезда</span>

                    <span className="text-334150 fs-14 fw-500">0</span>
                  </div>

                  <div className="custom-rounded-5 bg-f4f6f6 mb-3" style={{height: 12}}/>


                  <button type="button"
                          className="btn bg-d3B15e custom-rounded-8 w-100 text-white fw-600 py-2">
                    Написать oтзыв
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RecommendProducts/>

      <ModalLoginRegister
        {...{
          isModal,
          setModal,
        }}
      />
    </div>
  );
};

export default ProductSingle;
