import React, { memo } from 'react'
import { Switch, Route, useHistory } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Page, Icon } from 'ui'

const Config = ( {
	pages,
	shouldAnimate = false,
	...rest
} ) => {
	const { baseURL } = rest

	/*
	const history = useHistory()
	const reduceMotion = useReducedMotion()
	const getX = ( action, viewIs ) => {

		if ( ! shouldAnimate || reduceMotion ) return 0

		if ( 'POP' === action && 'exiting' === viewIs ) return '-100%'
		if ( 'POP' === action && 'entering' === viewIs ) return '-100%'
		if ( 'PUSH' === action && 'exiting' === viewIs ) return '100%'
		if ( 'PUSH' === action && 'entering' === viewIs ) return '100%'
		return 0
	}
	const transition = { duration: .15, type: "tween" }
	*/

	// Handle no pages in config
	if ( ! pages || 0 > Object.keys( pages ).length ) {
		return <NoPages { ...rest } />
	}

	return (
		<Switch>
			{ Object.entries( pages ).map( ( [ path, component ], i ) => {

				const Component = memo( component )

				return (
					<Route
						key={ i }
						exact={ 'default' === path }
						path={ 'default' === path ? baseURL : baseURL + '/' + path }
						render={ () => {
							return <Component { ...rest } />
						} }
					/>
				)
			} )}
			<Route component={ Page.NotFound } />
		</Switch>
	)

	/*
	return (
		<AnimatePresence initial={false}>
			<motion.div
				key={history.location.pathname}
				initial={{
					x: getX( history.action, 'entering' ),
					position: 'absolute',
					transition,
					zIndex: 1
				}}
				animate={{
					position: 'relative',
					x: 0,
					transition
				}}
				exit={{
					position: 'absolute',
					x: getX( history.action, 'exiting' ),
					transition,
					zIndex: 1
				}}
				style={{
					flex: '1 1 auto',
					maxHeight: '100%',
					minHeight: 0,
					display: 'flex',
					flexDirection: 'column',
					width: '100%',
				}}
			>
				<Switch location={history.location} key={history.location.pathname}>
					{ Object.entries( pages ).map( ( [ path, component ], i ) => {

						const Component = memo(component)

						return (
							<Route
								key={i}
								exact={ 'default' === path }
								path={ 'default' === path ? baseURL : baseURL + '/' + path }
								render={ () => {
		                            return <Component {...rest} />
		                        } }
							/>
						)
					})}
					<Route component={ Page.NotFound } />
				</Switch>
			</motion.div>
		</AnimatePresence>
	)
	*/
}

const NoPages = ( { label } ) => {
	return (
		<Page toolbar={ false }>
			<div style={ { margin: 'auto', textAlign: 'center' } }>
				<Icon.Pencil />
				<h1>Hello World, {label}</h1>
				<p>Your app is running! But you need to add some pages.</p>
			</div>
		</Page>
	)
}

export default Config
