import React, { createContext } from 'react'
import classname from 'classnames'
import { App } from '@beaverbuilder/app-core'
import { Page as FLUIDPage } from '@beaverbuilder/fluid'
import { Layout, Notice } from 'ui'
import { getFirstFocusableChild } from 'utils/dom'

import DetailPage from './detail'
import { Post } from './post'
import { CreatePost } from './post/create'
import { Term } from './term'
import { Attachment } from './attachment'
import { Plugin, Theme } from './themes-plugins'
import { Comment } from './comment'
import { PageNotFound } from './not-found'
import { Code } from './code'
import Loading from './loading'
import Error from './error'
import './style.scss'

const focusFirstElement = () => {
	const page = document.querySelector( '.fl-asst-screen-content' )
	const first = getFirstFocusableChild( page )
	if ( first ) {
		first.focus()
	}
}

const Page = ( {
	className,
	showAsRoot = false,
	onLoad = focusFirstElement,
	tabs,
	toolbar,
	overlay,
	children,
	...rest
} ) => {
	const { isAppRoot } = App.use()
	const { notices, renderNotices } = Notice.useNotices()

	const classes = classname( {
		'is-app-root': isAppRoot || showAsRoot,
		'fl-asst-page-has-tabs': tabs,
	}, className )

	const Overlay = () => (
		<>
			{overlay}
			{renderNotices()}
		</>
	)

	return (
		<FLUIDPage
			className={ classes }
			onLoad={ onLoad }
			toolbar={ tabs ? <Layout.TabsToolbar tabs={ tabs } /> : toolbar }
			overlay={ ( overlay || ( notices && 0 < notices.length ) ) && <Overlay /> }
			shouldShowBackButton={ true }
			{ ...rest }
		>
			{children}
		</FLUIDPage>
	)
}

// Pass along from FLUID
Page.Section = FLUIDPage.Section

/* ------ Page System Setup ------ */
Page.defaults = {
	scrollRef: null,
}

Page.Context = createContext( Page.defaults )

/* ------ Page Types ------ */
Page.Comment = Comment
Page.Post = Post
Page.CreatePost = CreatePost
Page.Term = Term
Page.Attachment = Attachment
Page.Plugin = Plugin
Page.Theme = Theme
Page.NotFound = PageNotFound
Page.Loading = Loading
Page.Error = Error
Page.Detail = DetailPage
Page.Code = Code

export { Page }

export default Page
