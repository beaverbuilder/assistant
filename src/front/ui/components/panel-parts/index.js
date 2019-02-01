import React, { useContext, useState } from 'react'
import classname from 'classnames'
import posed from 'react-pose'
import { Button, AppTabButton, Icon, AppContext } from 'components'
import { NotificationsIcon } from 'apps/fl-notifications'
import './style.scss'

const PanelBox = posed.div( {
	init: {
		position: 'fixed',
		top: 0,
		bottom: 0,
		width: 440,
		zIndex: 99999,
	},
	leadingEdgeVisible: {
		right: 0,
		x: '0%',
		flip: true,
	},
	leadingEdgeHidden: {
		right: 0,
		x: '100%',
		flip: true,
	},
	trailingEdgeVisible: {
		right: 'calc( 100vw - 440px )',
		x: '0%',
		flip: true,
	},
	trailingEdgeHidden: {
		right: 'calc( 100vw - 440px )',
		x: '-100%',
		flip: true,
	},
} )

export const PanelFrame = ( { children, position = 'end', isShowing = true } ) => {

	let pose = 'leadingEdgeVisible'
	if ( 'start' === position ) {
		if ( isShowing ) {
			pose = 'trailingEdgeVisible'
		} else {
			pose = 'trailingEdgeHidden'
		}
	} else {
		if ( isShowing ) {
			pose = 'leadingEdgeVisible'
		} else {
			pose = 'leadingEdgeHidden'
		}
	}

	return (
		<PanelBox pose={pose} className="fl-asst-panel-frame">{children}</PanelBox>
	)
}

export const PanelChrome = ( { tabs, activeTabName, onTabClick, onClose } ) => {
	const isNotificationsSelected = 'fl-notifications' === activeTabName ? true : false
	const notificationsLabel = tabs['fl-notifications'] ? tabs['fl-notifications'].label : ''
	return (
		<div className="fl-asst-panel-chrome">

			<div className="fl-asst-panel-chrome-area">
				<AppTabButton
					onClick={ () => onTabClick( 'fl-notifications' )}
					isSelected={isNotificationsSelected}
					tooltip={notificationsLabel}
				>
					<NotificationsIcon isSelected={isNotificationsSelected} />
				</AppTabButton>
			</div>

			<div className="fl-asst-app-tabs-wrap">
				<div className="fl-asst-app-tabs-area">
					{ Object.keys( tabs ).map( key => {
						const tab = tabs[key]
						const isSelected = ( key === activeTabName ) ? true : false

						if ( false === tab.showTabIcon ) {
							return null
						}

						if ( 'function' !== typeof tab.icon ) {
							tab.icon = props => <Icon name="default-app" {...props} />
						}

						return (
							<AppTabButton key={key} isSelected={isSelected} onClick={() => onTabClick( key )} tooltip={tab.label}>
								{tab.icon( { key, isSelected } )}
							</AppTabButton>
						)
					} ) }
				</div>
			</div>

			<div className="fl-asst-panel-chrome-area">
				<Button onClick={onClose} appearance="icon">
					<Icon name="close" />
				</Button>
			</div>
		</div>
	)
}

export const ScreenHeader = ( { children, showTitle, title } ) => {
	const tab = useContext( AppContext )
	const screenTitle = title ? title : tab.label
	return (
		<div className="fl-asst-screen-header">
			{ false !== showTitle && <div className="fl-asst-screen-title">{screenTitle}</div> }
			{children}
		</div>
	)
}

export const ScreenFooter = ( { children } ) => {
	const classes = classname( {
		'fl-asst-screen-footer': true,
	} )
	return (
		<div className={classes}>
			<div className="fl-asst-screen-footer-content">{children}</div>
		</div>
	)
}

export const ExpandedContents = ( { children } ) => {
	const [ isExpanded, setIsExpanded ] = useState( false )
	const toggleExpanded = () => {
		isExpanded ? setIsExpanded( false ) : setIsExpanded( true )
	}
	const classes = classname( {
		'fl-asst-expanded-contents': true,
	} )
	return (
		<div className={classes}>
			{ isExpanded && children}
			<div className="fl-asst-expanded-contents-footer">
				<button className="fl-asst-button fl-asst-more-button" onClick={toggleExpanded}>
					<svg className="fl-asst-icon" width="51px" height="4px" viewBox="0 0 51 4">
						<g transform="translate(-195.000000, -184.000000)" fillRule="nonzero" strokeWidth="4" strokeLinecap="round">
							<path d="M197.5,186 L244,186"></path>
						</g>
					</svg>
				</button>
			</div>
		</div>
	)
}

export const EmptyMessage = ( { children } ) => {
	return (
		<div className="fl-asst-empty-message">{children}</div>
	)
}
