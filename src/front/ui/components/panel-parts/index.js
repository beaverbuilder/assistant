import React, { useContext, useState } from 'react'
import classname from 'classnames'
import posed from 'react-pose'
import { TunnelPlaceholder } from 'react-tunnels'
import { Button, Icon, AppContext, StackContext } from 'components'
import './style.scss'


export const ScreenHeader = ( { children, showTitle, title } ) => {
	const { label, toggleAppMenu } = useContext( AppContext )
	const { isRootView, popView } = useContext( StackContext )
	const screenTitle = title ? title : label

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

				<TunnelPlaceholder id="app-menu" multiple>
					{ ({ items }) => {
						if ( items && items.length > 0 ) {
							return (
								<Button onClick={toggleAppMenu}>Menu</Button>
							)
						}
						return null
					} }
				</TunnelPlaceholder>
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
	pressable: true,
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
	press: {
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
