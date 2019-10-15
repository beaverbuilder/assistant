import React, { useEffect, useState } from 'fl-react'
import { getWpRest } from 'shared-utils/wordpress'
import { Form, Button, Control } from 'lib'

export const LabelsItem = ( {
	label,
} ) => {
	const [ options, setOptions ] = useState( {} )
	const wpRest = getWpRest()
	const value = [ {
		id: 'red',
		label: 'Red',
	}, {
		id: 'green',
		label: 'Green',
	}, {
		id: 'blue',
		label: 'Blue',
	} ]

	useEffect( () => {
		wpRest.labels().findWhere( {} ).then( response => {
			response.data.map( label => {
				options[ label.slug ] = label.label
			} )
			setOptions( { ...options } )
		} )
	}, [] )

	return (
		<Form.Item label={ label }>
			<Control.TagGroup value={ value } />
		</Form.Item>
	)
}
