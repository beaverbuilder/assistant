import React, { Fragment } from 'react'
import classname from 'classnames'
import { Padding } from 'components'
import './style.scss'

export const FormSection = ( {
	children,
	className,
	label = ''
 } ) => {

	const classes = classname( className, 'fl-asst-form-section' )

	return (
		<Fragment>
			{ label &&
				<div className='fl-asst-form-section-label'>
					{ label }
				</div>
			}
			<Padding className={ classes }>
				{ children }
			</Padding>
		</Fragment>
	)
}

export const FormField = ( {
	children,
	className,
	label = '',
	labelPosition = 'above'
 } ) => {

	const classes = classname( className, {
		'fl-asst-field': true,
		'fl-asst-field-label-above': 'above' === labelPosition,
		'fl-asst-field-label-beside': 'beside' === labelPosition,
	} )

	return (
		<div className={ classes }>
			<div className='fl-asst-field-label'>
				<label>{ label }</label>
			</div>
			<div className='fl-asst-field-input'>
				{ children }
			</div>
		</div>
	)
}
