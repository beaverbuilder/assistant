import React, { Fragment, useRef, useState, useLayoutEffect } from 'react'
import { __ } from '@wordpress/i18n'
import {
	Widget,
	Button,
	BackForwardControl,
} from 'components'
import { getSystemConfig } from 'data'
import './style.scss'

export const WayfinderWidget = () => {
	const listRef = useRef()
	const [ scroll, setScroll ] = useState( {
		canMoveForward: false,
		canMoveBackward: false,
	} )
	const increment = ( 180 * 2 ) + 5 + ( 2 * 2 ) // Increment by 2 buttons
	const cards = getCards()

	if ( 0 === cards.length ) {
		return null
	}

	useLayoutEffect( () => {
		if ( listRef.current ) {
			const el = listRef.current
			const end = el.scrollWidth - el.clientWidth
			setScroll( {
				canMoveForward: el.scrollLeft < end,
				canMoveBackward: 0 < el.scrollLeft,
			} )
		}
	}, [] )

	const move = ( direction = 'back' ) => {
		if ( listRef.current ) {
			const el = listRef.current
			const pos = el.scrollLeft
			const end = el.scrollWidth - el.clientWidth
			const value = 'forward' === direction ? pos + increment : pos - increment
			el.scrollLeft = value

			setScroll( {
				canMoveForward: pos < end,
				canMoveBackward: 0 < pos,
			} )
		}
	}

	const onScroll = e => {
		const el = e.target
		const end = el.scrollWidth - el.clientWidth
		setScroll( {
			canMoveForward: el.scrollLeft < end,
			canMoveBackward: 0 < el.scrollLeft,
		} )
		e.stopPropagation()
	}

	const Title = () => {
		return (
			<Fragment>
				{__( 'How would you like to begin?' )}
				<span className="fl-asst-widget-title-actions">
					<BackForwardControl
						onNext={ () => move( 'forward' ) }
						onPrevious={ () => move( 'back' ) }
						isNextEnabled={ scroll.canMoveForward }
						isPreviousEnabled={ scroll.canMoveBackward }
					/>
				</span>
			</Fragment>
		)
	}

	return (
		<Widget
			title={ <Title /> }
			isPadded={ false }
			className="fl-asst-wayfinder-widget"
		>
			<ul
				className="fl-asst-swipe-list"
				onScroll={ onScroll }
				ref={ listRef }
			>
				{ cards.map( ( card, i ) => {
					return (
						<li key={ i }>
							<Button { ...card } />
						</li>
					)
				} )}
			</ul>
		</Widget>
	)
}

const getCards = () => {
	const cards = []
	const { adminURLs: urls } = getSystemConfig()

	if ( 'undefined' === typeof urls ) {
		return cards
	}

	if ( 'undefined' !== typeof urls.createPost ) {
		cards.push( {
			children: __( 'Create A New Post' ),
			href: urls.createPost,
			target: '_blank',
		} )
	}

	if ( 'undefined' !== typeof urls.customize ) {
		cards.push( {
			children: __( 'Choose A New Theme' ),
			href: urls.customize,
			target: '_blank',
		} )
	}

	if ( 'undefined' !== typeof urls.createUser ) {
		cards.push( {
			children: __( 'Invite Users' ),
			href: urls.createUser,
			target: '_blank',
		} )
	}

	if ( 'undefined' !== typeof urls.customize ) {
		cards.push( {
			children: __( 'Create A Nav Menu' ),
			href: urls.customize,
			target: '_blank',
		} )
	}

	if ( 'undefined' !== typeof urls.customize ) {
		cards.push( {
			children: __( 'Manage Widgets' ),
			href: urls.customize,
			target: '_blank',
		} )
	}

	cards.push( {
		children: __( 'Learn About WordPress' ),
		href: 'https://wordpress.org/support/',
		target: '_blank',
	} )

	return cards
}
