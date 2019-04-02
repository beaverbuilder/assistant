import React from 'react'
import { __ } from '@wordpress/i18n'
import {
	Widget
} from 'components'
import './style.scss'

export const WayfinderWidget = () => {

	const cards = [
		{
			label: __( 'Create A New Post' ),
			href: '#',
		},
		{
			label: __( 'Choose A New Theme' ),
			href: '#',
		},
		{
			label: __( 'Invite Users' ),
			href: '#',
		},
		{
			label: __( 'Create A Nav Menu' ),
			href: '#',
		},
		{
			label: __( 'Manage Widgets' ),
			href: '#',
		},
		{
			label: __( 'Learn About WordPress' ),
			href: '#',
		},
	]

	return (
		<Widget
			title={__( 'How would you like to begin?' )}
			isPadded={false}
			className="fl-asst-wayfinder-widget"
		>
			<ul className="fl-asst-swipe-list">
				{ cards.map( ( card, i ) => {
					const { label } = card
					return (
						<li key={i}>
							<button>{label}</button>
						</li>
					)
				} )}
			</ul>
		</Widget>
	)
}

export const RecipesWidget = () => {

	const cards = [
		{
			label: __( 'Create A New Post' ),
			href: '#',
		},
		{
			label: __( 'Choose A New Theme' ),
			href: '#',
		},
		{
			label: __( 'Invite Users' ),
			href: '#',
		},
		{
			label: __( 'Create A Nav Menu' ),
			href: '#',
		},
		{
			label: __( 'Manage Widgets' ),
			href: '#',
		},
		{
			label: __( 'Learn About WordPress' ),
			href: '#',
		},
	]

	return (
		<Widget
			title={__( 'Starting Points' )}
			isPadded={false}
			className="fl-asst-wayfinder-widget"
		>
			<ul className="fl-asst-swipe-list">
				{ cards.map( ( card, i ) => {
					const { label } = card
					return (
						<li key={i}>
							<button>{label}</button>
						</li>
					)
				} )}
			</ul>
		</Widget>
	)
}
