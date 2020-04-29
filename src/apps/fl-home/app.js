import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Page, Button, Icon, Nav } from 'assistant/ui'
import { CardPage } from './ui'
import './style.scss'

export default ({ baseURL }) => (
	<Nav.Switch>
		<Nav.Route
			exact
			path={ baseURL }
			component={ CardsApp }
		/>
	</Nav.Switch>
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
