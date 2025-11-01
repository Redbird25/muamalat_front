import React, {useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Actions from '../../../redux/actions';
import get from 'lodash.get';
import * as SolarIconSet from 'solar-icon-set';

const flattenTree = (tree = []) => {
  const result = [];
  tree.forEach(node => {
    result.push(node);
    if (Array.isArray(node.children)) {
      result.push(...flattenTree(node.children.map(child => ({...child, parentId: node.id}))));
    }
  });
  return result;
};

const CatalogPage = () => {
  const dispatch = useDispatch();
  const catalog = useSelector(state => state.master.catalog);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    dispatch(Actions.MASTER_FETCH_CATALOG.request());
  }, [dispatch]);

  const tree = get(catalog, 'tree', []);
  const attributes = get(catalog, 'attributes', []);

  const flat = useMemo(() => flattenTree(tree), [tree]);
  const selected = flat.find(item => item.id === selectedId) || tree[0];

  const childNodes = useMemo(() => {
    if (!selected) return [];
    return tree.find(item => item.id === selected.id)?.children
      || tree.flatMap(parent => parent.children || []).filter(item => item.parentId === selected.id)
      || selected.children || [];
  }, [selected, tree]);

  const handleSelect = (id) => {
    setSelectedId(id);
  };

  return (
    <div className="master-catalog">
      <section className="master-grid master-grid--cols-2">
        <article className="master-section">
          <div className="master-section__header">
            <div>
              <h2 className="master-section__title">Структура каталога</h2>
              <p className="master-section__subtitle">Категории и подкатегории витрины</p>
            </div>
            <span className="master-tag">Обновлено: {new Date(get(catalog, 'lastUpdated', Date.now())).toLocaleDateString()}</span>
          </div>

          <div className="master-tree">
            {tree.map(node => (
              <div key={node.id} className="master-tree__group">
                <button
                  type="button"
                  onClick={() => handleSelect(node.id)}
                  className={`master-tree__node ${selected?.id === node.id ? 'master-tree__node--active' : ''}`}
                >
                  <div>
                    <p className="master-tree__title">{node.name}</p>
                    <span className="master-tree__meta">{node.products} товаров · код {node.code}</span>
                  </div>
                  <span className={`master-chip ${node.visibility === 'public' ? 'master-chip--success' : 'master-chip--warning'}`}>
                    {node.visibility === 'public' ? 'Публично' : 'Черновик'}
                  </span>
                </button>
                <div className="master-tree__children">
                  {(node.children || []).map(child => (
                    <button
                      key={child.id}
                      type="button"
                      onClick={() => handleSelect(child.id)}
                      className={`master-tree__node master-tree__node--child ${selected?.id === child.id ? 'master-tree__node--active' : ''}`}
                    >
                      <div>
                        <p className="master-tree__title">{child.name}</p>
                        <span className="master-tree__meta">{child.products} товаров · код {child.code}</span>
                      </div>
                      <span className={`master-chip ${child.visibility === 'public' ? 'master-chip--success' : 'master-chip--warning'}`}>
                        {child.visibility === 'public' ? 'Публично' : 'Черновик'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="master-section">
          <div className="master-section__header">
            <div>
              <h2 className="master-section__title">Детали категории</h2>
              <p className="master-section__subtitle">Работа с атрибутами и навигацией</p>
            </div>
            <div className="master-section__actions">
          <button type="button" className="master-topbar__button master-topbar__button--ghost">
            <SolarIconSet.Eye svgProps={{width: 18, height: 18}} iconStyle="Bold" color="#212640"/>
            Посмотреть на витрине
          </button>
          <button type="button" className="master-topbar__button master-topbar__button--primary">
            <SolarIconSet.PenNewSquare svgProps={{width: 18, height: 18}} iconStyle="Bold" color="#212640"/>
            Редактировать карточку
          </button>
            </div>
          </div>

          {selected ? (
            <>
              <div className="master-detail">
                <div>
                  <span className="master-tag">Код: {selected.code}</span>
                  <h3 className="master-detail__title">{selected.name}</h3>
                </div>
                <div className="master-detail__meta">
                  <span>{selected.products} товаров</span>
                  <span>Видимость: {selected.visibility === 'public' ? 'Публичная' : 'Черновик'}</span>
                </div>
              </div>

              <div className="master-section__divider"></div>

              <form
                className="master-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  // подготовка действия добавления подкатегории
                }}
              >
                <div className="master-form__header">
                  <h4>Добавить подкатегорию</h4>
                  <span>К родителю: {selected.name}</span>
                </div>
                <div className="master-form__grid">
                  <label className="master-form__group">
                    <span>Название</span>
                    <input type="text" placeholder="Например, Умные пылесосы"/>
                  </label>
                  <label className="master-form__group">
                    <span>Код</span>
                    <input type="text" placeholder="AUTO_SLUG" />
                  </label>
                  <label className="master-form__group">
                    <span>Тип отображения</span>
                    <select>
                      <option>Плитка</option>
                      <option>Список</option>
                      <option>Двойная сетка</option>
                    </select>
                  </label>
                </div>
                <button type="submit" className="master-topbar__button master-topbar__button--primary">
                  Сохранить подкатегорию
                </button>
              </form>

              <div className="master-section__divider"></div>

              <div>
                <div className="master-form__header">
                  <h4>Атрибуты категории</h4>
                  <span>Топ используемых фильтров по ветке</span>
                </div>
                <div className="master-attributes">
                  {attributes.map(group => (
                    <div key={group.group} className="master-attributes__group">
                      <p className="master-attributes__title">{group.group}</p>
                      <div className="master-attributes__chips">
                        {group.items.map(item => (
                          <span key={item.id} className="master-tag">
                            {item.name} · {item.usage}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="master-empty">
              Выберите категорию слева, чтобы увидеть детали.
            </div>
          )}
        </article>
      </section>

      <section className="master-section">
        <div className="master-section__header">
          <div>
            <h2 className="master-section__title">Быстрое создание каталога</h2>
            <p className="master-section__subtitle">Шаблон для массового импорта категорий и характеристик</p>
          </div>
          <button type="button" className="master-topbar__button master-topbar__button--ghost">
            <SolarIconSet.DownloadMinimalistic svgProps={{width: 18, height: 18}} iconStyle="Bold" color="#212640"/>
            Скачать CSV-шаблон
          </button>
        </div>
        <div className="master-empty">
          Перетащите сюда файл импорта или нажмите, чтобы выбрать. Поддерживаются CSV и XLSX.
        </div>
      </section>
    </div>
  );
};

export default CatalogPage;
