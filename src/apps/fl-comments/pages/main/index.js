import React from 'react'
import { Page } from 'assistant/ui'
import CommentList from './list'
import AppIcon from '../../icon'

const Main = ( { label, baseURL } ) => {

	return (
		<Page
			id="fl-comments-list-page"
			padX={ false }
			padY={ false }
			title={ label }
			icon={ <AppIcon context="sidebar" /> }
			shouldShowBackButton={ false }
			shouldScroll={ false }
			showAsRoot={ true }
		>
			<CommentList baseURL={ baseURL } />
		</Page>
	)
}

export default Main
