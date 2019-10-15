import React from 'fl-react'
import classname from 'fl-classnames'
import { Color } from 'lib'
import './style.scss'

const getDefaultColors = () => {
	return Object.keys( Color.knownColors ).map( key => {
		return Color.knownColors[ key ]
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
