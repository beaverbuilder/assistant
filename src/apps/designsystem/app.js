import React from 'react'
import { __ } from '@wordpress/i18n'
import { Switch, Route } from 'react-router-dom'
import { Page, Button, Icon, Layout } from 'assistant/ui'
import { useSystemState, getSystemActions } from 'assistant/data'
import { Docs } from 'fluid'

const ToggleBrightness = () => {
	const { appearance } = useSystemState( 'appearance' )
	const { setBrightness } = getSystemActions()
	const isDark = 'dark' === appearance.brightness
	return (
		<Button onClick={ () => setBrightness( isDark ? 'light' : 'dark' ) }>
			{ isDark ? <Icon.Brightness /> : <Icon.Moon /> }
		</Button>
	)
}

const FLUID = ( { baseURL } ) => {
	return (
		<Page title={ __( 'FLUID' ) } padX={ false } actions={ <ToggleBrightness /> }>

			<Layout.Toolbar>
				<Button.Group style={ { margin: '0 auto 10px' } }>
					<Button to={ `${baseURL}/` }>Intro</Button>
					<Button to={ `${baseURL}/color` }>Color</Button>
					<Button to={ `${baseURL}/buttons` }>Button</Button>
					<Button to={ `${baseURL}/icons` }>Icon</Button>
				</Button.Group>
			</Layout.Toolbar>

			<Switch>
				<Route exact path={ `${baseURL}/` } component={ Docs.IntroSheet } />
				<Route exact path={ `${baseURL}/color` } component={ Docs.ColorSheet } />
				<Route exact path={ `${baseURL}/buttons` } component={ Docs.ButtonSheet } />
				<Route exact path={ `${baseURL}/icons` } component={ Docs.IconSheet } />
			</Switch>
		</Page>
	)
}

export default FLUID
