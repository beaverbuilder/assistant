import React, { useRef } from 'react'

export const FileItem = ( {
	id,
	onChange = () => {},
	accept = '*',
	...rest
} ) => {
	const ref = useRef()

	return (
		<input
			ref={ ref }
			key={ id }
			id={ id }
			type='file'
			accept={ accept }
			onChange={ () => onChange( ref.current.files ) }
		/>
	)
}
