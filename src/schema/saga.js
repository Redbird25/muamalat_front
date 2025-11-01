import {all, call, put, takeLatest, takeEvery} from 'redux-saga/effects';
import Actions from './actions';
// import PublicActions from '../redux/actions'
import {api} from 'services';
import get from 'lodash.get';

function* LoadAll({payload}) {
  const {
    method = 'get',
    url = '',
    name = '',
    params = {},
    append = false,
    prepend = false,
    asData = false,
    dataKey = "data",
    metaKey = "meta",
    cb,
    callback
  } = payload;
  try {
    const {data: {result}} = yield call(api.request[method], api.queryBuilder(url, {...params}));
    let data = asData ? result : get(result, dataKey);
    let meta = get(result, metaKey)
    if (callback) {
      data = callback(data);
    }
    
    yield put(Actions.LoadAll.success({
      name,
      append,
      prepend,
      url,
      data,
      params,
      callback,
      meta: get(result, metaKey)
    }));
    
    yield call(cb.success, data, meta);
  } catch (error) {
    if (error) {
      if (get(error, 'response.data.message') === "Unauthenticated.") {
        // yield put(PublicActions.LOGOUT.success());
      }
      yield put(Actions.LoadAll.failure({
        name,
        url,
        params,
        error: get(error, 'response.data', '')
      }));
      yield put(Actions.ERRORS.success({
        name,
        url,
        params,
        error: get(error, 'response', '')
      }));
      yield call(cb.error, get(error, 'response.data', ''))
    }
  } finally {
    yield call(cb.finally)
  }
}

function* LoadOne({payload}) {
  const {
    url = '',
    name = '',
    params = {},
    asData = false,
    dataKey = "data",
    cb,
    callback
  } = payload;
  try {
    const {data: {result}} = yield call(api.request.get, api.queryBuilder(url, {...params}));
    let data = asData ? result : get(result, dataKey);
    if (callback) {
      data = callback(data);
    }
    
    yield put(Actions.LoadOne.success({
      name,
      url,
      data,
      params,
    }));
    yield call(cb.success, data);
  } catch (error) {
    
    yield put(Actions.LoadOne.failure({
      name,
      url,
      params,
      error: get(error, 'response.data', '')
    }));
    yield put(Actions.ERRORS.success({
      name,
      url,
      params,
      error: get(error, 'response', '')
    }));
    yield call(cb.error, get(error, 'response.data', ''))
  } finally {
    yield call(cb.finally)
  }
}

function* Create({payload}) {
  const {
    url,
    name,
    params,
    values,
    prepend = false,
    append = false,
    cb
  } = payload;
  try {
    const {data: {result}} = yield call(api.request.post, api.queryBuilder(url, {...params}), values);
    yield put(Actions.CREATE.success({
      name,
      url,
      data: get(result, "data"),
      prepend,
      params,
      values,
      append
    }));
    
    yield call(cb.success, get(result, "data"));
  } catch (error) {
    yield put(Actions.CREATE.failure({
      name,
      url,
      params,
      values,
      error: get(error, 'response.data', '')
    }));
    yield put(Actions.ERRORS.success({
      name,
      url,
      params,
      error: get(error, 'response', '')
    }));
    yield call(cb.error, get(error, 'response.data', ''))
  } finally {
    yield call(cb.finally);
  }
}

function* Update({payload}) {
  const {
    id,
    url,
    name,
    params,
    values,
    cb
  } = payload;
  try {
    const {data: {data}} = yield call(api.request.put, api.queryBuilder(url, {...params}), values);
    
    yield put(Actions.UPDATE.success({
      id,
      name,
      url,
      data,
      params,
      update_value: values,
    }));
    
    yield call(cb.success, data);
  } catch (error) {
    yield put(Actions.UPDATE.failure({
      name,
      url,
      params,
      values,
      error: get(error, 'response.data', '')
    }));
    yield put(Actions.ERRORS.success({
      name,
      url,
      params,
      error: get(error, 'response', '')
    }));
    yield call(cb.error, get(error, 'response.data', ''))
  } finally {
    yield call(cb.finally);
  }
}

function* Delete({payload}) {
  const {
    id,
    url,
    name,
    params,
    cb = {
      success: () => {
      },
      error: () => {
      },
      finally: () => {
      }
    }
  } = payload;
  try {
    yield call(api.request.delete, api.queryBuilder(url, {...params}));
    
    yield put(Actions.DELETE.success({
      id,
      name,
      params,
      url,
    }));
    
    yield call(cb.success, id);
  } catch (error) {
    if (get(error, 'response.data.message') === "Unauthenticated.") {
      // yield put(PublicActions.LOGOUT.success());
    }
    yield put(Actions.DELETE.failure({
      name,
      url,
      params,
      error: get(error, 'response.data', '')
    }));
    yield put(Actions.ERRORS.success({
      name,
      url,
      params,
      error: get(error, 'response', '')
    }));
    yield call(cb.error, get(error, 'response.data', ''))
  } finally {
    yield call(cb.finally);
  }
}

function* ByMethod({payload}) {
  const {
    method = "post",
    isUpdate = false,
    url,
    name,
    asData = false,
    id,
    params = {},
    values = {},
    cb
  } = payload;
  try {
    const {data: {result}} = yield call(api.request[method], api.queryBuilder(url, {...params}), values)
    let data = asData ? result : get(result, "data");
    
    if (isUpdate) {
      yield put(Actions.UPDATE.success({
        id,
        name,
        url,
        data,
        params,
        update_value: values,
      }));
    } else {
      yield put(Actions.METHOD.success({
        id,
        name,
        url,
        data,
        params,
        update_value: values,
      }));
    }
    
    yield call(cb.success, data);
  } catch (error) {
    if (get(error, 'response.data.message') === "Unauthenticated.") {
      // yield put(PublicActions.LOGOUT.success());
    }
    if (isUpdate) {
      yield put(Actions.CREATE.failure({
        name,
        url,
        params,
        values,
        error: get(error, 'response.data', '')
      }));
    } else {
      yield put(Actions.METHOD.failure({
        name,
        url,
        params,
        values,
        error: get(error, 'response.data', ''),
      }));
    }
    yield put(Actions.ERRORS.success({
      name,
      url,
      params,
      error: get(error, 'response', '')
    }));
    yield call(cb.error, get(error, 'response.data', ''))
  } finally {
    yield call(cb.finally);
  }
}


export default function* schemaSaga() {
  yield all([
    takeEvery(Actions.LoadAll.REQUEST, LoadAll),
    takeEvery(Actions.LoadOne.REQUEST, LoadOne),
    takeLatest(Actions.DELETE.REQUEST, Delete),
    takeLatest(Actions.CREATE.REQUEST, Create),
    takeLatest(Actions.UPDATE.REQUEST, Update),
    takeEvery(Actions.METHOD.REQUEST, ByMethod),
  
  ])
}