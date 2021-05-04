import React, { useRef } from 'react'
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
					<Button
						appearance="transparent"
						icon={ <Icon.CaretLeft /> }
						onClick={ () => go( true ) }
					/>
					<Button
						appearance="transparent"
						icon={ <Icon.CaretRight /> }
						onClick={ () => go( false ) }
					/>
				</div>
			) }
		</Tag>
	)
}

export default Swiper
