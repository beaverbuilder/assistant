import React from 'react'
import { App } from 'assistant/ui'
import { Main, Comment, Post } from './pages'

export default props => (
	<App.Config
		pages={ {
			default: Main,
			'comment/:id': Comment,
			'post/:id': Post,
		} }
		{ ...props }
	/>
)
