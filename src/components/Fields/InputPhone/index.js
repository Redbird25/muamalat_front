import React from 'react';
import NumberFormat from "react-number-format";



const InputPhone = ({
  className,
  name,
  format,
  placeholder,
  onChange,
  onBlur,
  onValueChange,
  value,
  type,
  mask,
  thousandSeparator='',
  isNumericString=false,
  ...rest
}) => {
  return (
    <NumberFormat
      {...{
        className,
        name,
        format,
        placeholder,
        onChange,
        onBlur,
        onValueChange,
        value,
        type,
        mask,
        thousandSeparator,
        isNumericString
      }}
      {...rest}
    />
  );
};

export default InputPhone;