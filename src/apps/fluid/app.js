import React from 'react'
import { __ } from '@wordpress/i18n'
import { Page } from 'assistant/ui'
import { List } from 'fluid'

const FLUID = () => {
	return (
		<Page title={ __( 'FLUID' ) } padX={ false }>

			<List.Test />

		</Page>
	)
}

export default FLUID
