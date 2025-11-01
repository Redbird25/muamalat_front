import Actions from '../actions';
import get from 'lodash.get';

const initialState = {
  overview: {
    cards: [],
    performance: {
      labels: [],
      revenue: [],
      orders: []
    },
    topCategories: [],
    alerts: []
  },
  catalog: {
    tree: [],
    attributes: [],
    lastUpdated: null
  },
  pendingProducts: [],
  featuredProducts: [],
  merchants: {
    queue: [],
    summary: {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0
    }
  },
  loading: {
    overview: false,
    catalog: false,
    pending: false,
    merchants: false
  },
  errors: {}
};

const removeById = (collection = [], id) => collection.filter(item => get(item, 'id') !== id);

const upsertById = (collection = [], entity) => {
  const idx = collection.findIndex(item => get(item, 'id') === get(entity, 'id'));
  if (idx === -1) {
    return [...collection, entity];
  }
  const next = [...collection];
  next[idx] = {...next[idx], ...entity};
  return next;
};

const MasterReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.MASTER_FETCH_OVERVIEW.REQUEST:
      return {
        ...state,
        loading: {...state.loading, overview: true}
      };
    case Actions.MASTER_FETCH_OVERVIEW.SUCCESS: {
      const {featuredProducts = undefined, ...overviewPayload} = action.payload || {};
      return {
        ...state,
        overview: overviewPayload,
        featuredProducts: Array.isArray(featuredProducts) ? featuredProducts : state.featuredProducts,
        loading: {...state.loading, overview: false},
        errors: {...state.errors, overview: null}
      };
    }
    case Actions.MASTER_FETCH_OVERVIEW.FAILURE:
      return {
        ...state,
        loading: {...state.loading, overview: false},
        errors: {...state.errors, overview: action.payload}
      };

    case Actions.MASTER_FETCH_CATALOG.REQUEST:
      return {
        ...state,
        loading: {...state.loading, catalog: true}
      };
    case Actions.MASTER_FETCH_CATALOG.SUCCESS:
      return {
        ...state,
        catalog: {
          tree: get(action.payload, 'tree', []),
          attributes: get(action.payload, 'attributes', []),
          lastUpdated: get(action.payload, 'lastUpdated', new Date().toISOString())
        },
        loading: {...state.loading, catalog: false},
        errors: {...state.errors, catalog: null}
      };
    case Actions.MASTER_FETCH_CATALOG.FAILURE:
      return {
        ...state,
        loading: {...state.loading, catalog: false},
        errors: {...state.errors, catalog: action.payload}
      };

    case Actions.MASTER_FETCH_PENDING_PRODUCTS.REQUEST:
      return {
        ...state,
        loading: {...state.loading, pending: true}
      };
    case Actions.MASTER_FETCH_PENDING_PRODUCTS.SUCCESS:
      return {
        ...state,
        pendingProducts: get(action.payload, 'items', []),
        loading: {...state.loading, pending: false},
        errors: {...state.errors, pending: null}
      };
    case Actions.MASTER_FETCH_PENDING_PRODUCTS.FAILURE:
      return {
        ...state,
        loading: {...state.loading, pending: false},
        errors: {...state.errors, pending: action.payload}
      };

    case Actions.MASTER_FETCH_MERCHANTS.REQUEST:
      return {
        ...state,
        loading: {...state.loading, merchants: true}
      };
    case Actions.MASTER_FETCH_MERCHANTS.SUCCESS:
      return {
        ...state,
        merchants: {
          queue: get(action.payload, 'queue', []),
          summary: {
            ...state.merchants.summary,
            ...get(action.payload, 'summary', {})
          }
        },
        loading: {...state.loading, merchants: false},
        errors: {...state.errors, merchants: null}
      };
    case Actions.MASTER_FETCH_MERCHANTS.FAILURE:
      return {
        ...state,
        loading: {...state.loading, merchants: false},
        errors: {...state.errors, merchants: action.payload}
      };

    case Actions.MASTER_UPDATE_MERCHANT_STATUS.SUCCESS: {
      const merchantId = get(action.payload, 'merchantId');
      if (!merchantId) {
        return state;
      }
      const updatedQueue = state.merchants.queue.map(item => {
        if (get(item, 'id') !== merchantId) return item;
        return {...item, ...action.payload.merchant};
      });
      const nextSummary = {...state.merchants.summary};
      const newStatus = get(action.payload, 'status', get(action.payload, 'merchant.status'));
      if (newStatus && nextSummary) {
        if (nextSummary.pending > 0) nextSummary.pending -= 1;
        if (newStatus === 'approved') {
          nextSummary.approved = (nextSummary.approved || 0) + 1;
        }
        if (newStatus === 'rejected') {
          nextSummary.rejected = (nextSummary.rejected || 0) + 1;
        }
      }
      return {
        ...state,
        merchants: {
          ...state.merchants,
          summary: nextSummary,
          queue: updatedQueue.filter(item => (item.status || '').toUpperCase() === 'PENDING_REVIEW')
        }
      };
    }

    case Actions.MASTER_APPROVE_PRODUCT.SUCCESS: {
      const approvedProduct = get(action.payload, 'product');
      const productId = get(action.payload, 'productId');
      const restPending = removeById(state.pendingProducts, productId);
      const nextFeatured = approvedProduct
        ? upsertById(state.featuredProducts, approvedProduct)
        : state.featuredProducts;
      return {
        ...state,
        pendingProducts: restPending,
        featuredProducts: nextFeatured
      };
    }

    case Actions.MASTER_UPDATE_PRODUCT_FLAGS.SUCCESS: {
      const productId = get(action.payload, 'productId');
      const flags = get(action.payload, 'flags', {});
      if (!productId) {
        return state;
      }
      const featured = state.featuredProducts.map(item => {
        if (get(item, 'id') !== productId) return item;
        return {...item, flags: {...item.flags, ...flags}};
      });
      const pending = state.pendingProducts.map(item => {
        if (get(item, 'id') !== productId) return item;
        return {...item, flags: {...item.flags, ...flags}};
      });
      return {
        ...state,
        featuredProducts: featured,
        pendingProducts: pending
      };
    }

    case Actions.MASTER_REMOVE_PRODUCT.SUCCESS: {
      const productId = get(action.payload, 'productId');
      return {
        ...state,
        featuredProducts: removeById(state.featuredProducts, productId),
        pendingProducts: removeById(state.pendingProducts, productId)
      };
    }

    default:
      return state;
  }
};

export default MasterReducer;
