import Actions from '../actions';
import {session} from 'services';
import get from "lodash.get";

const initialState = {
  isFetched: true,
  isAuthenticated: !!session.get('token'),
  data: JSON.parse(session.get('user')),
  token: session.get('token'),
  errors: {},
  customerAuth: {
    txId: null,
    intent: null,
    phoneNumber: null,
    firstName: null,
    lastName: null,
    middleName: null,
    isLoading: false
  }
};

const Auth = (state = initialState, action) => {
  switch (action.type) {
    case Actions.LOGIN.REQUEST:
      return {
        ...state,
        isFetched: false,
        isAuthenticated: false,
        token: '',
        data: {}
      };
    case Actions.LOGIN.SUCCESS:
      if (get(action, "payload.update_login")) {
        session.set('user', JSON.stringify({
          ...get(state, "data"),
          order: {
            ...get(state, "data.order"),
            products_count: get(action, "payload.count", 0)
          }
        }));
        return {
          ...state,
          data: {
            ...get(state, "data"),
            order: {
              ...get(state, "data.order"),
              products_count: get(action, "payload.count", 0)
            }
          }
        };
      } else {
        session.set("token", get(action.payload, "token"));
        session.set('user', JSON.stringify(action.payload.data ?? action.payload));
        return {
          isFetched: true,
          isAuthenticated: true,
          token: action.payload.token,
          data: action.payload
        };
      }
    
    case Actions.LOGOUT.SUCCESS:
    case Actions.LOGIN.FAILURE:
    case Actions.LOGOUT.FAILURE:
      session.remove('token');
      session.remove('user');
      session.remove('refreshToken');
      return {
        ...state,
        isFetched: true,
        isAuthenticated: false,
        token: '',
        data: {},
        customerAuth: initialState.customerAuth
      };

    // Customer Auth Cases
    case Actions.CUSTOMER_AUTH_START.REQUEST:
      return {
        ...state,
        customerAuth: {
          ...state.customerAuth,
          isLoading: true
        }
      };

    case Actions.CUSTOMER_AUTH_START.SUCCESS:
      return {
        ...state,
        customerAuth: {
          ...state.customerAuth,
          isLoading: false,
          txId: action.payload.txId,
          intent: action.payload.intent,
          phoneNumber: action.payload.phoneNumber,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          middleName: action.payload.middleName
        }
      };

    case Actions.CUSTOMER_AUTH_START.FAILURE:
      return {
        ...state,
        customerAuth: {
          ...state.customerAuth,
          isLoading: false
        }
      };

    case 'RESET_CUSTOMER_AUTH':
      return {
        ...state,
        customerAuth: initialState.customerAuth
      };

    default:
      return state
  }
};

export default Auth;
