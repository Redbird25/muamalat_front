import React, {useEffect, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Actions from '../../../redux/actions';
import get from 'lodash.get';
import dayjs from 'dayjs';
import * as SolarIconSet from 'solar-icon-set';

const TrendChip = ({delta, trend}) => {
  const className = useMemo(() => {
    if (trend === 'down') return 'master-card__delta master-card__delta--down';
    if (trend === 'warning') return 'master-card__delta master-card__delta--warning';
    return 'master-card__delta';
  }, [trend]);

  const icon = trend === 'down'
    ? <SolarIconSet.ArrowDown svgProps={{width: 14, height: 14}} iconStyle="Bold" color="#C62F5C"/>
    : trend === 'warning'
      ? <SolarIconSet.DangerTriangle svgProps={{width: 14, height: 14}} iconStyle="Bold" color="#A97900"/>
      : <SolarIconSet.ArrowUp svgProps={{width: 14, height: 14}} iconStyle="Bold" color="#2B8A3E"/>;

  return (
    <span className={className}>
      {icon}
      {delta}
    </span>
  );
};

const PerformanceSparkline = ({labels = [], revenue = [], orders = []}) => {
  const width = 520;
  const height = 200;

  const toPoints = (series) => {
    if (!series.length) return '';
    const min = Math.min(...series);
    const max = Math.max(...series);
    const range = max - min || 1;
    return series.map((value, idx) => {
      const x = series.length === 1 ? width : (idx / (series.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  };

  const revenuePoints = toPoints(revenue);
  const orderPoints = toPoints(orders);

  return (
    <div className="master-performance-chart">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="presentation">
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(61, 213, 152, 0.35)"/>
            <stop offset="100%" stopColor="rgba(61, 213, 152, 0)"/>
          </linearGradient>
          <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(0, 98, 255, 0.28)"/>
            <stop offset="100%" stopColor="rgba(0, 98, 255, 0)"/>
          </linearGradient>
        </defs>

        <polyline
          fill="none"
          stroke="rgba(0, 98, 255, 0.7)"
          strokeWidth="3"
          strokeLinecap="round"
          points={orderPoints}
        />
        <polyline
          fill="none"
          stroke="rgba(61, 213, 152, 0.85)"
          strokeWidth="3"
          strokeLinecap="round"
          points={revenuePoints}
        />
        <polyline
          fill="url(#ordersGradient)"
          stroke="none"
          points={`${orderPoints} ${width},${height} 0,${height}`}
        />
        <polyline
          fill="url(#revenueGradient)"
          stroke="none"
          points={`${revenuePoints} ${width},${height} 0,${height}`}
        />
      </svg>

      <div className="master-performance-chart__legend">
        <span>
          <span className="master-dot master-dot--blue"/> Количество заказов
        </span>
        <span>
          <span className="master-dot master-dot--green"/> Выручка (₽ млн)
        </span>
      </div>

      <div className="master-performance-chart__labels">
        {labels.map(label => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
};

const MasterDashboard = () => {
  const dispatch = useDispatch();
  const masterState = useSelector(state => state.master);

  useEffect(() => {
    dispatch(Actions.MASTER_FETCH_OVERVIEW.request());
    dispatch(Actions.MASTER_FETCH_PENDING_PRODUCTS.request());
  }, [dispatch]);

  const cards = get(masterState, 'overview.cards', []);
  const performance = get(masterState, 'overview.performance', {});
  const topCategories = get(masterState, 'overview.topCategories', []);
  const alerts = get(masterState, 'overview.alerts', []);
  const featuredProducts = get(masterState, 'featuredProducts', []);
  const pendingProducts = get(masterState, 'pendingProducts', []).slice(0, 4);

  return (
    <div className="master-dashboard">
      <section className="master-section">
        <div className="master-grid master-grid--cols-4">
          {cards.map(card => (
            <article className="master-card" key={card.id}>
              <p className="master-card__label">{card.title}</p>
              <p className="master-card__value">{card.value}</p>
              <TrendChip delta={card.delta} trend={card.trend}/>
            </article>
          ))}
        </div>
      </section>

      <section className="master-grid master-grid--cols-2">
        <article className="master-section">
          <div className="master-section__header">
            <div>
              <h2 className="master-section__title">Динамика продаж</h2>
              <p className="master-section__subtitle">Сравнение выручки и заказов по месяцам</p>
            </div>
            <button type="button" className="master-topbar__button master-topbar__button--ghost">
              <SolarIconSet.DownloadMinimalistic svgProps={{width: 18, height: 18}} iconStyle="Bold" color="#212640"/>
              Экспорт
            </button>
          </div>
          <PerformanceSparkline
            labels={performance.labels}
            revenue={performance.revenue}
            orders={performance.orders}
          />
        </article>

        <article className="master-section">
          <div className="master-section__header">
            <div>
              <h2 className="master-section__title">Топ категорий</h2>
              <p className="master-section__subtitle">Доля в обороте и конверсия</p>
            </div>
          </div>
          <table className="master-table master-table--compact">
            <thead>
            <tr>
              <th>Категория</th>
              <th>Доля</th>
              <th>Конверсия</th>
              <th>Тренд</th>
            </tr>
            </thead>
            <tbody>
            {topCategories.map(category => (
              <tr key={category.id}>
                <td data-label="Категория">{category.name}</td>
                <td data-label="Доля">{category.share}</td>
                <td data-label="Конверсия">{category.conversion}</td>
                <td data-label="Тренд">
                  <span className="master-chip master-chip--success">{category.trend}</span>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </article>
      </section>

      <section className="master-grid master-grid--cols-2">
        <article className="master-section">
          <div className="master-section__header">
            <div>
              <h2 className="master-section__title">Ожидают модерации</h2>
              <p className="master-section__subtitle">Первые позиции в очереди</p>
            </div>
            <button type="button" className="master-topbar__button master-topbar__button--ghost">
              Открыть полный список
            </button>
          </div>
          <table className="master-table">
            <thead>
            <tr>
              <th>Товар</th>
              <th>Продавец</th>
              <th>Категория</th>
              <th>Цена</th>
              <th>Комментарий</th>
            </tr>
            </thead>
            <tbody>
            {pendingProducts.map(product => (
              <tr key={product.id}>
                <td data-label="Товар">{product.name}</td>
                <td data-label="Продавец">{product.seller}</td>
                <td data-label="Категория">{product.category}</td>
                <td data-label="Цена">{new Intl.NumberFormat('ru-RU').format(product.price)} ₽</td>
                <td data-label="Комментарий">
                  {product.issues?.length
                    ? <span className="master-chip master-chip--warning">{product.issues[0]}</span>
                    : <span className="master-chip master-chip--success">Готов к проверке</span>}
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </article>

        <article className="master-section">
          <div className="master-section__header">
            <div>
              <h2 className="master-section__title">События и уведомления</h2>
              <p className="master-section__subtitle">Что требует внимания прямо сейчас</p>
            </div>
          </div>
          <ul className="master-alerts">
            {alerts.map(alert => (
              <li key={alert.id} className={`master-alert master-alert--${alert.severity}`}>
                <div className="master-alert__icon">
                  {alert.severity === 'warning'
                    ? <SolarIconSet.DangerTriangle svgProps={{width: 18, height: 18}} iconStyle="Bold" color="#A97900"/>
                    : <SolarIconSet.InfoSquare svgProps={{width: 18, height: 18}} iconStyle="Bold" color="#1F6FEB"/>}
                </div>
                <div>
                  <p className="master-alert__title">{alert.title}</p>
                  <p className="master-alert__message">{alert.message}</p>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="master-section">
        <div className="master-section__header">
          <div>
            <h2 className="master-section__title">Управление витриной</h2>
            <p className="master-section__subtitle">Избранные и маркетинговые позиции</p>
          </div>
          <button type="button" className="master-topbar__button master-topbar__button--primary">
            Добавить товар вручную
          </button>
        </div>
        <div className="master-grid master-grid--cols-3">
          {featuredProducts.map(product => (
            <article className="master-card" key={product.id}>
              <div className="master-card__header">
                <p className="master-card__label">{product.category}</p>
                <span className="master-chip master-chip--success">{product.status === 'active' ? 'В продаже' : product.status}</span>
              </div>
              <h3 className="master-featured__title">{product.name}</h3>
              <p className="master-featured__seller">Продавец: {product.seller}</p>
              <div className="master-featured__pricing">
                <span className="master-featured__price">{new Intl.NumberFormat('ru-RU').format(product.price)} ₽</span>
                {product.discount ? (
                  <span className="master-tag">Скидка {product.discount.type === 'percentage'
                    ? `${product.discount.value}%`
                    : `${new Intl.NumberFormat('ru-RU').format(product.discount.value)} ₽`} до {dayjs(product.discount.until).format('DD.MM')}</span>
                ) : <span className="master-tag">Без скидки</span>}
              </div>
              <div className="master-tag-list">
                {Object.entries(product.flags || {}).map(([flag, enabled]) => enabled ? (
                  <span key={flag} className="master-tag">
                    {flag === 'bestseller' && 'Хит продаж'}
                    {flag === 'hot' && 'Горящий товар'}
                    {flag === 'new' && 'Новинка'}
                    {flag === 'sale' && 'Распродажа'}
                  </span>
                ) : null)}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MasterDashboard;
