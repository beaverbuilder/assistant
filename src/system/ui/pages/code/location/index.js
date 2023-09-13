import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button } from 'ui'
import Rule from './rule'

export const Location = ( { item } ) => {

	return (
		<>
			<Rule { ...item }/>
		</>
	)
}
