import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { useSystemState } from 'data'
import { Button, Control } from 'ui'
import './style.scss'

export const LabelsItem = ( {
	value,
	onChange = () => {},
	onAdd = () => {},
	onRemove = () => {},
} ) => {
	const { labels } = useSystemState()
	const [ selectedLabel, setSelectedLabel ] = useState( '' )

	const removeLabel = ( option ) => {
		const i = value.indexOf( option.id )
		value.splice( i, 1 )
		onChange( [ ...value ] )
		onRemove( option )
	}

	const addLabel = () => {
		if ( '' === selectedLabel ) {
			return
		}

		labels.map( option => {
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
	labels.map( option => {
		if ( value.includes( option.id ) ) {
			tags.push( option )
		} else {
			filteredOptions.push( option )
		}
	} )

	return (
		<>
			{ 0 < value.length &&
				<div className='fl-asst-selected-labels'>
					<Control.TagGroup
						value={ tags }
						onRemove={ removeLabel }
					/>
				</div>
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
