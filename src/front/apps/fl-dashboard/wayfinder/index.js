import React, { Fragment, useRef, useState } from 'react'
import { __ } from '@wordpress/i18n'
import {
	Widget,
	Button,
	BackForwardControl,
} from 'components'
import { getSystemConfig } from 'store'
import './style.scss'

export const WayfinderWidget = () => {
	const [ scrollPos, setScrollPos ] = useState( 0 )
	const listRef = useRef( null )
	const cards = getCards()

	if ( 0 === cards.length ) {
		return null
	}

	const move = direction => {
		if ( listRef.current ) {
			const pos = listRef.current.scrollLeft
			const unit = ( 180 * 2 ) + 5 + ( 2 * 2 ) // Check out element spacing
			listRef.current.scrollLeft = 'forward' === direction ? pos + unit : pos - unit
			setScrollPos( listRef.current.scrollLeft )
		}
	}

	let end = 0
	if ( listRef.current ) {
		const el = listRef.current
		end = el.scrollWidth - el.clientWidth
	}

	const Title = () => {
		return (
			<Fragment>
				{__( 'How would you like to begin?' )}
				<span className="fl-asst-widget-title-actions">
					<BackForwardControl
						onNext={ () => move( 'forward' )}
						onPrevious={ () => move( 'back' )}
						isNextEnabled={ scrollPos < end }
						isPreviousEnabled={ 0 < scrollPos }
					/>
				</span>
			</Fragment>
		)
	}

	const handleScroll = e => {
		setScrollPos( e.target.scrollLeft )
		e.stopPropagation()
	}

	return (
		<Widget
			title={<Title />}
			isPadded={false}
			className="fl-asst-wayfinder-widget"
		>
			<ul
				className="fl-asst-swipe-list"
				ref={listRef}
				onScroll={handleScroll}
			>
				{ cards.map( ( card, i ) => {
					return (
						<li key={i}>
							<Button {...card} />
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
