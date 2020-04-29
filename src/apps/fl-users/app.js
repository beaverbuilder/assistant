import React from 'react'
import { Nav, Page } from 'assistant/ui'

import { Main } from './pages/main'
import { User } from './pages/user'
import { Search } from './pages/search'
import { Invite } from './pages/invite'

export default ({ baseURL }) => (
	<Nav.Switch>
		<Nav.Route exact path={ baseURL } component={ Main } />
		<Nav.Route path={ `${baseURL}/search` } component={ Search }/>
		<Nav.Route path={ `${baseURL}/invite` } component={ Invite }/>
		<Nav.Route path={ `${baseURL}/user/:id` } component={ User } />
		<Nav.Route path={ `${baseURL}/post/:id` } component={ Page.Post } />
	</Nav.Switch>
)
