import React from 'react'

export const ImageItem = ( {
	id,
	src,
	srcSet,
	onChange = () => {},
	...rest
} ) => {
	return (
		<img
			key={ id }
			id={ id }
			src={ src }
			srcSet={ srcSet }
			onChange={ e => onChange( e.target.value, e ) }
			width="100%"
			{ ...rest }
		/>
	)
}
