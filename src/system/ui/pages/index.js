import React, { createContext } from 'react'
import classname from 'classnames'
import { Page as FLUIDPage } from 'fluid/ui'
import { App, Nav } from 'ui'
import { getFirstFocusableChild } from 'utils/dom'

import { RegisteredSections } from './parts'

import { Post } from './post'
import { CreatePost } from './post/create'
import { User } from './user'
import { Term } from './term'
import { Attachment } from './attachment'
import { Plugin, Theme } from './themes-plugins'
import { Comment } from './comment'
import { PageNotFound } from './not-found'

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
	notices,
	children,
	...rest
} ) => {
	const { isAppRoot } = App.useApp()
	const classes = classname( {
		'is-app-root': isAppRoot || showAsRoot,
		'fl-asst-page-has-tabs': tabs,
	}, className )

	return (
		<FLUIDPage
			className={ classes }
			onLoad={ onLoad }
			toolbar={ tabs ? <Nav.TabsToolbar tabs={ tabs } /> : toolbar }
			{ ...rest }
		>
			{children}
			{ notices && <div className="fl-asst-notices-area">{notices}</div> }
		</FLUIDPage>
	)
}

Page.Section = FLUIDPage.Section


/* ------ Page System Setup ------ */
Page.defaults = {
	scrollRef: null,
}

Page.Context = createContext( Page.defaults )
Page.Context.displayName = 'Page.Context'

Page.RegisteredSections = RegisteredSections
Page.RegisteredSections.displayName = 'Page.RegisteredSections'

/* ------ Page Types ------ */
Page.Comment = Comment
Page.Comment.displayName = 'Page.Comment'

Page.Post = Post
Page.Post.displayName = 'Page.Post'

Page.CreatePost = CreatePost
Page.CreatePost.displayName = 'Page.CreatePost'

Page.Term = Term
Page.Term.displayName = 'Page.Term'

Page.Attachment = Attachment
Page.Attachment.displayName = 'Page.Attachment'

Page.User = User
Page.User.displayName = 'Page.User'

Page.Plugin = Plugin
Page.Plugin.displayName = 'Page.Plugin'

Page.Theme = Theme
Page.Theme.displayName = 'Page.Theme'

Page.NotFound = PageNotFound
Page.NotFound.displayName = 'Page.NotFound'

export { Page }
