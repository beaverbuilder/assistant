import React from 'react'
import classname from 'classnames'
import { Color } from 'lib'
import './style.scss'

const getDefaultColors = () => {
	return Object.keys( Color.labelColors ).map( key => {
		return Color.labelColors[ key ]
	} )
}

export const CirclePicker = ( {
	colors = getDefaultColors(),
	value = '',
	onChange = () => {}
} ) => {
	return (
		<div className='fl-asst-circle-picker'>
			{ colors.map( ( color, key ) => {
				return (
					<div
						key={ key }
						className={ classname( {
							'fl-asst-circle-picker-item': true,
							'fl-asst-circle-picker-selected': color === value,
						} ) }
						style={ {
							backgroundColor: color,
							borderColor: color,
						} }
						onClick={ () => onChange( color ) }
					></div>
				)
			} ) }
		</div>
	)
}
