import React, { useRef, useContext, createContext } from 'fl-react'
import classname from 'fl-classnames'
import { __ } from '@wordpress/i18n'
import { useSystemState } from '../../store'
import { Nav, Icon, App, Window } from '../'
import { Comment, Update, Post, Attachment, User } from './detail-pages'
import './style.scss'

export const Page = ( {
	className,
	shouldShowHeader = true,
	shouldPadTop = false,
	shouldPadSides = true,
	shouldPadBottom = true,
	title,
	headerActions,
	toolbar,
	icon,
	children,
	...rest
} ) => {

	const ref = useRef()

	const classes = classname( {
		'fl-asst-page-content': true,
		'fl-asst-pad-top': shouldPadTop,
		'fl-asst-pad-sides': shouldPadSides,
		'fl-asst-pad-bottom': shouldPadBottom,
	}, className )

	const context = {
		...Page.defaults,
		scrollRef: ref,
	}

	return (
		<Page.Context.Provider value={context}>
			<div className="fl-asst-page">
				{ shouldShowHeader && <Page.Header label={title} icon={icon} actions={headerActions} /> }
				{ toolbar && <Page.Toolbar shouldPadTop={! shouldShowHeader} shouldPadBottom={true}>{toolbar}</Page.Toolbar> }
				<div className="fl-asst-page-content-wrap" ref={ref} {...rest}>
					<div className={classes}>{children}</div>
				</div>
			</div>
		</Page.Context.Provider>
	)
}

Page.defaults = {
	scrollRef: null,
}

Page.Context = createContext( Page.defaults )
Page.Context.displayName = 'Page.Context'

Page.Header = ( { icon, label, actions } ) => {
	const { shouldShowLabels } = useSystemState()

	const app = useContext( App.Context )
	const { label: appLabel, icon: appIcon } = app

	const { history, isRoot, isAppRoot } = useContext( Nav.Context )

	let visual = icon
	if ( 'function' !== typeof visual ) {
		visual = appIcon
	}

	return (
		<>
			<div className="fl-asst-app-header">

				{ ( isRoot || isAppRoot ) && 'function' === typeof visual &&
				<div className="fl-asst-app-header-icon">
					<div>{visual( app )}</div>
				</div>
				}

				{ ! isRoot && ! isAppRoot &&
				<div className="fl-asst-app-header-icon">
					<button
						onClick={history.goBack}
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							color: 'inherit',
							lineHeight: 1,
							fontSize: 12,
						}}
					>
						<div style={{
							color: 'var(--fl-asst-accent-color)',
							marginBottom: shouldShowLabels ? 5 : null,
						}}>
							<Icon.BackArrow />
						</div>
						{ shouldShowLabels && <span style={{ marginTop: 'auto' }}>{__( 'Back' )}</span> }
					</button>
				</div>
				}

				<div className="fl-asst-app-header-name">
					<span>{ label ? label : appLabel }</span>
				</div>

				{ actions && <div className="fl-asst-app-header-actions">{actions}</div> }
			</div>
		</>
	)
}
Page.Header.displayName = 'Page.Header'

// Horizontal Toolbar - edge padding for controls
Page.Toolbar = ( {
	className,
	shouldPadSides = true,
	shouldPadBottom = false,
	shouldPadTop = false,
	...rest
} ) => {
	const classes = classname( {
		'fl-asst-toolbar': true,
		'fl-asst-pad-top': shouldPadTop,
		'fl-asst-pad-sides': shouldPadSides,
		'fl-asst-pad-bottom': shouldPadBottom,
	}, className )
	return (
		<div className={classes} {...rest} />
	)
}
Page.Toolbar.displayName = 'Page.Toolbar'

// Padded box
Page.Pad = ( {
	className,
	top = true,
	sides = true,
	bottom = true,
	...rest
} ) => {
	const classes = classname( {
		'fl-asst-pad-top': top,
		'fl-asst-pad-sides': sides,
		'fl-asst-pad-bottom': bottom,
	}, className )

	return <div className={classes} {...rest} />
}
Page.Pad.displayName = 'Page.Pad'


Page.Comment = Comment
Page.Comment.displayName = 'Page.Comment'

Page.Update = Update
Page.Update.displayName = 'Page.Update'

Page.Post = Post
Page.Post.displayName = 'Page.Post'

Page.Attachment = Attachment
Page.Attachment.displayName = 'Page.Attachment'

Page.User = User
Page.User.displayName = 'Page.User'

Page.ExpandedContent = ( { children } ) => {
	const { size } = useContext( Window.Context )

	if ( 'normal' === size ) {
		return children
	}

	return null
}
Page.ExpandedContent.displayName = 'Page.ExpandedContent'
