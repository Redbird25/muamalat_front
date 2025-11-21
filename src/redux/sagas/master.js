import {all, call, delay, put, select, takeLatest} from 'redux-saga/effects';
import Actions from '../actions';
import get from 'lodash.get';
import {api} from 'services';
import {toast} from 'react-toastify';

const overviewMock = {
  cards: [
    {id: 'gmv', title: 'Оборот платформы', value: '₽4.5 млрд', delta: '+12% к прошлому месяцу', trend: 'up'},
    {id: 'sellers', title: 'Активные продавцы', value: '1 248', delta: '+84 новых', trend: 'up'},
    {id: 'approvals', title: 'Ожидают модерации', value: '57 товаров', delta: '−18 за 24 часа', trend: 'down'},
    {id: 'complaints', title: 'Жалобы клиентов', value: '32 обращения', delta: '+5 срочно', trend: 'warning'}
  ],
  performance: {
    labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт'],
    revenue: [220, 245, 280, 310, 340, 360, 395, 420, 460, 505],
    orders: [92, 105, 118, 128, 140, 150, 165, 172, 183, 195]
  },
  topCategories: [
    {id: 'electronics', name: 'Электроника', share: '24%', conversion: '5.6%', trend: '+1.2%'},
    {id: 'home', name: 'Дом и интерьер', share: '18%', conversion: '4.3%', trend: '+0.6%'},
    {id: 'beauty', name: 'Красота', share: '13%', conversion: '6.1%', trend: '−0.4%'},
    {id: 'kids', name: 'Дети', share: '9%', conversion: '3.8%', trend: '+0.3%'}
  ],
  alerts: [
    {id: 'docs', title: 'Документы', message: '8 продавцов не обновили лицензии', severity: 'warning'},
    {id: 'hot', title: 'Горящие товары', message: '11 позиций заканчиваются менее чем через 48 часов', severity: 'info'}
  ],
  featuredProducts: [
    {
      id: 'prd-1001',
      name: 'Samsung Galaxy S24 Ultra 512GB',
      category: 'Смартфоны',
      seller: 'TechnoStar LLC',
      price: 12999000,
      stock: 245,
      status: 'active',
      discount: {type: 'percentage', value: 10, until: '2025-11-01'},
      flags: {bestseller: true, hot: false, new: true, sale: false}
    },
    {
      id: 'prd-1002',
      name: 'Bosch Serie 6 Посудомоечная машина',
      category: 'Бытовая техника',
      seller: 'KitchenPro',
      price: 7899000,
      stock: 64,
      status: 'active',
      discount: {type: 'flat', value: 800000, until: '2025-10-31'},
      flags: {bestseller: false, hot: true, new: false, sale: true}
    },
    {
      id: 'prd-1003',
      name: 'Nike Air Zoom Alphafly 3',
      category: 'Одежда и спорт',
      seller: 'SportLab',
      price: 2899000,
      stock: 418,
      status: 'active',
      discount: null,
      flags: {bestseller: true, hot: true, new: false, sale: false}
    }
  ]
};

const pendingProductsMock = [
  {
    id: 'pn-2001',
    name: 'Xiaomi Robot Vacuum S20',
    seller: 'CleanHome',
    category: 'Бытовая техника',
    price: 5499000,
    submittedAt: '2025-10-22T07:45:00Z',
    issues: ['Проверить сертификат соответствия'],
    flags: {bestseller: false, hot: false, new: true, sale: true}
  },
  {
    id: 'pn-2002',
    name: 'Apple Watch Series 10 Titanium',
    seller: 'GadgetStore',
    category: 'Смарт-часы',
    price: 7699000,
    submittedAt: '2025-10-22T08:10:00Z',
    issues: ['Требуется подтверждение RMA центра', 'Отсутствует таблица размеров ремешка'],
    flags: {bestseller: true, hot: true, new: true, sale: false}
  },
  {
    id: 'pn-2003',
    name: 'Hugo Boss Signature Suit',
    seller: 'FashionRoom',
    category: 'Мужская одежда',
    price: 3399000,
    submittedAt: '2025-10-22T09:05:00Z',
    issues: [],
    flags: {bestseller: false, hot: false, new: false, sale: true}
  }
];

