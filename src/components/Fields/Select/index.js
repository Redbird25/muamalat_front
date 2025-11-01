import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const SelectField = ({
                       optionLabel,
                       optionValue,
                       menuListHeight,
                       menuListMaxHeight = 200,
                       menuListWidth,
                       className,
                       style = null,
                       ...props
                     }) => {
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
  
  return (
    <>
      <Select
        styles={style ? style : customStyles}
        components={animatedComponents}
        className={className}
        getOptionLabel={option => typeof optionLabel === 'function' ? optionLabel(option) : option[optionLabel]}
        getOptionValue={option => typeof optionValue === 'function' ? optionValue(option) : option[optionValue]}
        {...props}
      />
    </>
  );
};

export default SelectField;