import React, {useState, useEffect} from 'react';
import get from 'lodash.get';
import PropTypes from 'prop-types';
import api from 'services/api';
import {useTranslation} from "react-i18next";

const Select2 = ({
                   dataKey,
                   url,
                   value,
                   name,
                   onChange,
                   getValue,
                   getLabel,
                   isActive,
                   
                   placeholder,
                   extraLabel,
                   language = false,
                   auth = null,
                   placeholderDisabled,
                   placeholderHidden,
                   optionDisabled,
                   search,
                   extraContent,
                   languageLastID = "",
                   ...props
                 }) => {
  
  const [state, setState] = useState([]);
  const {t} = useTranslation()
  
  useEffect(() => {
    if (url && isActive === true) {
      api.request.get(url)
        .then(res => {
          setState(get(res, `data.${dataKey}`));
        })
        .catch(() => {
          console.log(t("toast.error"));
        });
    }
  }, [isActive, dataKey, url, setState, t]);
  
  
  useEffect(() => {
    if (extraContent && state?.length) {
      state?.map((item, key) => {
        if (item.id === parseInt(value)) {
          return typeof extraContent === 'function' ? extraContent(item.text) : extraContent
        } else {
          return null
        }
      })
    } else {
      return null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, extraContent])
  
  if (get(props, "field") || get(props, "form")) {
    delete props["field"]
    delete props["form"]
  }
  
  return (
    <>
      {
        search
          ? <>
            <input className="form-control"
                   list={props.id + "list"}
                   name={name}
                   onChange={onChange}
                   value={value}
                   id={props.id} placeholder={placeholder} disabled={props.disabled}/>
            <datalist id={props.id + "list"}>
              {
                state && state.length
                  ? state?.map((item, key) => (
                    <option value={get(item, getValue, '')}
                            key={key}
                            disabled={optionDisabled}
                            hidden={language ? [4].includes(parseInt(get(item, getLabel, ''))) : false}
                    >{
                      language
                        ? t(`appeals.status_${get(auth, "data.user.role_id")}_${get(item, getLabel, '')}`)
                        : extraLabel
                          ? get(item, getLabel, '') + " " + get(item, extraLabel, '')
                          : get(item, getLabel, '')
                    }</option>
                  ))
                  : null
              }
            </datalist>
          </>
          : <select
            onChange={onChange}
            value={value}
            name={name}
            {...props}
          >
            <option value="" disabled={placeholderDisabled} hidden={placeholderHidden}>{placeholder}</option>
            {
              state && state.length
                ? state?.map((item, key) => (
                  <option value={get(item, getValue, '')}
                          key={key}
                          disabled={optionDisabled}
                          hidden={language ? [4].includes(parseInt(get(item, getLabel, ''))) : false}
                  >{
                    language
                      ? t(`appeals.status_${get(auth, "data.user.role_id")}_${get(item, getLabel, '')}`)
                      : extraLabel
                        ? get(item, getLabel, '') + " " + get(item, extraLabel, '')
                        : languageLastID
                          ? t(`${languageLastID + get(item, getLabel, '')}`)
                          : get(item, getLabel, '')
                  }</option>
                ))
                : null
            }
          </select>
      }
    </>
  );
};

Select2.defaultProps = {
  isActive: true,
  dataKey: 'result.data',
  url: '',
  name: 'name',
  value: '',
  getValue: 'id',
  getLabel: 'name',
  placeholder: '',
  extraLabel: "",
  placeholderDisabled: true,
  placeholderHidden: true,
  optionDisabled: false
};
Select2.propTypes = {
  isActive: PropTypes.bool,
  url: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  placeholderDisabled: PropTypes.bool,
  placeholderHidden: PropTypes.bool
};


export default Select2;