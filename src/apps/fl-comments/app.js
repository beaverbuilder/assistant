import React from 'react'
import { App } from 'assistant/ui'
import { Main, Comment } from './pages'

export default props => (
	<App.Config
		pages={ {
			default: Main,
			'tab/:tab': Main,
			'comment/:id': Comment
		} }
		{ ...props }
	/>
)
