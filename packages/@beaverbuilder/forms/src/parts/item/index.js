import React from 'react'
import classname from 'classnames'
import Loading from '../../temp-components/loading'

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
		isLoading = false,
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
					{ isRequired && <abbr title="required">*</abbr> }
					{ isLoading && <Layout.Loading /> }
				</label>
			}
			<div className="fl-asst-form-item-content">{children}</div>
			{ errors.map( ( error, key ) =>
				<div key={ key } className="fl-asst-form-item-error">{ error }</div>
			) }
		</div>
	)
}
