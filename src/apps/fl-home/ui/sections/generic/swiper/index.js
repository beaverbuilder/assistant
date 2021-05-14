import React, { useRef, useEffect } from 'react'
import c from 'classnames'
import { Button, Icon } from 'assistant/ui'
import './style.scss'

const Swiper = ( {
	tag: Tag = 'div',
	className,
	children,
	scrollBy = 360,
	disabled = false,
	...rest
} ) => {
	const ref = useRef( null )
	const classes = c( 'fl-asst-swiper', {
		'is-disabled': true === disabled
	}, className )

	useEffect( () => {
		if ( ref.current ) {
			const scroller = ref.current

			const setScrollClasses = el => {
				const { scrollLeft, scrollWidth, clientWidth, parentNode } = el
				const parentClasses = parentNode.classList

				// Toggle Start and End classes
				if ( 0 === scrollLeft ) {
					parentClasses.add( 'scroll-start' )
					parentClasses.remove( 'scroll-end' )
				} else if ( scrollWidth === ( scrollLeft + clientWidth ) ) {
					parentClasses.remove( 'scroll-start' )
					parentClasses.add( 'scroll-end' )
				} else {
					if ( parentClasses.contains( 'scroll-start' ) ) {
						parentClasses.remove( 'scroll-start' )
					}
					if ( parentClasses.contains( 'scroll-end' ) ) {
						parentClasses.remove( 'scroll-end' )
					}
				}
			}

			// Initial check
			setScrollClasses( scroller )

			const handleScroll = e => setScrollClasses( e.target )
			scroller.addEventListener( 'scroll', handleScroll )
			return () => scroller.removeEventListener( 'scroll', handleScroll )
		}
	}, [] )

	const go = ( back = false ) => {
		if ( ref.current ) {
			const el = ref.current
			const left = back ? el.scrollLeft - scrollBy : el.scrollLeft + scrollBy
			el.scrollTo( {
				left,
				behavior: 'smooth'
			} )
		}
	}
	let showBack = true
	let showForward = true

	return (
		<Tag className={ classes } { ...rest }>
			<div
				className="fl-asst-swiper-scroller"
				ref={ ref }
			>
				{children}
			</div>
			{ ! disabled && (
				<div className="fl-asst-swiper-nav">
					{ showBack && (
						<Button
							appearance="transparent"
							icon={ <Icon.CaretLeft /> }
							onClick={ () => go( true ) }
						/>
					) }
					{ showForward && (
						<Button
							appearance="transparent"
							icon={ <Icon.CaretRight /> }
							onClick={ () => go( false ) }
						/>
					) }
				</div>
			) }
		</Tag>
	)
}

export default Swiper
