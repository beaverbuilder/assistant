import React from 'react'
import { withRouter } from 'fl-react-router-dom'
import { Appearance, App, Error, Page, Nav } from 'assistant/lib'
import { useSystemState } from 'assistant/data'

export const Assistant = () => {
	const { appearance, window } = useSystemState()
	const { brightness = 'light' } = appearance
	const { size } = window

	return (
		<Nav.Provider>
			<App.Provider>
				<Appearance brightness={ brightness } size={ 'mini' === size ? 'compact' : 'normal' }>
                    <Error.Boundary alternate={ WindowError }>

                        <AppRouting />

                    </Error.Boundary>
				</Appearance>
			</App.Provider>
		</Nav.Provider>
	)
}

export const HomeScreen = () => {
	return (
		<Page shouldPadSides={ false } shouldShowHeader={ false }>
			<Page.RegisteredSections
				location={ { type: 'home' } }
				data={ {} }
			/>
		</Page>
	)
}

export const AppRouting = withRouter(  ( { location } ) => {
	return (
		<Nav.Switch location={ location }>
			<Nav.Route exact path="/" component={ HomeScreen } />
			{ /* <Nav.Route path="/:app" component={ AppContent } />  */ }
			<Nav.Route component={ Page.NotFound } />
		</Nav.Switch>
	)
} )

const WindowError = () => {
	return (
		<Page shouldPadTop={ true }>
			<h1>{__( 'We Have A Problem!' )}</h1>
			<p>{__( 'There seems to be an issue inside the panel content.' )}</p>
		</Page>
	)
}
