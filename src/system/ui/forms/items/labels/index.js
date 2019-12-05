import React, { useEffect, useState } from 'react'
import { CancelToken, isCancel } from 'axios'
import { __ } from '@wordpress/i18n'
import { getWpRest } from 'utils/wordpress'
import { Button, Control } from 'ui'
import './style.scss'

export const LabelsItem = ( {
	value,
	onChange = () => {},
	onAdd = () => {},
	onRemove = () => {},
} ) => {
	const [ options, setOptions ] = useState( [] )
	const [ selectedLabel, setSelectedLabel ] = useState( '' )
	const wpRest = getWpRest()
	const source = CancelToken.source()

	useEffect( () => {
		wpRest.labels().findWhere( {}, {
			cancelToken: source.token,
		} ).then( response => {
			setOptions( [ ...response.data ] )
		} ).catch( ( error ) => {
			if ( ! isCancel( error ) ) {
				console.log( error ) // eslint-disable-line no-console
			}
		} )
		return () => source.cancel()
	}, [] )

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
