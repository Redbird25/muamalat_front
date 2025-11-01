# Changelog

## 2025-10-05 Обновление витрины

### Новое
- Добавлена SMS-авторизация покупателей с шагами «отправить код», «подтвердить OTP» и повторной отправкой прямо из модального окна входа/регистрации (см. `src/components/ModalLoginRegister/index.js:1`, `src/redux/actions/index.js:23`, `src/redux/sagas/auth.js:59`, `src/services/api/index.js:117`).
- Появилась отдельная служебная страница для ручного входа через customer API — помогает тестировать бэкенд без OTP (`src/pages/Auth/Login.js:1`).
- Карточки товаров получили кнопку «Купить в один клик» с быстрым переходом к оформлению заказа (`src/components/ProductItem/index.js:305`).
- Страница товара переработана: динамическая группировка атрибутов, выбор вариантов, раскрытие всех характеристик и зум-галерея на базе `react-image-magnify` (`src/pages/ProductSingle/index.js:1`).
- Витрина категорий на главной прокручивается бесшовно благодаря новому автоскроллу Swiper FreeMode (`src/pages/Main/index.js:117`).

### Изменено
- Проект переведён на стек React 18 и `react-scripts@5`, обновлены ключевые зависимости (axios 1.x, react-redux 8.x, redux-saga 1.3, переход с `node-sass` на `sass`) и убраны legacy-флаги запуска (`package.json`).
- Компоненты Яндекс.Карты теперь читают ключ из конфигурации и передают его через обёртку `YMaps` (`src/index.js:1`, `src/components/YandexMap/index.js:13`).
- Мега-меню каталога получает первый раздел автоматически, закрывается по клику вне области и имеет отдельную кнопку закрытия (`src/Layout/DashboardLayout/Header/index.js:145`).
- Все импорты Swiper унифицированы на `swiper/react`, что соответствует новой версии библиотеки (`src/components/Toolbar/index.js:1`, `src/pages/Main/index.js:2`, `src/pages/CatalogSingle/index.js:4`).
- Таймеры SMS-подтверждения для продавцов и регистрации сокращены до 60 секунд, чтобы цикл проверки был быстрее (`src/components/SellerRegisterForm/index.js:25`, `src/pages/Seller/LoginSaler/index.js:21`).

### Исправлено
- Сага выхода корректно обрабатывает refresh-токены клиентов и сбрасывает сессию даже при ошибках API (`src/redux/sagas/auth.js:29`), а редьюсер чистит customerAuth-состояние и refreshToken (`src/redux/reducers/auth.js:61`).
- Модальное окно авторизации полностью очищает таймеры и локальные списки при закрытии, исключая «залипание» состояния (`src/components/ModalLoginRegister/index.js:72`).
- Обёртка e-Imzo больше не тянет пакет `buffer` в браузерных сборках, обходя ошибки бандлера (`src/components/useImzo/js/e-imzo.js:6`).

### Примечания для разработчиков
- CRA-прокси направлен на `http://localhost:8080`; для customer auth требуется работающий backend и корректные CORS заголовки (`package.json`, `src/services/api/index.js:117`).
- Добавлен `.env.local` с настройками dev-сервера; alongside требуется заполнить `REACT_APP_*` переменные для API и Яндекс-карты (`.env.local`, `src/config.js:1`).
- После обновления зависимостей стоит переустановить npm-пакеты (`npm ci`) и проверить линтер/тесты на React 18.
