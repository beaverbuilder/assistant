import React, { useState, useEffect } from 'react'
import { __ } from '@wordpress/i18n'
import { Icon, Form } from 'ui'
import { getWpRest } from 'utils/wordpress'
import { getSystemActions, getSystemConfig } from 'data'

const Rules = ( { item, onChange } ) => {

	const { id } = item
	const { setCurrentHistoryState } = getSystemActions()
	const { contentTypes } = getSystemConfig()
	const typesData = Object.entries( contentTypes )
	const exclude_types = ['fl-builder-template', 'fl_code', 'fl-theme-layout']
	const types = typesData.filter( t => true === t[1].canView && !exclude_types.includes( t[0] ) )
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
		setFormData( updatedData )
		onChange( updatedData )
	}

	const addLocation = () => {

		const updatedData = [
			...formData,
			{
				type: '',
				operator: '',
				value: '',
			},
		]
		setFormData( updatedData )
		onChange( updatedData )
	}

	const removeRule = ( index ) => {

		if( 2 > formData.length ) {
			return
		}

		const updatedData = [ ...formData ]
		updatedData.splice( index, 1 )
		setFormData( updatedData )
		onChange( updatedData )
	}

	const Rule = () => {

		return (
			<>
				{ formData.map( (group, index) => (
					<div key={index} style={ { display: 'grid', gridGap: 'var(--fluid-sm-space)', gridTemplateColumns: 'post_type' !== formData[ index ].type ? '1fr 20px' : 'repeat(3, 1fr) 20px', margin: '5px 0' } }>
						<select value={ group.type } name='type' onChange={ (e) => handleChange( e, index ) }>
							<option value=''>{ __( 'Choose...' ) }</option>
							<optgroup label="General">
								<option value='entire_site'>{ __( 'Entire site' ) }</option>
								<option value='all_singular'>{ __( 'All Singular' ) }</option>
								<option value='all_archives'>{ __( 'All Archives' ) }</option>
								<option value='author_archives'>{ __( 'Author Archives' ) }</option>
								<option value='date_archives'>{ __( 'Date Archives' ) }</option>
								<option value='search_results'>{ __( 'Search Results' ) }</option>
								<option value='404_page'>{ __( '404 Page' ) }</option>
							</optgroup>
							<optgroup label="Posts">
								<option value='post_type'>{ __( 'Post Type' ) }</option>
							</optgroup>
						</select>

						{ 'post_type' === formData[ index ].type &&
							<select value={ group.operator } name='operator' onChange={ (e) => handleChange( e, index ) }>
								<option value=''>{ __( 'Choose...' ) }</option>
								<option value='equals'>{ __( 'equals' ) }</option>
								<option value='does_not_equal'>{ __( 'does not equal' ) }</option>
							</select>
						}

						{ 'post_type' === formData[ index ].type &&
							<select value={ group.value } name='value' onChange={ (e) => handleChange( e, index ) }>
								{
									types.map( t => <option value={ t[0] }>{ t[1].labels.singular }</option> )
								}
							</select>
						}

						{ 1 < formData.length && <a className="fluid-button fluid-appearance-transparent" style={ { width: '20px' } } onClick={ () => removeRule( index ) }>
							<Icon.Trash />
						</a> }
					</div>
				)) }
			</>
		)
	}

	return (
		<>
			<Rule />
			<div style={ { margin: '5px 0' } }>
				<a className="fluid-button fluid-appearance-normal" onClick={ addLocation }>{ __( 'Add Rule' ) }</a>
			</div>
		</>
	)
}
export default Rules
