import { combineReducers } from 'redux';
import {ImportAll} from 'services/utils';
import Actions from '../actions';

import schema from 'schema/reducer';
const reducersArray = ImportAll(require.context('.', false, /^\.\/(?!index)\w+$/));

 const appReducer = combineReducers({
  ...reducersArray,
  schema
});

 const rootReducer = ((state, action) => {
   if(action.type === Actions.LOGOUT.SUCCESS) {
     return appReducer({}, action)
   }else{
     return appReducer(state, action)
   }
 })

export default rootReducer