import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TimePicker = ({ className="", value, showYearPicker, onChange, }) => {
  const [startDate, setStartDate] = useState(null);

  return (
    <DatePicker
      className={className}
      selected={startDate}
      showYearPicker={showYearPicker}
      onChange={(date) => {
        setStartDate(date);
      }}
      dateFormat="yyyy"
      yearItemNumber={18}
      placeholderText="YYYY"
    />
  );
};

TimePicker.defaultProps = {

};

export default TimePicker;