import React from 'react'
import { __ } from '@wordpress/i18n'
import { useAppState, getAppActions } from 'assistant/data'
import { Filter } from 'assistant/ui'
import { statuses, defaultStatus } from '../../../data'

const Filters = () => {
	const { type } = useAppState()
	const { setType } = getAppActions()
	return (
		<Filter>
			<Filter.RadioGroupItem
				title={ __( 'Status' ) }
				items={ statuses }
				value={ type }
				defaultValue={ defaultStatus }
				onChange={ value => setType( value ) }
			/>
			<Filter.Button onClick={ () => setType( defaultStatus ) }>{__( 'Reset Filter' )}</Filter.Button>
		</Filter>
	)
}

export default Filters
