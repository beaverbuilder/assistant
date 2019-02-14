import React, { useContext, useState, useEffect } from 'react'
import classname from 'classnames'
import posed from 'react-pose'
import { Button, AppTabButton, Icon, AppContext, StackContext, UIContext } from 'components'
import { NotificationsTabButton } from 'apps/fl-notifications'
import './style.scss'

/*
const PanelBox = posed.div( {
	init: {
		position: 'fixed',
		top: 0,
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
		right: ( { style } ) => {
			const { width } = style
			return `calc( 100vw - ${width}px )`
		},
		x: '0%',
		flip: true,
		transition,
	},
	leadingEdgeHidden: {
		right: ( { style } ) => {
			const { width } = style
			return `calc( 100vw - ${width}px )`
		},
		x: '-100%',
		flip: true,
		transition,
	},
} )
*/

const PanelBox = posed.div( () => {

	const transition = props => {
		return {
			type: 'spring',
			stiffness: 200,
			damping: 40,
			mass: 1
		}
	}

	const init = {
		position: 'fixed',
		top: 0,
		right: 0,
		zIndex: 999999,
		width: ({ style }) => style.width,
		height: ({ style }) => style.height,
		boxShadow: '0px 0px 40px rgba(0, 0, 0, 0.1)',
		borderLeft: '1px solid var(--fl-line-color)'
	}

	const hidden = {
		right:({ alignment, style }) => {
			if ( 'end' === alignment ) {
				return 0
			} else {
				return `calc( 100vw - ${style.width}px )`
			}
		},
		x: ({ alignment, frameSize }) => {
			if ( 'full' === frameSize ) {
				return '0%'
			} else {
				return 'end' === alignment ? '100%' : '-100%'
			}
		},
		y: ({ frameSize }) => 'full' === frameSize ? '10%' : '0%',
		opacity: ({ frameSize }) => 'full' === frameSize ? 0 : 1,
		scale: ({ frameSize }) => 'full' === frameSize ? .9 : 1,
		width: ({ style }) => style.width,
		height: ({ style }) => style.height,
		applyAtStart: {
			pointerEvents: 'none',
		},
		transition,
	}

	return {
		init,
		hidden,
		normal: {
			right: ({ alignment, style }) => {
				if ( 'end' === alignment ) {
					return 0
				} else {
					return `calc( 100vw - ${style.width}px )`
				}
			},
			x: '0%',
			y: '0%',
			scale: 1,
			opacity: 1,
			width: ({ style }) => style.width,
			height: ({ style }) => style.height,
			applyAtEnd: {
				pointerEvents: 'auto',
			},
			transition,
		},
	}
})

export const PanelFrame = ( { children } ) => {
	const { isShowingUI, appFrame } = useContext( UIContext )

	const styles = {
		width: appFrame.width,
		height: appFrame.height,
	}

	const key = Date.now() // make sure PanelBox re-renders when frame does

	return (
		<PanelBox
			pose={ isShowingUI ? 'normal' : 'hidden' }
			poseKey={key}
			style={styles}
			frameSize={appFrame.size}
			alignment={appFrame.alignment}
		>{children}</PanelBox>
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
