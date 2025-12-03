import {all, call, put, takeLatest, takeEvery} from 'redux-saga/effects';
import Actions from './actions';
// import PublicActions from '../redux/actions'
import {api} from 'services';
import get from 'lodash.get';

const normalizeResponse = (response, {dataKey = 'data', metaKey = 'meta', asData = false} = {}) => {
  const payload = get(response, 'data', response);
  const result = get(payload, 'result', payload);

  let data = asData ? result : get(result, dataKey);
  let meta = get(result, metaKey);

  if (typeof data === 'undefined' && Array.isArray(get(result, 'content'))) {
    data = get(result, 'content');
    meta = meta || {
      total: get(result, 'totalElements'),
      page: get(result, 'number'),
      size: get(result, 'size')
    };
  }

  if (typeof data === 'undefined') {
    data = result;
  }

  return {data, meta};
};

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
    const response = yield call(api.request[method], api.queryBuilder(url, {...params}));
    const {data, meta} = normalizeResponse(response, {dataKey, metaKey, asData});
    const normalizedData = callback ? callback(data) : data;
    
    yield put(Actions.LoadAll.success({
      name,
      append,
      prepend,
      url,
      data: normalizedData,
      params,
      callback,
      meta
    }));
    
    yield call(cb.success, normalizedData, meta);
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
    const response = yield call(api.request.get, api.queryBuilder(url, {...params}));
    const {data} = normalizeResponse(response, {dataKey, asData});
    const normalizedData = callback ? callback(data) : data;
    
    yield put(Actions.LoadOne.success({
      name,
      url,
      data: normalizedData,
      params,
    }));
    yield call(cb.success, normalizedData);
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
