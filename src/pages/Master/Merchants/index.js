import React, {useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import dayjs from 'dayjs';
import get from 'lodash.get';
import * as SolarIconSet from 'solar-icon-set';
import Actions from '../../../redux/actions';

const statusChip = (status = '') => {
  switch ((status || '').toUpperCase()) {
    case 'APPROVED':
      return 'master-chip master-chip--success';
    case 'REJECTED':
      return 'master-chip master-chip--danger';
    case 'PENDING_REVIEW':
    case 'NOT_SUBMITTED':
    default:
      return 'master-chip master-chip--warning';
  }
};

const statusLabel = (status = '') => {
  switch ((status || '').toUpperCase()) {
    case 'APPROVED':
      return 'Одобрен';
    case 'REJECTED':
      return 'Отклонён';
    case 'PENDING_REVIEW':
      return 'На проверке';
    case 'NOT_SUBMITTED':
      return 'Черновик';
    default:
      return status || 'Неизвестно';
  }
};

const businessTypeLabel = (type = '') => {
  const map = {
    LIMITED_LIABILITY_COMPANY: 'Общество с ограниченной ответственностью',
    LIMITED_PARTNERSHIP: 'Товарищество с ограниченной ответственностью',
    SOLE_PROPRIETORSHIP: 'Индивидуальный предприниматель'
  };
  return map[type] || type || '—';
};

const documentTypeLabel = (type = '') => {
  const map = {
    PASSPORT_OF_DIRECTOR: 'Паспорт директора',
    BUSINESS_LICENSE: 'Лицензия на деятельность',
    APPOINTMENT_ORDER_OF_DIRECTOR: 'Приказ о назначении директора'
  };
  return map[type] || type || 'Документ';
};

const formatDate = (value, fallback = '—') => {
  if (!value) return fallback;
  const date = dayjs(value);
  return date.isValid() ? date.format('DD.MM.YYYY HH:mm') : fallback;
};

const formatSize = (bytes) => {
  if (!bytes && bytes !== 0) return '—';
  if (bytes < 1024) return `${bytes} Б`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} КБ`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} МБ`;
  const gb = mb / 1024;
  return `${gb.toFixed(1)} ГБ`;
};

const resolveDocUrl = (doc) => doc?.path || doc?.url || doc?.downloadUrl || '';