const extractPage = (response) => get(response, 'data', response) || {};

const extractTotalElements = (response) => get(extractPage(response), 'totalElements', 0);

const normalizeSellerProfiles = (items = []) =>
  items.map(item => {
    const sellerProfile = get(item, 'sellerProfile', {}) || {};
    const merchant = get(sellerProfile, 'merchant', {}) || {};
    const documents = Array.isArray(merchant.documents)
      ? merchant.documents.map(doc => ({
        ...doc,
        downloadUrl: api.master.getMerchantDocumentUrl(doc.id)
      }))
      : [];
    const normalizedMerchant = {
      ...merchant,
      documents
    };
    return {
      id: sellerProfile.id || get(item, 'id'),
      sellerProfileId: sellerProfile.id || get(item, 'id'),
      status: sellerProfile.status || item.status,
      merchant: normalizedMerchant,
      sellerProfile: {
        ...sellerProfile,
        merchant: normalizedMerchant
      },
      applicant: {
        firstName: item.firstName,
        lastName: item.lastName,
        middleName: item.middleName,
        phoneNumber: item.phoneNumber
      },
      submittedAt: documents.length ? documents[0].uploadedAt : null,
      notes: []
    };
  });

function* fetchOverview() {
  try {
    yield delay(200);
    yield put(Actions.MASTER_FETCH_OVERVIEW.success(overviewMock));
  } catch (error) {
    yield put(Actions.MASTER_FETCH_OVERVIEW.failure(error));
  }
}

function* fetchCatalog({payload}) {
  try {
    const token = yield select(state => get(state, 'auth.token'));
    const response = yield call(api.master.fetchCatalogs, {accessToken: token});
    const catalogs = extractPage(response) || [];
    const items = (Array.isArray(catalogs) ? catalogs : get(catalogs, 'data', []))
      .map(item => ({
        id: get(item, 'id'),
        nameUz: get(item, 'nameUz'),
        nameEn: get(item, 'nameEn'),
        nameRu: get(item, 'nameRu'),
        published: !!get(item, 'published'),
        createdAt: get(item, 'createdAt'),
        updatedAt: get(item, 'updatedAt')
      }));
    yield put(Actions.MASTER_FETCH_CATALOG.success({
      items,
      lastUpdated: new Date().toISOString()
    }));
  } catch (error) {
    yield put(Actions.MASTER_FETCH_CATALOG.failure(error));
  }
}

function* fetchPendingProducts() {
  try {
    yield delay(150);
    yield put(Actions.MASTER_FETCH_PENDING_PRODUCTS.success({items: pendingProductsMock}));
  } catch (error) {
    yield put(Actions.MASTER_FETCH_PENDING_PRODUCTS.failure(error));
  }
}

function* fetchCategories({payload}) {
  try {
    const token = yield select(state => get(state, 'auth.token'));
    const query = get(payload, 'query', '').trim();
    if (query) {
      const response = yield call(api.master.searchCategories, {
        accessToken: token,
        name: query
      });
      yield put(Actions.MASTER_FETCH_CATEGORIES.success({
        items: get(response, 'data', response) || [],
        page: 0,
        size: 50,
        total: get(response, 'data.length', 0)
      }));
      return;
    }
    const page = get(payload, 'page', 0);
    const size = get(payload, 'size', 50);
    const response = yield call(api.master.fetchCategories, {
      accessToken: token,
      page,
      size
    });
    const pageData = extractPage(response);
    yield put(Actions.MASTER_FETCH_CATEGORIES.success({
      items: get(pageData, 'content', []),
      page: get(pageData, 'number', page),
      size: get(pageData, 'size', size),
      total: get(pageData, 'totalElements', 0)
    }));
  } catch (error) {
    yield put(Actions.MASTER_FETCH_CATEGORIES.failure(error));
  }
}

