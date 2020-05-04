import React from 'react'
import { __ } from '@wordpress/i18n'
import { App, Page, Button, Icon } from 'assistant/ui'
import { CardPage } from './ui'
import './style.scss'


// Setup config like this
export default props => (
	<App.Config
		pages={ {
			default: CardsApp
		} }
		{ ...props }
	/>
)

const CardsApp = () => {

	return (
		<Page
			id="cards"
			padX={ false }
			padY={ false }
			toolbar={ false }
		>
			<CardPage
				page="home"
			/>
		</Page>
	)
}
