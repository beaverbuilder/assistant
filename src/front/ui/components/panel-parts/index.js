import React, { useContext, useState, useEffect } from 'react'
import classname from 'classnames'
import posed from 'react-pose'
import { Button, AppTabButton, Icon, AppContext, StackContext } from 'components'
import { NotificationsTabButton } from 'apps/fl-notifications'
import './style.scss'

function useWindowSize() {
	const isClient = typeof window === 'object'

	const getSize = () => {
		return {
			width: isClient ? window.innerWidth : undefined,
			height: isClient ? window.innerHeight : undefined,
		}
	}

	const [windowSize, setWindowSize] = useState( getSize() )

	function handleResize() {
		setWindowSize( getSize() )
	}

	useEffect( () => {
		if ( ! isClient ) {
			return false
		}

		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [] )

	return windowSize
}




const transition = () => ( {
	type: 'spring',
	damping: 30,
	stiffness: 200,
} )

const PanelBox = posed.div( {
	init: {
		position: 'fixed',
		top: 0,
		bottom: 0,
		/*
		width: ( { panelWidth } ) => {
			return panelWidth
		},*/
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
	const { width } = useWindowSize()

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

	const size = 440 // slim
	const panelWidth = size > ( width * .6 ) ? width : size
	const styles = {
		width: panelWidth
	}

	return (
		<PanelBox pose={pose} className="fl-asst-panel-frame" style={styles}>{children}</PanelBox>
	)
}

export const PanelChrome = ( { tabs, activeTabName, onTabClick, onClose } ) => {
	return (
		<div className="fl-asst-panel-chrome">

			<div className="fl-asst-panel-chrome-area">
				<NotificationsTabButton />
			</div>

			<div className="fl-asst-app-tabs-wrap">
				<div className="fl-asst-app-tabs-area">
					{ Object.keys( tabs ).map( key => {
						const tab = tabs[key]
						const isSelected = ( key === activeTabName ) ? true : false

						if ( false === tab.enabled || false === tab.showTabIcon ) {
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
	const titleClasses = classname( {
		'fl-asst-screen-title': true,
		'has-back-button': ! isRootView
	} )
	return (
		<div className="fl-asst-screen-header">
			{ false !== showTitle && <div className={titleClasses}>
				{ ! isRootView && <Button onClick={popView} appearance="icon" className="fl-asst-button-back">
					<Icon name="back" />
				</Button> }
				<div className="fl-asst-screen-title-text">{screenTitle}</div>
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
	init: {
		opacity: .5,
	},
	hover: {
		opacity: 1,
	},
	focus: {
		opacity: 1,
	}
} )
const MoreButtonPath = posed.polyline( {
	init: {
		points: '2,4 25,4 48,4',
	},
	hover: {
		points: ( { isExpanded } ) => isExpanded ? '5,6 25,2 45,6' : '5,2 25,6 45,2',
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

export const Toolbar = ( { children } ) => {
	const classes = classname( {
		'fl-asst-toolbar': true,
	} )
	return (
		<div className={classes}>{children}</div>
	)
}
