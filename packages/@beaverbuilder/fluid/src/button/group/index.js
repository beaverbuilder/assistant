import React, { Children, useState, useLayoutEffect, useRef } from 'react'
import classname from 'classnames'
import Menu from '../../menu'
import Button from '../base'
import * as Icon from '../../icon'
import './style.scss'

const limitChildren = ( children, count = null ) => {
	if ( Number.isInteger( count ) ) {
		return Children.map( children, ( child, i ) => {
			return ( i + 1 ) > count ? null : child
		} )
	}
	return children
}

const Rule = ( {
	className,
	direction: dir = 'horizontal',
	isHidden = false
} ) => {
	const classes = classname( 'fluid-divider', {
		'fluid-vertical-divider': 'vertical' === dir,
		'fluid-horizontal-divider': 'horizontal' === dir,
		'fluid-is-hidden': isHidden,
	}, className )
	return (
		<hr className={ classes } />
	)
}

/**
 * Button.Group
 */
const Group = ( {
	children,
	className,
	direction = 'row',
	appearance = 'normal',
	shouldHandleOverflow = false,
	label,
	moreMenu,
	...rest
} ) => {
	const [ maxChildren, setMaxChildren ] = useState( null )
	const [ shouldShowMoreBtn, setShouldShowMoreBtn ] = useState( true )
	const wrapRef = useRef()

	const shouldInsertDividers = 'normal' === appearance
	const dividerDirection = 'row' === direction ? 'vertical' : 'horizontal'

	let allChildren = Children.map( children, ( child, i ) => {
		if ( ! child ) {
			return null
		}
		const isFirst = 0 === i
		const shouldInsertDivider = ! isFirst && shouldInsertDividers
		const shouldHideDivider = child.props.isSelected
		return child
	} )

	useLayoutEffect( () => {
		if ( ! shouldHandleOverflow ) {
			setShouldShowMoreBtn( false )
			return
		}

		if ( wrapRef.current ) {
			const wrap = wrapRef.current
			const styles = window.getComputedStyle( wrap )
			const pad = parseInt( styles.paddingLeft ) + parseInt( styles.paddingRight )
			const moreBtn = wrap.querySelector( '.fluid-more-button' )
			const areaWidth = wrap.clientWidth - pad
			const contentWidth = moreBtn ? wrap.scrollWidth - ( pad + moreBtn.offsetWidth ) : wrap.scrollWidth - pad


			if ( contentWidth > areaWidth ) {
				setShouldShowMoreBtn( true )

				const available = areaWidth - moreBtn.offsetWidth
				let used = 0
				let max = 0

				for ( let child of wrap.childNodes ) {
					used += child.offsetWidth
					if ( used > available ) {
						continue
					}
					max++
				}
				setMaxChildren( max )
			} else {
				setShouldShowMoreBtn( false )
				setMaxChildren( null )
			}
		}
	}, [ children ] )

	const classes = classname( {
		'fluid-button-group': true,
		[`fluid-button-group-${direction}`]: direction,
		[`fluid-button-group-appearance-${appearance}`]: appearance,
	}, className )

	const props = {
		...rest,
		className: classes,
		role: rest.role ? rest.role : 'group',
		ref: wrapRef,
	}

	const MoreMenuContent = () => {

		if ( moreMenu ) {
			return moreMenu
		}

		return Children.map( children, ( child, i ) => {
			if ( ! child || child.props.excludeFromMenu ) {
				return null
			}
			return (
				<Menu.Item key={ i } { ...child.props } />
			)
		} )
	}

	const MoreBtn = () => {
		const [ isShowing, setIsShowing ] = useState( false )

		return (
			<>
				{ shouldInsertDividers && <Rule
					className='fluid-more-button-divider'
					direction={ dividerDirection }
				/> }
				<Menu
					content={ <MoreMenuContent /> }
					isShowing={ isShowing }
					onOutsideClick={ () => setIsShowing( false ) }
				>
					<Button
						className='fluid-more-button'
						isSelected={ isShowing }
						onClick={ () => setIsShowing( ! isShowing ) }
					>
						<Icon.More />
					</Button>
				</Menu>
			</>
		)
	}

	return (
		<>
			{ label && <label>{label}</label> }
			<div { ...props }>
				{ limitChildren( allChildren, maxChildren ) }
				{ shouldShowMoreBtn && <MoreBtn /> }
			</div>
		</>
	)
}

export default Group
