import { createRoutine } from 'redux-saga-routines';

//System Actions
export const LOGIN = createRoutine('LOGIN');
export const LOGIN_WITH_SIGNATURE = createRoutine('LOGIN_WITH_SIGNATURE');
export const LOGOUT = createRoutine('LOGOUT');
export const UTILITY = createRoutine('UTILITY')
export const CHANGE_LANG = createRoutine('LANGUAGE');
export const CHANGE_FAVOURITES = createRoutine('FAVOURITES');
export const CHANGE_PRODUCTS = createRoutine('PRODUCTS');
export const CHANGE_SIDEBAR = createRoutine('SIDEBAR');
export const CHANGE_MENU = createRoutine('MENU');
export const CHANGE_MOBILE = createRoutine('MOBILE');
export const CHANGE_GRID = createRoutine('GRID');
export const CHANGE_COUNT = createRoutine('COUNT');
export const ERRORS = createRoutine('ERRORS');

export const REGIONS = createRoutine("GET_REGIONS");
export const MARQUEE = createRoutine("GET_MARQUEE");

export const TRIGGER  = createRoutine("TRIGGER");

// Customer auth actions
export const CUSTOMER_AUTH_START = createRoutine("CUSTOMER_AUTH_START");
export const CUSTOMER_AUTH_VERIFY = createRoutine("CUSTOMER_AUTH_VERIFY");
export const CUSTOMER_AUTH_RESEND = createRoutine("CUSTOMER_AUTH_RESEND");

// Master admin actions
export const MASTER_FETCH_OVERVIEW = createRoutine("MASTER_FETCH_OVERVIEW");
export const MASTER_FETCH_CATALOG = createRoutine("MASTER_FETCH_CATALOG");
export const MASTER_FETCH_PENDING_PRODUCTS = createRoutine("MASTER_FETCH_PENDING_PRODUCTS");
export const MASTER_APPROVE_PRODUCT = createRoutine("MASTER_APPROVE_PRODUCT");
export const MASTER_UPDATE_PRODUCT_FLAGS = createRoutine("MASTER_UPDATE_PRODUCT_FLAGS");
export const MASTER_REMOVE_PRODUCT = createRoutine("MASTER_REMOVE_PRODUCT");
export const MASTER_FETCH_MERCHANTS = createRoutine("MASTER_FETCH_MERCHANTS");
export const MASTER_UPDATE_MERCHANT_STATUS = createRoutine("MASTER_UPDATE_MERCHANT_STATUS");

const actions = {
  LOGIN,
  ERRORS,
  LOGIN_WITH_SIGNATURE,
  LOGOUT,
  UTILITY,
  CHANGE_LANG,
  CHANGE_FAVOURITES,
  CHANGE_PRODUCTS,
  CHANGE_SIDEBAR,
  CHANGE_MENU,
  CHANGE_MOBILE,
  CHANGE_GRID,
  CHANGE_COUNT,
  REGIONS,
  MARQUEE,
  TRIGGER,
  CUSTOMER_AUTH_START,
  CUSTOMER_AUTH_VERIFY,
  CUSTOMER_AUTH_RESEND,
  MASTER_FETCH_OVERVIEW,
  MASTER_FETCH_CATALOG,
  MASTER_FETCH_PENDING_PRODUCTS,
  MASTER_APPROVE_PRODUCT,
  MASTER_UPDATE_PRODUCT_FLAGS,
  MASTER_REMOVE_PRODUCT,
  MASTER_FETCH_MERCHANTS,
  MASTER_UPDATE_MERCHANT_STATUS
};

export default actions;
