import React, { forwardRef, Children, cloneElement, useState, useLayoutEffect, useRef } from 'fl-react'
import { __ } from '@wordpress/i18n'
import { Link } from 'fl-react-router-dom'
import classname from 'fl-classnames'
import { Icon } from 'lib'
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

const Rule = ( { className, direction: dir = 'horizontal', isHidden = false } ) => {
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
	shouldHandleOverflow = true,
	label,
	...rest
} ) => {
	const [ visibleChildren, setVisibleChildren ] = useState( [] )
	const [ moreChildren, setMoreChildren ] = useState( [] )
	const [ shouldShowMoreBtn, setShouldShowMoreBtn ] = useState( true )
	const [ shouldShowMoreMenu, setShouldShowMoreMenu ] = useState( false )
	const wrapRef = useRef()
	const moreBtnRef = useRef()

	const shouldInsertDividers = 'normal' === appearance
	const dividerDirection = 'row' === direction ? 'vertical' : 'horizontal'

	let allChildren = []
	let childWidths = []

	allChildren = Children.map( children, ( child, i ) => {
		const isFirst = 0 === i
		const shouldInsertDivider = ! isFirst && shouldInsertDividers
		const shouldHideDivider = child.props.isSelected
		const childRef = el => {
			if ( el ) {
				childWidths.push( el.clientWidth + ( isFirst ? 0 : 2 ) )
			}
		}
		return (
			<>
				{ shouldInsertDivider && <Rule direction={ dividerDirection } isHidden={ shouldHideDivider } /> }
				{ cloneElement( child, { ref: childRef } ) }
			</>
		)
	} )

	useLayoutEffect( () => {
		if ( ! shouldHandleOverflow ) {
			setShouldShowMoreBtn( false )
			return
		}

		const wrapWidth = wrapRef.current.clientWidth
		const moreBtnWidth = moreBtnRef.current.offsetWidth
		let totalChildWidths = 0
		let visibleChildren = []
		let moreChildren = []

		childWidths.map( ( width, i ) => {
			totalChildWidths += width
			if ( totalChildWidths + moreBtnWidth < wrapWidth ) {
				visibleChildren.push( allChildren[ i ] )
			} else {
				moreChildren.push( allChildren[ i ] )
			}
		} )

		setVisibleChildren( visibleChildren )
		setMoreChildren( moreChildren )
		setShouldShowMoreBtn( moreChildren.length > 0 )
	}, [] )

	const classes = classname( {
		'fl-asst-button-group': true,
		[`fl-asst-button-group-${direction}`]: direction,
		[`fl-asst-button-group-appearance-${appearance}`]: appearance,
	}, className )

	const props = {
		...rest,
		className: classes,
		role: 'group',
		ref: wrapRef,
	}

	const MoreBtn = () => {
		return (
			<>
				<Rule
					className='fl-asst-more-button-divider'
					direction={ dividerDirection }
				/>
				<Button
					ref={ moreBtnRef }
					className='fl-asst-more-button'
					onClick={ () => setShouldShowMoreMenu( ! shouldShowMoreMenu ) }
				>
						{__( 'More' )}
				</Button>
			</>
		)
	}

	const MoreMenu = () => {
		return (
			<div className="fl-asst-more-menu">{ moreChildren }</div>
		)
	}

	return (
		<>
			{ label && <label>{label}</label> }
			<div { ...props }>
				{ 0 === visibleChildren.length ? allChildren : visibleChildren }
				{ shouldShowMoreBtn && <MoreBtn /> }
			</div>
			{ shouldShowMoreMenu && moreChildren.length > 0 && <MoreMenu /> }
		</>
	)
}

Button.Loading = ( {
	className,
	children,
	...rest
} ) => {
	const classes = classname( {
		'fl-asst-button-loading': true,
	}, className )

	return (
		<Button className={ classes } { ...rest }>
			{ children }
			<Icon.SmallSpinner />
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
