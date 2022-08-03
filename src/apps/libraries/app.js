import React from 'react'
import { Switch, Route, useHistory } from 'react-router-dom'
import { Selection } from '@beaverbuilder/fluid'
import { useSystemState } from 'assistant/data'
import { Library, Libraries } from './ui'

export default ( { baseURL } ) => {
	const history = useHistory()
	const { isCloudConnected } = useSystemState( 'isCloudConnected' )

	if ( ! isCloudConnected ) {
		history.replace( '/fl-cloud-connect' )
		return null
	}

	return (
		<Selection.Provider>
			<Switch>
				<Route exact path={ `${baseURL}` } component={ Libraries } />
				<Route path={ `${baseURL}/:id` } component={ Library } />
			</Switch>
		</Selection.Provider>
	)
}
