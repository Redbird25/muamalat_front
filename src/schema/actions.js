import { createRoutine } from 'redux-saga-routines'


//Schema Actions
export const LoadAll = createRoutine('LOAD_ALL');
export const LoadOne = createRoutine('LOAD_ONE');
export const CREATE = createRoutine('CREATE_REQUEST');
export const UPDATE = createRoutine('UPDATE_REQUEST');
export const DELETE = createRoutine('DELETE_REQUEST');
export const METHOD = createRoutine('METHOD_REQUEST');
export const OTHER = createRoutine('REQUEST_OTHER');
export const ERRORS = createRoutine('REQUEST_ERRORS');

const actions = {
  LoadAll,
  LoadOne,
  CREATE,
  UPDATE,
  DELETE,
  METHOD,
  OTHER,
  ERRORS
};

export default actions;