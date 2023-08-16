import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button } from 'ui'

export const getSiteLocations = ( { values, setValue } ) => {
	const {
		id,
		title,
		type,
		url,
		editUrl,
		status,
		trashedStatus,
		bbCanEdit,
		bbBranding,
		bbEditUrl,
	} = values

	const AddLocation = () => {}

	const lastPosts = () => {}

	return (
		<>
			<div style={ { display: 'grid', gridGap: 'var(--fluid-med-space)', gridTemplateColumns: '1fr 1fr' } }>
				<select
					value={'posts'}
					onChange={ lastPosts }
				>
					<option value='posts'>{ __( 'Posts' ) }</option>
					<option value='pages'>{ __( 'Pages' ) }</option>
				</select>
				<select
					value={'all'}
				>
					<option value='all'>{ __( 'All Posts' ) }</option>
					<option value='pages'>{ __( 'All Pages' ) }</option>
				</select>
			</div>
			<button className="fluid-button fluid-appearance-normal" onClick={ AddLocation }>{ __( 'Add Location' ) }</button>	
		</>
	)
}
