import React, { Fragment, useState, useEffect } from 'react'
import classname from 'classnames'
import posed from 'react-pose'
import { StackContext } from 'components'
import './style.scss'

export const StackView = posed.div( {
	init: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'var(--fl-background-color)'
	},
	past: {
		x: '-100%',
	},
	present: {
		x: '0%',
	},
	future: {
		x: '100%'
	},
} )
StackView.displayName = 'StackView'


export const Stack = ( { children, className } ) => {
	const [ views, setViews ] = useState( [
		{
			key: Date.now(),
			pose: 'present',
			children,
		}
	] )
	const [ action, setAction ] = useState()

	useEffect( () => {
		if ( action ) {
			if ( 'push' === action ) {
				setViews( views.map( view => {
					switch ( view.pose ) {
					case 'future':
						view.pose = 'present'
						break
					case 'present':
						view.pose = 'past'
					}
					return view
				} ) )
			}
			if ( 'pop' === action ) {
				const newViews = views

				// ditch the last item
				newViews.pop()
				setViews( newViews )
			}
			if ( 'root' === action ) {
				views.pop()
				setViews( views )
			}
			setAction( null )
		}
	} )

	// Setup the API that will be exposed with StackContext
	const context = {
		pushView: children => {
			const newViews = views
			newViews.push( {
				key: Date.now(),
				pose: 'future',
				children,
			} )
			setViews( newViews )
			setAction( 'push' )
		},
		popView: () => {
			const newViews = views
			newViews[ newViews.length - 1 ].pose = 'future'
			newViews[ newViews.length - 2 ].pose = 'present'
			setViews( newViews )
			setAction( 'pop' )
		},
		popToRoot: () => {
			const current = views[ views.length - 1 ]
			current.pose = 'future'
			const root = views[0]
			root.pose = 'present'
			setViews( [root, current] )
			setAction( 'root' )
		},
	}

	const classes = classname( {
		'fl-asst-stack': true,
	}, className )

	return (
		<StackContext.Provider value={context}>
			<div className={classes}>
			{ views.map( view => {
				return (
					<StackView key={view.key} {...view} />
				)
			} ) }
			</div>
		</StackContext.Provider>
	)
}
