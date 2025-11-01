import Actions from './actions';
import get from 'lodash.get';

const initialState = {};

const schemaReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.ERRORS.SUCCESS:
      const {name, url, params, error} = action.payload;
      return {
        ...state,
        error: {
          ...state.error,
          [name]: {
            url,
            params: {...get(state, `${name}.params`), ...params},
            error: {...get(state, `${name}.error`), ...error}
          }
        }
      };
    case Actions.LoadAll.REQUEST: {
      const {name} = action.payload;
      return {
        ...state,
        [name]: {
          ...get(state, `${name}`, {}),
          isFetched: false,
          // data: [...get(state, `${name}.data`, [])],
          data: [],
          meta: {},
          error: null,
        }
      };
    }
    case Actions.LoadAll.SUCCESS: {
      const {
        name,
        url,
        data,
        params,
        meta,
        append,
        prepend
      } = action.payload;
      const stateData = typeof data === 'function' ? data(get(state, `${name}.data`, [])) : data;
      let result = append ? [...get(state, `${name}.data`, []), ...stateData] : prepend ? [...stateData, ...get(state, `${name}.data`, [])] : [...stateData];
      return {
        ...state,
        [name]: {
          ...get(state, `[${name}]`, {}),
          isFetched: true,
          url,
          data: result,
          meta: {...get(state, `${name}.meta`), ...meta},
          params: {...get(state, `${name}.params`), ...params},
          error: null,
        }
      };
    }
    case Actions.LoadOne.REQUEST: {
      const {name} = action.payload;
      return {
        ...state,
        [name]: {
          ...get(state, `[${name}]`, {}),
          isFetched: false,
          data: {},
          error: null,
        }
      };
    }
    case Actions.LoadOne.SUCCESS: {
      const {name, url, data, params} = action.payload;
      return {
        ...state,
        [name]: {
          ...get(state, `[${name}]`, {}),
          isFetched: true,
          url,
          data,
          params,
          error: null
        }
      };
    }
    case Actions.LoadAll.FAILURE:
    case Actions.LoadOne.FAILURE: {
      const {name, url, error, params} = action.payload;
      return {
        ...state,
        [name]: {
          isFetched: true,
          url: url,
          error,
          params
        }
      };
    }

    case Actions.CREATE.REQUEST:
    case Actions.DELETE.REQUEST:
    case Actions.UPDATE.REQUEST: {
      const {name} = action.payload;
      return {
        ...state,
        [name]: {
          ...get(state, `[${name}]`, {}),
        }
      };
    }

    case Actions.METHOD.SUCCESS:
    case Actions.CREATE.SUCCESS: {
      const {name, url, data, append, prepend, params, values} = action.payload;
      let result =
        append
          ? [...get(state, `[${name}].data`, []), data]
          :
          prepend
            ? [data, ...get(state, `[${name}].data`, [])]
            : [...get(state, `[${name}].data`, [])];

      return {
        ...state,
        [name]: {
          ...get(state, `[${name}]`, {}),
          isFetched: true,
          url,
          params,
          values,
          data: result,
          error: null
        }
      };
    }

    case Actions.UPDATE.SUCCESS: {
      const {
        name,
        url,
        data,
        id,
        params,
        update_value,
        isFetched,
        array = true,
        inner = false,
        values = false,
        objectInner = false,
        customData = false,
        arrayUpdate = false
      } = action.payload;
      return {
        ...state,
        [name]: {
          ...get(state, `[${name}]`, {}),
          isFetched: isFetched ?? true,
          url,
          params,
          values: update_value,
          data: values
            ? [...Object.values(get(state, `[${name}].data`).map(res => [res[0], res[1].map(item => item.id === id
              ? customData
                ? {...data}
                : {...item, ...data} : item)]))]
            : objectInner
              ? {
                ...get(state, `[${name}].data`),
                ...data
              }
              : array
                ? arrayUpdate
                  ? [...get(state, `[${name}].data`), data]
                  : [...(get(state, `[${name}].data`)
                    ? get(state, `[${name}].data`)?.map(item => item.id === id
                      ? customData
                        ? {...data}
                        : {...item, ...data} : item) : [])]
                : inner
                  ? get(state, `[${name}].data`) && parseInt(get(state, `[${name}].data.${inner}.id`)) === parseInt(id)
                    ? customData
                      ? {...data}
                      : {...get(state, `[${name}].data.${inner}`), ...data}
                    : {...get(state, `[${name}].data.${inner}`)}
                  : get(state, `[${name}].data`) && parseInt(get(state, `[${name}].data.id`)) === parseInt(id)
                    ? customData
                      ? {...data}
                      : {...get(state, `[${name}].data`), ...data}
                    : {...get(state, `[${name}].data`)},
          error: null
        }
      };
    }

    case Actions.OTHER.SUCCESS: {
      const {
        name,
        url,
        data,
        params,
        values,
      } = action.payload;
      return {
        ...state,
        [name]: {
          ...get(state, `[${name}]`, {}),
          isFetched: true,
          url,
          data,
          params,
          values,
          error: null,
        }
      };
    }

    case Actions.CREATE.FAILURE:
    case Actions.UPDATE.FAILURE:
    case Actions.OTHER.FAILURE:
    case Actions.DELETE.FAILURE: {
      const {name, url, error, params, values} = action.payload;
      return {
        ...state,
        [name]: {
          isFetched: true,
          url,
          error,
          params,
          values
        }
      };
    }


    case Actions.DELETE.SUCCESS: {
      const {id, name, object, objectInnerArray} = action.payload;
      if (object) {
        delete state[name]
        return {
          ...state,
        }
      } else {
        return {
          ...state,
          [name]: {
            ...get(state, `[${name}]`, {}),
            data: objectInnerArray ? {
              ...get(state, `${name}.data`, []),
              [objectInnerArray]: get(state, `${name}.data.${objectInnerArray}`, []).filter(item => get(item, "id") !== id)
            } : [...get(state, `${name}.data`, []).filter(item => item.id !== id)],
          }
        };
      }
    }


    default:
      return state
  }
};

export default schemaReducer;