import React, {useEffect} from "react";
import {AsyncPaginate} from "react-select-async-paginate";
import {api, session} from 'services';
import get from 'lodash.get';
import PropTypes from 'prop-types';
// import {useTranslation} from "react-i18next";


const Select = (
  {
    isActive = false,
    url,
    other = false,
    perPage,
    optionLabel,
    optionValue,
    filterParams,
    defaultValue,
    value,
    onChange,
    updateValue = false,
    inputClassName,
    hideSelectedOptions,
    closeMenuOnSelect,
    menuListHeight,
    menuListMaxHeight,
    menuListWidth,
    dataKey,
    type,
    key,
    onInputChangeValue,
    onMenuOpen,
    onMenuClose,
    onSuccess,
    style,
    postMethod,
    setValue,
    isOptionJoin,
    ...rest
  }) => {
  
  // const {t} = useTranslation();
  
  
  const customStyles = {
    multiValueLabel: (props) => ({
      ...props,
      fontSize: '13px'
    }),
    menuList: props => ({
      ...props,
      height: menuListHeight,
      maxHeight: menuListMaxHeight,
      width: menuListWidth,
    }),
    option: (props) => ({
      ...props,
      fontSize: '14px',
    }),
    placeholder: (props) => ({
      ...props,
      fontSize: '14px'
    }),
    singleValue: (props) => ({
      ...props,
      fontSize: '14px'
    }),
    valueContainer: (props) => ({
      ...props,
      width: '80%'
    }),
    menuPortal: provided => ({...provided, zIndex: 9999}),
    menu: provided => ({...provided, zIndex: 9999})
  };
  const load = async ({page, url, perPage, filterParams, dataKey}) => {
    
    let {data: {result}} = postMethod ? await api.request.post(api.queryBuilder(url, {
      page,
      perPage, ...filterParams
    }), {
      headers: {
        "Authorization": `Bearer ${session.get('token')}`
      }
    }) : await api.request.get(api.queryBuilder(url, {page, perPage, ...filterParams}), {
      headers: {
        "Authorization": `Bearer ${session.get('token')}`
      }
    });
    
    if (onSuccess) {
      onSuccess(result)
    }
    
    if (isOptionJoin) {
      if (result?.data?.length) {
        result.data.unshift(isOptionJoin)
      }
    }
    
    return {
      options: dataKey ? get(result, dataKey, []) : (result || []),
      hasMore: get(result, "meta.current_page", 1) < get(result, "meta.last_page", 1),
      additional: {
        page: get(result, 'meta.current_page', 1) + 1
      }
    }
  };
  
  useEffect(() => {
    if (isActive && setValue) {
      load({page: 1, url, perPage, filterParams, dataKey}).then(r => {
        setValue(r.options.filter(item => item.id === parseInt(defaultValue))[0])
        return r
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue, isActive])
  
  return (
    <>
      <AsyncPaginate
        cacheUniqs={[type]}
        key={key}
        styles={style ? style : customStyles}
        isCreatable={false}
        defaultValue={defaultValue}
        value={value}
        additional={{page: 1}}
        loadOptions={(search, prevOptions, {page}) => {
          
          return load({
            search,
            prevOptions,
            page,
            other,
            url,
            perPage,
            filterParams: typeof filterParams === 'function' ? filterParams(search) : filterParams,
            dataKey
          })
        }
        }
        itemSize={25}
        isMulti
        hideSelectedOptions={hideSelectedOptions}
        closeMenuOnSelect={closeMenuOnSelect}
        noOptionsMessage={() => "Ma'lumot mavjud emas"}
        loadingMessage={() => "Yuklanmoqda"}
        onChange={onChange}
        getOptionLabel={option => typeof optionLabel === 'function' ? optionLabel(option) : option[optionLabel]}
        getOptionValue={option => typeof optionValue === 'function' ? optionValue(option) : option[optionValue]}
        inputClassName={inputClassName}
        onInputChange={e => typeof onInputChangeValue === 'function' ? onInputChangeValue(e) : e[onInputChangeValue]}
        debounceTimeout={500}
        {...rest}
        onMenuOpen={onMenuOpen}
        onMenuClose={onMenuClose}
      
      />
    </>
  );
};

Select.defaultProps = {
  // url: '',
  optionValue: 'id',
  optionLabel: 'name',
  hideSelectedOptions: false,
  perPage: 20,
  closeMenuOnSelect: false,
  dataKey: 'data',
  key: "1"
};

Select.propTypes = {
  url: PropTypes.string.isRequired
};


export default Select;