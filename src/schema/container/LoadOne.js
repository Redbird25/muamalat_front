import PropTypes from 'prop-types';
// import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Actions from '../actions';
// import PublicActions from 'redux/actions'
import { createSelector } from 'reselect';
import useDeepEffect   from './customHook'
import get from "lodash.get";
import {toast} from "react-toastify";
import {useTranslation} from "react-i18next";

const LoadOne = (
  {
    isActive,
    children,
    url='',
    name='',
    params={},
    asData,
    dataKey,
    callback,
    onSuccess,
    onError,
    onFinally
  }
) => {
  const {t} = useTranslation()
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const myState = state => state.schema;
  const state = useSelector(createSelector(myState, (state) => state[name]));

  useDeepEffect(() => {
    if(isActive){
      dispatch(Actions.LoadOne.request({
        url,
        name,
        params,
        callback,
        asData,
        dataKey,
        cb: {
          success: (data) => {
            onSuccess(data);
          },
          error: (error) => {
            if(get(error, "error.code") === 401 && get(error, "error.message") === "Unauthorized"){
              // dispatch(PublicActions.LOGOUT.success());
              /*navigate('/login', { replace: true });*/
              toast.error(t("toast.return_login"));
            }else{
              onError(error)
            }
          },
          finally: () => {
            onFinally()
          },
        }
      }));
    }
  }, [dispatch, url, name, params, isActive]);

  return children(isActive ? {...state} : {})
};

LoadOne.propTypes = {
  isActive: PropTypes.bool,
  children: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  params: PropTypes.object,
  asData: PropTypes.bool,
  dataKey: PropTypes.string,
  onSuccess: PropTypes.func,
  callback: PropTypes.func,
  onError: PropTypes.func,
  onFinally: PropTypes.func,
};

LoadOne.defaultProps = {
  isActive: true,
  children: () => {},
  url: '',
  name: '',
  params: {},
  asData: false,
  dataKey: 'data',
  onSuccess: () => {},
  onError: () => {},
  onFinally: () => {},
  callback: null
};

export default LoadOne;