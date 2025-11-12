import React, {useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import get from 'lodash.get';
import Actions from '../../../redux/actions';
import * as SolarIconSet from 'solar-icon-set';
import {toast} from 'react-toastify';
import './index.css';

const INITIAL_FORM = {
  id: null,
  nameUz: '',
  nameEn: '',
  nameRu: '',
  published: false
};

const INITIAL_CATEGORY_FORM = {
  nameUz: '',
  nameEn: '',
  nameRu: '',
  published: true,
  catalogId: '',
  characteristics: []
};

const createEmptyOption = () => ({
  valueUz: '',
  valueEn: '',
  valueRu: ''
});

const INITIAL_CHARACTERISTIC_FORM = {
  nameUz: '',
  nameEn: '',
  nameRu: '',
  options: [createEmptyOption()]
};

const INITIAL_SUBCATEGORY_FORM = {
  nameUz: '',
  nameEn: '',
  nameRu: '',
  parentCategoryId: '',
  published: true
};

const formatDateTime = (value) => {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
};

const CatalogPage = () => {
  const dispatch = useDispatch();
  const items = useSelector(state => get(state, 'master.catalog.items', []));
  const lastUpdated = useSelector(state => get(state, 'master.catalog.lastUpdated'));
  const loadingList = useSelector(state => get(state, 'master.loading.catalog'));
  const mutationLoading = useSelector(state => get(state, 'master.loading.catalogMutation'));
  const categories = useSelector(state => get(state, 'master.categories.items', []));
  const categoriesMeta = useSelector(state => get(state, 'master.categories') || {});
  const categoriesLoading = useSelector(state => get(state, 'master.loading.categories'));
  const categoryMutationLoading = useSelector(state => get(state, 'master.loading.categoryMutation'));
  const characteristics = useSelector(state => get(state, 'master.characteristics.items', []));
  const characteristicsLoading = useSelector(state => get(state, 'master.loading.characteristics'));
  const subCategoriesState = useSelector(state => get(state, 'master.subCategories', {}));
  const subCategoriesLoading = useSelector(state => get(state, 'master.loading.subCategories'));
  const subCategoryMutationLoading = useSelector(state => get(state, 'master.loading.subCategoryMutation'));

  const [form, setForm] = useState(INITIAL_FORM);
  const [mode, setMode] = useState('create');
  const [categoryForm, setCategoryForm] = useState(INITIAL_CATEGORY_FORM);
  const [categorySearch, setCategorySearch] = useState('');
  const [characteristicSearch, setCharacteristicSearch] = useState('');
  const [characteristicForm, setCharacteristicForm] = useState(INITIAL_CHARACTERISTIC_FORM);
  const [subCategoryForm, setSubCategoryForm] = useState(INITIAL_SUBCATEGORY_FORM);
  const [subCategorySearch, setSubCategorySearch] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    dispatch(Actions.MASTER_FETCH_CATALOG.request());
  }, [dispatch]);

  useEffect(() => {
    dispatch(Actions.MASTER_FETCH_CATEGORIES.request());
    dispatch(Actions.MASTER_FETCH_CHARACTERISTICS.request());
    dispatch(Actions.MASTER_FETCH_SUBCATEGORIES.request());
  }, [dispatch]);

  useEffect(() => {
    if (mode === 'edit' && form.id) {
      const updated = items.find(item => item.id === form.id);
      if (!updated) {
        setForm(INITIAL_FORM);
        setMode('create');
      }
    }
  }, [items, form.id, mode]);

  const orderedItems = useMemo(
    () => [...items].sort((a, b) => {
      const aDate = new Date(get(a, 'createdAt', 0)).getTime();
      const bDate = new Date(get(b, 'createdAt', 0)).getTime();
      return bDate - aDate;
    }),
    [items]
  );

  const handleSelect = (item) => {
    setForm({
      id: item.id,
      nameUz: item.nameUz || '',
      nameEn: item.nameEn || '',
      nameRu: item.nameRu || '',
      published: !!item.published
    });
    setMode('edit');
  };

  const handleChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setMode('create');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      nameUz: form.nameUz.trim(),
      nameEn: form.nameEn.trim(),
      nameRu: form.nameRu.trim(),
      published: !!form.published
    };
    if (!payload.nameUz || !payload.nameRu || !payload.nameEn) {
      return;
    }
    if (mode === 'edit' && form.id) {
      dispatch(Actions.MASTER_UPDATE_CATALOG.request({
        catalog: {...payload, id: form.id}
      }));
    } else {
      dispatch(Actions.MASTER_CREATE_CATALOG.request({
        catalog: payload
      }));
    }
    resetForm();
  };

  const handleCategoryChange = (field, value) => {
    setCategoryForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategoryMultiChange = (event) => {
    const values = Array.from(event.target.selectedOptions || []).map(option => option.value);
    handleCategoryChange('characteristics', values);
  };

  const handleCharacteristicFieldChange = (field, value) => {
    setCharacteristicForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCharacteristicOptionChange = (index, field, value) => {
    setCharacteristicForm(prev => ({
      ...prev,
      options: prev.options.map((option, idx) =>
        idx === index ? {...option, [field]: value} : option
      )
    }));
  };

  const addCharacteristicOption = () => {
    setCharacteristicForm(prev => ({
      ...prev,
      options: [...prev.options, createEmptyOption()]
    }));
  };

  const removeCharacteristicOption = (index) => {
    setCharacteristicForm(prev => {
      if (prev.options.length === 1) {
        return prev;
      }
      const nextOptions = prev.options.filter((_, idx) => idx !== index);
      return {
        ...prev,
        options: nextOptions.length ? nextOptions : [createEmptyOption()]
      };
    });
  };

  const resetCategoryForm = () => {
    setCategoryForm(INITIAL_CATEGORY_FORM);
  };

  const handleCategorySubmit = (event) => {
    event.preventDefault();
    if (!categoryForm.catalogId) {
      toast.error('Выберите родительский каталог');
      return;
    }
    if (!categoryForm.characteristics.length) {
      toast.error('Выберите хотя бы одну характеристику');
      return;
    }
    const payload = {
      nameUz: categoryForm.nameUz.trim(),
      nameEn: categoryForm.nameEn.trim(),
      nameRu: categoryForm.nameRu.trim(),
      published: !!categoryForm.published,
      catalogId: Number(categoryForm.catalogId),
      characteristicsIds: categoryForm.characteristics
    };
    if (!payload.nameUz || !payload.nameRu || !payload.nameEn) {
      toast.error('Заполните названия категории');
      return;
    }
    dispatch(Actions.MASTER_CREATE_CATEGORY.request({category: payload}));
    resetCategoryForm();
  };

  const handleSubCategoryChange = (field, value) => {
    setSubCategoryForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetSubCategoryForm = () => {
    setSubCategoryForm(INITIAL_SUBCATEGORY_FORM);
  };

  const handleSubCategorySubmit = (event) => {
    event.preventDefault();
    if (!subCategoryForm.nameUz.trim() || !subCategoryForm.nameRu.trim() || !subCategoryForm.nameEn.trim()) {
      toast.error('Заполните названия подкатегории');
      return;
    }
    const parentCategoryId = Number(subCategoryForm.parentCategoryId);
    if (!parentCategoryId || Number.isNaN(parentCategoryId)) {
      toast.error('Выберите родительскую категорию');
      return;
    }
    dispatch(Actions.MASTER_CREATE_SUBCATEGORY.request({
      subCategory: {
        nameUz: subCategoryForm.nameUz.trim(),
        nameRu: subCategoryForm.nameRu.trim(),
        nameEn: subCategoryForm.nameEn.trim(),
        parentCategoryId,
        published: !!subCategoryForm.published
      }
    }));
    resetSubCategoryForm();
  };

  const handleSubCategorySearch = (event) => {
    event.preventDefault();
    dispatch(Actions.MASTER_FETCH_SUBCATEGORIES.request({
      query: subCategorySearch.trim() || undefined
    }));
  };

  const categoryList = useMemo(() => categories || [], [categories]);
  const subCategories = useMemo(() => get(subCategoriesState, 'items', []), [subCategoriesState]);
  const subCategoryList = useMemo(() => subCategories || [], [subCategories]);
  const subCategoriesMeta = subCategoriesState || {};
  const categoryNameById = useMemo(() => {
    const map = {};
    categoryList.forEach(category => {
      map[category.id] = category.nameRu || category.nameUz || category.nameEn;
    });
    return map;
  }, [categoryList]);
  const characteristicList = useMemo(() => characteristics || [], [characteristics]);
  const lastCategories = useMemo(() => categoryList.slice(0, 5), [categoryList]);
  const lastSubCategories = useMemo(() => subCategoryList.slice(0, 5), [subCategoryList]);
  const publishedCatalogs = useMemo(() => orderedItems.filter(item => item.published).length, [orderedItems]);
  const publishedCategories = useMemo(() => categoryList.filter(item => item.published).length, [categoryList]);
  const publishedSubCategories = useMemo(() => subCategoryList.filter(item => item.published).length, [subCategoryList]);
  const overviewStats = useMemo(() => ([
    {
      id: 'catalogs',
      title: 'Каталоги',
      value: orderedItems.length,
      meta: `${publishedCatalogs} опубликовано`
    },
    {
      id: 'categories',
      title: 'Категории',
      value: categoryList.length,
      meta: `${publishedCategories} опубликовано`
    },
    {
      id: 'subcategories',
      title: 'Подкатегории',
      value: subCategoryList.length,
      meta: `${publishedSubCategories} опубликовано`
    },
    {
      id: 'characteristics',
      title: 'Характеристики',
      value: characteristicList.length,
      meta: 'Используются в категориях'
    },
    {
      id: 'lastUpdated',
      title: 'Последнее обновление',
      value: formatDateTime(lastUpdated),
      meta: 'Обновление справочника'
    }
  ]), [orderedItems, categoryList.length, subCategoryList.length, characteristicList.length, publishedCatalogs, publishedCategories, publishedSubCategories, lastUpdated]);
  const tabs = useMemo(() => ([
    {
      id: 'overview',
      title: 'Обзор',
      description: 'Ключевые показатели структуры каталога'
    },
    {
      id: 'catalogs',
      title: 'Каталоги',
      description: 'Корневые разделы и их параметры'
    },
    {
      id: 'characteristics',
      title: 'Характеристики',
      description: 'Справочники значений для карточек товара'
    },
    {
      id: 'categories',
      title: 'Категории',
      description: 'Привязка к каталогам и характеристикам'
    },
    {
      id: 'subcategories',
      title: 'Подкатегории',
      description: 'Управление ветками внутри категорий'
    }
  ]), []);
  const isOverviewTab = activeTab === 'overview';
  const isCatalogTab = activeTab === 'catalogs';
  const isCharacteristicsTab = activeTab === 'characteristics';
  const isCategoriesTab = activeTab === 'categories';
  const isSubCategoriesTab = activeTab === 'subcategories';

  const handleCategorySearch = (event) => {
    event.preventDefault();
    dispatch(Actions.MASTER_FETCH_CATEGORIES.request({
      query: categorySearch.trim() || undefined
    }));
  };

  const handleCharacteristicSearch = (event) => {
    event.preventDefault();
    dispatch(Actions.MASTER_FETCH_CHARACTERISTICS.request({
      query: characteristicSearch.trim() || undefined
    }));
  };

  const resetCharacteristicForm = () => {
    setCharacteristicForm({
      ...INITIAL_CHARACTERISTIC_FORM,
      options: [createEmptyOption()]
    });
  };

  const handleCharacteristicSubmit = (event) => {
    event.preventDefault();
    if (!characteristicForm.nameUz.trim() || !characteristicForm.nameRu.trim() || !characteristicForm.nameEn.trim()) {
      toast.error('Заполните названия характеристики на всех языках');
      return;
    }
    const normalizedOptions = characteristicForm.options.map(option => ({
      valueUz: (option.valueUz || '').trim(),
      valueRu: (option.valueRu || '').trim(),
      valueEn: (option.valueEn || '').trim()
    }));
    if (!normalizedOptions.length || normalizedOptions.some(option =>
      !option.valueUz || !option.valueRu || !option.valueEn
    )) {
      toast.error('Заполните значения на всех языках и добавьте минимум одно значение');
      return;
    }
    dispatch(Actions.MASTER_CREATE_CHARACTERISTIC.request({
      characteristic: {
        nameUz: characteristicForm.nameUz.trim(),
        nameRu: characteristicForm.nameRu.trim(),
        nameEn: characteristicForm.nameEn.trim(),
        options: normalizedOptions
      }
    }));
    resetCharacteristicForm();
  };

  return (
    <div className="master-catalog">
      <div className="master-tabs master-tabs--spaced" role="tablist">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`master-tab ${isActive ? 'is-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="master-tab__title">{tab.title}</span>
              <span className="master-tab__subtitle">{tab.description}</span>
            </button>
          );
        })}
      </div>

      {isOverviewTab && (
        <>
          <section className="master-section">
            <div className="master-section__header">
              <div>
                <h2 className="master-section__title">Общий обзор каталога</h2>
                <p className="master-section__subtitle">
                  Количество элементов и состояние структуры. Используйте вкладки для детальной работы.
                </p>
              </div>
              {lastUpdated && (
                <span className="master-tag">Обновлено: {formatDateTime(lastUpdated)}</span>
              )}
            </div>

            <div className="master-grid master-grid--cols-2">
              {overviewStats
                .filter(stat => stat.id !== 'lastUpdated')
                .map(stat => (
                  <article className="master-card" key={stat.id}>
                    <p className="master-card__label">{stat.title}</p>
                    <p className="master-card__value">{stat.value}</p>
                    {stat.meta && (
                      <p className="master-table__secondary-text">{stat.meta}</p>
                    )}
                  </article>
                ))}
            </div>
          </section>

          <section className="master-section">
            <div className="master-section__header">
              <div>
                <h3 className="master-section__title">Последние изменения</h3>
                <p className="master-section__subtitle">
                  5 свежих записей по категориям и подкатегориям для контроля публикаций.
                </p>
              </div>
            </div>

            <div className="master-grid master-grid--cols-2">
              <article className="master-table-wrapper">
                <div className="master-section__header">
                  <h4 className="master-section__title">Категории</h4>
                  <span className="master-tag">Последние 5</span>
                </div>
                <table className="master-table master-table--compact">
                  <thead>
                  <tr>
                    <th>Категория</th>
                    <th>Каталог</th>
                  </tr>
                  </thead>
                  <tbody>
                  {lastCategories.length === 0 ? (
                    <tr>
                      <td colSpan={2}>
                        <div className="master-empty">Категории ещё не созданы.</div>
                      </td>
                    </tr>
                  ) : (
                    lastCategories.map(category => (
                      <tr key={category.id || `${category.nameRu}_${category.nameUz}`}>
                        <td data-label="Категория">
                          <div className="master-table__primary-text">
                            {category.nameRu || category.nameUz || category.nameEn || '—'}
                          </div>
                          <span className="master-table__secondary-text">
                            Статус: {category.published ? 'Опубликована' : 'Черновик'}
                          </span>
                        </td>
                        <td data-label="Каталог">
                          {get(category, 'catalog.nameRu') || get(category, 'catalog.nameUz') || get(category, 'catalog.nameEn') || '—'}
                        </td>
                      </tr>
                    ))
                  )}
                  </tbody>
                </table>
              </article>

              <article className="master-table-wrapper">
                <div className="master-section__header">
                  <h4 className="master-section__title">Подкатегории</h4>
                  <span className="master-tag">Последние 5</span>
                </div>
                <table className="master-table master-table--compact">
                  <thead>
                  <tr>
                    <th>Подкатегория</th>
                    <th>Категория</th>
                  </tr>
                  </thead>
                  <tbody>
                  {lastSubCategories.length === 0 ? (
                    <tr>
                      <td colSpan={2}>
                        <div className="master-empty">Подкатегории ещё не созданы.</div>
                      </td>
                    </tr>
                  ) : (
                    lastSubCategories.map(sub => (
                      <tr key={sub.id}>
                        <td data-label="Подкатегория">
                          <div className="master-table__primary-text">{sub.nameRu || sub.nameUz || sub.nameEn || '—'}</div>
                          <span className="master-table__secondary-text">
                            Статус: {sub.published ? 'Опубликована' : 'Черновик'}
                          </span>
                        </td>
                        <td data-label="Категория">{categoryNameById[sub.parentCategoryId] || '—'}</td>
                      </tr>
                    ))
                  )}
                  </tbody>
                </table>
              </article>
            </div>
          </section>
        </>
      )}

      {isSubCategoriesTab && (
        <section className="master-section">
          <div className="master-section__header">
            <div>
              <h2 className="master-section__title">Подкатегории</h2>
              <p className="master-section__subtitle">Управляйте ветками внутри выбранных категорий.</p>
            </div>
          </div>

          <div className="master-grid master-grid--cols-2">
            <article className="master-table-wrapper">
              <div className="master-section__header">
                <h3 className="master-section__title">Список подкатегорий</h3>
                <span className="master-tag">Всего: {subCategoriesMeta.total || subCategoryList.length}</span>
                <form className="master-search" onSubmit={handleSubCategorySearch}>
                  <input
                    type="text"
                    placeholder="Поиск по названию"
                    value={subCategorySearch}
                    onChange={(event) => setSubCategorySearch(event.target.value)}
                  />
                  <button type="submit" className="master-topbar__button master-topbar__button--ghost">
                    Найти
                  </button>
                </form>
              </div>
              <table className="master-table">
                <thead>
                <tr>
                  <th>Название (RU)</th>
                  <th>Родительская категория</th>
                  <th>Статус</th>
                  <th>Создана</th>
                </tr>
                </thead>
                <tbody>
                {subCategoriesLoading ? (
                  <tr>
                    <td colSpan={4}>
                      <div className="master-empty">Загружаем подкатегории…</div>
                    </td>
                  </tr>
                ) : subCategoryList.length === 0 ? (
                  <tr>
                    <td colSpan={4}>
                      <div className="master-empty">Подкатегории ещё не созданы.</div>
                    </td>
                  </tr>
                ) : (
                  subCategoryList.map(subCategory => (
                    <tr key={subCategory.id}>
                      <td data-label="Название (RU)">{subCategory.nameRu || '—'}</td>
                      <td data-label="Родительская">{categoryNameById[subCategory.parentCategoryId] || '—'}</td>
                      <td data-label="Статус">
                        <span className={`master-chip ${subCategory.published ? 'master-chip--success' : 'master-chip--warning'}`}>
                          {subCategory.published ? 'Опубликована' : 'Черновик'}
                        </span>
                      </td>
                      <td data-label="Создана">
                        {formatDateTime(subCategory.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
                </tbody>
              </table>
            </article>

            <article className="master-section">
              <div className="master-section__header">
                <div>
                  <h3 className="master-section__title">Создание подкатегории</h3>
                  <p className="master-section__subtitle">Выберите родительскую категорию и укажите названия.</p>
                </div>
              </div>
              <form className="master-form" onSubmit={handleSubCategorySubmit}>
                <div className="master-form__grid">
                  <label className="master-form__group">
                    <span>Название (UZ)</span>
                    <input
                      type="text"
                      value={subCategoryForm.nameUz}
                      onChange={(event) => handleSubCategoryChange('nameUz', event.target.value)}
                      required
                    />
                  </label>
                  <label className="master-form__group">
                    <span>Название (RU)</span>
                    <input
                      type="text"
                      value={subCategoryForm.nameRu}
                      onChange={(event) => handleSubCategoryChange('nameRu', event.target.value)}
                      required
                    />
                  </label>
                  <label className="master-form__group">
                    <span>Название (EN)</span>
                    <input
                      type="text"
                      value={subCategoryForm.nameEn}
                      onChange={(event) => handleSubCategoryChange('nameEn', event.target.value)}
                      required
                    />
                  </label>
                </div>

                <label className="master-form__group">
                  <span>Родительская категория</span>
                  <select
                    value={subCategoryForm.parentCategoryId}
                    onChange={(event) => handleSubCategoryChange('parentCategoryId', event.target.value)}
                    required
                  >
                    <option value="">Выберите категорию</option>
                    {categoryList.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.nameRu || category.nameUz || category.nameEn}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="master-form__group master-form__group--inline">
                  <label className="master-checkbox">
                    <input
                      type="checkbox"
                      checked={subCategoryForm.published}
                      onChange={(event) => handleSubCategoryChange('published', event.target.checked)}
                    />
                    <span>Опубликовать сразу</span>
                  </label>
                </div>

                <div className="master-actions master-actions--horizontal">
                  <button
                    type="submit"
                    className="master-topbar__button master-topbar__button--primary"
                    disabled={subCategoryMutationLoading}
                  >
                    {subCategoryMutationLoading ? 'Сохраняем…' : 'Создать подкатегорию'}
                  </button>
                  <button
                    type="button"
                    className="master-topbar__button master-topbar__button--ghost"
                    onClick={resetSubCategoryForm}
                    disabled={subCategoryMutationLoading}
                  >
                    Очистить форму
                  </button>
                </div>
              </form>
            </article>
          </div>
        </section>
      )}

      {isCatalogTab && (
        <section className="master-section">
        <div className="master-section__header">
          <div>
            <h2 className="master-section__title">Каталог платформы</h2>
            <p className="master-section__subtitle">
              Управление корневыми каталогами и их атрибутами.
              Используйте форму справа, чтобы создавать и редактировать записи.
            </p>
          </div>
          <span className="master-tag">
            Обновлено: {lastUpdated ? new Date(lastUpdated).toLocaleString() : '—'}
          </span>
        </div>

        <div className="master-grid master-grid--cols-2">
          <article className="master-table-wrapper">
            <div className="master-section__header">
              <h3 className="master-section__title">Список каталогов</h3>
              <button
                type="button"
                className="master-topbar__button master-topbar__button--ghost"
                onClick={resetForm}
              >
                <SolarIconSet.AddSquare svgProps={{width: 18, height: 18}} iconStyle="Bold" color="#212640"/>
                Новый каталог
              </button>
            </div>
            <table className="master-table">
              <thead>
              <tr>
                <th>Название (RU)</th>
                <th>Название (UZ)</th>
                <th>Название (EN)</th>
                <th>Флаг публикации</th>
                <th>Создан</th>
              </tr>
              </thead>
              <tbody>
              {loadingList ? (
                <tr>
                  <td colSpan={5}>
                    <div className="master-empty">Загружаем каталоги…</div>
                  </td>
                </tr>
              ) : orderedItems.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="master-empty">Каталоги ещё не созданы.</div>
                  </td>
                </tr>
              ) : (
                orderedItems.map(item => (
                  <tr
                    key={item.id}
                    className={form.id === item.id ? 'master-row--active' : ''}
                    onClick={() => handleSelect(item)}
                  >
                    <td data-label="Название (RU)">{item.nameRu || '—'}</td>
                    <td data-label="Название (UZ)">{item.nameUz || '—'}</td>
                    <td data-label="Название (EN)">{item.nameEn || '—'}</td>
                    <td data-label="Публикация">
                      <span className={`master-chip ${item.published ? 'master-chip--success' : 'master-chip--warning'}`}>
                        {item.published ? 'Опубликован' : 'Черновик'}
                      </span>
                    </td>
                    <td data-label="Создан">
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))
              )}
              </tbody>
            </table>
          </article>

          <article className="master-section">
            <div className="master-section__header">
              <div>
                <h3 className="master-section__title">
                  {mode === 'edit' ? 'Редактирование каталога' : 'Создание каталога'}
                </h3>
                <p className="master-section__subtitle">
                  Заполните названия на всех языках и выберите видимость.
                </p>
              </div>
            </div>
            <form className="master-form" onSubmit={handleSubmit}>
              <div className="master-form__grid">
                <label className="master-form__group">
                  <span>Название (UZ)</span>
                  <input
                    type="text"
                    value={form.nameUz}
                    onChange={(event) => handleChange('nameUz', event.target.value)}
                    placeholder="Например, Elektronika"
                    required
                  />
                </label>
                <label className="master-form__group">
                  <span>Название (RU)</span>
                  <input
                    type="text"
                    value={form.nameRu}
                    onChange={(event) => handleChange('nameRu', event.target.value)}
                    placeholder="Например, Электроника"
                    required
                  />
                </label>
                <label className="master-form__group">
                  <span>Название (EN)</span>
                  <input
                    type="text"
                    value={form.nameEn}
                    onChange={(event) => handleChange('nameEn', event.target.value)}
                    placeholder="E.g. Electronics"
                    required
                  />
                </label>
              </div>

              <div className="master-form__group master-form__group--inline">
                <label className="master-checkbox">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(event) => handleChange('published', event.target.checked)}
                  />
                  <span>Опубликовать сразу</span>
                </label>
              </div>

              <div className="master-actions master-actions--horizontal">
                <button
                  type="submit"
                  className="master-topbar__button master-topbar__button--primary"
                  disabled={mutationLoading}
                >
                  {mutationLoading ? 'Сохраняем…' : 'Сохранить'}
                </button>
                {mode === 'edit' && (
                  <button
                    type="button"
                    className="master-topbar__button master-topbar__button--ghost"
                    onClick={resetForm}
                    disabled={mutationLoading}
                  >
                    Отмена
                  </button>
                )}
              </div>
      </form>
            </article>
          </div>
        </section>

      )}

      {isCharacteristicsTab && (
        <section className="master-section">
          <div className="master-section__header">
            <div>
              <h2 className="master-section__title">Характеристики товаров</h2>
              <p className="master-section__subtitle">
                Создавайте справочники для фильтров и карточек товара. Их можно привязывать к категориям.
              </p>
            </div>
            <form className="master-search" onSubmit={handleCharacteristicSearch}>
              <input
                type="text"
                placeholder="Поиск по названию"
                value={characteristicSearch}
                onChange={(event) => setCharacteristicSearch(event.target.value)}
              />
              <button type="submit" className="master-topbar__button master-topbar__button--ghost">
                Найти
              </button>
            </form>
          </div>

          <div className="master-grid master-grid--cols-2">
            <article className="master-table-wrapper">
              <table className="master-table">
                <thead>
                <tr>
                  <th>Название (RU)</th>
                  <th>Название (UZ)</th>
                  <th>Значений</th>
                </tr>
                </thead>
                <tbody>
                {characteristicsLoading ? (
                  <tr>
                    <td colSpan={3}>
                      <div className="master-empty">Загружаем характеристики…</div>
                    </td>
                  </tr>
                ) : characteristicList.length === 0 ? (
                  <tr>
                    <td colSpan={3}>
                      <div className="master-empty">Характеристик пока нет.</div>
                    </td>
                  </tr>
                ) : (
                  characteristicList.map(ch => (
                    <tr key={ch.id}>
                      <td data-label="Название (RU)">{ch.nameRu || '—'}</td>
                      <td data-label="Название (UZ)">{ch.nameUz || '—'}</td>
                      <td data-label="Значений">
                        {Array.isArray(ch.options) ? ch.options.length : 0}
                      </td>
                    </tr>
                  ))
                )}
                </tbody>
              </table>
            </article>

            <article className="master-section">
              <div className="master-section__header">
                <div>
                  <h3 className="master-section__title">Новая характеристика</h3>
                  <p className="master-section__subtitle">
                    Разделите значения переводом строки или запятыми.
                  </p>
                </div>
              </div>
              <form className="master-form" onSubmit={handleCharacteristicSubmit}>
                <div className="master-form__grid">
                  <label className="master-form__group">
                    <span>Название (UZ)</span>
                    <input
                      type="text"
                      value={characteristicForm.nameUz}
                      onChange={(event) => handleCharacteristicFieldChange('nameUz', event.target.value)}
                      placeholder="Material"
                      required
                    />
                  </label>
                  <label className="master-form__group">
                    <span>Название (RU)</span>
                    <input
                      type="text"
                      value={characteristicForm.nameRu}
                      onChange={(event) => handleCharacteristicFieldChange('nameRu', event.target.value)}
                      placeholder="Материал"
                      required
                    />
                  </label>
                  <label className="master-form__group">
                    <span>Название (EN)</span>
                    <input
                      type="text"
                      value={characteristicForm.nameEn}
                      onChange={(event) => handleCharacteristicFieldChange('nameEn', event.target.value)}
                      placeholder="Material"
                      required
                    />
                  </label>
                </div>

              <div className="master-form__group">
                <span>Значения</span>
                <div className="characteristic-options">
                  {characteristicForm.options.map((option, index) => (
                    <div className="characteristic-options__row" key={`characteristic-option-${index}`}>
                      <label className="master-form__group">
                        <span>Значение (UZ)</span>
                        <input
                          type="text"
                          value={option.valueUz}
                          onChange={(event) => handleCharacteristicOptionChange(index, 'valueUz', event.target.value)}
                          required
                        />
                      </label>
                      <label className="master-form__group">
                        <span>Значение (RU)</span>
                        <input
                          type="text"
                          value={option.valueRu}
                          onChange={(event) => handleCharacteristicOptionChange(index, 'valueRu', event.target.value)}
                          required
                        />
                      </label>
                      <label className="master-form__group">
                        <span>Значение (EN)</span>
                        <input
                          type="text"
                          value={option.valueEn}
                          onChange={(event) => handleCharacteristicOptionChange(index, 'valueEn', event.target.value)}
                          required
                        />
                      </label>
                      {characteristicForm.options.length > 1 && (
                        <button
                          type="button"
                          className="master-topbar__button master-topbar__button--ghost characteristic-options__remove"
                          onClick={() => removeCharacteristicOption(index)}
                        >
                          Удалить
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="master-topbar__button master-topbar__button--ghost characteristic-options__add"
                  onClick={addCharacteristicOption}
                >
                  Добавить значение
                </button>
                <small className="text-75758b">Укажите перевод для каждого значения характеристики</small>
              </div>

                <div className="master-actions master-actions--horizontal">
                  <button type="submit" className="master-topbar__button master-topbar__button--primary">
                    Добавить характеристику
                  </button>
                  <button
                    type="button"
                    className="master-topbar__button master-topbar__button--ghost"
                    onClick={resetCharacteristicForm}
                  >
                    Очистить
                  </button>
                </div>
              </form>
            </article>
          </div>
        </section>

      )}

      {isCategoriesTab && (
        <>
        <section className="master-section">
          <div className="master-section__header">
            <div>
              <h2 className="master-section__title">Категории каталога</h2>
              <p className="master-section__subtitle">
                Привязывайте категории к каталогу и назначайте им характеристики для фильтров.
              </p>
            </div>
          </div>

          <div className="master-grid master-grid--cols-2">
            <article className="master-table-wrapper">
              <div className="master-section__header">
                <h3 className="master-section__title">Список категорий</h3>
                <span className="master-tag">Всего: {categoriesMeta.total || categoryList.length}</span>
                <form className="master-search" onSubmit={handleCategorySearch}>
                  <input
                    type="text"
                    placeholder="Поиск по названию"
                    value={categorySearch}
                    onChange={(event) => setCategorySearch(event.target.value)}
                  />
                  <button type="submit" className="master-topbar__button master-topbar__button--ghost">
                    Найти
                  </button>
                </form>
              </div>
              <table className="master-table">
                <thead>
                <tr>
                  <th>Название (RU)</th>
                  <th>Каталог</th>
                  <th>Характеристики</th>
                  <th>Статус</th>
                </tr>
                </thead>
                <tbody>
                {categoriesLoading ? (
                  <tr>
                    <td colSpan={4}>
                      <div className="master-empty">Загружаем категории…</div>
                    </td>
                  </tr>
                ) : categoryList.length === 0 ? (
                  <tr>
                    <td colSpan={4}>
                      <div className="master-empty">Категории ещё не созданы.</div>
                    </td>
                  </tr>
                ) : (
                  categoryList.map(category => (
                    <tr key={category.id || `${category.nameRu}_${category.nameUz}`}>
                      <td data-label="Название">{category.nameRu || '—'}</td>
                      <td data-label="Каталог">{get(category, 'catalog.nameRu') || get(category, 'catalog.nameUz') || '—'}</td>
                      <td data-label="Характеристики">
                        {Array.isArray(get(category, 'characteristics')) ? get(category, 'characteristics').length : 0}
                      </td>
                      <td data-label="Статус">
                        <span className={`master-chip ${category.published ? 'master-chip--success' : 'master-chip--warning'}`}>
                          {category.published ? 'Опубликована' : 'Черновик'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
                </tbody>
              </table>
            </article>

            <article className="master-section">
              <div className="master-section__header">
                <div>
                  <h3 className="master-section__title">Создание категории</h3>
                  <p className="master-section__subtitle">
                    Укажите каталог, названия и привяжите характеристики.
                  </p>
                </div>
              </div>
              <form className="master-form" onSubmit={handleCategorySubmit}>
                <div className="master-form__grid">
                  <label className="master-form__group">
                    <span>Название (UZ)</span>
                    <input
                      type="text"
                      value={categoryForm.nameUz}
                      onChange={(event) => handleCategoryChange('nameUz', event.target.value)}
                      placeholder="Например, Maishiy texnika"
                      required
                    />
                  </label>
                  <label className="master-form__group">
                    <span>Название (RU)</span>
                    <input
                      type="text"
                      value={categoryForm.nameRu}
                      onChange={(event) => handleCategoryChange('nameRu', event.target.value)}
                      placeholder="Например, Бытовая техника"
                      required
                    />
                  </label>
                  <label className="master-form__group">
                    <span>Название (EN)</span>
                    <input
                      type="text"
                      value={categoryForm.nameEn}
                      onChange={(event) => handleCategoryChange('nameEn', event.target.value)}
                      placeholder="Home appliances"
                      required
                    />
                  </label>
                </div>

                <label className="master-form__group">
                  <span>Каталог</span>
                  <select
                    value={categoryForm.catalogId}
                    onChange={(event) => handleCategoryChange('catalogId', event.target.value)}
                    required
                  >
                    <option value="">Выбрать каталог</option>
                    {items.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.nameRu || item.nameUz || item.nameEn}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="master-form__group">
                  <span>Характеристики</span>
                  <select
                    multiple
                    value={categoryForm.characteristics}
                    onChange={handleCategoryMultiChange}
                    disabled={characteristicsLoading}
                  >
                    {characteristicList.map(ch => (
                      <option key={ch.id} value={ch.id}>
                        {ch.nameRu || ch.nameUz || ch.nameEn}
                      </option>
                    ))}
                  </select>
                  <small className="text-75758b d-block mt-1">
                    Удерживайте Ctrl (Cmd) для выбора нескольких значений
                  </small>
                </label>

                <div className="master-form__group master-form__group--inline">
                  <label className="master-checkbox">
                    <input
                      type="checkbox"
                      checked={categoryForm.published}
                      onChange={(event) => handleCategoryChange('published', event.target.checked)}
                    />
                    <span>Опубликовать сразу</span>
                  </label>
                </div>

                <div className="master-actions master-actions--horizontal">
                  <button
                    type="submit"
                    className="master-topbar__button master-topbar__button--primary"
                    disabled={categoryMutationLoading}
                  >
                    {categoryMutationLoading ? 'Сохраняем…' : 'Создать категорию'}
                  </button>
                  <button
                    type="button"
                    className="master-topbar__button master-topbar__button--ghost"
                    onClick={resetCategoryForm}
                    disabled={categoryMutationLoading}
                  >
                    Очистить форму
                  </button>
                </div>
              </form>
            </article>
          </div>
        </section>

        </>
      )}
    </div>
  );
};

export default CatalogPage;
