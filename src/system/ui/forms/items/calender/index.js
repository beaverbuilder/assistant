import React, { useState } from 'react'
import { Button, Menu } from 'ui'
import { DateTimePicker } from '@wordpress/components'
import { __experimentalGetSettings, dateI18n } from '@wordpress/date'
import './style.scss'

export const CalenderItem = ({
	value,
	onChange = () => {},
}) => {
	const [ isMenuShowing, setIsMenuShowing ] = useState( false )
	const unixTime = Date.parse(value)
	const [ startDate, setStartDate ] = useState( unixTime )
	const settings = __experimentalGetSettings()
	const is12HourTime = /a(?!\\)/i.test(
		settings.formats.time
			.toLowerCase() // Test only the lower case a
			.replace(/\\\\/g, '') // Replace "//" with empty strings
			.split('')
			.reverse()
			.join('') // Reverse the string and test for "a" not followed by a slash
	)

	const label = dateI18n( settings.formats.datetime, startDate )

	const MenuContent = () => {
		return (
			<DateTimePicker
				currentDate={ startDate }
				onChange={ date => onChange( setStartDate( date ), date ) }
				is12Hour={ is12HourTime }
			/>
		)
	}

	return (
		<Menu
			content={ <MenuContent /> }
			isShowing={ isMenuShowing }
			className="fl-asst-calendar-menu"
		>
			<Button
				appearance="transparent"
				onClick={ () => setIsMenuShowing( !isMenuShowing )}
			>{label}</Button>
		</Menu>
	)
}
