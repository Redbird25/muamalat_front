import axios from 'axios';
import buildUrl from 'build-url';
import config from 'config';
import get from 'lodash.get';
import qs from 'qs';
import storage from '../storage';
import session from '../session';

const request = axios.create({
  baseURL: config.API_ROOT || '',
  headers: {
    common: {
      "Accept": "application/json",
      "Cache-Control": "no-cache",
      "Authorization": `Bearer ${session.get('token')}`,
      "Content-Type": "application/json",
      "X-Localization": storage.get("language") ? storage.get("language") : 'oz'
    },
  }
});
request.defaults.headers.common["Cache-Control"] = "no-cache";

const PRODUCT_ENDPOINT_PREFIXES = [
  '/products',
  '/product/',
  '/products-types',
  '/seller/products',
  '/seller/product-delete'
];

const isProductsEndpoint = (path = '') =>
  typeof path === 'string' && PRODUCT_ENDPOINT_PREFIXES.some(prefix => path.startsWith(prefix));

const queryBuilder = (
  url = '',
  {
    limit,
    q = '',
    page,
    perPage,
    filter = {},
    search = {},
    search_extra = {},
    extra = {}
  } = {}
) => {
  
  let query = {};
  
  if (get(config, "API_KEY")) {
    query['key'] = get(config, "API_KEY")
  }
  
  if (limit > 0) {
    query['maxResults'] = limit;
  }
  if (perPage > 0) {
    query['per_page'] = perPage;
  }
  if (q) {
    query['q'] = q
  }
  
  if (page > 0) {
    query['page'] = page;
  }
  
  if (Object.keys(filter).length) {
    Object.keys(filter).forEach(item => {
      const normalized = qs.stringify({filter: {[item]: filter[item]}}, {encode: false}).split("&");
      normalized.forEach(item => {
        const splited = item.split("=");
        if (splited.length === 2 && splited[0] && splited[1]) {
          query[splited[0]] = splited[1];
        }
      });
    });
  }
  
  if (Object.keys(search).length || Object.keys(search_extra).length) {
    const NORMALIZED = Object.keys(search).map(item => {
      return qs.stringify({search: {[item]: search[item]}}, {encode: false}).split("&");
    }).flat(1);
    const EXTRA_NORMALIZED = Object.keys(search_extra).map(extra => {
      return qs.stringify({[extra]: search_extra[extra]}, {encode: false}).split("&");
    }).flat(1);
    const ALL_NORMALIZED = [...NORMALIZED, ...EXTRA_NORMALIZED]
    
    ALL_NORMALIZED.forEach(item => {
      const splited = item.split("=");
      if (splited.length === 2 && splited[0] && splited[1]) {
        query[splited[0]] = splited[1];
      }
    });
  }
  
  if (Object.keys(extra).length) {
    Object.keys(extra).forEach(key => {
      if (key && extra[key]) {
        query[key] = extra[key]
      }
    })
  }

  const builtPath = buildUrl({
    path: url,
    queryParams: query
  });

  if (isProductsEndpoint(url) && config.PRODUCTS_API_ROOT) {
    const base = config.PRODUCTS_API_ROOT.endsWith("/")
      ? config.PRODUCTS_API_ROOT.slice(0, -1)
      : config.PRODUCTS_API_ROOT;
    const normalizedPath = builtPath.startsWith("/")
      ? builtPath
      : `/${builtPath}`;
    return `${base}${normalizedPath}`;
  }

  return builtPath;
};


const subscribe = store => {
  let token = session.get("token");
  
  let state = store.getState();
  
  if (state.auth.token) {
    token = get(state, "auth.token");
  }
  if (token) {
    request.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    request.defaults.headers.common["Cache-Control"] = "no-cache";
  }
};

const customerAuthRequest = axios.create({
  baseURL: config.API_ROOT || '',
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json"
  }
});

