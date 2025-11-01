import Actions from '../actions';
import {storage} from 'services';

const initialState = {
  language: storage.get('language'),
  sidebarToggle: storage.get('sidebarToggle') ?? storage.set('sidebarToggle', 0),
  menuToggle: storage.get('menuToggle') ?? storage.set('menuToggle', 1),
  mobileToggle: storage.get('mobileToggle') ?? storage.set('mobileToggle', 0),
  gridToggle: storage.get('gridToggle') ?? storage.set('gridToggle', 0),
  versionToggle: storage.get('versionToggle') ? storage.get('versionToggle') : storage.set('versionToggle', 0),
  products: storage.get("products") ? JSON.parse(storage.get("products")) : storage.set("products", JSON.stringify({})),
  regions: [],
  marquee: {},
  count: {},
  errors: []
};

const systemReducer = (state = initialState, action) => {
  
  switch (action.type) {
    case Actions.ERRORS.SUCCESS:
      return {
        ...state,
        errors: [action.payload]
      };
    case Actions.UTILITY.SUCCESS:
      const {versionToggle, sidebarToggle, products} = action.payload;
      
      if (versionToggle) {
        storage.set("versionToggle", parseInt(versionToggle) ? "1" : "0");
      }
      if (sidebarToggle) {
        storage.set("sidebarToggle", parseInt(sidebarToggle) ? "1" : "0");
      }
      
      if (products) {
        storage.set("products", JSON.stringify(products))
      }
      
      return {
        ...state,
        versionToggle: versionToggle ? parseInt(versionToggle) ? 1 : 0 : storage.get('versionToggle'),
        sidebarToggle: sidebarToggle ? parseInt(sidebarToggle) ? 1 : 0 : storage.get('sidebarToggle'),
        products: products ? products : JSON.parse(storage.get("products")),
      }
    case Actions.CHANGE_LANG.SUCCESS:
      storage.set("language", action.payload);
      return {
        ...state,
        language: action.payload
      };
    case Actions.CHANGE_SIDEBAR.SUCCESS:
      let toggle = action.payload ? 1 : 0
      storage.set("sidebarToggle", toggle?.toString());
      return {
        ...state,
        sidebarToggle: action.payload
      };
    case Actions.CHANGE_MENU.SUCCESS:
      let menu = action.payload ? 1 : 0
      storage.set("menuToggle", menu?.toString());
      return {
        ...state,
        menuToggle: action.payload
      };
    case Actions.CHANGE_MOBILE.SUCCESS:
      let mobile = action.payload ? 1 : 0
      storage.set("mobileToggle", mobile?.toString());
      return {
        ...state,
        mobileToggle: action.payload
      };
    case Actions.CHANGE_GRID.SUCCESS:
      let grid = action.payload ? 1 : 0
      storage.set("gridToggle", grid?.toString());
      return {
        ...state,
        gridToggle: action.payload
      };
    case Actions.CHANGE_COUNT.SUCCESS:
      return {
        ...state,
        count: action.payload
      };
    case Actions.REGIONS.SUCCESS:
      return {
        ...state,
        regions: action.payload
      };
    case Actions.MARQUEE.SUCCESS:
      return {
        ...state,
        marquee: action.payload
      };
    default:
      return state
  }
};

export default systemReducer;