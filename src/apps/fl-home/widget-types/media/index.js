import React, { useState, useEffect } from 'react'
import { __ } from '@wordpress/i18n'
import { AnimatePresence, motion } from 'framer-motion'
import { useSystemState } from 'assistant/data'
import { getWpRest } from 'assistant/utils/wordpress'
import { Layout, Button } from 'assistant/ui'
import { wrap } from '@popmotion/popcorn'
import './style.scss'

const variants = {
	enter: direction => {
		return {
			x: 0 < direction ? 100 : -100,
			opacity: 0,
			scale: 0,
		}
	},
	center: {
		zIndex: 1,
		x: 0,
		opacity: 1,
		scale: 1,
	},
	exit: direction => {
		return {
			zIndex: 0,
			x: 0 > direction ? 100 : -100,
			scale: 0,
			opacity: 0
		}
	}
}

const Media = () => {
	const { attachments } = getWpRest()
	const [ images, setImages ] = useState( [] )
	const [ [ page, direction ], setPage ] = useState( [ 0, 0 ] )
	const { appearance } = useSystemState( [ 'appearance' ] )
	const isDark = 'dark' === appearance.brightness

	useEffect( () => {
		attachments().findWhere( { post_mime_type: 'image', posts_per_page: 5 } ).then( ( { data } ) => {
			if ( data.items ) {
				setImages( data.items )
			}
		} )
	}, [] )

	// Run carousel
	const duration = 3000
	const next = () => {
		const i = wrap( 0, images.length, page + 1 )
		setPage( [ i, 1 ] )
	}

	useEffect( () => {
		if ( 0 < images.length ) {
			const id = setInterval( next, duration )
			return () => clearInterval( id )
		}
	}, [ images, page ] )

	if ( ! images.length ) {
		return <Layout.Loading />
	}

	const imageIndex = wrap( 0, images.length, page )
	const img = images[ imageIndex ]
	const src = ( 'sizes' in img && 'medium' in img.sizes ) ? img.sizes.medium.url : img.url

	return (
		<>
			<AnimatePresence initial={ false } custom={ direction }>
				<motion.img
					key={ page }
					src={ src }
					custom={ direction }
					variants={ variants }
					initial="enter"
					animate="center"
					exit="exit"
					style={ {
						pointerEvents: 'none',
						position: 'absolute',
					} }
					transition={ {
						x: { type: 'spring', stiffness: 400, damping: 100 },
						opacity: { duration: 0.3 }
					} }
				/>
			</AnimatePresence>
			<div
				style={ {
					position: 'absolute',
					width: '100%',
					height: '100%',
					padding: 5,
					zIndex: 2,
					display: 'flex',
					alignItems: 'flex-end',
					background: 'rgba(0,0,0,.2)'
				} }
			>
				<Button
					to="/fl-media"
					style={ {
						backdropFilter: 'blur(10px) saturate(200%)',
						background: isDark ? 'rgba(0,0,0,.4)' : 'rgba(255,255,255,.5)',
						padding: '5px 15px',
						margin: '0 auto',
						borderRadius: 18,
						boxShadow: 'none',
					} }
				>
					<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
						style={ {
							marginRight: 10
						} }
					>
						<path d="M1 11V1H8.87175" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
						<path d="M8.00023 1H19.0002V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
						<path d="M18.5819 20H1.82167C1.03258 20 0.554371 19.1288 0.978014 18.4631L7 9L11.375 13.7143L13.125 12.1429L19.2882 18.2921C19.9193 18.9217 19.4734 20 18.5819 20Z" fill="currentColor"/>
						<circle cx="13" cy="7" r="2" fill="currentColor"/>
					</svg>
					{ __( 'Media' ) }
				</Button>
			</div>
		</>
	)
}

export default Media
