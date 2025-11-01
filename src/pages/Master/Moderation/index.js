import React, {useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Actions from '../../../redux/actions';
import get from 'lodash.get';
import dayjs from 'dayjs';
import * as SolarIconSet from 'solar-icon-set';

const ModerationPage = () => {
  const dispatch = useDispatch();
  const pendingProducts = useSelector(state => get(state, 'master.pendingProducts', []));
  const [search, setSearch] = useState('');
  const [onlyWithIssues, setOnlyWithIssues] = useState(false);

  const filteredProducts = useMemo(() => {
    return pendingProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase())
        || product.seller.toLowerCase().includes(search.toLowerCase())
        || product.category.toLowerCase().includes(search.toLowerCase());
      const matchesIssues = !onlyWithIssues || (product.issues && product.issues.length);
      return matchesSearch && matchesIssues;
    });
  }, [pendingProducts, search, onlyWithIssues]);

  const handleApprove = (productId) => {
    dispatch(Actions.MASTER_APPROVE_PRODUCT.request({productId}));
  };

  const handleReject = (productId) => {
    dispatch(Actions.MASTER_REMOVE_PRODUCT.request({productId}));
  };

  const handleFlagToggle = (productId, flag) => {
    dispatch(Actions.MASTER_UPDATE_PRODUCT_FLAGS.request({
      productId,
      flags: {[flag]: !get(pendingProducts.find(item => item.id === productId), ['flags', flag])}
    }));
  };

  return (
    <div className="master-moderation">
      <section className="master-section">
        <div className="master-section__header">
          <div>
            <h2 className="master-section__title">Очередь на модерацию</h2>
            <p className="master-section__subtitle">Проверяем товары перед публикацией</p>
          </div>
          <div className="master-section__actions">
            <div className="master-topbar__search master-topbar__search--compact">
              <SolarIconSet.MinimalisticMagniferZoomOut svgProps={{width: 18, height: 18}} iconStyle="Bold" color="#A2A2C3"/>
              <input
                type="search"
                placeholder="Поиск по товару или продавцу"
                value={search}
                onChange={event => setSearch(event.target.value)}
                className="master-topbar__search-input"
              />
            </div>
            <label className="master-toggle">
              <input
                type="checkbox"
                checked={onlyWithIssues}
                onChange={event => setOnlyWithIssues(event.target.checked)}
              />
              Только с комментариями
            </label>
          </div>
        </div>

        <table className="master-table">
          <thead>
          <tr>
            <th>Товар</th>
            <th>Продавец</th>
            <th>Категория</th>
            <th>Цена</th>
            <th>Подача</th>
            <th>Флаги</th>
            <th>Комментарий</th>
            <th>Действия</th>
          </tr>
          </thead>
          <tbody>
          {filteredProducts.map(product => (
            <tr key={product.id}>
              <td data-label="Товар">
                <div className="master-table__primary-text">{product.name}</div>
                <span className="master-table__secondary-text">ID: {product.id}</span>
              </td>
              <td data-label="Продавец">
                <div className="master-table__primary-text">{product.seller}</div>
              </td>
              <td data-label="Категория">{product.category}</td>
              <td data-label="Цена">{new Intl.NumberFormat('ru-RU').format(product.price)} ₽</td>
              <td data-label="Подача">{dayjs(product.submittedAt).format('DD.MM HH:mm')}</td>
              <td data-label="Флаги">
                <div className="master-tag-list">
                  {Object.entries(product.flags || {}).map(([flag, enabled]) => (
                    <button
                      key={flag}
                      type="button"
                      className={`master-tag master-tag--button ${enabled ? 'master-tag--active' : ''}`}
                      onClick={() => handleFlagToggle(product.id, flag)}
                    >
                      {flag === 'bestseller' && 'Хит'}
                      {flag === 'hot' && 'Горящий'}
                      {flag === 'new' && 'New'}
                      {flag === 'sale' && 'Sale'}
                    </button>
                  ))}
                </div>
              </td>
              <td data-label="Комментарий">
                {product.issues?.length ? (
                  <div className="master-issue-list">
                    {product.issues.map((issue, idx) => (
                      <span key={idx} className="master-chip master-chip--warning">{issue}</span>
                    ))}
                </div>
                ) : <span className="master-chip master-chip--success">Без замечаний</span>}
              </td>
              <td data-label="Действия">
                <div className="master-actions">
                  <button
                    type="button"
                    className="master-actions__button master-actions__button--approve"
                    onClick={() => handleApprove(product.id)}
                  >
                    <SolarIconSet.CheckCircle svgProps={{width: 16, height: 16}} iconStyle="Bold" color="#1C8A64"/>
                    Одобрить
                  </button>
                  <button
                    type="button"
                    className="master-actions__button master-actions__button--reject"
                    onClick={() => handleReject(product.id)}
                  >
                    <SolarIconSet.CloseCircle svgProps={{width: 16, height: 16}} iconStyle="Bold" color="#C62F5C"/>
                    Отклонить
                  </button>
                </div>
              </td>
            </tr>
          ))}
          </tbody>
        </table>

        {!filteredProducts.length && (
          <div className="master-empty">
            Все товары обработаны. Отличная работа!
          </div>
        )}
      </section>
    </div>
  );
};

export default ModerationPage;
