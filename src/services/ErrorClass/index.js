import {get} from "lodash";

const ErrorClass = (errors, touched, name, returnNotClass = false) => {
  if (get(errors, name) && get(touched, name)) {
    return returnNotClass ? true : 'is-invalid'
  } else if ((get(touched, name) && !get(errors, name))) {
    return returnNotClass ? false : 'is-valid'
  } else {
    return returnNotClass ? false : ''
  }
};

export default ErrorClass;
