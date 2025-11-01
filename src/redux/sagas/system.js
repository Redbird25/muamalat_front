import {
  all,
  call,
  put,
  takeLatest,
} from 'redux-saga/effects';
import get from "lodash.get";
import Actions from '../actions';
import {api} from 'services';


function* LoadRegions() {
  try {
    const {data: {result}} = yield call(api.request.get, api.queryBuilder("/regions", {perPage: 30}));
    yield put(Actions.REGIONS.success(get(result, 'data', [])));
  } catch (error) {
    if (get(error, 'response.data.message') === "Unauthenticated.") {
      yield put(Actions.LOGOUT.success());
    }
    yield put(Actions.REGIONS.failure({
      error: get(error, 'response.data', '')
    }));
    
    yield put(Actions.ERRORS.success({
      error: get(error, 'response', '')
    }));
  }
}

function* LoadMarquee() {
  try {
    const {data: {result}} = yield call(api.request.get, api.queryBuilder("/get-begushaya", {}));
    yield put(Actions.MARQUEE.success(get(result, 'data', {})));
  } catch (error) {
    if (get(error, 'response.data.message') === "Unauthenticated.") {
      yield put(Actions.LOGOUT.success());
    }
    yield put(Actions.MARQUEE.failure({
      error: get(error, 'response.data', '')
    }));
    yield put(Actions.ERRORS.success({
      error: get(error, 'response', '')
    }));
  }
}

function* TriggerRequest() {

}

export default function* systemSaga() {
  yield all([
    takeLatest(Actions.REGIONS.REQUEST, LoadRegions),
    takeLatest(Actions.MARQUEE.REQUEST, LoadMarquee),
    takeLatest(Actions.TRIGGER.REQUEST, TriggerRequest),
  ])
}