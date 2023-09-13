import React, { useState, useEffect } from 'react'
import { __ } from '@wordpress/i18n'
import { Icon } from 'ui'
import { getWpRest } from 'utils/wordpress'
import { getSystemActions } from 'data'

const Rule = ( item ) => {

	const { id } = item
	const { setCurrentHistoryState } = getSystemActions()
	const [formData, setFormData] = useState( ( '' !== item.locations ) ? item.locations : [{
		type: '',
		operator: '',
		value: '',
	}] )

 
	const handleChange = ( e, index ) => {
		const { name, value } = e.target
		const updatedData = [...formData]
		updatedData[index] = {
			...updatedData[index],
			[name]: value,
		}
		setFormData(updatedData)
	}

	const AddLocation = () => {

		setFormData([
			...formData,
			{
				type: '',
				operator: '',
				value: '',
			},
		])
		return
	}

	const removeRule = ( index ) => {

		if( 2 > formData.length ) {
			return
		}

		const updatedData = [...formData]
		updatedData.splice(index, 1)
		setFormData(updatedData)
	}

	const handleSave = () => {
		const wpRest = getWpRest()
		const data = {
			meta: { code_locations :formData }
		}
		item.locations = formData
		wpRest.posts().update( id, 'data', data ).then( () => {
			setCurrentHistoryState( { item } )
		} )
	}

	return (
		<>
			{ formData.map( (group, index) => (
				<div key={index} style={ { display: 'grid', gridGap: 'var(--fluid-sm-space)', gridTemplateColumns: 'repeat(3, 1fr) 20px', margin: '5px 0' } }>
					<select value={ group.type } name='type' onChange={ (e) => handleChange( e, index ) }>
						<option value=''>{ __( 'Choose...' ) }</option>
						<option value='location'>{ __( 'Location' ) }</option>
						<option value='post_type'>{ __( 'Post Type' ) }</option>
					</select>

					<select value={ group.operator } name='operator' onChange={ (e) => handleChange( e, index ) }>
						<option value=''>{ __( 'Choose...' ) }</option>
						<option value='equals'>{ __( 'equals' ) }</option>
						<option value='does not equal'>{ __( 'does not equal' ) }</option>
					</select>

					<select value={ group.value } name='value' onChange={ (e) => handleChange( e, index ) }>
						<option value=''>{ __( 'Choose...' ) }</option>
						<option value='entire'>{ __( 'Entire site' ) }</option>
						<option value='all'>{ __( 'All Posts' ) }</option>
						<option value='pages'>{ __( 'All Pages' ) }</option>
					</select>

					<a className="fluid-button fluid-appearance-transparent" style={ { width: '20px' } } onClick={ () => removeRule( index ) }>
						<Icon.Trash />
					</a>
				</div>
			)) }
			<div style={ { margin: '5px 0' } }>
				<button style={ { marginRight: '5px' } } className="fluid-button fluid-appearance-normal" onClick={ handleSave }>{ __( 'Save' ) }</button>
				<a className="fluid-button fluid-appearance-normal" onClick={ AddLocation }>{ __( 'Add Rule' ) }</a>
			</div>
		</>
	)
}
export default Rule
