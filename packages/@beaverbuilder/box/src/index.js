import React from 'react'
import FLBox from './box'

/**
 * The proxy object allows our function component to handle custom properties
 * without actually having those properties set.
 * For example: <FLBox.div /> - there's no actual div property attached to the component.
 * The Proxy() get() handler will convert property requests into tag="div" props on our FLBox component.
 *
 * This works for other shorthand concepts like poster - translates to aspect="3:4" prop.
*/
export default new Proxy( { FLBox }, {

	/**
	 * Getter function returns our component with the tag folded into props
	 */
	get: ( { FLBox }, key = 'div' ) => props => {
		let newProps = { ...props }

		switch ( key ) {

		// box and column are aliases for flex-direction: column.
		case 'box':
		case 'column':
			newProps.column = true
			break

		case 'row':
			newProps.row = true
			break

		// Poster is just for aspect ratio. Default div or tag prop will get used for element.
		case 'poster':
			newProps.ratio = '3:4'
			break

		// In most cases we just want to pass the key as the tag attribute.
		default:

			// Don't override tag if they've already created one
			newProps.tag = props.tag ? props.tag : key
		}
		return React.createElement( FLBox, { ...newProps } )
	}
} )
