import React from 'react'
import classname from 'classnames'

export const Form = ( {
	className,
	context = Form.defaults,
	onSubmit = e => e.preventDefault(),
	additionalClasses, /* used by form hook */
	children,
	...rest
} ) => {
	const classes = classname( 'fluid-form', className, additionalClasses )

	return (
		<Form.Context.Provider value={ context }>
			<form className={ classes } onSubmit={ onSubmit } { ...rest }>
				{ children }
				<button type='submit' style={ { display: 'none' } } />
			</form>
		</Form.Context.Provider>
	)
}
