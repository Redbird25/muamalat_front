import React, {useCallback} from 'react';
import axios from 'axios';
import AsyncSelect from 'react-select/async';
import PropTypes from 'prop-types';

const Select = ({
                  url = '',
                  cacheOptions = true,
                  defaultOptions = true,
                  regionId,
                  ...props
                }) => {

  const loadData = useCallback(() => {

    if(regionId){
      return axios.get(url).then(res => res.data.data)
    }else{
      return []
    }

  },[url, regionId]);

  return (
    <>
      <AsyncSelect
        loadOptions={regionId ? loadData : () => []}
        cacheOptions={cacheOptions}
        defaultOptions={defaultOptions}
        {...props}
      />
    </>
  );
};

Select.propTypes = {
  url: PropTypes.string.isRequired,
  defaultOptions: PropTypes.bool
};


export default Select;
