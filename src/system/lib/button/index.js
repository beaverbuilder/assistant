import React, { forwardRef, Children, cloneElement, useState, useLayoutEffect, useRef } from 'fl-react'
import { __ } from '@wordpress/i18n'
import { Link } from 'fl-react-router-dom'
import classname from 'fl-classnames'
import './style.scss'

export const Button = forwardRef( ( props, ref ) => {
	const {
		className,
		to,
		href,
		onClick,
		isSelected = false,
		appearance = 'normal',
		...rest
	} = props

	const classes = classname( {
		'fl-asst-button': true,
		'fl-asst-is-selected': isSelected,
		[`fl-asst-button-appearance-${appearance}`]: appearance,
	}, className )

	let newProps = {
		...rest,
		ref,
		className: classes,
	}

	// Determine the tag for this button based on props.
	let Tag = 'button'
	if ( to || href ) {

		// Routing Link
		Tag = 'a'
		if ( href ) {
			newProps.href = href
		} else {
			Tag = Link
			newProps.to = to
		}
	} else {
		newProps.onClick = onClick
	}

	return (
		<Tag { ...newProps } />
	)
} )

const Rule = ( { direction: dir = 'horizontal', isHidden = false } ) => {
	const classes = classname( {
		'fl-asst-divider': true,
		'fl-asst-vertical-divider': 'vertical' === dir,
		'fl-asst-horizontal-divider': 'horizontal' === dir,
		'fl-asst-is-hidden': isHidden,
	} )
	return (
		<hr className={ classes } />
	)
}

/**
 * Button.Group
 */
Button.Group = ( {
	children: passedChildren,
	className,
	direction = 'row',
	shouldHandleOverflow = true,
	label,
	...rest
} ) => {
	const [ needsOverflow, setNeedsOverflow ] = useState( false )
	const [ availableSpace, setAvailableSpace ] = useState( null )
	const [ shouldShowMoreMenu, setShouldShowMoreMenu ] = useState( false )

	const wrapRef = useRef()
	const moreBtnRef = useRef()

	let children = passedChildren
	let ejected = []
	const dividerDirection = 'row' === direction ? 'vertical' : 'horizontal'

	// First Pass - Is the scroll width greater than the width of the container?
	useLayoutEffect( () => {

		if ( ! shouldHandleOverflow ) {
			if ( needsOverflow ) {
				setNeedsOverflow( false )
			}
			return
		}

		if ( wrapRef.current ) {
			const wrap = wrapRef.current
			const hasScroll = wrap.scrollWidth > wrap.clientWidth

			// Did the value change?
			if ( needsOverflow !== hasScroll ) {
				setNeedsOverflow( hasScroll )
			}
		}

	} ) // always

	// Second Pass - Determine how much available space there is after more button is added.
	useLayoutEffect( () => {
		if ( ! needsOverflow ) {
			return
		}

		const wrap = wrapRef.current
		const more = moreBtnRef.current

		if ( needsOverflow && wrap && more ) {
			setAvailableSpace( wrap.clientWidth - ( more.clientWidth + 2 ) )
		}

	}, [ needsOverflow ] )


	// Process children
	if ( children ) {
		let accruedWidth = 0

		children = Children.map( passedChildren, ( child, i ) => {

			if ( ! child ) {
				return null
			}

			let shouldEject = false
			const isFirst = 0 === i
			const shouldInsertDivider = ! isFirst
			const shouldHideDivider = child.props.isSelected

			const childRef = el => {
				if ( ! shouldHandleOverflow ) {
					return
				}

				if ( el && availableSpace ) {
					accruedWidth += el.clientWidth + ( isFirst ? 0 : 2 )

					if ( accruedWidth > availableSpace ) {

						// Do something here
					}
				}
			}

			if ( shouldEject ) {
				return null
			}

			return (
                <>
                    { shouldInsertDivider && <Rule direction={ dividerDirection } isHidden={ shouldHideDivider } /> }
                    { cloneElement( child, { ref: childRef } ) }
                </>
			)
		} )
	}

	const classes = classname( {
		'fl-asst-button-group': true,
		[`fl-asst-button-group-${direction}`]: direction,
	}, className )

	const props = {
		...rest,
		className: classes,
		role: 'group',
		ref: wrapRef,
	}

	const MoreBtn = () => {
		return (
			<Button ref={ moreBtnRef } onClick={ () => setShouldShowMoreMenu( ! shouldShowMoreMenu ) }>{__( 'More' )}</Button>
		)
	}

	return (
			<>
				{ label && <label>{label}</label> }
				<div { ...props }>
					{ children }
					{ needsOverflow && (
					<>
						<Rule direction={ dividerDirection } />
						<MoreBtn />
					</>
					) }
				</div>
				{ shouldShowMoreMenu && needsOverflow && <MoreMenu>{ejected}</MoreMenu> }
			</>
	)
}

const MoreMenu = ( { children } ) => {
	return (
		<div className="fl-asst-more-menu">{children}</div>
	)
}
