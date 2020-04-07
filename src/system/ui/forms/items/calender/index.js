import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./style.scss";
import { DateTimePicker } from '@wordpress/components';
export const CalenderItem = ({
	id,
	value,
	onChange = () => {},
	content,
	...rest
}) => {
	const unixTime = Date.parse(value);
	const [startDate, setStartDate] = useState(unixTime);

	return (
		<>
		<DateTimePicker
            currentDate={ date }
            onChange={ ( date ) => setState( { date } ) }
            is12Hour={ is12HourTime }
        />
			<DatePicker
				key={id}
				id={id}
				value={startDate}
				dateFormat="yyyy/MM/dd h:mm aa"
				fixedHeight
				selected={startDate}
				timeInputLabel="Time:"
				showTimeInput
				showYearDropdown
				dateFormatCalendar="MMMM"
				yearDropdownItemNumber={15}
				scrollableYearDropdown
				onChange={date => onChange(setStartDate(date), date)}
				value={startDate}
				{...rest}
			/>
		</>
	);
};
