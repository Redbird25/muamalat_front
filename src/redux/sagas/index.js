import { all, fork } from 'redux-saga/effects';

import SchemaSaga from 'schema/saga';
import AuthSaga from './auth';
import SystemSaga from './system';
import MasterSaga from './master';

export default function* root(){
  yield all([
    fork(SchemaSaga),
    fork(AuthSaga),
    fork(SystemSaga),
    fork(MasterSaga),
  ])
};
