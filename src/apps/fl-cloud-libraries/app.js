import React from 'react'
import { Switch, Route, useHistory } from 'react-router-dom'
import { useSystemState } from 'assistant/data'

import Libraries from './ui/libraries'
import Library from './ui/library-new'
import LibraryItem from './ui/library-item'

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
			<Route path={ `${baseURL}/:id/items/:itemId` } component={ LibraryItem } />
			<Route path={ `${baseURL}/:id` } component={ Library } />
		</Switch>
	)
}
