import React, {useCallback} from 'react';
import axios from 'axios';
import AsyncSelect from 'react-select/async';
import PropTypes from 'prop-types';

const Select = (props) => {

  const loadData = useCallback(() => {

    if(props.regionId){
      return axios.get(props.url).then(res => res.data.data)
    }else{
      return []
    }

  },[props.url, props.regionId]);

  return (
    <>
      <AsyncSelect
        loadOptions={props.regionId ? loadData : () => []}
        {...props}
      />
    </>
  );
};

Select.propTypes = {
  url: PropTypes.string.isRequired,
  defaultOptions: PropTypes.bool
};


Select.defaultProps = {
  url: '',
  cacheOptions: true,
  defaultOptions: true
};


export default Select;