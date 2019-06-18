import React, { Fragment } from 'react'
import classname from 'classnames'
import { Padding } from 'components'
import './style.scss'

export const SettingsGroup = ( {
	children,
	className,
	label = ''
} ) => {

	const classes = classname( className, 'fl-asst-settings-group' )

	return (
		<Fragment>
			{ label &&
				<div className='fl-asst-settings-section-label'>
					{ label }
				</div>
			}
			<Padding className={ classes }>
				{ children }
			</Padding>
		</Fragment>
	)
}

export const SettingsItem = ( {
	children,
	className,
	label = '',
	labelPosition = 'beside'
} ) => {

	const classes = classname( className, {
		'fl-asst-settings-item': true,
		'fl-asst-settings-item-label-above': 'above' === labelPosition,
		'fl-asst-settings-item-label-beside': 'beside' === labelPosition,
	} )

	return (
		<div className={ classes }>
			{ label &&
				<div className='fl-asst-settings-item-label'>
					<label>{ label }</label>
				</div>
			}
			<div className='fl-asst-settings-item-control'>
				{ children }
			</div>
		</div>
	)
}
