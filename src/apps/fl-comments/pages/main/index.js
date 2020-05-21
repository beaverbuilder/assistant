import React from 'react'
import { Page } from 'assistant/ui'
import CommentList from './list'
import Filters from './filters'
import AppIcon from '../../icon'
import './style.scss'

const Main = ( { label, baseURL } ) => {

	return (
		<Page
			id="fl-comments-list-page"
			padX={ false }
			padY={ false }
			title={ label }
			header={ <Filters /> }
			icon={ <AppIcon context="sidebar" /> }
			shouldShowBackButton={ false }
			shouldScroll={ false }
		>
			<CommentList baseURL={ baseURL } />
		</Page>
	)
}

export default Main
