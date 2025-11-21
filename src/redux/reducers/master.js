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
    items: [],
    lastUpdated: null
  },
  categories: {
    items: [],
    page: 0,
    size: 50,
    total: 0
  },
  subCategories: {
    items: [],
    page: 0,
    size: 50,
    total: 0
  },
  characteristics: {
    items: [],
    page: 0,
    size: 20,
    total: 0
  },
  permissions: {
    items: []
  },
  productBadges: {
    items: []
  },
  adminUsers: {
    items: [],
    page: 0,
    size: 20,
    total: 0
  },
  pendingProducts: [],
  featuredProducts: [],
  merchants: {
    queue: [],
    summary: {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      drafts: 0
    }
  },
  loading: {
    overview: false,
    catalog: false,
    catalogMutation: false,
    categories: false,
    categoryMutation: false,
    subCategories: false,
    subCategoryMutation: false,
    pending: false,
    merchants: false,
    characteristics: false,
    characteristicMutation: false,
    permissions: false,
    permissionMutation: false,
    grantPermission: false,
    adminUsers: false,
    adminUserMutation: false,
    productBadges: false,
    productBadgeMutation: false
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
          items: get(action.payload, 'items', []),
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

    case Actions.MASTER_FETCH_CATEGORIES.REQUEST:
      return {
        ...state,
        loading: {...state.loading, categories: true}
      };
    case Actions.MASTER_FETCH_CATEGORIES.SUCCESS:
      return {
        ...state,
        categories: {
          items: get(action.payload, 'items', []),
          page: get(action.payload, 'page', 0),
          size: get(action.payload, 'size', 50),
          total: get(action.payload, 'total', 0)
        },
        loading: {...state.loading, categories: false},
        errors: {...state.errors, categories: null}
      };
    case Actions.MASTER_FETCH_CATEGORIES.FAILURE:
      return {
        ...state,
        loading: {...state.loading, categories: false},
        errors: {...state.errors, categories: action.payload}
      };

    case Actions.MASTER_CREATE_CATEGORY.REQUEST:
      return {
        ...state,
        loading: {...state.loading, categoryMutation: true}
      };
    case Actions.MASTER_CREATE_CATEGORY.SUCCESS:
      return {
        ...state,
        loading: {...state.loading, categoryMutation: false},
        errors: {...state.errors, categoryMutation: null}
      };
    case Actions.MASTER_CREATE_CATEGORY.FAILURE:
      return {
        ...state,
        loading: {...state.loading, categoryMutation: false},
        errors: {...state.errors, categoryMutation: action.payload}
      };

    case Actions.MASTER_FETCH_SUBCATEGORIES.REQUEST:
      return {
        ...state,
        loading: {...state.loading, subCategories: true}
      };
    case Actions.MASTER_FETCH_SUBCATEGORIES.SUCCESS:
      return {
        ...state,
        subCategories: {
          items: get(action.payload, 'items', []),
          page: get(action.payload, 'page', 0),
          size: get(action.payload, 'size', 50),
          total: get(action.payload, 'total', 0)
        },
        loading: {...state.loading, subCategories: false},
        errors: {...state.errors, subCategories: null}
      };
    case Actions.MASTER_FETCH_SUBCATEGORIES.FAILURE:
      return {
        ...state,
        loading: {...state.loading, subCategories: false},
        errors: {...state.errors, subCategories: action.payload}
      };

    case Actions.MASTER_CREATE_SUBCATEGORY.REQUEST:
      return {
        ...state,
        loading: {...state.loading, subCategoryMutation: true}
      };
    case Actions.MASTER_CREATE_SUBCATEGORY.SUCCESS:
      return {
        ...state,
        loading: {...state.loading, subCategoryMutation: false},
        errors: {...state.errors, subCategoryMutation: null}
      };
    case Actions.MASTER_CREATE_SUBCATEGORY.FAILURE:
      return {
        ...state,
        loading: {...state.loading, subCategoryMutation: false},
        errors: {...state.errors, subCategoryMutation: action.payload}
      };

    case Actions.MASTER_CREATE_CATALOG.REQUEST:
    case Actions.MASTER_UPDATE_CATALOG.REQUEST:
      return {
        ...state,
        loading: {...state.loading, catalogMutation: true}
      };
    case Actions.MASTER_CREATE_CATALOG.SUCCESS:
    case Actions.MASTER_UPDATE_CATALOG.SUCCESS:
      return {
        ...state,
        loading: {...state.loading, catalogMutation: false},
        errors: {...state.errors, catalogMutation: null}
      };
    case Actions.MASTER_CREATE_CATALOG.FAILURE:
    case Actions.MASTER_UPDATE_CATALOG.FAILURE:
      return {
        ...state,
        loading: {...state.loading, catalogMutation: false},
        errors: {...state.errors, catalogMutation: action.payload}
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
      const sellerProfileId = get(action.payload, 'sellerProfileId');
      if (!sellerProfileId) {
        return state;
      }
      const updatedQueue = state.merchants.queue.filter(item => get(item, 'id') !== sellerProfileId);
      return {
        ...state,
        merchants: {
          ...state.merchants,
          queue: updatedQueue
        }
      };
    }
    case Actions.MASTER_UPDATE_MERCHANT_STATUS.FAILURE:
      return {
        ...state,
        errors: {...state.errors, merchants: action.payload}
      };

    case Actions.MASTER_FETCH_CHARACTERISTICS.REQUEST:
      return {
        ...state,
        loading: {...state.loading, characteristics: true}
      };
    case Actions.MASTER_FETCH_CHARACTERISTICS.SUCCESS:
      return {
        ...state,
        characteristics: {
          items: get(action.payload, 'items', []),
          page: get(action.payload, 'page', 0),
          size: get(action.payload, 'size', 20),
          total: get(action.payload, 'total', 0)
        },
        loading: {...state.loading, characteristics: false},
        errors: {...state.errors, characteristics: null}
      };
    case Actions.MASTER_FETCH_CHARACTERISTICS.FAILURE:
      return {
        ...state,
        loading: {...state.loading, characteristics: false},
        errors: {...state.errors, characteristics: action.payload}
      };

    case Actions.MASTER_CREATE_CHARACTERISTIC.REQUEST:
      return {
        ...state,
        loading: {...state.loading, characteristicMutation: true}
      };
    case Actions.MASTER_CREATE_CHARACTERISTIC.SUCCESS:
      return {
        ...state,
        loading: {...state.loading, characteristicMutation: false},
        errors: {...state.errors, characteristicMutation: null}
      };
    case Actions.MASTER_CREATE_CHARACTERISTIC.FAILURE:
      return {
        ...state,
        loading: {...state.loading, characteristicMutation: false},
        errors: {...state.errors, characteristicMutation: action.payload}
      };

    case Actions.MASTER_FETCH_PERMISSIONS.REQUEST:
      return {
        ...state,
        loading: {...state.loading, permissions: true}
      };
    case Actions.MASTER_FETCH_PERMISSIONS.SUCCESS:
      return {
        ...state,
        permissions: {
          items: get(action.payload, 'items', [])
        },
        loading: {...state.loading, permissions: false},
        errors: {...state.errors, permissions: null}
      };
    case Actions.MASTER_FETCH_PERMISSIONS.FAILURE:
      return {
        ...state,
        loading: {...state.loading, permissions: false},
        errors: {...state.errors, permissions: action.payload}
      };

    case Actions.MASTER_CREATE_PERMISSION.REQUEST:
      return {
        ...state,
        loading: {...state.loading, permissionMutation: true}
      };
    case Actions.MASTER_CREATE_PERMISSION.SUCCESS:
      return {
        ...state,
        loading: {...state.loading, permissionMutation: false},
        errors: {...state.errors, permissionMutation: null}
      };
    case Actions.MASTER_CREATE_PERMISSION.FAILURE:
      return {
        ...state,
        loading: {...state.loading, permissionMutation: false},
        errors: {...state.errors, permissionMutation: action.payload}
      };

    case Actions.MASTER_GIVE_PERMISSION.REQUEST:
      return {
        ...state,
        loading: {...state.loading, grantPermission: true}
      };
    case Actions.MASTER_GIVE_PERMISSION.SUCCESS:
      return {
        ...state,
        loading: {...state.loading, grantPermission: false},
        errors: {...state.errors, grantPermission: null}
      };
    case Actions.MASTER_GIVE_PERMISSION.FAILURE:
      return {
        ...state,
        loading: {...state.loading, grantPermission: false},
        errors: {...state.errors, grantPermission: action.payload}
      };

    case Actions.MASTER_FETCH_PRODUCT_BADGES.REQUEST:
      return {
        ...state,
        loading: {...state.loading, productBadges: true}
      };
    case Actions.MASTER_FETCH_PRODUCT_BADGES.SUCCESS:
      return {
        ...state,
        productBadges: {
          items: get(action.payload, 'items', [])
        },
        loading: {...state.loading, productBadges: false},
        errors: {...state.errors, productBadges: null}
      };
    case Actions.MASTER_FETCH_PRODUCT_BADGES.FAILURE:
      return {
        ...state,
        loading: {...state.loading, productBadges: false},
        errors: {...state.errors, productBadges: action.payload}
      };

    case Actions.MASTER_CREATE_PRODUCT_BADGE.REQUEST:
      return {
        ...state,
        loading: {...state.loading, productBadgeMutation: true}
      };
    case Actions.MASTER_CREATE_PRODUCT_BADGE.SUCCESS: {
      const createdBadge = get(action.payload, 'item') || get(action.payload, 'badge');
      return {
        ...state,
        productBadges: {
          items: createdBadge
            ? upsertById(state.productBadges.items, createdBadge)
            : state.productBadges.items
        },
        loading: {...state.loading, productBadgeMutation: false},
        errors: {...state.errors, productBadgeMutation: null}
      };
    }
    case Actions.MASTER_CREATE_PRODUCT_BADGE.FAILURE:
      return {
        ...state,
        loading: {...state.loading, productBadgeMutation: false},
        errors: {...state.errors, productBadgeMutation: action.payload}
      };

    case Actions.MASTER_FETCH_ADMIN_USERS.REQUEST:
      return {
        ...state,
        loading: {...state.loading, adminUsers: true}
      };
    case Actions.MASTER_FETCH_ADMIN_USERS.SUCCESS:
      return {
        ...state,
        adminUsers: {
          items: get(action.payload, 'items', []),
          page: get(action.payload, 'page', 0),
          size: get(action.payload, 'size', 20),
          total: get(action.payload, 'total', 0)
        },
        loading: {...state.loading, adminUsers: false},
        errors: {...state.errors, adminUsers: null}
      };
    case Actions.MASTER_FETCH_ADMIN_USERS.FAILURE:
      return {
        ...state,
        loading: {...state.loading, adminUsers: false},
        errors: {...state.errors, adminUsers: action.payload}
      };

    case Actions.MASTER_CREATE_ADMIN_USER.REQUEST:
      return {
        ...state,
        loading: {...state.loading, adminUserMutation: true}
      };
    case Actions.MASTER_CREATE_ADMIN_USER.SUCCESS:
      return {
        ...state,
        loading: {...state.loading, adminUserMutation: false},
        errors: {...state.errors, adminUserMutation: null}
      };
    case Actions.MASTER_CREATE_ADMIN_USER.FAILURE:
      return {
        ...state,
        loading: {...state.loading, adminUserMutation: false},
        errors: {...state.errors, adminUserMutation: action.payload}
      };

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
