import {all, delay, put, select, takeLatest} from 'redux-saga/effects';
import Actions from '../actions';
import get from 'lodash.get';

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

const catalogMock = {
  lastUpdated: new Date().toISOString(),
  tree: [
    {
      id: 'electronics',
      name: 'Электроника',
      code: 'ELEC',
      products: 1240,
      visibility: 'public',
      children: [
        {id: 'smartphones', name: 'Смартфоны', code: 'ELEC_SM', products: 420, visibility: 'public'},
        {id: 'laptops', name: 'Ноутбуки', code: 'ELEC_LT', products: 180, visibility: 'public'},
        {id: 'audio', name: 'Аудио', code: 'ELEC_AD', products: 210, visibility: 'private'}
      ]
    },
    {
      id: 'home',
      name: 'Дом и интерьер',
      code: 'HOME',
      products: 980,
      visibility: 'public',
      children: [
        {id: 'kitchen', name: 'Кухня', code: 'HOME_KT', products: 320, visibility: 'public'},
        {id: 'decor', name: 'Декор', code: 'HOME_DC', products: 140, visibility: 'private'}
      ]
    },
    {
      id: 'fashion',
      name: 'Мода',
      code: 'FASH',
      products: 1560,
      visibility: 'public',
      children: [
        {id: 'men', name: 'Мужская одежда', code: 'FASH_M', products: 480, visibility: 'public'},
        {id: 'women', name: 'Женская одежда', code: 'FASH_W', products: 560, visibility: 'public'},
        {id: 'footwear', name: 'Обувь', code: 'FASH_F', products: 310, visibility: 'public'}
      ]
    }
  ],
  attributes: [
    {
      group: 'Общие',
      items: [
        {id: 'brand', name: 'Бренд', usage: '78%'},
        {id: 'country', name: 'Страна производства', usage: '65%'},
        {id: 'warranty', name: 'Гарантия', usage: '52%'}
      ]
    },
    {
      group: 'Технические',
      items: [
        {id: 'screen', name: 'Диагональ экрана', usage: '41%'},
        {id: 'battery', name: 'Ёмкость аккумулятора', usage: '38%'},
        {id: 'material', name: 'Материал корпуса', usage: '24%'}
      ]
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

const merchantsMock = {
  summary: {
    total: 312,
    pending: 18,
    approved: 274,
    rejected: 20
  },
  queue: [
    {
      id: 'sp-1001',
      authUserId: 'au-1001',
      status: 'PENDING_REVIEW',
      submittedAt: '2025-10-21T10:30:00Z',
      merchant: {
        id: 'm-5001',
        legalName: 'Fresh Market LLC',
        type: 'LIMITED_LIABILITY_COMPANY',
        taxpayerIdentificationNumber: '305123456',
        ifut: '4789',
        phoneNumber: '+998 90 123 45 67',
        accountName: 'ООО «Fresh Market»',
        mfoBankCode: '01112',
        ifutBankCode: '9988',
        location: {
          region: 'Ташкентская область',
          district: 'Янгиюльский район',
          street: 'ул. Навои',
          building: '12А'
        },
        documents: [
          {
            id: 'doc-1',
            merchantId: 'm-5001',
            originalFilename: 'biz-license.pdf',
            path: '/mock/uploads/biz-license.pdf',
            type: 'BUSINESS_LICENSE',
            sizeBytes: 512000,
            contentType: 'application/pdf',
            uploadedAt: '2025-10-21T08:15:00Z',
            uploadedByUserId: 'au-1001'
          },
          {
            id: 'doc-2',
            merchantId: 'm-5001',
            originalFilename: 'director-passport.jpg',
            type: 'PASSPORT_OF_DIRECTOR',
            sizeBytes: 420000,
            contentType: 'image/jpeg',
            uploadedAt: '2025-10-21T08:20:00Z',
            uploadedByUserId: 'au-1001'
          }
        ]
      },
      notes: ['Ожидает проверку бизнес-лицензии']
    },
    {
      id: 'sp-1002',
      authUserId: 'au-1002',
      status: 'PENDING_REVIEW',
      submittedAt: '2025-10-21T11:05:00Z',
      merchant: {
        id: 'm-5002',
        legalName: 'Healthy Delivery',
        type: 'SOLE_PROPRIETORSHIP',
        taxpayerIdentificationNumber: '305654321',
        ifut: '5120',
        phoneNumber: '+998 93 765 43 21',
        accountName: 'ИП «Healthy Delivery»',
        mfoBankCode: '01015',
        ifutBankCode: '7770',
        location: {
          region: 'г. Ташкент',
          district: 'Мирабадский район',
          street: 'ул. Фидокорлар',
          building: '44B'
        },
        documents: [
          {
            id: 'doc-3',
            merchantId: 'm-5002',
            originalFilename: 'appointment-order.pdf',
            type: 'APPOINTMENT_ORDER_OF_DIRECTOR',
            sizeBytes: 268000,
            contentType: 'application/pdf',
            uploadedAt: '2025-10-21T09:40:00Z',
            uploadedByUserId: 'au-1002'
          }
        ]
      },
      notes: ['Не хватает телефонного номера склада']
    },
    {
      id: 'sp-1003',
      authUserId: 'au-1003',
      status: 'PENDING_REVIEW',
      submittedAt: '2025-10-21T12:40:00Z',
      merchant: {
        id: 'm-5003',
        legalName: 'Gadget Planet',
        type: 'LIMITED_PARTNERSHIP',
        taxpayerIdentificationNumber: '309876543',
        ifut: '6201',
        phoneNumber: '+998 97 777 00 55',
        accountName: 'Gadget Planet LP',
        mfoBankCode: '01021',
        ifutBankCode: '8899',
        location: {
          region: 'Самаркандская область',
          district: 'г. Самарканд',
          street: 'пр. Улугбека',
          building: '7'
        },
        documents: [
          {
            id: 'doc-4',
            merchantId: 'm-5003',
            originalFilename: 'license.pdf',
            type: 'BUSINESS_LICENSE',
            sizeBytes: 830000,
            contentType: 'application/pdf',
            uploadedAt: '2025-10-21T11:45:00Z',
            uploadedByUserId: 'au-1003'
          }
        ]
      },
      notes: []
    }
  ]
};

function* fetchOverview() {
  try {
    yield delay(200);
    yield put(Actions.MASTER_FETCH_OVERVIEW.success(overviewMock));
  } catch (error) {
    yield put(Actions.MASTER_FETCH_OVERVIEW.failure(error));
  }
}

function* fetchCatalog() {
  try {
    yield delay(180);
    yield put(Actions.MASTER_FETCH_CATALOG.success(catalogMock));
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

function* fetchMerchants() {
  try {
    yield delay(200);
    yield put(Actions.MASTER_FETCH_MERCHANTS.success(merchantsMock));
  } catch (error) {
    yield put(Actions.MASTER_FETCH_MERCHANTS.failure(error));
  }
}

function* updateMerchantStatus({payload}) {
  const merchantId = get(payload, 'merchantId');
  const status = get(payload, 'status');
  if (!merchantId || !status) {
    return;
  }
  const merchants = yield select(state => get(state, 'master.merchants.queue', []));
  const merchant = merchants.find(item => get(item, 'id') === merchantId);
  if (!merchant) {
    return;
  }
  const updatedMerchant = {
    ...merchant,
    status,
    reviewer: get(payload, 'reviewer', 'Система'),
    reviewedAt: new Date().toISOString(),
    notes: get(payload, 'notes', merchant.notes)
  };
  yield put(Actions.MASTER_UPDATE_MERCHANT_STATUS.success({merchantId, merchant: updatedMerchant, status}));
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

export default function* MasterSaga() {
  yield all([
    takeLatest(Actions.MASTER_FETCH_OVERVIEW.TRIGGER, fetchOverview),
    takeLatest(Actions.MASTER_FETCH_OVERVIEW.REQUEST, fetchOverview),
    takeLatest(Actions.MASTER_FETCH_CATALOG.REQUEST, fetchCatalog),
    takeLatest(Actions.MASTER_FETCH_PENDING_PRODUCTS.REQUEST, fetchPendingProducts),
    takeLatest(Actions.MASTER_FETCH_MERCHANTS.REQUEST, fetchMerchants),
    takeLatest(Actions.MASTER_APPROVE_PRODUCT.REQUEST, approveProduct),
    takeLatest(Actions.MASTER_UPDATE_PRODUCT_FLAGS.REQUEST, updateProductFlags),
    takeLatest(Actions.MASTER_REMOVE_PRODUCT.REQUEST, removeProduct),
    takeLatest(Actions.MASTER_UPDATE_MERCHANT_STATUS.REQUEST, updateMerchantStatus)
  ]);
}
