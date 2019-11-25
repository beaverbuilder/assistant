import React, { Fragment, useContext } from 'react'
import { TunnelPlaceholder } from 'react-tunnels'
import { __ } from '@wordpress/i18n'
import {
	UIContext,
	Icon,
	Button,
} from 'components'
import { useAppState, getAppActions } from 'data'
import classname from 'classnames'
import './style.scss'

export const AppHeader = () => {
	const { activeAppName: appName } = useContext( UIContext )
	const { isAppHeaderExpanded, isFirstTime } = useAppState( appName )
	const { setIsAppHeaderExpanded, setIsFirstTime } = getAppActions( appName )

	return (
		<div className="fl-asst-app-header">
			<CollapsedContent isExpanded={ isAppHeaderExpanded } />
			<ExpandedContent isExpanded={ isAppHeaderExpanded } />
			<ExpanderButton isExpanded={ isAppHeaderExpanded } onClick={ () => {
				setIsAppHeaderExpanded( ! isAppHeaderExpanded )
				if ( isFirstTime ) {
					setIsFirstTime( false )
				}
			} } />
		</div>
	)
}

const CollapsedContent = props => {
	const { className, isExpanded } = props
	const { activeAppName: appName } = useContext( UIContext )

	if ( isExpanded ) {
		return null
	}

	const classes = classname( {
		'fl-asst-app-header-content': true,
	}, className )

	const merged = {
		...props,
		className: classes,
	}
	delete merged.isExpanded

	return (
		<TunnelPlaceholder id={ `app-header-${appName}` } appName={ appName } multiple>
			{ ( { items } ) => {
				if ( 'undefined' !== items && 0 < items.length ) {
					return (
						<div { ...merged }>
							{ items.map( item => item.children )}
						</div>
					)
				}

				// Default to app title
				return (
					<div { ...merged }>
						<BreadcrumbTrail />
					</div>
				)
			} }
		</TunnelPlaceholder>
	)
}

const ExpandedContent = props => {
	const { activeAppName: appName } = useContext( UIContext )
	const {
		className,
		isExpanded,
	} = props

	if ( ! isExpanded ) {
		return null
	}

	const classes = classname( {
		'fl-asst-app-header-content-expanded': true,
	}, className )

	const merged = {
		...props,
		className: classes,
	}
	delete merged.isExpanded

	return (
		<TunnelPlaceholder id={ `app-header-expanded-${appName}` } appName={ appName } multiple>
			{ ( { items } ) => {
				if ( 'undefined' !== items && 0 < items.length ) {
					return (
						<div { ...merged }>
							{ items.map( item => item.children )}
						</div>
					)
				}
				return null
			} }
		</TunnelPlaceholder>
	)
}

const BarButton = props => {
	const { isExpanded, className } = props
	const line = '2,4 25,4 48,4'
	const up = '5,6 25,2 45,6'

	const classes = classname( {
		'fl-asst-button-expand-bar': true
	}, className )

	const merged = {
		...props,
		className: classes,
	}
	delete merged.isExpanded

	return (
		<Button { ...merged } appearance="transparent" title={ __( 'Expand Header' ) }>
			<svg className="fl-asst-icon" width="50px" height="8px" viewBox="0 0 50 8">
				<g
					fill="transparent"
					fillRule="nonzero"
					stroke="currentColor"
					strokeWidth="4"
					strokeLinecap="round"
				>
					<polyline points={ isExpanded ? up : line } />
				</g>
			</svg>
		</Button>
	)
}

const ExpanderButton = props => {
	const { activeAppName: appName } = useContext( UIContext )

	return (
		<TunnelPlaceholder id={ `app-header-expanded-${appName}` } key={ name } multiple>
			{ ( { items } ) => {
				if ( 'undefined' !== items && 0 < items.length ) {

					return (
						<div className="fl-asst-app-header-control">
							<BarButton { ...props } />
						</div>
					)
				}
				return null
			} }
		</TunnelPlaceholder>
	)
}

const BreadcrumbTrail = () => {
	return (
		<TunnelPlaceholder id='app-breadcrumbs' multiple>
			{ ( { items } ) => {
				return items.map( ( item, i ) => {
					const { children, onClick = () => {} } = item
					const isFirst = 0 === i
					const isLast = i === items.length - 1
					return (
						<Fragment key={ i }>
							{ ! isFirst &&
							<span className="fl-asst-app-breadcrumb-separator">
								<Icon name="forward" />
							</span>
							}
							{ ! isLast && <Button
								appearance="transparent"
								className="fl-asst-app-breadcrumb-item"
								onClick={ onClick }
							>{children}</Button> }
							{ isLast && <span className="fl-asst-app-breadcrumb-item">{children}</span> }
						</Fragment>
					)
				} )
			}}
		</TunnelPlaceholder>
	)
}
