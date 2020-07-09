import React from 'react'
import { Switch, Route, useHistory } from 'react-router-dom'
import { useSystemState } from 'assistant/data'

import Dashboard from './pages/dashboard'
import NewLibrary from './pages/libraries/new-library'
import NewLibraryItem from './pages/libraries/items/new-item'
import Library from './pages/libraries/library'
import LibraryItem from './pages/libraries/items/item'

export default ( { baseURL } ) => {
	const history = useHistory()
	const { isCloudConnected } = useSystemState( 'isCloudConnected' )

	if ( ! isCloudConnected ) {
		history.replace( '/fl-cloud-connect' )
		return null
	}

	return (
		<Switch>
			<Route exact path={ `${baseURL}` } component={ Dashboard } />
			<Route path={ `${baseURL}/libraries/new` } component={ NewLibrary } />
			<Route path={ `${baseURL}/libraries/:id/items/new` } component={ NewLibraryItem } />
			<Route path={ `${baseURL}/libraries/:id/items/:itemId` } component={ LibraryItem } />
			<Route path={ `${baseURL}/libraries/:id` } component={ Library } />
			<Route path={ `${baseURL}/libraries/:id/tab/:tab` } component={ Library } />
		</Switch>
	)
}