function* createCategory({payload}) {
  try {
    const token = yield select(state => get(state, 'auth.token'));
    yield call(api.master.createCategory, {
      accessToken: token,
      payload: get(payload, 'category')
    });
    yield put(Actions.MASTER_CREATE_CATEGORY.success());
    yield put(Actions.MASTER_FETCH_CATEGORIES.request());
    toast.success('Категория создана');
  } catch (error) {
    yield put(Actions.MASTER_CREATE_CATEGORY.failure(error));
    toast.error(get(error, 'response.data.message') || 'Не удалось создать категорию');
  }
}

function* fetchMerchants() {
  try {
    const token = yield select(state => get(state, 'auth.token'));
    const pendingResponse = yield call(api.master.fetchSellerProfiles, {
      accessToken: token,
      status: 'PENDING_REVIEW',
      page: 0,
      size: 50
    });
    const pendingPage = extractPage(pendingResponse);
    const queue = normalizeSellerProfiles(get(pendingPage, 'content', []));
    const [approvedResponse, rejectedResponse, draftsResponse] = yield all([
      call(api.master.fetchSellerProfiles, {
        accessToken: token,
        status: 'APPROVED',
        page: 0,
        size: 1
      }),
      call(api.master.fetchSellerProfiles, {
        accessToken: token,
        status: 'REJECTED',
        page: 0,
        size: 1
      }),
      call(api.master.fetchSellerProfiles, {
        accessToken: token,
        status: 'NOT_SUBMITTED',
        page: 0,
        size: 1
      })
    ]);
    const summary = {
      pending: extractTotalElements(pendingResponse),
      approved: extractTotalElements(approvedResponse),
      rejected: extractTotalElements(rejectedResponse),
      drafts: extractTotalElements(draftsResponse)
    };
    summary.total = summary.pending + summary.approved + summary.rejected + summary.drafts;
    yield put(Actions.MASTER_FETCH_MERCHANTS.success({queue, summary}));
  } catch (error) {
    yield put(Actions.MASTER_FETCH_MERCHANTS.failure(error));
  }
}

function* updateMerchantStatus({payload}) {
  try {
    const token = yield select(state => get(state, 'auth.token'));
    const sellerProfileId = get(payload, 'sellerProfileId') || get(payload, 'merchantId');
    const decision = (get(payload, 'decision') || '').toUpperCase();
    if (!sellerProfileId || !decision) {
      return;
    }
    yield call(api.master.confirmOrRejectSeller, {
      accessToken: token,
      sellerProfileId,
      decision
    });
    yield put(Actions.MASTER_UPDATE_MERCHANT_STATUS.success({sellerProfileId, decision}));
    yield put(Actions.MASTER_FETCH_MERCHANTS.request());
  } catch (error) {
    yield put(Actions.MASTER_UPDATE_MERCHANT_STATUS.failure(error));
    const message = get(error, 'response.data.message') || 'Не удалось применить решение. Попробуйте снова.';
    toast.error(message);
  }
}

function* fetchPermissionsSaga({payload}) {
  try {
    const token = yield select(state => get(state, 'auth.token'));
    const query = (get(payload, 'query') || '').trim();
    let response;
    if (query) {
      response = yield call(api.master.searchPermissions, {accessToken: token, name: query});
      yield put(Actions.MASTER_FETCH_PERMISSIONS.success({items: get(response, 'data', response) || []}));
    } else {
      response = yield call(api.master.fetchPermissions, {accessToken: token});
      yield put(Actions.MASTER_FETCH_PERMISSIONS.success({items: get(response, 'data', response) || []}));
    }
  } catch (error) {
    yield put(Actions.MASTER_FETCH_PERMISSIONS.failure(error));
  }
}

function* createPermissionSaga({payload}) {
  try {
    const token = yield select(state => get(state, 'auth.token'));
    yield call(api.master.createPermission, {
      accessToken: token,
      name: get(payload, 'name')
    });
    yield put(Actions.MASTER_CREATE_PERMISSION.success());
    yield put(Actions.MASTER_FETCH_PERMISSIONS.request());
    toast.success('Разрешение создано');
  } catch (error) {
    yield put(Actions.MASTER_CREATE_PERMISSION.failure(error));
    toast.error(get(error, 'response.data.message') || 'Не удалось создать разрешение');
  }
}

