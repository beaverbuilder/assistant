import React, {useEffect, useState, useContext} from 'fl-react'
import {getWpRest} from 'assistant/utils/wordpress'
import {Page, List, App, Nav} from 'assistant/ui'

export const UpdatesApp = ( {match} ) => (
	<Nav.Switch>
		<Nav.Route exact path={`${match.url}/`} component={UpdatesMain}/>
		<Nav.Route path={`${match.url}/updates/:id`} component={Page.Update}/>
	</Nav.Switch>
)

const UpdatesMain = () => {
	return (
		<Page shouldPadSides={false}>
			<List.Updates />
		</Page>
	)
}
