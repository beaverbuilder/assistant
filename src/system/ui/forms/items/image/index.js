import React from 'react'

export const ImageItem = ( {
	id,
	src,
	onChange = () => {},
	...rest
} ) => {
	return (
		<img

			key={ id }
			id={ id }
			src={ src }
			onChange={ e => onChange( e.target.value, e ) }
			width="100%"
			{ ...rest }
		/>
	)
}
