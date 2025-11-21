import React, {useEffect, useMemo, useState} from 'react';
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
  const productBadges = useSelector(state => get(state, 'master.productBadges.items', []));
  const badgesLoading = useSelector(state => get(state, 'master.loading.productBadges', false));
  const badgeMutation = useSelector(state => get(state, 'master.loading.productBadgeMutation', false));
  const [discountPreset, setDiscountPreset] = useState({type: 'percentage', value: 10});
  const [badgeForm, setBadgeForm] = useState({
    nameUz: '',
    nameEn: '',
    nameRu: '',
    descriptionUz: '',
    descriptionEn: '',
    descriptionRu: ''
  });

  const totalActive = useMemo(() => featuredProducts.length, [featuredProducts]);

  const isBadgeFormValid = useMemo(
    () => Object.values(badgeForm).every(value => (value || '').toString().trim().length > 0),
    [badgeForm]
  );

  const handleFlagChange = (productId, flag, checked) => {
    dispatch(Actions.MASTER_UPDATE_PRODUCT_FLAGS.request({
      productId,
      flags: {[flag]: checked}
    }));
  };

  const handleRemove = (productId) => {
    dispatch(Actions.MASTER_REMOVE_PRODUCT.request({productId}));
  };

  useEffect(() => {
    dispatch(Actions.MASTER_FETCH_PRODUCT_BADGES.request());
  }, [dispatch]);

  const handleBadgeSubmit = (event) => {
    event.preventDefault();
    if (!isBadgeFormValid || badgeMutation) {
      return;
    }
    dispatch(Actions.MASTER_CREATE_PRODUCT_BADGE.request({badge: badgeForm}));
    setBadgeForm({
      nameUz: '',
      nameEn: '',
      nameRu: '',
      descriptionUz: '',
      descriptionEn: '',
      descriptionRu: ''
    });
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

      <section className="master-grid master-grid--cols-2">
        <article className="master-section">
          <div className="master-section__header">
            <div>
              <h2 className="master-section__title">Product badges</h2>
              <p className="master-section__subtitle">Manage labels that surface on product cards and detail pages.</p>
            </div>
            <span className="master-tag">Total: {productBadges.length}</span>
          </div>
          {badgesLoading ? (
            <p className="master-table__secondary-text mb-0">Loading badges...</p>
          ) : productBadges.length ? (
            <table className="master-table">
              <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
              </tr>
              </thead>
              <tbody>
              {productBadges.map((badge) => (
                <tr key={badge.id}>
                  <td data-label="ID">
                    <span className="master-chip master-chip--secondary">#{badge.id}</span>
                  </td>
                  <td data-label="Name">
                    <div className="master-table__primary-text">
                      {badge.nameEn || badge.nameUz || badge.nameRu || `Badge #${badge.id}`}
                    </div>
                    <span className="master-table__secondary-text">
                      {badge.nameUz || 'No Uzbek title'}
                    </span>
                  </td>
                  <td data-label="Description">
                    <div className="master-table__secondary-text">
                      {badge.descriptionEn || badge.descriptionUz || badge.descriptionRu || 'No description'}
                    </div>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          ) : (
            <p className="master-table__secondary-text mb-0">No product badges yet.</p>
          )}
        </article>

        <article className="master-section">
          <div className="master-section__header">
            <div>
              <h2 className="master-section__title">Create badge</h2>
              <p className="master-section__subtitle">Add multilingual labels for campaigns, bundles, or highlights.</p>
            </div>
          </div>
          <form className="master-form" onSubmit={handleBadgeSubmit}>
            <div className="master-form__grid">
              <label className="master-form__group">
                <span>Name (Uz)</span>
                <input
                  type="text"
                  value={badgeForm.nameUz}
                  onChange={event => setBadgeForm(prev => ({...prev, nameUz: event.target.value}))}
                  placeholder="Masalan: Chegirma"
                />
              </label>
              <label className="master-form__group">
                <span>Name (En)</span>
                <input
                  type="text"
                  value={badgeForm.nameEn}
                  onChange={event => setBadgeForm(prev => ({...prev, nameEn: event.target.value}))}
                  placeholder="e.g. Discount"
                />
              </label>
              <label className="master-form__group">
                <span>Name (Ru)</span>
                <input
                  type="text"
                  value={badgeForm.nameRu}
                  onChange={event => setBadgeForm(prev => ({...prev, nameRu: event.target.value}))}
                  placeholder="For example: Promo"
                />
              </label>
              <label className="master-form__group">
                <span>Description (Uz)</span>
                <textarea
                  rows={2}
                  value={badgeForm.descriptionUz}
                  onChange={event => setBadgeForm(prev => ({...prev, descriptionUz: event.target.value}))}
                  placeholder="Qisqa izoh"
                />
              </label>
              <label className="master-form__group">
                <span>Description (En)</span>
                <textarea
                  rows={2}
                  value={badgeForm.descriptionEn}
                  onChange={event => setBadgeForm(prev => ({...prev, descriptionEn: event.target.value}))}
                  placeholder="Short description"
                />
              </label>
              <label className="master-form__group">
                <span>Description (Ru)</span>
                <textarea
                  rows={2}
                  value={badgeForm.descriptionRu}
                  onChange={event => setBadgeForm(prev => ({...prev, descriptionRu: event.target.value}))}
                  placeholder="Short description in Russian"
                />
              </label>
            </div>
            <div className="master-form__actions">
              <button
                type="submit"
                className="master-topbar__button master-topbar__button--primary"
                disabled={!isBadgeFormValid || badgeMutation}
              >
                {badgeMutation ? 'Saving...' : 'Save badge'}
              </button>
            </div>
          </form>
        </article>
      </section>
    </div>
  );
};

export default PromotionsPage;
