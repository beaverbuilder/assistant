import React, { useState }  from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
export const CalenderItem = ( {id,value,onChange = () => {},content,...rest} ) => {
	const [startDate, setStartDate] = useState(new Date());

	return (
		<>
			<DatePicker dateFormat="dd/MM/yyyy" fixedHeight  selected={startDate} onChange={ date => setStartDate(date) }  />
		</>
	)
}

