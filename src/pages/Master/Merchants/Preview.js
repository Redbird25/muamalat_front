import React, {useEffect, useMemo, useState} from 'react';
import {useParams, useNavigate, Navigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import get from 'lodash.get';
import dayjs from 'dayjs';
import * as SolarIconSet from 'solar-icon-set';
import Actions from '../../../redux/actions';

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

const resolveDocUrl = (doc) => {
  const direct = doc?.downloadUrl || doc?.url || doc?.path || '';
  if (!direct) {
    return '';
  }
  try {
    return decodeURIComponent(direct);
  } catch (error) {
    return direct;
  }
};
const isImage = (doc) => {
  const type = (doc?.contentType || '').toLowerCase();
  const name = (doc?.originalFilename || '').toLowerCase();
  return type.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg)$/.test(name);
};
const isPdf = (doc) => {
  const type = (doc?.contentType || '').toLowerCase();
  const name = (doc?.originalFilename || '').toLowerCase();
  return type === 'application/pdf' || name.endsWith('.pdf');
};

const MerchantsPreviewPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queue = useSelector(state => get(state, 'master.merchants.queue', []));
  const isLoading = useSelector(state => get(state, 'master.loading.merchants'));
  useEffect(() => {
    if (!queue.length) {
      dispatch(Actions.MASTER_FETCH_MERCHANTS.request());
    }
  }, [queue.length, dispatch]);
  const profileId = params.profileId;
  const documentId = params.documentId;

  const profileIndex = useMemo(
    () => queue.findIndex(item => item.id === profileId),
    [queue, profileId]
  );
  const profile = profileIndex >= 0 ? queue[profileIndex] : null;

  const documents = useMemo(() => {
    const docs = get(profile, 'merchant.documents', []);
    return Array.isArray(docs) ? docs : [];
  }, [profile]);

  const [docIndex, setDocIndex] = useState(() => {
    if (!documentId) return 0;
    const idx = documents.findIndex(doc => doc.id === documentId);
    return idx >= 0 ? idx : 0;
  });

  const doc = documents[docIndex] || null;

  if (!profile || !doc) {
    if (!queue.length && isLoading) {
      return (
        <div className="master-preview master-preview--loading">
          <div className="master-empty">Загружаем документы мерчанта…</div>
        </div>
      );
    }
    return <Navigate to="/dashboard/merchants" replace/>;
  }

  const goToDoc = (nextIndex) => {
    if (nextIndex < 0 || nextIndex >= documents.length) return;
    const nextDoc = documents[nextIndex];
    setDocIndex(nextIndex);
    navigate(`/dashboard/merchants/${profile.id}/document/${nextDoc.id}`, {replace: true});
  };

  const goToProfile = (offset) => {
    const nextProfile = queue[profileIndex + offset];
    if (!nextProfile) return;
    const firstDoc = get(nextProfile, 'merchant.documents', [])[0];
    if (!firstDoc) return;
    navigate(`/dashboard/merchants/${nextProfile.id}/document/${firstDoc.id}`);
  };

  return (
    <div className="master-preview">
      <header className="master-preview__topbar">
        <button className="master-preview__back" type="button" onClick={() => navigate('/dashboard/merchants')}>
          <SolarIconSet.ArrowLeft svgProps={{width: 18, height: 18}} iconStyle="Bold" color="#212640"/>
          <span>Назад к профилю</span>
        </button>
        <div className="master-preview__meta">
          <h1 className="master-preview__title">{doc.originalFilename || 'Документ'}</h1>
          <p className="master-preview__subtitle">
            {documentTypeLabel(doc.type)} · {formatSize(doc.sizeBytes)} · {formatDate(doc.uploadedAt)}
          </p>
        </div>
        <div className="master-preview__actions">
          <button
            type="button"
            className="master-topbar__button master-topbar__button--ghost"
            onClick={() => goToDoc(docIndex - 1)}
            disabled={docIndex === 0}
          >
            <SolarIconSet.ArrowLeft svgProps={{width: 18, height: 18}} iconStyle="Bold" color="#212640"/>
            Предыдущий документ
          </button>
          <button
            type="button"
            className="master-topbar__button master-topbar__button--ghost"
            onClick={() => goToDoc(docIndex + 1)}
            disabled={docIndex >= documents.length - 1}
          >
            Следующий документ
            <SolarIconSet.ArrowRight svgProps={{width: 18, height: 18}} iconStyle="Bold" color="#212640"/>
          </button>
          <a
            href={resolveDocUrl(doc)}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="master-topbar__button master-topbar__button--primary"
          >
            <SolarIconSet.DownloadMinimalistic svgProps={{width: 18, height: 18}} iconStyle="Bold" color="#212640"/>
            Скачать
          </a>
        </div>
      </header>

      <main className="master-preview__body">
        {(() => {
          const src = resolveDocUrl(doc);
          if (!src) {
            return <div className="master-empty">Файл недоступен для просмотра</div>;
          }
          if (isImage(doc)) {
            return <img src={src} alt={doc.originalFilename || 'Документ'} className="master-preview__image"/>;
          }
          if (isPdf(doc)) {
            return <iframe src={src} title={doc.originalFilename || 'Документ'} className="master-preview__iframe"/>;
          }
          return (
            <div className="master-empty">
              Не удаётся отобразить файл. Скачайте документ для просмотра.
            </div>
          );
        })()}
      </main>

      <footer className="master-preview__footer">
        <button
          type="button"
          className="master-topbar__button master-topbar__button--ghost"
          onClick={() => goToProfile(-1)}
          disabled={profileIndex <= 0}
        >
          <SolarIconSet.ArrowLeft svgProps={{width: 18, height: 18}} iconStyle="Bold" color="#212640"/>
          Предыдущий мерчант
        </button>
        <button
          type="button"
          className="master-topbar__button master-topbar__button--ghost"
          onClick={() => goToProfile(1)}
          disabled={profileIndex >= queue.length - 1}
        >
          Следующий мерчант
          <SolarIconSet.ArrowRight svgProps={{width: 18, height: 18}} iconStyle="Bold" color="#212640"/>
        </button>
      </footer>
    </div>
  );
};

export default MerchantsPreviewPage;
