import {all, call, put, select, takeLatest} from 'redux-saga/effects';
import Actions from '../actions';
import {api} from 'services';
import {session} from 'services';
import get from 'lodash.get';

const normalizePhoneNumber = (value = '') => {
  if (!value) {
    return '';
  }
  const trimmed = `${value}`.trim();
  if (trimmed.startsWith('+')) {
    return trimmed;
  }
  const digits = trimmed.replace(/\D/g, '');
  if (!digits) {
    return '';
  }
  if (digits.startsWith('998') && digits.length === 12) {
    return `+${digits}`;
  }
  if (digits.length === 9) {
    return `+998${digits}`;
  }
  return `+${digits}`;
};

function* Login(action) {
  const {
    url,
    values,
    cb
  } = action.payload;
  try {
    const {data: {result}} = yield call(api.request.post, api.queryBuilder(url, {}), {...values});
    
    yield put(Actions.LOGIN.success(result));
    yield call(cb.success, result);
  } catch (err) {
    yield put(Actions.LOGIN.failure(get(err, 'response.data', '')));
    yield call(cb.error, get(err, 'response.data'));
    yield put(Actions.ERRORS.success({
      error: get(err, 'response', '')
    }));
  } finally {
    yield call(cb.finally)
  }
}

function* Logout({payload}) {
  const {cb, navigate} = payload;
  try {
    // Check if user is a customer (role_id: 3)
    const user = JSON.parse(session.get('user') || '{}');
    const refreshToken = session.get('refreshToken');
    
    if (user.role_id === 3 && refreshToken) {
      // Customer logout with refreshToken
      yield call(api.customerAuth.logout, {refreshToken});
    } else {
      // Regular admin/staff logout
      yield call(api.request.post, api.queryBuilder('/logout', {}));
    }
    
    yield put(Actions.LOGOUT.success());
    if (navigate) {
      navigate()
    }
    yield call(cb.success);
  } catch (err) {
    // Even if logout API returns 401, still clear session locally
    yield put(Actions.LOGOUT.success());
    if (navigate) {
      navigate()
    }
    yield call(cb.success);
  }
}

function* CustomerAuthStart(action) {
  const {phoneNumber, intent, firstName, lastName, middleName = '', cb} = action.payload;
  try {
    const normalizedPhone = normalizePhoneNumber(phoneNumber);
    if (!normalizedPhone) {
      throw {response: {data: {message: 'Invalid phone number'}}};
    }
    const response = yield call(api.customerAuth.startBuyer, {phoneNumber: normalizedPhone});
    const txId = get(response, 'data.txId');
    
    yield put(Actions.CUSTOMER_AUTH_START.success({
      txId, 
      intent, 
      phoneNumber: normalizedPhone, 
      firstName, 
      lastName,
      middleName
    }));
    
    yield call(cb.success, {txId});
  } catch (err) {
    yield put(Actions.CUSTOMER_AUTH_START.failure(get(err, 'response.data', '')));
    yield call(cb.error, get(err, 'response.data'));
  }
}

function* CustomerAuthVerify(action) {
  const {txId, code, cb} = action.payload;
  try {
    const response = yield call(api.customerAuth.verifyBuyer, {txId, code});
    const authData = get(response, 'data');
    const customerAuthState = yield select(state => get(state, 'auth.customerAuth', {}));

    if (authData && authData.accessToken && authData.refreshToken) {
      session.set('token', authData.accessToken);
      session.set('refreshToken', authData.refreshToken);
      session.set('user', JSON.stringify({
        id: authData.userId,
        identifier: authData.phoneNumber,
        phone_number: authData.phoneNumber,
        role_id: 3
      }));

      yield put(Actions.LOGIN.success({
        token: authData.accessToken,
        user: {
          id: authData.userId,
          identifier: authData.phoneNumber,
          phone_number: authData.phoneNumber,
          role_id: 3
        }
      }));

      const shouldFillProfile = get(customerAuthState, 'intent') === 'REGISTER'
        && get(customerAuthState, 'firstName')
        && get(customerAuthState, 'lastName');

      if (shouldFillProfile) {
        try {
          yield call(api.customerAuth.fillProfile, {
            accessToken: authData.accessToken,
            profile: {
              firstName: get(customerAuthState, 'firstName'),
              lastName: get(customerAuthState, 'lastName'),
              middleName: get(customerAuthState, 'middleName') || ''
            }
          });
        } catch (profileError) {
          console.error('Failed to fill profile', profileError);
        }
      }

      yield call(cb.success, authData);
      return;
    }
    throw response;
  } catch (err) {
    yield put(Actions.CUSTOMER_AUTH_VERIFY.failure(get(err, 'response.data', '')));
    yield call(cb.error, get(err, 'response.data'));
  }
}

function* CustomerAuthResend(action) {
  const {txId, cb} = action.payload;
  try {
    yield call(api.customerAuth.resend, {txId: txId});
    yield put(Actions.CUSTOMER_AUTH_RESEND.success());
    yield call(cb.success);
  } catch (err) {
    yield put(Actions.CUSTOMER_AUTH_RESEND.failure(get(err, 'response.data', '')));
    yield call(cb.error, get(err, 'response.data'));
  }
}

export default function* AuthSaga() {
  yield all([
    takeLatest(Actions.LOGIN.REQUEST, Login),
    takeLatest(Actions.LOGOUT.REQUEST, Logout),
    takeLatest(Actions.CUSTOMER_AUTH_START.REQUEST, CustomerAuthStart),
    takeLatest(Actions.CUSTOMER_AUTH_VERIFY.REQUEST, CustomerAuthVerify),
    takeLatest(Actions.CUSTOMER_AUTH_RESEND.REQUEST, CustomerAuthResend)
  ])
}