// Add response interceptor to handle CORS
customerAuthRequest.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ERR_NETWORK') {
      console.error('CORS or network error. Make sure the backend server is running and has CORS enabled.');
    }
    return Promise.reject(error);
  }
);

const customerAuthUrl = {
  startBuyer: '/api/v1/auth/otp/start',
  startSeller: '/api/v1/auth/otp/start-seller',
  verifyBuyer: '/api/v1/auth/otp/verify',
  verifySeller: '/api/v1/auth/otp/verify-seller',
  resend: '/api/v1/auth/otp/resend',
  refresh: '/api/v1/auth/refresh',
  logout: '/api/v1/auth/logout',
  fillProfile: '/api/v1/auth/fill-profile'
};

const customerAuth = {
  start: ({phoneNumber} = {}) => customerAuthRequest.post(customerAuthUrl.startBuyer, null, {
    params: {phoneNumber}
  }),
  startBuyer: ({phoneNumber} = {}) => customerAuthRequest.post(customerAuthUrl.startBuyer, null, {
    params: {phoneNumber}
  }),
  startSeller: ({phoneNumber} = {}) => customerAuthRequest.post(customerAuthUrl.startSeller, null, {
    params: {phoneNumber}
  }),
  startAdmin: ({phoneNumber} = {}) => customerAuthRequest.post('/api/v1/auth/otp/start-admin', null, {
    params: {phoneNumber}
  }),
  verify: (data) => customerAuthRequest.post(customerAuthUrl.verifyBuyer, data),
  verifyBuyer: (data) => customerAuthRequest.post(customerAuthUrl.verifyBuyer, data),
  verifySeller: (data) => customerAuthRequest.post(customerAuthUrl.verifySeller, data),
  verifyAdmin: (data) => customerAuthRequest.post('/api/v1/auth/otp/verify-admin', data),
  resend: ({txId} = {}) => customerAuthRequest.post(customerAuthUrl.resend, null, {
    params: {txId}
  }),
  refresh: (data) => customerAuthRequest.post(customerAuthUrl.refresh, data),
  logout: (data) => customerAuthRequest.post(customerAuthUrl.logout, data),
  fillProfile: ({accessToken, profile} = {}) => {
    const headers = {};
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
    return request.put(customerAuthUrl.fillProfile, profile || {}, {headers});
  },
  userInfo: ({accessToken} = {}) =>
    request.get('/api/v1/auth/userinfo', {
      headers: authHeader(accessToken)
    })
};

const authHeader = (accessToken) => {
  if (!accessToken) {
    return {};
  }
  return {Authorization: `Bearer ${accessToken}`};
};

