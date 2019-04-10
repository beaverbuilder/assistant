import React, { useState, useEffect, useContext, createRef, createContext } from 'react'
import classname from 'classnames'
import { __ } from '@wordpress/i18n'
import posed from 'react-pose'
import { ViewContext, Button, Icon, Scroller, AppContext, Title } from 'components'
import { Tunnel } from 'react-tunnels'
import './style.scss'

export const StackContext = createContext()
StackContext.displayName = 'StackContext'

const handleTransition = () => {
	return {
		type: 'tween',
		duration: 150
	}
}

export const StackView = posed.div( props => {
	const { shouldAnimate } = props

	if ( false === shouldAnimate ) {
		return {
			init: {
				display: 'flex',
				flexDirection: 'column',
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
			},
			past: {},
			present: {},
			future: {},
		}
	}

	return {
		init: {
			display: 'flex',
			flexDirection: 'column',
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
		},
		past: {
			x: '0%',
			scale: .9,
			opacity: 0,
			transition: handleTransition,
		},
		present: {
			x: '0%',
			scale: 1,
			opacity: 1,
			transition: handleTransition,
		},
		future: {
			x: '100%',
			opacity: 0,
			transition: handleTransition,
		},
	}
} )
StackView.displayName = 'StackView'


export const Stack = ( { children, className } ) => {
	const {
		label: appLabel,
		appearance = 'normal',
		shouldShowTitle = true
	} = useContext( AppContext )

	const [ views, setViews ] = useState( [
		{
			key: Date.now(),
			pose: 'present',
			label: appLabel,
			content: children,
			appearance,
			shouldShowTitle,
			config: {
				shouldAnimate: true,
				context: {}
			},
		}
	] )
	const [ action, setAction ] = useState()
	const [ height, setHeight ] = useState()

	// After DOM is mounted, "push" new view on.
	useEffect( () => {
		if ( action ) {
			if ( 'push' === action ) {
				setViews( views.map( view => {
					switch ( view.pose ) {
					case 'future':
						view.pose = 'present'
						'undefined' !== typeof view.height ? setHeight( view.height ) : null
						break
					case 'present':
						view.pose = 'past'
					}
					return view
				} ) )
			}
			setAction( null )
		}
	} )

	// After pop transition completes, cleanup data
	const poseComplete = name => {
		console.log('pose complete', action, name )
		if ( action && 'pop' === action && 'future' === name ) {

			// ditch the last 'future' item
			const view = views.pop()
			setViews( Array.from( views ) )
			setAction( null )

			if ( 'function' === typeof view.onDismiss ) {
				view.onDismiss()
			}
		}
		if ( action && 'root' === action && 'future' === name ) {

			// Drop the last 'future' item.
			const view = views.pop()
			setViews( Array.from( views ) )
			setAction( null )

			if ( 'function' === typeof view.onDismiss ) {
				view.onDismiss()
			}
		}
	}

	// Setup the API that will be exposed with StackContext
	const pushView = ( content, config = {} ) => {
		const defaults = {
			key: Date.now(),
			shouldAnimate: true,
			height: null,
			context: {},
			onDismiss: () => {},
		}
		const newViews = views

		const obj = Object.assign( {}, defaults, config )

		newViews.push( {
			...obj,
			pose: ! obj.shouldAnimate ? 'present' : 'future',
			config: obj,
		} )
		setViews( Array.from( newViews ) )
		setAction( 'push' )
	}

	const popView = () => {
		if ( 2 > views.length ) {
			return
		}
		const newViews = views
		newViews[ newViews.length - 1 ].pose = 'future'
		newViews[ newViews.length - 2 ].pose = 'present'
		setViews( Array.from( newViews ) )
		setAction( 'pop' )
	}

	const popToRoot = () => {
		if ( 2 > views.length ) {
			return
		}
		views.map( ( view, i ) => {
			view.pose = i === 0 ? 'present' : 'future'
		})
		setViews( Array.from( views ) )
		setAction( 'root' )
	}

	const updateCurrentView = ( data ) => {
		const index = views.length - 1
		const { context } = views[ index ].config

		views[ index ].config.context = {
			...context,
			...data,
		}
		setViews( Array.from( views ) )
	}

	// New API
	const present = config => {
		const defaults = {
			label: __( 'Unnamed' ),
			content: null,
			appearance: 'normal',
			onDismiss: () => {},
			shouldShowTitle: true,
		}
		const view = Object.assign( {}, defaults, config )
		pushView( view.content, view )
	}

	const dismiss = () => popView()

	const dismissAll = () => popToRoot()

	const api = {
		isRootView: false,
		isCurrentView: false,
		viewCount: views.length,

		// Deprecated
		updateCurrentView,

		// New API
		present,
		dismiss,
		dismissAll,
	}

	const classes = classname( {
		'fl-asst-stack': true,
	}, className )

	const styles = {
		height,
	}

	return (
		<div className={classes} style={styles}>
			{ views.map( ( view, i ) => {
				const { config, key, pose, content, appearance, label, shouldShowTitle } = view
				const checks = {
					isRootView: 0 === i,
					isCurrentView: 'present' === pose,
				}
				const ref = createRef()
				const context = Object.assign( { ref }, api, checks )
				const props = Object.assign( { ref }, view )
				delete props.onDismiss
				delete props.label
				delete props.content

				let breadcrumb = label
				if ( checks.isRootView && ! breadcrumb ) {
					breadcrumb = appLabel
				}

				const classes = classname( {
					'fl-asst-stack-view': true,
					[`fl-asst-appearance-${appearance}`]: appearance,
				} )

				return (
					<StackContext.Provider key={i} value={context}>
						<ViewContext.Provider value={config.context}>
							<StackView
								key={key}
								id={`fl-asst-stack-view-${key}`}
								ref={ref}
								onPoseComplete={poseComplete}
								className={classes}
								{...props}
							>
								<Breadcrumb onClick={dismiss}>{breadcrumb}</Breadcrumb>
								<Scroller>
									{ shouldShowTitle && <Title>{label}</Title> }
									{content}
								</Scroller>
							</StackView>
						</ViewContext.Provider>
					</StackContext.Provider>
				)
			} ) }
		</div>
	)
}

export const BackButton = props => {
	const stack = useContext( StackContext )

	if ( 'undefined' === typeof stack ) {
		return null
	}
	const { isRootView, dismiss } = stack

	if ( isRootView ) {
		return null
	}

	const onClick = e => {
		dismiss()
		if ( 'function' === typeof props.onClick ) {
			props.onClick( e )
		}
	}

	return (
		<Button appearance="icon" {...props} onClick={onClick}>
			<Icon name="back-arrow" />
		</Button>
	)
}

const Breadcrumb = props => {
	return <Tunnel id="app-breadcrumbs" {...props} />
}
