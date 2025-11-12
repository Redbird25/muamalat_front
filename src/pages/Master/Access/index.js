import React, {useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import get from 'lodash.get';
import Actions from '../../../redux/actions';
import {toast} from 'react-toastify';
import './index.css';

const AccessPage = () => {
  const dispatch = useDispatch();
  const permissions = useSelector(state => get(state, 'master.permissions.items', []));
  const permissionsLoading = useSelector(state => get(state, 'master.loading.permissions'));
  const permissionMutation = useSelector(state => get(state, 'master.loading.permissionMutation'));
  const grantPermissionLoading = useSelector(state => get(state, 'master.loading.grantPermission'));
  const adminUsersState = useSelector(state => get(state, 'master.adminUsers', {}));
  const adminUsersLoading = useSelector(state => get(state, 'master.loading.adminUsers'));
  const adminUserMutation = useSelector(state => get(state, 'master.loading.adminUserMutation'));

  const [permissionName, setPermissionName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [grantForm, setGrantForm] = useState({permissionId: '', userId: ''});
  const [userSearch, setUserSearch] = useState('');
  const [adminForm, setAdminForm] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    phoneNumber: ''
  });
  const [userPage, setUserPage] = useState(0);
  const [activeTab, setActiveTab] = useState('permissions');

  useEffect(() => {
    dispatch(Actions.MASTER_FETCH_PERMISSIONS.request());
    dispatch(Actions.MASTER_FETCH_ADMIN_USERS.request());
  }, [dispatch]);

  const permissionOptions = useMemo(() => permissions || [], [permissions]);
  const adminUserList = useMemo(() => Array.isArray(get(adminUsersState, 'items')) ? get(adminUsersState, 'items') : [], [adminUsersState]);
  const filteredAdminUsers = useMemo(() => {
    const term = userSearch.trim().toLowerCase();
    if (!term) {
      return adminUserList;
    }
    return adminUserList.filter(user => {
      const fullName = `${get(user, 'firstName', '')} ${get(user, 'lastName', '')}`.toLowerCase();
      const phone = (get(user, 'phoneNumber', '') || '').toLowerCase();
      return fullName.includes(term) || phone.includes(term);
    });
  }, [adminUserList, userSearch]);
  const USERS_PER_PAGE = 6;
  const totalUserPages = Math.max(1, Math.ceil(filteredAdminUsers.length / USERS_PER_PAGE));
  useEffect(() => {
    if (userPage > totalUserPages - 1) {
      setUserPage(Math.max(0, totalUserPages - 1));
    }
  }, [userPage, totalUserPages]);
  const pagedAdminUsers = filteredAdminUsers.slice(
    userPage * USERS_PER_PAGE,
    userPage * USERS_PER_PAGE + USERS_PER_PAGE
  );

  const tabs = useMemo(() => ([
    {
      id: 'permissions',
      title: 'Права доступа',
      description: 'Создание разрешений и выдача прав администраторам'
    },
    {
      id: 'admins',
      title: 'Администраторы',
      description: 'Просмотр и добавление пользователей с ролью ADMIN'
    }
  ]), []);
  const isPermissionsTab = activeTab === 'permissions';
  const isAdminsTab = activeTab === 'admins';

  const handlePermissionSearch = (event) => {
    event.preventDefault();
    dispatch(Actions.MASTER_FETCH_PERMISSIONS.request({query: searchTerm}));
  };

  const handleCreatePermission = (event) => {
    event.preventDefault();
    if (!permissionName.trim()) {
      toast.error('Введите название разрешения');
      return;
    }
    dispatch(Actions.MASTER_CREATE_PERMISSION.request({name: permissionName.trim()}));
    setPermissionName('');
  };

  const handleGrantPermission = (event) => {
    event.preventDefault();
    if (!grantForm.permissionId || !grantForm.userId) {
      toast.error('Выберите разрешение и пользователя');
      return;
    }
    dispatch(Actions.MASTER_GIVE_PERMISSION.request({
      permissionId: grantForm.permissionId,
      userId: grantForm.userId
    }));
    setGrantForm({permissionId: '', userId: ''});
  };

  const handleAdminUserSubmit = (event) => {
    event.preventDefault();
    if (!adminForm.firstName.trim() || !adminForm.lastName.trim() || !adminForm.phoneNumber.trim()) {
      toast.error('Заполните ФИО и номер телефона');
      return;
    }
    dispatch(Actions.MASTER_CREATE_ADMIN_USER.request({
      user: {
        firstName: adminForm.firstName.trim(),
        lastName: adminForm.lastName.trim(),
        middleName: adminForm.middleName.trim() || null,
        phoneNumber: adminForm.phoneNumber.trim()
      }
    }));
    setAdminForm({
      firstName: '',
      lastName: '',
      middleName: '',
      phoneNumber: ''
    });
  };

  return (
    <div className="master-access">
      <div className="master-tabs" role="tablist">
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

      {isPermissionsTab && (
        <section className="master-section">
          <div className="master-section__header">
            <div>
              <h2 className="master-section__title">Права доступа</h2>
              <p className="master-section__subtitle">Управление разрешениями и выдачей ролей.</p>
            </div>
          </div>

          <div className="master-grid master-grid--cols-2">
            <article className="master-table-wrapper">
              <div className="master-form__header">
                <h3>Добавить разрешение</h3>
                <span>Используйте префиксы вроде ADMIN_, SELLER_, PRODUCT_</span>
              </div>
              <form className="master-form" onSubmit={handleCreatePermission}>
                <label className="master-form__group">
                  <span>Название разрешения</span>
                  <input
                    type="text"
                    value={permissionName}
                    onChange={(event) => setPermissionName(event.target.value)}
                    placeholder="Например, ADMIN_CONTROL_SELLERS"
                    required
                  />
                </label>
                <div className="master-actions master-actions--horizontal">
                  <button
                    type="submit"
                    className="master-topbar__button master-topbar__button--primary"
                    disabled={permissionMutation}
                  >
                    {permissionMutation ? 'Создаём…' : 'Создать'}
                  </button>
                  <button
                    type="button"
                    className="master-topbar__button master-topbar__button--ghost"
                    onClick={() => setPermissionName('')}
                  >
                    Очистить
                  </button>
                </div>
              </form>

              <div className="master-section__header">
                <h3 className="master-section__title">Список разрешений</h3>
                <form className="master-search" onSubmit={handlePermissionSearch}>
                  <input
                    type="text"
                    placeholder="Поиск по названию"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />
                  <button type="submit" className="master-topbar__button master-topbar__button--ghost">
                    Найти
                  </button>
                </form>
              </div>
              <table className="master-table">
                <thead>
                <tr>
                  <th>Название</th>
                </tr>
                </thead>
                <tbody>
                {permissionsLoading ? (
                  <tr>
                    <td>
                      <div className="master-empty">Загружаем разрешения…</div>
                    </td>
                  </tr>
                ) : permissionOptions.length === 0 ? (
                  <tr>
                    <td>
                      <div className="master-empty">Разрешений пока нет.</div>
                    </td>
                  </tr>
                ) : (
                  permissionOptions.map(permission => (
                    <tr key={permission.id || permission.name}>
                      <td>{permission.name}</td>
                    </tr>
                  ))
                )}
                </tbody>
              </table>
            </article>

            <article className="master-section">
              <div className="master-form__header">
                <h3>Выдать разрешение пользователю</h3>
                <span>Выберите администратора по имени или номеру</span>
              </div>
              <form className="master-form" onSubmit={handleGrantPermission}>
                <label className="master-form__group">
                  <span>Разрешение</span>
                  <select
                    value={grantForm.permissionId}
                    onChange={(event) => setGrantForm(prev => ({...prev, permissionId: event.target.value}))}
                    required
                  >
                    <option value="">Выберите разрешение</option>
                    {permissionOptions.map(permission => (
                      <option key={permission.id || permission.name} value={permission.id}>
                        {permission.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="master-form__group">
                  <span>Поиск пользователя</span>
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(event) => {
                      setUserSearch(event.target.value);
                      setUserPage(0);
                    }}
                    placeholder="Введите имя или номер телефона"
                  />
                </label>
                <div className="master-card-grid">
                  {pagedAdminUsers.length === 0 && !adminUsersLoading && (
                    <div className="master-empty">Пользователи не найдены</div>
                  )}
                  {pagedAdminUsers.map(user => {
                    const fullName = [get(user, 'firstName', ''), get(user, 'lastName', '')].filter(Boolean).join(' ') || '—';
                    const isActive = grantForm.userId === user.id;
                    return (
                      <button
                        type="button"
                        key={user.id}
                        className={`master-card master-card--user ${isActive ? 'is-active' : ''}`}
                        onClick={() => setGrantForm(prev => ({...prev, userId: user.id}))}
                      >
                        <p className="master-card__title">{fullName}</p>
                        <p className="master-card__meta">{get(user, 'phoneNumber', '—')}</p>
                        <p className="master-card__meta">{get(user, 'role', 'ADMIN')}</p>
                        {Array.isArray(user.permissions) && user.permissions.length ? (
                          <div className="master-card__tags">
                            {user.permissions.slice(0, 2).map(permission => (
                              <span key={permission} className="master-tag master-tag--mini">{permission}</span>
                            ))}
                            {user.permissions.length > 2 && (
                              <span className="master-tag master-tag--mini">+{user.permissions.length - 2}</span>
                            )}
                          </div>
                        ) : (
                          <div className="master-card__meta">Без прав</div>
                        )}
                      </button>
                    );
                  })}
                </div>
                {totalUserPages > 1 && (
                  <div className="master-pagination">
                    <button
                      type="button"
                      className="master-topbar__button master-topbar__button--ghost"
                      onClick={() => setUserPage(prev => Math.max(0, prev - 1))}
                      disabled={userPage === 0}
                    >
                      Назад
                    </button>
                    <span className="master-pagination__status">{userPage + 1} / {totalUserPages}</span>
                    <button
                      type="button"
                      className="master-topbar__button master-topbar__button--ghost"
                      onClick={() => setUserPage(prev => Math.min(totalUserPages - 1, prev + 1))}
                      disabled={userPage >= totalUserPages - 1}
                    >
                      Вперёд
                    </button>
                  </div>
                )}
                <button
                  type="submit"
                  className="master-topbar__button master-topbar__button--primary"
                  disabled={grantPermissionLoading}
                >
                  {grantPermissionLoading ? 'Выдаём…' : 'Выдать разрешение'}
                </button>
              </form>
            </article>
          </div>
        </section>
      )}

      {isAdminsTab && (
        <section className="master-section">
          <div className="master-section__header">
            <div>
              <h2 className="master-section__title">Администраторы платформы</h2>
              <p className="master-section__subtitle">Просмотр и добавление пользователей с ролью ADMIN.</p>
            </div>
          </div>

          <div className="master-grid master-grid--cols-2">
            <article className="master-table-wrapper">
              <table className="master-table">
                <thead>
                <tr>
                  <th>Имя</th>
                  <th>Телефон</th>
                  <th>Роль</th>
                  <th>Права</th>
                </tr>
                </thead>
                <tbody>
                {adminUsersLoading ? (
                  <tr>
                    <td colSpan={4}>
                      <div className="master-empty">Загружаем администраторов…</div>
                    </td>
                  </tr>
                ) : adminUserList.length === 0 ? (
                  <tr>
                    <td colSpan={4}>
                      <div className="master-empty">Администраторов ещё нет.</div>
                    </td>
                  </tr>
                ) : (
                  adminUserList.map(user => (
                    <tr key={user.id || user.phoneNumber}>
                      <td data-label="Имя">
                        {[user.firstName, user.lastName].filter(Boolean).join(' ') || '—'}
                      </td>
                      <td data-label="Телефон">{user.phoneNumber || '—'}</td>
                      <td data-label="Роль">{user.role || '—'}</td>
                      <td data-label="Права">
                        {Array.isArray(user.permissions) && user.permissions.length
                          ? user.permissions.join(', ')
                          : '—'}
                      </td>
                    </tr>
                  ))
                )}
                </tbody>
              </table>
            </article>

            <article className="master-section">
              <div className="master-form__header">
                <h3>Создать администратора</h3>
              </div>
              <form className="master-form" onSubmit={handleAdminUserSubmit}>
                <div className="master-form__grid">
                  <label className="master-form__group">
                    <span>Имя</span>
                    <input
                      type="text"
                      value={adminForm.firstName}
                      onChange={(event) => setAdminForm(prev => ({...prev, firstName: event.target.value}))}
                      required
                    />
                  </label>
                  <label className="master-form__group">
                    <span>Фамилия</span>
                    <input
                      type="text"
                      value={adminForm.lastName}
                      onChange={(event) => setAdminForm(prev => ({...prev, lastName: event.target.value}))}
                      required
                    />
                  </label>
                </div>
                <label className="master-form__group">
                  <span>Отчество</span>
                  <input
                    type="text"
                    value={adminForm.middleName}
                    onChange={(event) => setAdminForm(prev => ({...prev, middleName: event.target.value}))}
                  />
                </label>
                <label className="master-form__group">
                  <span>Телефон</span>
                  <input
                    type="text"
                    value={adminForm.phoneNumber}
                    onChange={(event) => setAdminForm(prev => ({...prev, phoneNumber: event.target.value}))}
                    placeholder="+998XXXXXXXXX"
                    required
                  />
                </label>
                <button
                  type="submit"
                  className="master-topbar__button master-topbar__button--primary"
                  disabled={adminUserMutation}
                >
                  {adminUserMutation ? 'Сохраняем…' : 'Создать администратора'}
                </button>
              </form>
            </article>
          </div>
        </section>
      )}
    </div>
  );
};

export default AccessPage;