const buildApiUrl = (path = '') => {
  const base = config.API_ROOT || '';
  if (!base) {
    return path;
  }
  const normalizedBase = base.endsWith('/')
    ? base.slice(0, -1)
    : base;
  const normalizedPath = path.startsWith('/')
    ? path
    : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

const merchant = {
  submitInfo: ({accessToken, payload} = {}) =>
    request.post('/api/v1/merchant/submit-info', payload || {}, {
      headers: authHeader(accessToken)
    }),
  submitDocs: ({accessToken, merchantId, files = [], types = []} = {}) => {
    const formData = new FormData();
    files.forEach(file => {
      if (file) {
        formData.append('files', file);
      }
    });

    return request.post('/api/v1/merchant/submit-docs', formData, {
      headers: {
        ...authHeader(accessToken),
        'Content-Type': 'multipart/form-data'
      },
      params: {
        merchantId,
        types
      },
      paramsSerializer: params => qs.stringify(params, {arrayFormat: 'repeat'})
    });
  }
};

const sellerProfile = {
  get: ({accessToken} = {}) =>
    request.get('/api/v1/seller-profile', {
      headers: authHeader(accessToken)
    })
};

const master = {
  fetchSellerProfiles: ({
    accessToken,
    status = 'PENDING_REVIEW',
    page = 0,
    size = 20
  } = {}) =>
    request.get('/api/v1/admin/seller-profile/all', {
      headers: authHeader(accessToken),
      params: {status, page, size}
  }),
  fetchCategories: ({accessToken, page = 0, size = 50} = {}) =>
    request.get('/api/v1/category/all', {
      headers: authHeader(accessToken),
      params: {page, size}
    }),
  searchCategories: ({accessToken, name} = {}) =>
    request.get('/api/v1/category/all/by-name-containing', {
      headers: authHeader(accessToken),
      params: {name}
    }),
  createCategory: ({accessToken, payload} = {}) =>
    request.post('/api/v1/category', payload, {
      headers: authHeader(accessToken)
    }),
  confirmOrRejectSeller: ({
    accessToken,
    sellerProfileId,
    decision
  } = {}) =>
    request.put('/api/v1/admin/confirm-or-reject-seller', null, {
      headers: authHeader(accessToken),
      params: {
        sellerProfileId,
        value: decision
      }
    }),
  getMerchantDocumentUrl: (documentId) =>
    buildApiUrl(`/api/v1/admin/merchant-document/${documentId}`),
  fetchCatalogs: ({accessToken} = {}) =>
    request.get('/api/v1/catalog/all', {
      headers: authHeader(accessToken)
    }),
  createCatalog: ({accessToken, payload} = {}) =>
    request.post('/api/v1/catalog', payload, {
      headers: authHeader(accessToken)
    }),
  updateCatalog: ({accessToken, payload} = {}) =>
    request.put('/api/v1/catalog', payload, {
      headers: authHeader(accessToken)
    }),
  fetchCharacteristics: ({accessToken, page = 0, size = 20} = {}) =>
    request.get('/api/v1/characteristic/all', {
      headers: authHeader(accessToken),
      params: {page, size}
    }),
  searchCharacteristics: ({accessToken, query} = {}) =>
    request.get('/api/v1/characteristic/all/by-name-containing', {
      headers: authHeader(accessToken),
      params: {name: query}
    }),
  createCharacteristic: ({accessToken, payload} = {}) =>
    request.post('/api/v1/characteristic', payload, {
      headers: authHeader(accessToken)
    }),
  fetchSubCategories: ({accessToken, page = 0, size = 50} = {}) =>
    request.get('/api/v1/sub-category/all', {
      headers: authHeader(accessToken),
      params: {page, size}
    }),
  searchSubCategories: ({accessToken, name} = {}) =>
    request.get('/api/v1/sub-category/all/by-name-containing', {
      headers: authHeader(accessToken),
      params: {name}
    }),
  createSubCategory: ({accessToken, payload} = {}) =>
    request.post('/api/v1/sub-category', payload, {
      headers: authHeader(accessToken)
    }),
  fetchPermissions: ({accessToken} = {}) =>
    request.get('/api/v1/permissions/all', {
      headers: authHeader(accessToken)
    }),
  createPermission: ({accessToken, name} = {}) =>
    request.post('/api/v1/permissions', null, {
      headers: authHeader(accessToken),
      params: {permissionName: name}
    }),
  searchPermissions: ({accessToken, name} = {}) =>
    request.get('/api/v1/permissions/by-name', {
      headers: authHeader(accessToken),
      params: {permissionName: name}
    }),
  createAdminUser: ({accessToken, payload} = {}) =>
    request.post('/api/v1/admin/add', payload, {
      headers: authHeader(accessToken)
    }),
  fetchUsers: ({accessToken, page = 0, size = 20} = {}) =>
    request.get('/api/v1/admin/all/users', {
      headers: authHeader(accessToken),
      params: {page, size}
    }),
  givePermissionToUser: ({accessToken, permissionId, userId} = {}) =>
    request.post('/api/v1/permissions/give-permission', null, {
      headers: authHeader(accessToken),
      params: {permissionId, userId}
    })
};

const defaultExport = {
  request,
  queryBuilder,
  subscribe,
  customerAuth,
  merchant,
  sellerProfile,
  master
};

export default defaultExport;
