import React from 'react'
import { Switch, Route, useHistory } from 'react-router-dom'
import { useSystemState } from 'assistant/data'

import Libraries from './ui/libraries'
import NewLibrary from './ui/new-library'
import Library from './ui/library'
import NewLibraryItem from './ui/library/items/new-item'
import LibraryItem from './ui/library/items/item'

export default ( { baseURL } ) => {
	const history = useHistory()
	const { isCloudConnected } = useSystemState( 'isCloudConnected' )

	if ( ! isCloudConnected ) {
		history.replace( '/fl-cloud-connect' )
		return null
	}

	return (
		<Switch>
			<Route exact path={ `${baseURL}` } component={ Libraries } />
			<Route path={ `${baseURL}/new` } component={ NewLibrary } />
			<Route path={ `${baseURL}/:id/items/new` } component={ NewLibraryItem } />
			<Route path={ `${baseURL}/:id/items/:itemId` } component={ LibraryItem } />
			<Route path={ `${baseURL}/:id` } component={ Library } />
			<Route path={ `${baseURL}/:id/tab/:tab` } component={ Library } />
		</Switch>
	)
}
