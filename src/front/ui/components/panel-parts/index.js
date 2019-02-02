import React, { useContext, useState } from 'react'
import classname from 'classnames'
import posed from 'react-pose'
import { Button, AppTabButton, Icon, AppContext, StackContext } from 'components'
import { NotificationsIcon } from 'apps/fl-notifications'
import './style.scss'

const transition = () => ({
	type: 'spring',
	damping: 30,
	stiffness: 200,
})

const PanelBox = posed.div( {
	init: {
		position: 'fixed',
		top: 0,
		bottom: 0,
		width: ( { panelWidth } ) => panelWidth,
		zIndex: 999999,
	},
	trailingEdgeVisible: {
		right: 0,
		x: '0%',
		flip: true,
		transition,
	},
	trailingEdgeHidden: {
		right: 0,
		x: '100%',
		flip: true,
		transition,
	},
	leadingEdgeVisible: {
		right: ( { panelWidth } ) => `calc( 100vw - ${panelWidth}px )`,
		x: '0%',
		flip: true,
		transition,
	},
	leadingEdgeHidden: {
		right: ( { panelWidth } ) => `calc( 100vw - ${panelWidth}px )`,
		x: '-100%',
		flip: true,
		transition,
	},
} )

export const PanelFrame = ( { children, position = 'end', isShowing = true } ) => {

	let pose = ''
	if ( 'start' === position ) {
		if ( isShowing ) {
			pose = 'leadingEdgeVisible'
		} else {
			pose = 'leadingEdgeHidden'
		}
	} else {
		if ( isShowing ) {
			pose = 'trailingEdgeVisible'
		} else {
			pose = 'trailingEdgeHidden'
		}
	}

	return (
		<PanelBox pose={pose} className="fl-asst-panel-frame" panelWidth={440}>{children}</PanelBox>
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
	const { isRootView, popView } = useContext( StackContext )
	const screenTitle = title ? title : tab.label
	const titleClasses = classname({
		'fl-asst-screen-title': true,
		'has-back-button' : ! isRootView
	})
	return (
		<div className="fl-asst-screen-header">
			{ false !== showTitle && <div className={titleClasses}>
				{ ! isRootView && <Button onClick={popView} appearance="icon" className="fl-asst-button-back">
					<Icon name="back" />
				</Button> }
				{screenTitle}
			</div> }
			<div className="fl-asst-screen-header-contents">{children}</div>
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

const MoreButton = posed.button( {
	hoverable: true,
	focusable: true,
} )
const MoreButtonPath = posed.polyline( {
	init: {
		points: '2,4 25,4 48,4',
	},
	hover: {
		points: ( { isExpanded } ) => isExpanded ? '2,6 25,2 48,6' : '2,2 25,6 48,2',
	},
} )

const Expander = posed.div( {
	init: {
		overflow: 'hidden',
	},
	open: {
		height: 'auto',
		opacity: 1,
	},
	closed: {
		height: '0px',
		opacity: 0,
	},
} )

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
			<Expander pose={ isExpanded ? 'open' : 'closed' } className="fl-asst-expanded-contents-wrap">{children}</Expander>
			<div className="fl-asst-expanded-contents-footer">
				<MoreButton className="fl-asst-button fl-asst-more-button" onClick={toggleExpanded}>
					<svg className="fl-asst-icon" width="50px" height="8px" viewBox="0 0 50 8">
						<g fill="transparent" fillRule="nonzero" strokeWidth="4" strokeLinecap="round">
							<MoreButtonPath isExpanded={isExpanded} />
						</g>
					</svg>
				</MoreButton>
			</div>
		</div>
	)
}

export const EmptyMessage = ( { children } ) => {
	return (
		<div className="fl-asst-empty-message">{children}</div>
	)
}
