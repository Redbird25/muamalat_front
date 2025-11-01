import React, {useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Actions from '../../../redux/actions';
import get from 'lodash.get';
import * as SolarIconSet from 'solar-icon-set';

const flagsMap = [
  {key: 'bestseller', label: 'Хит продаж'},
  {key: 'hot', label: 'Горящий товар'},
  {key: 'new', label: 'Новинка'},
  {key: 'sale', label: 'Распродажа'}
];

const PromotionsPage = () => {
  const dispatch = useDispatch();
  const featuredProducts = useSelector(state => get(state, 'master.featuredProducts', []));
  const [discountPreset, setDiscountPreset] = useState({type: 'percentage', value: 10});

  const totalActive = useMemo(() => featuredProducts.length, [featuredProducts]);

  const handleFlagChange = (productId, flag, checked) => {
    dispatch(Actions.MASTER_UPDATE_PRODUCT_FLAGS.request({
      productId,
      flags: {[flag]: checked}
    }));
  };

  const handleRemove = (productId) => {
    dispatch(Actions.MASTER_REMOVE_PRODUCT.request({productId}));
  };

  return (
    <div className="master-promotions">
      <section className="master-section">
        <div className="master-section__header">
          <div>
            <h2 className="master-section__title">Промо-пулы и статусы</h2>
            <p className="master-section__subtitle">Управляем выдачей, скидками и стикерами</p>
          </div>
          <div className="master-section__actions">
            <span className="master-tag">Активных товаров: {totalActive}</span>
            <button type="button" className="master-topbar__button master-topbar__button--primary">
              <SolarIconSet.AddSquare svgProps={{width: 18, height: 18}} iconStyle="Bold" color="#212640"/>
              Добавить в промо
            </button>
          </div>
        </div>

        <table className="master-table">
          <thead>
          <tr>
            <th>Товар</th>
            <th>Продавец</th>
            <th>Цена</th>
            <th>Метки</th>
            <th>Скидка</th>
            <th>Действия</th>
          </tr>
          </thead>
          <tbody>
          {featuredProducts.map(product => (
            <tr key={product.id}>
              <td data-label="Товар">
                <div className="master-table__primary-text">{product.name}</div>
                <span className="master-table__secondary-text">{product.category}</span>
              </td>
              <td data-label="Продавец">{product.seller}</td>
              <td data-label="Цена">{new Intl.NumberFormat('ru-RU').format(product.price)} ₽</td>
              <td data-label="Метки">
                <div className="master-flag-grid">
                  {flagsMap.map(flag => (
                    <label key={flag.key} className="master-toggle">
                      <input
                        type="checkbox"
                        checked={!!get(product, ['flags', flag.key])}
                        onChange={event => handleFlagChange(product.id, flag.key, event.target.checked)}
                      />
                      {flag.label}
                    </label>
                  ))}
                </div>
              </td>
              <td data-label="Скидка">
                {product.discount ? (
                  <div className="master-discount">
                    <span className="master-chip master-chip--success">
                      {product.discount.type === 'percentage'
                        ? `-${product.discount.value}%`
                        : `-${new Intl.NumberFormat('ru-RU').format(product.discount.value)} ₽`}
                    </span>
                    <span className="master-table__secondary-text">
                      до {new Date(product.discount.until).toLocaleDateString()}
                    </span>
                  </div>
                ) : (
                  <span className="master-table__secondary-text">Нет активной скидки</span>
                )}
              </td>
              <td data-label="Действия">
                <div className="master-actions master-actions--horizontal">
                  <button type="button" className="master-actions__button master-actions__button--approve">
                    <SolarIconSet.PenNewSquare svgProps={{width: 16, height: 16}} iconStyle="Bold" color="#1C8A64"/>
                    Изменить
                  </button>
                  <button
                    type="button"
                    className="master-actions__button master-actions__button--reject"
                    onClick={() => handleRemove(product.id)}
                  >
                    <SolarIconSet.TrashBinTrash svgProps={{width: 16, height: 16}} iconStyle="Bold" color="#C62F5C"/>
                    Удалить
                  </button>
                </div>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </section>

      <section className="master-grid master-grid--cols-2">
        <article className="master-section">
          <div className="master-section__header">
            <div>
              <h2 className="master-section__title">Массовое назначение скидок</h2>
              <p className="master-section__subtitle">Выберите пресет и примените к подборке</p>
            </div>
          </div>
          <div className="master-form">
            <div className="master-form__grid">
              <label className="master-form__group">
                <span>Тип скидки</span>
                <select
                  value={discountPreset.type}
                  onChange={event => setDiscountPreset(prev => ({...prev, type: event.target.value}))}
                >
                  <option value="percentage">Процентная</option>
                  <option value="flat">Фиксированная сумма</option>
                  <option value="bundle">Комплект</option>
                </select>
              </label>
              <label className="master-form__group">
                <span>Значение</span>
                <input
                  type="number"
                  value={discountPreset.value}
                  onChange={event => setDiscountPreset(prev => ({...prev, value: Number(event.target.value)}))}
                  min={0}
                />
              </label>
              <label className="master-form__group">
                <span>Cрок действия</span>
                <input type="date"/>
              </label>
            </div>
            <button type="button" className="master-topbar__button master-topbar__button--primary">
              Применить к отобранным товарам
            </button>
          </div>
        </article>

        <article className="master-section">
          <div className="master-section__header">
            <div>
              <h2 className="master-section__title">Настройки витрины</h2>
              <p className="master-section__subtitle">Приоритеты показов и подборки</p>
            </div>
          </div>
          <div className="master-vitrine">
            <div className="master-vitrine__row">
              <span>Хиты продаж на главной</span>
              <label className="master-toggle">
                <input type="checkbox" defaultChecked/>
                Автоматическое наполнение
              </label>
            </div>
            <div className="master-vitrine__row">
              <span>Порог для бейджа «Горящий»</span>
              <div className="master-vitrine__control">
                <input type="number" defaultValue={48}/>
                <span>часов до окончания акции</span>
              </div>
            </div>
            <div className="master-vitrine__row">
              <span>Лимит товаров в подборке «Новинки»</span>
              <div className="master-vitrine__control">
                <input type="number" defaultValue={24}/>
                <span>шт.</span>
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
};

export default PromotionsPage;
