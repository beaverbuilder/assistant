import React, { useState } from 'react'
import './style.scss'
import { DateTimePicker } from '@wordpress/components'
import { __experimentalGetSettings } from '@wordpress/date'
import '@wordpress/components/build-style/style.css'

export const CalenderItem = ({
	id,
	value,
	onChange = () => {},
	content,
	...rest
}) => {
	const unixTime = Date.parse(value)
	const [startDate, setStartDate] = useState(unixTime)
	const settings = __experimentalGetSettings()
	const is12HourTime = /a(?!\\)/i.test(
		settings.formats.time
			.toLowerCase() // Test only the lower case a
			.replace(/\\\\/g, '') // Replace "//" with empty strings
			.split('')
			.reverse()
			.join('') // Reverse the string and test for "a" not followed by a slash
	)

	return (
		<>
			<DateTimePicker
				currentDate={startDate}
				onChange={date => onChange(setStartDate(date), date)}
				is12Hour={is12HourTime}
			/>
		</>
	)
}
