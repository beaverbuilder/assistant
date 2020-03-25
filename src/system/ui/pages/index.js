import React, { useContext, createContext } from 'react'
import classname from 'classnames'
import { __ } from '@wordpress/i18n'
import { Page as FLUIDPage } from 'fluid/ui'
import { useSystemState } from 'data'
import { Nav, Icon, App } from 'ui'
import { getFirstFocusableChild } from 'utils/dom'

import {
	Pad,
	Toolbar,
	TitleCard,
	RegisteredSections,
	Empty,
} from './parts'

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

const Page = ( { className, showAsRoot = false, onLoad = focusFirstElement, ...rest } ) => {
	const { isAppRoot } = App.useApp()
	const classes = classname( {
		'is-app-root': isAppRoot || showAsRoot,
	}, className )

	return (
		<FLUIDPage
			className={ classes }
			onLoad={ onLoad }
			{ ...rest }
		/>
	)
}

Page.Section = FLUIDPage.Section


/* ------ Page System Setup ------ */
Page.defaults = {
	scrollRef: null,
}

Page.Context = createContext( Page.defaults )
Page.Context.displayName = 'Page.Context'

/* ------ Partial Components ------ */
Page.Header = ( { icon, label, actions } ) => {
	const { shouldShowLabels, window } = useSystemState()

	const app = useContext( App.Context )
	const { label: appLabel, icon: appIcon } = app

	const { history, isRoot } = useContext( Nav.Context )

	const isAppRoot = 1 === history.index

	let visual = icon
	if ( 'function' !== typeof visual ) {
		visual = appIcon
	}

	const iconProps = {
		width: 24,
		height: 24,
		windowSize: window.size,
		context: 'header',
	}

	const titleClasses = classname( {
		'fl-asst-app-header-name': true,
		'fl-asst-app-small-title': ! isRoot && ! isAppRoot,
	} )

	return (
		<>
			<div className="fl-asst-app-header">

				{ ( isRoot || isAppRoot ) && 'function' === typeof visual &&
				<div className="fl-asst-app-header-icon">
					{ visual( iconProps ) }
				</div>
				}

				{ ! isRoot && ! isAppRoot &&
				<div className="fl-asst-app-header-icon">
					<button
						onClick={ history.goBack }
						style={ {
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							color: 'inherit',
							lineHeight: 1,
							fontSize: 12,
						} }
					>
						<div style={ {
							color: 'var(--fl-asst-accent-color)',
							marginBottom: shouldShowLabels ? 5 : null,
						} }>
							<Icon.BackArrow />
						</div>
						{ shouldShowLabels && <span style={ { marginTop: 'auto' } }>{__( 'Back' )}</span> }
					</button>
				</div>
				}

				<div className={ titleClasses }>
					<span>{ label ? label : appLabel }</span>
				</div>

				{ actions && <div className="fl-asst-app-header-actions">{actions}</div> }
			</div>
		</>
	)
}


Page.Header.displayName = 'Page.Header'

// Horizontal Toolbar - edge padding for controls
Page.Toolbar = Toolbar
Page.Toolbar.displayName = 'Page.Toolbar'

// Padded box
Page.Pad = Pad
Page.Pad.displayName = 'Page.Pad'

Page.TitleCard = TitleCard
Page.TitleCard.displayName = 'Page.TitleCard'

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

Page.Empty = Empty
Page.Empty.displayName = 'Page.Empty'

Page.NotFound = PageNotFound
Page.NotFound.displayName = 'Page.NotFound'

export { Page }
