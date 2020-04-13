import React, { Children, useState, useLayoutEffect, useRef } from 'react'
import classname from 'classnames'
import { Button as FLUID_Button } from 'fluid/ui'
import { Icon } from 'ui'
import Menu from './menu'
import './style.scss'

const Button = { ...FLUID_Button }

export const limitChildren = ( children, count = null ) => {
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
	const classes = classname( className, {
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
		return (
			<>
				{ shouldInsertDivider && <Rule direction={ dividerDirection } isHidden={ shouldHideDivider } /> }
				{ child }
			</>
		)
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
			const moreBtn = wrap.querySelector( '.fl-asst-more-button' )
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
		'fl-asst-button-group': true,
		[`fl-asst-button-group-${direction}`]: direction,
		[`fl-asst-button-group-appearance-${appearance}`]: appearance,
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
				<Menu.Item
					key={ i }
					{ ...child.props }
				/>
			)
		} )
	}

	const MoreBtn = () => {
		const [ isShowing, setIsShowing ] = useState( false )

		return (
			<>
				{ shouldInsertDividers && <Rule
					className='fl-asst-more-button-divider'
					direction={ dividerDirection }
				/> }
				<Menu content={ <MoreMenuContent /> } isShowing={ isShowing }>
					<Button
						className='fl-asst-more-button'
						status={ isShowing ? 'primary' : '' }
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
				{ /*0 === visibleChildren.length ? allChildren : visibleChildren*/ }
				{ shouldShowMoreBtn && <MoreBtn /> }
			</div>
		</>
	)
}

Button.Loading = ( {
	className,
	children,
	isLoading = true,
	...rest
} ) => {
	const classes = classname( {
		'fl-asst-button-loading': true,
	}, className )

	return (
		<Button className={ classes } { ...rest }>
			{ children }
			{ isLoading && <Icon.SmallSpinner /> }
		</Button>
	)
}

Button.renderActions = actions => {
	const defaultAction = {
		label: null,
		shouldRender: true,
		isEnabled: true,
	}
	return Object.values( actions ).map( ( action, i ) => {

		const { label, shouldRender, isEnabled, ...rest } = { ...defaultAction, ...action }

		// NOTE: isEnabled is an older prop coming from the currently viewing actions.

		if ( ! shouldRender || ! isEnabled ) {
			return null
		}

		return (
			<Button key={ i } { ...rest }>{label}</Button>
		)
	} )
}

export { Button, Menu }

export default Button
