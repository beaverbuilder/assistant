import React from 'react'
import { __ } from '@wordpress/i18n'
import { Switch, Route, Redirect } from 'react-router-dom'
import { getSystemConfig } from 'assistant/data'
import { Page, Nav } from 'assistant/ui'
import { PostTypeTab } from './tabs'
import { SplitView, Sidebar } from './admin'
import './style.scss'

export default ( { baseURL } ) => (
    <SplitView sidebar={ <Sidebar /> }>
        <Switch>
            <Route exact path={ baseURL }>
                <Redirect to={ { pathname: `${baseURL}/tab/post` } } />
            </Route>
            <Route path={ `${baseURL}/tab/:tab` }>
                <SplitView sidebar={ <Main /> }>
                    <Switch>
                        <Route exact path={ `${baseURL}/tab/:tab/post/:id` } render={ props => {
                            console.log('render')
                            return <Page.Post key={props.match.params.id} {...props} />
                        }} />
                    </Switch>
                </SplitView>
            </Route>
        </Switch>
    </SplitView>
)

const Main = () => {
	const { contentTypes } = getSystemConfig()

	const getTabs = () => {
		let tabs = []
		Object.keys( contentTypes ).map( key => {

			const type = contentTypes[key]
			tabs.push( {
				handle: key,
				path: '/fl-content/tab/' + key,
				label: type.labels.plural,
				component: () => <PostTypeTab type={ key } />,
			} )
		} )

		return tabs
	}

	const tabs = getTabs()

	const onLoad = () => {
		const item = document.querySelector( '.fl-asst-filter .fluid-button' )
		if ( item ) {
			item.focus()
		}
	}

	return (
		<Page
			id="fl-asst-content-list-page"
			padY={ false }
			topContentStyle={ { border: 'none' } }
			shouldScroll={ false }
			shouldShowBackButton={ false }
			showAsRoot={ true }
			onLoad={ onLoad }
            toolbar={false}
		>
			<Nav.CurrentTab tabs={ tabs } />
		</Page>
	)
}