function* givePermissionSaga({payload}) {
  try {
    const token = yield select(state => get(state, 'auth.token'));
    yield call(api.master.givePermissionToUser, {
      accessToken: token,
      permissionId: get(payload, 'permissionId'),
      userId: get(payload, 'userId')
    });
    yield put(Actions.MASTER_GIVE_PERMISSION.success());
    toast.success('Право успешно выдано');
  } catch (error) {
    yield put(Actions.MASTER_GIVE_PERMISSION.failure(error));
    toast.error(get(error, 'response.data.message') || 'Не удалось выдать право');
  }
}

function* fetchAdminUsers({payload}) {
  try {
    const token = yield select(state => get(state, 'auth.token'));
    const page = get(payload, 'page', 0);
    const size = get(payload, 'size', 20);
    const response = yield call(api.master.fetchUsers, {
      accessToken: token,
      page,
      size
    });
    const pageData = extractPage(response);
    yield put(Actions.MASTER_FETCH_ADMIN_USERS.success({
      items: get(pageData, 'content', []),
      page: get(pageData, 'number', page),
      size: get(pageData, 'size', size),
      total: get(pageData, 'totalElements', 0)
    }));
  } catch (error) {
    yield put(Actions.MASTER_FETCH_ADMIN_USERS.failure(error));
  }
}

function* createAdminUser({payload}) {
  try {
    const token = yield select(state => get(state, 'auth.token'));
    yield call(api.master.createAdminUser, {
      accessToken: token,
      payload: get(payload, 'user')
    });
    yield put(Actions.MASTER_CREATE_ADMIN_USER.success());
    yield put(Actions.MASTER_FETCH_ADMIN_USERS.request());
    toast.success('Администратор создан');
  } catch (error) {
    yield put(Actions.MASTER_CREATE_ADMIN_USER.failure(error));
    toast.error(get(error, 'response.data.message') || 'Не удалось создать администратора');
  }
}
function* createCatalog({payload}) {
  try {
    const token = yield select(state => get(state, 'auth.token'));
    yield call(api.master.createCatalog, {
      accessToken: token,
      payload: get(payload, 'catalog')
    });
    yield put(Actions.MASTER_CREATE_CATALOG.success());
    yield put(Actions.MASTER_FETCH_CATALOG.request());
  } catch (error) {
    yield put(Actions.MASTER_CREATE_CATALOG.failure(error));
  }
}

function* updateCatalog({payload}) {
  try {
    const token = yield select(state => get(state, 'auth.token'));
    yield call(api.master.updateCatalog, {
      accessToken: token,
      payload: get(payload, 'catalog')
    });
    yield put(Actions.MASTER_UPDATE_CATALOG.success());
    yield put(Actions.MASTER_FETCH_CATALOG.request());
  } catch (error) {
    yield put(Actions.MASTER_UPDATE_CATALOG.failure(error));
  }
}

function* fetchCharacteristics({payload}) {
  try {
    const token = yield select(state => get(state, 'auth.token'));
    const query = (get(payload, 'query') || '').trim();
    if (query) {
      const response = yield call(api.master.searchCharacteristics, {
        accessToken: token,
        query
      });
      const data = get(response, 'data', response) || [];
      const items = (Array.isArray(data) ? data : []).map(item => ({
        id: get(item, 'id'),
        nameUz: get(item, 'nameUz'),
        nameEn: get(item, 'nameEn'),
        nameRu: get(item, 'nameRu'),
        options: Array.isArray(item.options) ? item.options : []
      }));
      yield put(Actions.MASTER_FETCH_CHARACTERISTICS.success({
        items,
        page: 0,
        size: items.length,
        total: items.length
      }));
      return;
    }
    const page = get(payload, 'page', 0);
    const size = get(payload, 'size', 20);
    const response = yield call(api.master.fetchCharacteristics, {
      accessToken: token,
      page,
      size
    });
    const pageData = extractPage(response);
    const items = (get(pageData, 'content') || []).map(item => ({
      id: get(item, 'id'),
      nameUz: get(item, 'nameUz'),
      nameEn: get(item, 'nameEn'),
      nameRu: get(item, 'nameRu'),
      options: Array.isArray(item.options) ? item.options : []
    }));
    yield put(Actions.MASTER_FETCH_CHARACTERISTICS.success({
      items,
      page: get(pageData, 'number', page),
      size: get(pageData, 'size', size),
      total: get(pageData, 'totalElements', items.length)
    }));
  } catch (error) {
    yield put(Actions.MASTER_FETCH_CHARACTERISTICS.failure(error));
  }
}