const MerchantsPage = () => {
  const dispatch = useDispatch();
  const {merchants, loading} = useSelector(state => state.master);
  const [selectedId, setSelectedId] = useState(null);

  const queue = useMemo(() => Array.isArray(get(merchants, 'queue')) ? merchants.queue : [], [merchants]);
  const summary = get(merchants, 'summary', {});
  const isLoading = get(loading, 'merchants');

  useEffect(() => {
    dispatch(Actions.MASTER_FETCH_MERCHANTS.request());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedId && queue.length) {
      setSelectedId(queue[0].id);
    }
  }, [queue, selectedId]);

  const selectedProfile = useMemo(
    () => queue.find(item => item.id === selectedId) || null,
    [queue, selectedId]
  );

  const merchantInfo = get(selectedProfile, 'merchant', {}) || {};
  const location = get(merchantInfo, 'location', {}) || {};
  const documents = Array.isArray(merchantInfo.documents) ? merchantInfo.documents : [];
  const locationSummary = [location.region, location.district, location.street, location.building].filter(Boolean).join(', ');

  const onDecision = (status) => {
    if (!selectedProfile) return;
    dispatch(Actions.MASTER_UPDATE_MERCHANT_STATUS.request({
      merchantId: selectedProfile.id,
      status,
      reviewer: 'Master Admin'
    }));
  };

  return (
    <div className="master-merchants">
      <section className="master-section">
        <div className="master-section__header">
          <div>
            <h2 className="master-section__title">Очередь мерчантов</h2>
            <p className="master-section__subtitle">Просмотр анкет и документов перед подключением</p>
          </div>
          <span className="master-tag">В ожидании: {summary.pending || 0}</span>
        </div>

        <div className="master-grid master-grid--cols-4">
          {[
            {id: 'total', title: 'Всего мерчантов', value: summary.total || 0},
            {id: 'pending', title: 'На модерации', value: summary.pending || 0},
            {id: 'approved', title: 'Одобрено', value: summary.approved || 0},
            {id: 'rejected', title: 'Отклонено', value: summary.rejected || 0}
          ].map(card => (
            <article className="master-card" key={card.id}>
              <p className="master-card__label">{card.title}</p>
              <p className="master-card__value">{card.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="master-grid master-grid--cols-2">
        <article className="master-section">
          <div className="master-section__header">
            <div>
              <h2 className="master-section__title">Очередь заявок</h2>
              <p className="master-section__subtitle">Выберите профиль для проверки</p>
            </div>
          </div>
          <div className="master-table-wrapper">
            <table className="master-table">
              <thead>
              <tr>
                <th>Мерчант</th>
                <th>Контакты</th>
                <th>Подача</th>
                <th>Статус</th>
              </tr>
              </thead>
              <tbody>
              {queue.length === 0 && (
                <tr>
                  <td colSpan={4} data-label="">
                    <div className="master-empty">Новых заявок нет</div>
                  </td>
                </tr>
              )}
              {queue.map(profileItem => {
                const info = get(profileItem, 'merchant', {});
                const submitted = profileItem.submittedAt || info?.documents?.[0]?.uploadedAt;
                return (
                  <tr
                    key={profileItem.id}
                    className={selectedId === profileItem.id ? 'master-row--active' : ''}
                    onClick={() => setSelectedId(profileItem.id)}
                  >
                    <td data-label="Мерчант">
                      <div className="master-table__primary-text">{info.legalName || '—'}</div>
                      <span className="master-table__secondary-text">Профиль ID: {profileItem.id}</span>
                    </td>
                    <td data-label="Контакты">{info.phoneNumber || '—'}</td>
                    <td data-label="Подача">{formatDate(submitted)}</td>
                    <td data-label="Статус">
                      <span className={statusChip(profileItem.status)}>{statusLabel(profileItem.status)}</span>
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        </article>

        <article className="master-section">
          {selectedProfile ? (
            <>
              <div className="master-section__header">
                <div>
                  <h2 className="master-section__title">Карточка мерчанта</h2>
                  <p className="master-section__subtitle">Проверьте данные перед решением</p>
                </div>
                <span className={statusChip(selectedProfile.status)}>{statusLabel(selectedProfile.status)}</span>
              </div>

              <div className="master-detail">
                <div>
                  <span className="master-tag">Профиль ID: {selectedProfile.id}</span>
                  <h3 className="master-detail__title">{merchantInfo.legalName || '—'}</h3>
                  <p className="master-table__secondary-text">Форма бизнеса: {businessTypeLabel(merchantInfo.type)}</p>
                </div>
                <div className="master-detail__meta">
                  <span>ИНН: {merchantInfo.taxpayerIdentificationNumber || '—'}</span>
                  <span>Телефон: {merchantInfo.phoneNumber || '—'}</span>
                </div>
              </div>

              <div className="master-section__divider"/>

              <div className="master-attributes">
                <div className="master-attributes__group">
                  <p className="master-attributes__title">Локация бизнеса</p>
                  <div className="master-location">
                    <span>{locationSummary || '—'}</span>
                  </div>
                </div>

                <div className="master-attributes__group">
                  <p className="master-attributes__title">Банковские реквизиты</p>
                  <div className="master-attributes__chips">
                    <span className="master-tag">Счёт: {merchantInfo.accountName || '—'}</span>
                    <span className="master-tag">МФО: {merchantInfo.mfoBankCode || '—'}</span>
                    <span className="master-tag">ИФУТ банка: {merchantInfo.ifutBankCode || '—'}</span>
                  </div>
                </div>

                <div className="master-attributes__group">
                  <p className="master-attributes__title">Документы</p>
                  <div className="master-documents">
                    {documents.length === 0 && (
                      <p className="master-table__secondary-text">Документы не загружены</p>
                    )}
                    {documents.map(doc => (
                      <div key={doc.id} className="master-document">
                        <div className="master-document__meta">
                          <span className="master-document__title">{doc.originalFilename || 'Документ'}</span>
                          <span className="master-document__type">{documentTypeLabel(doc.type)}</span>
                          <div className="master-document__info">
                            <span>Размер: {formatSize(doc.sizeBytes)}</span>
                            <span>Загружен: {formatDate(doc.uploadedAt)}</span>
                          </div>
                        </div>
                        <div className="master-document__actions">
                          <Link
                            className="master-actions__button master-actions__button--ghost"
                            to={`/dashboard/merchants/${selectedProfile.id}/document/${doc.id}`}
                          >
                            <SolarIconSet.Eye svgProps={{width: 16, height: 16}} iconStyle="Bold" color="#212640"/>
                            Просмотреть
                          </Link>
                          <a
                            className="master-actions__button master-actions__button--ghost"
                            href={resolveDocUrl(doc)}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <SolarIconSet.DownloadMinimalistic svgProps={{width: 16, height: 16}} iconStyle="Bold" color="#212640"/>
                            Скачать
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="master-attributes__group">
                  <p className="master-attributes__title">Комментарии</p>
                  {selectedProfile.notes && selectedProfile.notes.length ? (
                    <ul className="master-notes">
                      {selectedProfile.notes.map((note, idx) => (
                        <li key={idx}>{note}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="master-table__secondary-text">Замечаний нет</p>
                  )}
                </div>
              </div>

              <div className="master-actions master-actions--horizontal" style={{marginTop: 16}}>
                <button
                  type="button"
                  className="master-actions__button master-actions__button--approve"
                  onClick={() => onDecision('APPROVED')}
                  disabled={(selectedProfile.status || '').toUpperCase() !== 'PENDING_REVIEW'}
                >
                  <SolarIconSet.CheckCircle svgProps={{width: 18, height: 18}} iconStyle="Bold" color="#1C8A64"/>
                  Одобрить мерчанта
                </button>
                <button
                  type="button"
                  className="master-actions__button master-actions__button--reject"
                  onClick={() => onDecision('REJECTED')}
                  disabled={(selectedProfile.status || '').toUpperCase() !== 'PENDING_REVIEW'}
                >
                  <SolarIconSet.CloseCircle svgProps={{width: 18, height: 18}} iconStyle="Bold" color="#C62F5C"/>
                  Отклонить заявку
                </button>
              </div>
            </>
          ) : (
            <div className="master-empty">Выберите заявку в таблице слева, чтобы увидеть детали.</div>
          )}
        </article>
      </section>

      {isLoading && (
        <div className="master-empty">Загружаем очередь мерчантов…</div>
      )}
    </div>
  );
};

export default MerchantsPage;
