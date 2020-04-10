import React from 'react'
import { Nav, Page } from 'assistant/ui'

import { Main } from './pages/main'
import { User } from './pages/user'
import { Search } from './pages/search'
import { Invite } from './pages/invite'

export const Users = ( { match } ) => (
	<Nav.Switch>
		<Nav.Route exact path={ `${match.url}/` } component={ Main } />
		<Nav.Route path={ `${match.url}/search` } component={ Search }/>
		<Nav.Route path={ `${match.url}/invite` } component={ Invite }/>
		<Nav.Route path={ `${match.url}/user/:id` } component={ User } />
		<Nav.Route path={ `${match.url}/post/:id` } component={ Page.Post } />
	</Nav.Switch>
)
