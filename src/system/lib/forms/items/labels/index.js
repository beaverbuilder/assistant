import React, { useEffect, useState } from 'fl-react'
import { __ } from '@wordpress/i18n'
import { getWpRest } from 'shared-utils/wordpress'
import { Form, Button, Control } from 'lib'
import './style.scss'

export const LabelsItem = ( {
	label,
	value,
	onChange = () => {},
	onAdd = () => {},
	onRemove = () => {},
} ) => {
	const [ options, setOptions ] = useState( [] )
	const [ selectedLabel, setSelectedLabel ] = useState( '' )
	const wpRest = getWpRest()

	useEffect( () => {
		wpRest.labels().findWhere( {} ).then( response => {
			setOptions( [ ...response.data ] )
		} )
	}, [] )

	const removeLabel = ( option, i ) => {
		value.splice( i, 1 )
		onChange( [ ...value ] )
		onRemove( option )
	}

	const addLabel = () => {
		if ( '' === selectedLabel ) {
			return
		}

		options.map( option => {
			if ( option.id === Number( selectedLabel ) && ! value.includes( option.id ) ) {
				value.push( option.id )
				onChange( [ ...value ] )
				onAdd( option )
			}
		} )

		setSelectedLabel( '' )
	}

	const tags = []
	const filteredOptions = []
	options.map( option => {
		if ( value.includes( option.id ) ) {
			tags.push( option )
		} else {
			filteredOptions.push( option )
		}
	} )

	return (
		<>
			{ 0 < value.length &&
				<Form.Item label={ label }>
					<Control.TagGroup
						value={ tags }
						onRemove={ removeLabel }
					/>
				</Form.Item>
			}
			{ 0 < filteredOptions.length &&
				<div className='fl-asst-add-label'>
					<select value={ selectedLabel } onChange={ e => setSelectedLabel( e.target.value ) }>
						<option value=''>{ __( 'Choose...' ) }</option>
						{ filteredOptions.map( ( option, i ) => {
							return <option key={ i } value={ option.id }>{ option.label }</option>
						} ) }
					</select>
					<Button onClick={ addLabel }>{ __( 'Add Label' ) }</Button>
				</div>
			}
		</>
	)
}
