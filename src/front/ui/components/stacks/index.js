import React, { useState, useEffect, createRef } from 'react'
import classname from 'classnames'
import posed from 'react-pose'
import { StackContext, ViewContext } from 'components'
import './style.scss'

const handleTransition = () => {
	return {
		type: 'tween',
		duration: 220
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
				backgroundColor: 'var(--fl-background-color)',
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
			backgroundColor: 'var(--fl-background-color)',
			pointerEvents: 'auto'
		},
		past: {
			x: '0%',
			scale: .9,
			opacity: 0,
			transition: handleTransition,
			applyAtStart: {
				pointerEvents: 'none'
			}
		},
		present: {
			x: '0%',
			scale: 1,
			opacity: 1,
			transition: handleTransition,
			applyAtEnd: {
				pointerEvents: 'auto'
			}
		},
		future: {
			x: '80%',
			opacity: 0,
			transition: handleTransition,
			applyAtStart: {
				pointerEvents: 'none'
			}
		},
	}
} )
StackView.displayName = 'StackView'


export const Stack = ( { children, className } ) => {
	const [ views, setViews ] = useState( [
		{
			key: Date.now(),
			pose: 'present',
			children,
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
		if ( action && 'pop' === action && 'future' === name ) {

			// ditch the last 'future' item
			views.pop()
			setViews( Array.from( views ) )
			setAction( null )
		}
		if ( action && 'root' === action && 'future' === name ) {

			// Drop the last 'future' item.
			views.pop()
			setViews( Array.from( views ) )
			setAction( null )
		}
	}

	// Setup the API that will be exposed with StackContext
	const api = {
		isRootView: false,
		isCurrentView: false,
		viewCount: views.length,

		pushView: ( children, config = {} ) => {
			const defaults = {
				shouldAnimate: true,
				height: null,
				context: {},
			}
			const newViews = views
			newViews.push( {
				key: Date.now(),
				pose: 'future',
				children,
				config: Object.assign( {}, defaults, config ),
			} )
			setViews( Array.from( newViews ) )
			setAction( 'push' )
		},
		popView: () => {
			if ( 2 > views.length ) {
				return
			}

			const newViews = views
			newViews[ newViews.length - 1 ].pose = 'future'
			newViews[ newViews.length - 2 ].pose = 'present'
			setViews( Array.from( newViews ) )
			setAction( 'pop' )
		},
		popToRoot: () => {
			if ( 2 > views.length ) {
				return
			}

			const current = views[ views.length - 1 ]
			current.pose = 'future'
			const root = views[0]
			root.pose = 'present'
			setViews( [ root, current ] )
			setAction( 'root' )
		},
		updateCurrentView: ( data ) => {
			const index = views.length - 1
			const { context } = views[ index ].config

			views[ index ].config.context = {
				...context,
				...data,
			}

			setViews( Array.from( views ) )
		},
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
				const { config, key, pose } = view
				const checks = {
					isRootView: 0 === i,
					isCurrentView: 'present' === pose ? true : false,
				}
				const ref = createRef()
				const context = Object.assign( { ref }, api, checks )
				const props = Object.assign( { ref }, view )

				return (
					<StackContext.Provider key={i} value={context}>
						<ViewContext.Provider value={config.context}>
							<StackView
								key={key}
								ref={ref}
								onPoseComplete={poseComplete}
								className='fl-asst-stack-view'
								{...props}
							/>
						</ViewContext.Provider>
					</StackContext.Provider>
				)
			} ) }
		</div>
	)
}
