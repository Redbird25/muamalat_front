import React, {useMemo} from 'react';
import {useLocation} from 'react-router-dom';
import * as SolarIconSet from 'solar-icon-set';

const routeMeta = {
  '/dashboard': {
    title: 'Обзор платформы',
    hint: 'Следим за динамикой продаж и критическими событиями'
  },
  '/dashboard/catalog': {
    title: 'Управление каталогом',
    hint: 'Категории, атрибуты и навигация по витрине'
  },
  '/dashboard/merchants': {
    title: 'Онбординг мерчантов',
    hint: 'Проверяем анкеты и документы продавцов'
  },
  '/dashboard/moderation': {
    title: 'Модерация товаров продавцов',
    hint: 'Проверка, approve и обратная связь'
  },
  '/dashboard/promotions': {
    title: 'Промо и статусы товаров',
    hint: 'Хиты, скидки и приоритеты показов'
  }
};

const Topbar = ({
  onToggleSidebar,
  onToggleSidebarMobile,
  isSidebarCollapsed,
  isMobileSidebarOpen
}) => {
  const location = useLocation();

  const meta = useMemo(() => {
    const matched = Object.entries(routeMeta).find(([path]) => location.pathname === path);
    return matched ? matched[1] : {title: 'Панель управления', hint: ''};
  }, [location.pathname]);

  const handleCollapseClick = () => {
    if (typeof onToggleSidebar === 'function') {
      onToggleSidebar();
    }
  };

  const handleMobileClick = () => {
    if (typeof onToggleSidebarMobile === 'function') {
      onToggleSidebarMobile();
    }
  };

  return (
    <header className="master-topbar">
      <div className="master-topbar__lead">
        <div className="master-topbar__controls">
          <button
            type="button"
            className={`master-topbar__control master-topbar__control--burger ${isMobileSidebarOpen ? 'is-active' : ''}`}
            aria-label={isMobileSidebarOpen ? 'Закрыть меню' : 'Открыть меню'}
            onClick={handleMobileClick}
          >
            <span className="master-topbar__burger-lines"/>
          </button>
          <button
            type="button"
            className={`master-topbar__control master-topbar__control--collapse ${isSidebarCollapsed ? 'is-collapsed' : ''}`}
            aria-label={isSidebarCollapsed ? 'Развернуть меню' : 'Свернуть меню'}
            onClick={handleCollapseClick}
          >
            <SolarIconSet.ArrowLeft svgProps={{width: 18, height: 18}} iconStyle="Bold" color="#212640"/>
          </button>
        </div>

        <div className="master-topbar__headline">
          <h1 className="master-topbar__title">{meta.title}</h1>
          {meta.hint ? <p className="master-topbar__hint">{meta.hint}</p> : null}
        </div>
      </div>

      <div className="master-topbar__actions">
        <div className="master-topbar__search">
          <SolarIconSet.MinimalisticMagniferZoomOut svgProps={{width: 18, height: 18}} iconStyle="Bold" color="#A2A2C3"/>
          <input
            type="search"
            placeholder="Поиск по продавцам, товарам или документам"
            className="master-topbar__search-input"
          />
        </div>

        <button type="button" className="master-topbar__button master-topbar__button--ghost">
          <SolarIconSet.Calendar svgProps={{width: 18, height: 18}} iconStyle="Bold" color="#212640"/>
          Период: 30 дней
        </button>

        <button type="button" className="master-topbar__button master-topbar__button--primary">
          <SolarIconSet.AddSquare svgProps={{width: 18, height: 18}} iconStyle="Bold" color="#212640"/>
          Создать категорию
        </button>
      </div>
    </header>
  );
};

export default Topbar;