function* createCharacteristic({payload}) {
  try {
    const token = yield select(state => get(state, 'auth.token'));
    yield call(api.master.createCharacteristic, {
      accessToken: token,
      payload: get(payload, 'characteristic')
    });
    yield put(Actions.MASTER_CREATE_CHARACTERISTIC.success());
    yield put(Actions.MASTER_FETCH_CHARACTERISTICS.request());
    toast.success('Характеристика сохранена');
  } catch (error) {
    yield put(Actions.MASTER_CREATE_CHARACTERISTIC.failure(error));
    toast.error(get(error, 'response.data.message') || 'Не удалось сохранить характеристику');
  }
}

function* fetchSubCategories({payload}) {
  try {
    const token = yield select(state => get(state, 'auth.token'));
    const query = (get(payload, 'query') || '').trim();
    if (query) {
      const response = yield call(api.master.searchSubCategories, {
        accessToken: token,
        name: query
      });
      const items = get(response, 'data', response) || [];
      yield put(Actions.MASTER_FETCH_SUBCATEGORIES.success({
        items,
        page: 0,
        size: items.length,
        total: items.length
      }));
      return;
    }
    const page = get(payload, 'page', 0);
    const size = get(payload, 'size', 50);
    const response = yield call(api.master.fetchSubCategories, {
      accessToken: token,
      page,
      size
    });
    const pageData = extractPage(response);
    yield put(Actions.MASTER_FETCH_SUBCATEGORIES.success({
      items: get(pageData, 'content', []),
      page: get(pageData, 'number', page),
      size: get(pageData, 'size', size),
      total: get(pageData, 'totalElements', 0)
    }));
  } catch (error) {
    yield put(Actions.MASTER_FETCH_SUBCATEGORIES.failure(error));
  }
}

function* createSubCategory({payload}) {
  try {
    const token = yield select(state => get(state, 'auth.token'));
    yield call(api.master.createSubCategory, {
      accessToken: token,
      payload: get(payload, 'subCategory')
    });
    yield put(Actions.MASTER_CREATE_SUBCATEGORY.success());
    yield put(Actions.MASTER_FETCH_SUBCATEGORIES.request());
    toast.success('Подкатегория создана');
  } catch (error) {
    yield put(Actions.MASTER_CREATE_SUBCATEGORY.failure(error));
    toast.error(get(error, 'response.data.message') || 'Не удалось создать подкатегорию');
  }
}

function* approveProduct({payload}) {
  const productId = get(payload, 'productId');
  if (!productId) {
    return;
  }
  const pending = yield select(state => get(state, 'master.pendingProducts', []));
  const product = pending.find(item => get(item, 'id') === productId);
  if (!product) {
    return;
  }
  const enrichedProduct = {
    ...product,
    status: 'active',
    approvedAt: new Date().toISOString()
  };
  yield put(Actions.MASTER_APPROVE_PRODUCT.success({productId, product: enrichedProduct}));
}

function* updateProductFlags({payload}) {
  const productId = get(payload, 'productId');
  const flags = get(payload, 'flags', {});
  if (!productId) {
    return;
  }
  yield put(Actions.MASTER_UPDATE_PRODUCT_FLAGS.success({productId, flags}));
}

function* removeProduct({payload}) {
  const productId = get(payload, 'productId');
  if (!productId) {
    return;
  }
  yield put(Actions.MASTER_REMOVE_PRODUCT.success({productId}));
}

