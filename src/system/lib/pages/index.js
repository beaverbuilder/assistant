import React, { useRef, useContext, createContext } from 'fl-react'
import classname from 'fl-classnames'
import { __ } from '@wordpress/i18n'
import { useSystemState } from '../../store'
import { Nav, Icon, App } from '../'
import './style.scss'

export const Page = ( {
	className,
	shouldShowHeader = true,
	shouldPadTop = false,
	shouldPadSides = true,
	shouldPadBottom = true,
	title,
	icon,
	...rest
} ) => {

	const ref = useRef()

	const classes = classname( {
		'fl-asst-page': true,
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
			{ shouldShowHeader && <Page.Header label={title} icon={icon} /> }
			<div className={classes} ref={ref} {...rest} />
		</Page.Context.Provider>
	)
}

Page.defaults = {
	scrollRef: null,
}

Page.Context = createContext( Page.defaults )
Page.Context.displayName = 'Page.Context'

Page.Header = ( { icon, label } ) => {
	const { shouldShowLabels } = useSystemState()

	const app = useContext( App.Context )
	const { label: appLabel, icon: appIcon } = app

	const { history, isRoot, isAppRoot } = useContext( Nav.Context )

	let visual = icon
	if ( 'function' !== typeof visual ) {
		visual = appIcon
	}

	return (
		<div className="fl-asst-screen-header fl-asst-app-header">

			{ ( isRoot || isAppRoot ) && 'function' === typeof visual &&
			<div className="fl-asst-app-header-icon">
				<div>{visual( app )}</div>
			</div>
			}

			{ !isRoot && !isAppRoot &&
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

			<div className="fl-asst-app-header-actions">
				{ /* App actions go here */ }
			</div>
		</div>
	)
}
Page.Header.displayName = 'Page.Header'

// Horizontal Toolbar - edge padding for controls
Page.Toolbar = ({
	className,
	shouldPadSides = true,
	...rest
}) => {
	const classes = classname({
		'fl-asst-toolbar' : true,
		'fl-asst-pad-sides' : shouldPadSides,
	}, className )
	return (
		<div className={classes} {...rest} />
	)
}
Page.Toolbar.displayName = 'Page.Toolbar'

// Padded box
Page.Pad = ({
	className,
	top = true,
	sides = true,
	bottom = true,
	...rest
}) => {
	const classes = classname({
		'fl-asst-pad-top' : top,
		'fl-asst-pad-sides' : sides,
		'fl-asst-pad-bottom' : bottom,
	}, className )

	return <div className={classes} {...rest} />
}
Page.Pad.displayName = 'Page.Pad'




Page.PostDetail = () => {
	return (
		<Page>Yo!</Page>
	)
}
