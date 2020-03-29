import React from 'react'
import classname from 'classnames'
import { Icon, Page } from 'ui'

export const Section = props => {
	return (
		<Page.Section className="fl-asst-form-section" { ...props } />
	)
}

export const Item = props => {
	const {
		children,
		className,
		label,
		labelFor,
		labelPlacement = 'above',
		hasChanges = false,
		isRequired = false,
		isVisible = true,
		errors = [],
		style = {}
	} = props

	if ( ! isVisible ) {
		return null
	}

	const classes = classname( {
		'fl-asst-form-item': true,
		[`fl-asst-form-item-placement-${labelPlacement}`]: labelPlacement,
		'fl-asst-form-item-has-changes': hasChanges,
		'fl-asst-form-item-has-errors': !! errors.length
	}, className )

	return (
		<div className={ classes } style={ style }>
			{ label &&
				<label htmlFor={ labelFor }>
					{label}
					{ isRequired && <abbr title="required"><Icon name="asterisk" /></abbr> }
				</label>
			}
			<div className="fl-asst-form-item-content">{children}</div>
			{ errors.map( ( error, key ) =>
				<div key={ key } className="fl-asst-form-item-error">{ error }</div>
			) }
		</div>
	)
}

export const Footer = props => {
	const { children, className } = props
	const classes = classname( {
		'fl-asst-form-footer': true,
	}, className )
	return (
		<div className={ classes }>{children}</div>
	)
}
