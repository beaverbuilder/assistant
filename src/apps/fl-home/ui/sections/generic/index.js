import React, { useState, useEffect } from 'react'
import c from 'classnames'
import { Icon, Button } from 'assistant/ui'
import Swiper from './swiper'
import './style.scss'

const Section = ( {
	tag: Tag = 'div',
	headerComponent: Header = SectionHeader,
	title,
	className,
	children,
	padContent = true,
	canCollapse = true,
	isCollapsed = false,
	headerActions,
	description,
	footer,
	onToggle = () => {},
	...rest
} ) => {
	const [ showContent, setShowContent ] = useState( ! isCollapsed )

	// Handle external prop control
	useEffect( () => {
		if ( showContent === isCollapsed ) {
			setShowContent( ! isCollapsed )
		}
	}, [ isCollapsed ] )

	const classes = c( 'fl-asst-feature-section', {
		'pad-content': padContent
	}, className )

	return (
		<Tag className={ classes } { ...rest } >
			<Header
				title={ title }
				showCaret={ canCollapse }
				isExpanded={ showContent }
				toggleExpanded={ () => {
					if ( canCollapse ) {
						const newValue = ! showContent
						setShowContent( newValue )
						onToggle( newValue )
					}
				} }
				actions={ headerActions }
			/>
			{ showContent && (
				<>
					{ description && <div className="section-description">{ description }</div> }
					<div className="section-content">
						{ children }
					</div>
					{ footer && <div className="section-footer">{ footer }</div> }
				</>
			) }
		</Tag>
	)
}

const SectionHeader = ( {
	title,
	showCaret = false,
	isExpanded = true,
	toggleExpanded = () => {},
	actions,
	...rest
} ) => {
	return (
		<div className="fl-asst-feature-section-header" { ...rest }>
			<div className="gutter-space">
				{ showCaret && (
					<Button
						onClick={ toggleExpanded }
						icon={ isExpanded ? <Icon.CaretDown /> : <Icon.CaretRight /> }
						appearance="transparent"
						size="sm"
						shape="round"
					/>
				) }
			</div>
			<div className="title-text">{title}</div>
			{ actions && <div className="header-actions">{ actions }</div>}
		</div>
	)
}

export { Swiper }

export default Section
