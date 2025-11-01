import PropTypes from 'prop-types';
// import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import Actions from '../actions';
// import PublicActions from 'redux/actions'
import {createSelector} from 'reselect';
import useDeepEffect from './customHook';
import {toast} from "react-toastify";
import get from 'lodash.get';
import {useTranslation} from "react-i18next";

const LoadAll = (
  {
    isActive,
    children,
    url = '',
    name = '',
    params = {},
    append,
    prepend,
    asData,
    dataKey,
    metaKey,
    callback,
    onSuccess,
    onError,
    onFinally
  }
) => {
  const {t} = useTranslation()
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const selectSchema = state => state.schema;
  const state = useSelector(createSelector(selectSchema, (state) => state[name]));
  
  useDeepEffect(() => {
    if (isActive) {
      dispatch(Actions.LoadAll.request({
        url,
        name,
        params,
        asData,
        dataKey,
        metaKey,
        append,
        prepend,
        callback,
        cb: {
          success: (data, meta) => {
            onSuccess(data, meta);
          },
          error: (error) => {
            if (get(error, "error.message") === "Unauthenticated.") {
              // dispatch(PublicActions.LOGOUT.success());
              /*navigate('/login', {replace: true});*/
              toast.error(t("toast.return_login"));
            } else {
              onError(error)
            }
          },
          finally: () => {
            onFinally(params)
          },
        }
      }));
    }
  }, [dispatch, url, name, params, isActive]);
  
  return children({...state})
};

LoadAll.propTypes = {
  isActive: PropTypes.bool,
  children: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  params: PropTypes.object,
  append: PropTypes.bool,
  prepend: PropTypes.bool,
  asData: PropTypes.bool,
  dataKey: PropTypes.string,
  metaKey: PropTypes.string,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onFinally: PropTypes.func,
  callback: PropTypes.func
};

LoadAll.defaultProps = {
  isActive: true,
  children: () => {
  },
  url: '',
  name: '',
  params: {},
  append: false,
  prepend: false,
  asData: false,
  dataKey: 'data',
  metaKey: 'meta',
  onSuccess: () => {
  },
  onError: () => {
  },
  onFinally: () => {
  },
  callback: null,
};

export default LoadAll;