function* fetchProductBadges() {
  try {
    const token = yield select(state => get(state, 'auth.token'));
    const response = yield call(api.productBadges.fetchAll, {accessToken: token});
    const items = get(response, 'data', response) || [];
    yield put(Actions.MASTER_FETCH_PRODUCT_BADGES.success({items}));
  } catch (error) {
    yield put(Actions.MASTER_FETCH_PRODUCT_BADGES.failure(error));
  }
}

function* createProductBadge({payload}) {
  try {
    const token = yield select(state => get(state, 'auth.token'));
    const badgePayload = get(payload, 'badge', payload);
    const response = yield call(api.productBadges.create, {
      accessToken: token,
      payload: badgePayload
    });
    const item = get(response, 'data', response);
    yield put(Actions.MASTER_CREATE_PRODUCT_BADGE.success({item}));
    yield put(Actions.MASTER_FETCH_PRODUCT_BADGES.request());
    toast.success('Product badge created');
  } catch (error) {
    yield put(Actions.MASTER_CREATE_PRODUCT_BADGE.failure(error));
    const status = get(error, 'response.status');
    const msg = get(error, 'response.data.message');
    if (status === 403) {
      toast.error('You need ADMIN role with ALL_PERMISSIONS or ADMIN_GENERAL_ACTIONS to create badges.');
    } else {
      toast.error(msg || 'Failed to create product badge');
    }
  }
}

export default function* MasterSaga() {
  yield all([
    takeLatest(Actions.MASTER_FETCH_OVERVIEW.TRIGGER, fetchOverview),
    takeLatest(Actions.MASTER_FETCH_OVERVIEW.REQUEST, fetchOverview),
    takeLatest(Actions.MASTER_FETCH_CATALOG.REQUEST, fetchCatalog),
    takeLatest(Actions.MASTER_CREATE_CATALOG.REQUEST, createCatalog),
    takeLatest(Actions.MASTER_UPDATE_CATALOG.REQUEST, updateCatalog),
    takeLatest(Actions.MASTER_FETCH_CATEGORIES.REQUEST, fetchCategories),
    takeLatest(Actions.MASTER_CREATE_CATEGORY.REQUEST, createCategory),
    takeLatest(Actions.MASTER_FETCH_PENDING_PRODUCTS.REQUEST, fetchPendingProducts),
    takeLatest(Actions.MASTER_FETCH_MERCHANTS.REQUEST, fetchMerchants),
    takeLatest(Actions.MASTER_APPROVE_PRODUCT.REQUEST, approveProduct),
    takeLatest(Actions.MASTER_UPDATE_PRODUCT_FLAGS.REQUEST, updateProductFlags),
    takeLatest(Actions.MASTER_REMOVE_PRODUCT.REQUEST, removeProduct),
    takeLatest(Actions.MASTER_UPDATE_MERCHANT_STATUS.REQUEST, updateMerchantStatus),
    takeLatest(Actions.MASTER_FETCH_CHARACTERISTICS.REQUEST, fetchCharacteristics),
    takeLatest(Actions.MASTER_CREATE_CHARACTERISTIC.REQUEST, createCharacteristic),
    takeLatest(Actions.MASTER_FETCH_SUBCATEGORIES.REQUEST, fetchSubCategories),
    takeLatest(Actions.MASTER_CREATE_SUBCATEGORY.REQUEST, createSubCategory),
    takeLatest(Actions.MASTER_FETCH_PERMISSIONS.REQUEST, fetchPermissionsSaga),
    takeLatest(Actions.MASTER_CREATE_PERMISSION.REQUEST, createPermissionSaga),
    takeLatest(Actions.MASTER_GIVE_PERMISSION.REQUEST, givePermissionSaga),
    takeLatest(Actions.MASTER_FETCH_ADMIN_USERS.REQUEST, fetchAdminUsers),
    takeLatest(Actions.MASTER_CREATE_ADMIN_USER.REQUEST, createAdminUser),
    takeLatest(Actions.MASTER_FETCH_PRODUCT_BADGES.REQUEST, fetchProductBadges),
    takeLatest(Actions.MASTER_CREATE_PRODUCT_BADGE.REQUEST, createProductBadge)
  ]);
}
