import React, { useState } from 'react'
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
	const [ isEditing, setIsEditing ] = useState( false )

	return (
		<Page
			id="cards"
			padX={ false }
			padY={ false }
			toolbar={ false }
		>
			<div style={ {
				display: 'flex',
				flexDirection: 'row',
				minHeight: 'var(--fluid-target-size)',
				justifyContent: 'flex-end',
				padding: 2
			} }>
				<Button
					onClick={ () => setIsEditing( ! isEditing ) }
				>
					{ isEditing ? __( 'Done' ) : <Icon.Edit /> }
				</Button>
			</div>
			<CardPage
				page="home"
				isEditing={ isEditing }
			/>
		</Page>
	)
}
