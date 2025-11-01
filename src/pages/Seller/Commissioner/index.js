import React from 'react';
import {Link} from "react-router-dom";

const Commissioner = () => {
  return (
    <div>
      <p className="fs-32 text-greyscale800 fw-700">Компания-Комиссионер</p>
      
      <nav className={"clear-before"} aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fs-14 fw-500">
            <Link className="text-75758b text-decoration-none"
                  to="/dashboard">Кабинет продавца</Link>
          </li>
          <li className="breadcrumb-item clear-before fs-14 fw-500 text-75758b active" aria-current="page">
            <i className="fas fa-chevron-right fs-12 me-1"/>
            <Link className="text-75758b text-decoration-none"
                  to="/dashboard/company"> Компания</Link>
          </li>
          
          <li className="breadcrumb-item clear-before fs-14 fw-500 text-75758b active" aria-current="page">
            <i className="fas fa-chevron-right fs-12 me-1"/> Компания-Комиссионер
          </li>
        </ol>
      </nav>
      
      <div className="bg-white p-3 custom-rounded-12">
        <p className={"fs-18 fw-600"}>Инструкция</p>
        
        <p className={"fs-14 mb-2"}>
          1. Зайдите о персональный кабинет на <b className={"text-decoration-underline"}>сайт электронных налоговых
          услуг.</b> Для входа используйте свой ключ ЭЦП.
        </p>
        
        <p className={"fs-14 mb-2"}>
          2. В разделе налогового учёта используйте поиск и выберите услугу «Формирование списка комиссионеров
          юридических лиц»
        </p>
        <p className={"fs-14 mb-2"}>
          3. На экране создания комиссионера нажмите кнопку <b>Добавить</b> и введите следующие данные:
        </p>
        
        <ul className={"p-0"}>
          <li className={"p-3 bg-f1f1f1 custom-rounded-top-8 fs-14 fw-500 text-75758b border-bottom border-d9d9d9"}>
            ИНН или ПИНФЛ ИП 309376127
          </li>
          <li className={"p-3 bg-f1f1f1 fs-14 fw-500 text-75758b border-bottom border-d9d9d9"}>
            Наименование фирмы
          </li>
          <li className={"p-3 bg-f1f1f1 fs-14 fw-500 text-75758b border-bottom border-d9d9d9"}>
            Номер контракта
          </li>
          <li className={"p-3 bg-f1f1f1 fs-14 fw-500 text-75758b border-bottom border-d9d9d9"}>
            МФО банка комиссионера
          </li>
          <li className={"p-3 bg-f1f1f1 fs-14 fw-500 text-75758b border-bottom border-d9d9d9"}>
            Расчётный счёт
            <br/>
            <b>20208000005504983001</b>
          </li>
          <li className={"p-3 bg-f1f1f1 fs-14 fw-500 text-75758b border-bottom border-d9d9d9"}>
            Дата заключения договора
          </li>
          <li className={"p-3 bg-f1f1f1 fs-14 fw-500 text-75758b border-bottom border-d9d9d9"}>
            Начало срока действия договора
          </li>
          <li className={"p-3 bg-f1f1f1 fs-14 fw-500 text-75758b border-bottom border-d9d9d9"}>
            Окончание срока действия договора
          </li>
          <li className={"p-3 bg-f1f1f1 custom-rounded-bottom-8 fs-14 fw-500 text-75758b"}>
            ИНН, ПИНФЛ субкомитента
          </li>
        </ul>
        
        <p className={"fs-14 mb-2"}>
          4. Нажмите кнопку Сохранить.
        </p>
        
        <p className={"fs-14 mb-2"}>
          5. Сделайте и загрузите скриншот или фотографию Огит Магкег как добавленного комиссионера.
        </p>
        
        <div
          className={"p-3 custom-rounded-12 bg-f1f1f1"}
        >
          <p className={"text-141316 fw-600"}>Скриншот или фото добавленного комиссионера</p>
          
          <a
            href={"https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"}
            download={"https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"}
            rel={"oopener noreferrer"}
            className={`btn btn-menu custom-rounded-12 focus-none w-auto`}
            style={{minWidth: 270, height: 43}}
          >
            <span className="bg-gradient-custom reverse custom-rounded-12"/>
            <span
              style={{marginTop: 2}}
              className="position-relative d-flex align-items-center justify-content-center fs-17 fw-600 custom-zindex-2">
                Загрузить <svg xmlns="http://www.w3.org/2000/svg" className={"ms-2"} width="24" height="25"
                               viewBox="0 0 24 25" fill="none">
                  <path
                    d="M20.97 1.5H18.03C16.76 1.5 16 2.26 16 3.53V6.47C16 7.74 16.76 8.5 18.03 8.5H20.97C22.24 8.5 23 7.74 23 6.47V3.53C23 2.26 22.24 1.5 20.97 1.5ZM21.19 4.81C21.07 4.93 20.91 4.99 20.75 4.99C20.59 4.99 20.43 4.93 20.31 4.81L20.13 4.63V6.87C20.13 7.22 19.85 7.5 19.5 7.5C19.15 7.5 18.87 7.22 18.87 6.87V4.63L18.69 4.81C18.45 5.05 18.05 5.05 17.81 4.81C17.57 4.57 17.57 4.17 17.81 3.93L19.06 2.68C19.11 2.63 19.18 2.59 19.25 2.56C19.27 2.55 19.29 2.55 19.31 2.54C19.36 2.52 19.41 2.51 19.47 2.51H19.53C19.6 2.51 19.66 2.52 19.73 2.55H19.75C19.82 2.58 19.88 2.62 19.93 2.67C19.94 2.68 19.94 2.68 19.95 2.68L21.2 3.93C21.44 4.17 21.44 4.57 21.19 4.81Z"
                    fill="white"/>
                  <path
                    d="M9.00012 10.8801C10.3146 10.8801 11.3801 9.81455 11.3801 8.50012C11.3801 7.18568 10.3146 6.12012 9.00012 6.12012C7.68568 6.12012 6.62012 7.18568 6.62012 8.50012C6.62012 9.81455 7.68568 10.8801 9.00012 10.8801Z"
                    fill="white"/>
                  <path
                    d="M20.97 8.5H20.5V13.11L20.37 13C19.59 12.33 18.33 12.33 17.55 13L13.39 16.57C12.61 17.24 11.35 17.24 10.57 16.57L10.23 16.29C9.52 15.67 8.39 15.61 7.59 16.15L3.85 18.66C3.63 18.1 3.5 17.45 3.5 16.69V8.31C3.5 5.49 4.99 4 7.81 4H16V3.53C16 3.13 16.07 2.79 16.23 2.5H7.81C4.17 2.5 2 4.67 2 8.31V16.69C2 17.78 2.19 18.73 2.56 19.53C3.42 21.43 5.26 22.5 7.81 22.5H16.19C19.83 22.5 22 20.33 22 16.69V8.27C21.71 8.43 21.37 8.5 20.97 8.5Z"
                    fill="white"/>
                </svg>
              </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Commissioner;
