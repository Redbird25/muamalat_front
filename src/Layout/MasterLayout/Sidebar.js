import React, {useMemo} from 'react';
import {NavLink} from 'react-router-dom';
import * as SolarIconSet from 'solar-icon-set';
import {useSelector} from 'react-redux';
import logoSidebar from 'assets/images/icon/logo.svg';
import get from 'lodash.get';

const Sidebar = ({collapsed = false, isMobileOpen = false, onCloseMobile}) => {
  const {auth} = useSelector(state => state);
  const userName = useMemo(() => {
    const first = get(auth, 'data.user.name') || get(auth, 'data.user.firstName');
    const last = get(auth, 'data.user.surname') || get(auth, 'data.user.lastName');
    return [first, last].filter(Boolean).join(' ') || 'Главный администратор';
  }, [auth]);

  const userRole = useMemo(() => get(auth, 'data.user.roleLabel') || '', [auth]);
  const shouldShowRole = userRole && userRole !== userName;

  const sidebarClassName = useMemo(() => {
    const classes = ['master-sidebar'];
    if (collapsed) {
      classes.push('master-sidebar--collapsed');
    }
    if (isMobileOpen) {
      classes.push('master-sidebar--mobile-open');
    }
    return classes.join(' ');
  }, [collapsed, isMobileOpen]);

  const menu = [
    {
      to: '/dashboard',
      label: 'Обзор',
      description: 'Живые метрики и тревоги',
      icon: <SolarIconSet.PieChart2 svgProps={{width: 22, height: 22}} iconStyle="Bold" color="#E2C881"/>
    },
    {
      to: '/dashboard/catalog',
      label: 'Каталог',
      description: 'Категории и атрибуты',
      icon: <SolarIconSet.Shop2 svgProps={{width: 22, height: 22}} iconStyle="Bold" color="#E2C881"/>
    },
    {
      to: '/dashboard/merchants',
      label: 'Мерчанты',
      description: 'Анкеты и документы',
      icon: <SolarIconSet.UserId svgProps={{width: 22, height: 22}} iconStyle="Bold" color="#E2C881"/>
    },
    {
      to: '/dashboard/moderation',
      label: 'Модерация товаров',
      description: 'Очередь и approve',
      icon: <SolarIconSet.ShieldCheck svgProps={{width: 22, height: 22}} iconStyle="Bold" color="#E2C881"/>
    },
    {
      to: '/dashboard/promotions',
      label: 'Промо и статусы',
      description: 'Хиты, акции, скидки',
      icon: <SolarIconSet.Fire svgProps={{width: 22, height: 22}} iconStyle="Bold" color="#E2C881"/>
    }
  ];

  const handleLinkClick = () => {
    if (isMobileOpen && onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside className={sidebarClassName}>
      <button
        type="button"
        className="master-sidebar__close"
        aria-label="Закрыть меню"
        onClick={onCloseMobile}
      >
        <SolarIconSet.CloseCircle svgProps={{width: 22, height: 22}} iconStyle="Bold" color="#f7f6ff"/>
      </button>

      <div className="master-sidebar__brand">
        <img src={logoSidebar} alt="Muamalat" className="master-sidebar__logo"/>
        <div className="master-sidebar__brand-info">
          <span className="master-sidebar__title">Muamalat</span>
          <span className="master-sidebar__subtitle">Control center</span>
        </div>
      </div>

      <div className="master-sidebar__profile">
        <div className="master-sidebar__avatar">
          <span>{userName.substring(0, 1).toUpperCase()}</span>
        </div>
        <div>
          <p className="master-sidebar__profile-name">{userName}</p>
          {shouldShowRole ? (
            <p className="master-sidebar__profile-role">{userRole}</p>
          ) : null}
        </div>
      </div>

      <nav className="master-sidebar__nav">
        {menu.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({isActive}) =>
              `master-sidebar__link ${isActive ? 'master-sidebar__link--active' : ''}`
            }
            end={item.to === '/dashboard'}
            title={item.label}
            onClick={handleLinkClick}
          >
            <span className="master-sidebar__icon">{item.icon}</span>
            <span className="master-sidebar__link-text">
              <span className="master-sidebar__link-title">{item.label}</span>
              <span className="master-sidebar__link-description">{item.description}</span>
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="master-sidebar__footer">
        <div className="master-sidebar__support">
          <SolarIconSet.PhoneCalling svgProps={{width: 24, height: 24}} iconStyle="Bold" color="#212640"/>
          <div>
            <p className="master-sidebar__support-title">Нужна помощь?</p>
            <p className="master-sidebar__support-text">support@muamalat.uz</p>
          </div>
        </div>
        <p className="master-sidebar__legal">© {new Date().getFullYear()} Muamalat. Все права защищены.</p>
      </div>
    </aside>
  );
};

export default Sidebar;
