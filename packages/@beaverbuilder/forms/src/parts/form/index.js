import React from 'react'
import classname from 'classnames'

export const Form = ( {
	className,
	context = Form.defaults,
	onSubmit = e => e.preventDefault(),
	additionalClasses, /* used by form hook */
	...rest
} ) => {
	const classes = classname( 'fl-asst-form', className, additionalClasses )

	return (
		<Form.Context.Provider value={ context }>
			<form className={ classes } onSubmit={ onSubmit } { ...rest } />
		</Form.Context.Provider>
	)
}
