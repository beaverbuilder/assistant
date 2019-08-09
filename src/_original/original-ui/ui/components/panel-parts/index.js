import React, { Fragment, useContext, useState } from 'react'
import { __ } from '@wordpress/i18n'
import classname from 'classnames'
import posed from 'react-pose'
import { AppContext, StackContext, Button, Icon, Padding } from 'components'
import { AppMenuButton } from 'system'
import './style.scss'

export const ScreenHeader = ( { children, showTitle, title } ) => {
	const { label } = useContext( AppContext )
	const { isRootView } = useContext( StackContext )
	const screenTitle = title ? title : label

	const titleClasses = classname( {
		'fl-asst-screen-title': true,
		'has-back-button': ! isRootView
	} )
	return (
		<div className="fl-asst-screen-header">
			{ false !== showTitle && <div className={ titleClasses }>
				<div className="fl-asst-screen-title-text">{screenTitle}</div>
				<AppMenuButton />
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
		<div className={ classes }>
			<div className="fl-asst-screen-footer-content">{children}</div>
		</div>
	)
}

const MoreButton = posed.button( {
	hoverable: true,
	focusable: true,
	pressable: true,
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
		<div className={ classes }>
			<Expander pose={ isExpanded ? 'open' : 'closed' } className="fl-asst-expanded-contents-wrap">{children}</Expander>
			<div className="fl-asst-expanded-contents-footer">
				<MoreButton className="fl-asst-button fl-asst-more-button" onClick={ toggleExpanded }>
					<svg className="fl-asst-icon" width="50px" height="8px" viewBox="0 0 50 8">
						<g fill="transparent" fillRule="nonzero" strokeWidth="4" strokeLinecap="round">
							<MoreButtonPath isExpanded={ isExpanded } />
						</g>
					</svg>
				</MoreButton>
			</div>
		</div>
	)
}

export const EmptyMessage = props => {
	const { className } = props

	const classes = classname( {
		'fl-asst-empty-message': true,
	}, className )

	const merged = {
		...props,
		className: classes,
	}
	return (
		<div { ...merged } />
	)
}

export const Toolbar = ( { children } ) => {
	const classes = classname( {
		'fl-asst-toolbar': true,
	} )
	return (
		<div className={ classes }>{children}</div>
	)
}

export const Title = props => {
	const { children, className, actions, shouldOverlay = false, style, shouldInvertColors = false } = props
	const stack = useContext( StackContext )

	let dismiss = () => {}
	let isRootView = true
	if ( 'undefined' !== typeof stack ) {
		isRootView = stack.isRootView
		dismiss = stack.dismiss
	}

	const classes = classname( {
		'fl-asst-screen-name': true,
		'fl-asst-screen-name-has-back': ! isRootView,
		'fl-asst-screen-name-overlay': shouldOverlay,
		'fl-asst-screen-name-inverted': shouldInvertColors,
	}, className )

	const merged = {
		...props,
		className: classes,
	}
	delete merged.actions
	delete merged.shouldOverlay
	delete merged.style
	delete merged.shouldInvertColors

	return (
		<div { ...merged }>
			{ ! isRootView &&
				<Button
					className="fl-asst-title-wrap fl-asst-title-back-button"
					onClick={ dismiss }
					appearance="transparent"
					style={ style }
					title={ __( 'Back to Previous Screen' ) }
				>
					<Icon name="back-arrow" />
					<span className="fl-asst-screen-title-text">{children}</span>
				</Button>
			}
			{ isRootView &&
				<div className="fl-asst-title-wrap" style={ style }>
					<span className="fl-asst-screen-title-text">{children}</span>
				</div>
			}
			{ actions && <span className="fl-asst-screen-title-actions">{actions}</span> }
		</div>
	)
}

export const ContentFrame = props => {
	const { className, padded = false, align } = props

	const classes = classname( {
		'fl-asst-content-frame': true,
		'fl-asst-content-frame-align-center': 'center' === align,
	}, className )

	const mergedProps = Object.assign( {}, props, {
		className: classes,
	} )
	delete mergedProps.align

	return (
		<Fragment>
			{ padded && <Padding>
				<div { ...mergedProps } />
			</Padding> }
			{ ! padded && <div { ...mergedProps } /> }
		</Fragment>
	)
}
