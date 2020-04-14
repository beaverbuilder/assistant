import React, { useContext, useEffect } from 'react'
import classname from 'classnames'
import Nav from '../nav'
import Section from './section'
import Error from '../error'
import Layout from '../layout'
import './style.scss'

const Page = ( {
	children,
	className,
	hero,
	title,
	icon,
	toolbar,
	topContentStyle, /* element wraps header and toolbar */
	actions,
	header,

	footer,
	onLoad = () => {},
	shouldScroll = true,
	shouldShowBackButton = val => val,
	style = {},

	// Passed to Layout.Box
	padX = true,
	padY = true,
	contentWrapStyle = null,

	overlay,

	...rest
} ) => {
	const { isRoot } = useContext( Nav.Context )
	const classes = classname( 'fluid-page', className )

	// Handle initial loading, like focusing.
	useEffect( onLoad, [] )

	// Handle whether or not to show the back button
	let showBackButton = true
	if ( 'boolean' === typeof shouldShowBackButton ) {
		showBackButton = shouldShowBackButton
	} else if ( 'function' === typeof shouldShowBackButton ) {
		showBackButton = shouldShowBackButton( ! isRoot )
	}

	const Hero = ( { children } ) => {

		if ( ! children ) {
			return null
		}
		const isString = 'string' === typeof children

		const style = {
			transformOrigin: '0 0',
			flex: '0 0 auto',
		}

		return (
			<div style={ style }>
				{ isString && <img src={ children } style={ { width: '100%' } } /> }
				{ ! isString && children }
			</div>
		)
	}

	const styles = {
		...style,
		overflowX: 'hidden',
		overflowY: shouldScroll ? 'scroll' : 'hidden',
		perspective: 1,
		perspectiveOrigin: '0 0',
	}

	const wrapStyle = {
		flex: '1 1 auto',
		position: 'relative',
		minHeight: 0,
		maxHeight: '100%',
		display: 'flex',
		flexDirection: 'column'
	}

	const contentBoxStyle = {
		flexGrow: 1,
		flexShrink: 1,
		minHeight: 0,
		maxHeight: '100%', /* yes, for scroll loading to work */
		...contentWrapStyle,
	}

	return (
		<div className="fluid-page-wrap" style={ wrapStyle }>
			<div className={ classes } { ...rest } style={ styles }>

				{ hero && <Hero>{hero}</Hero> }

				<div className="fluid-page-content" style={ {
					maxHeight: shouldScroll ? '' : '100%',
					minHeight: 0,
					flexShrink: shouldScroll ? 0 : 1,
				} }>
					<div className="fluid-sticky-element fluid-page-top-content" style={ topContentStyle }>

						{ toolbar }
						{ false !== toolbar && ! toolbar && (
							<div className="fluid-toolbar fluid-page-top-toolbar">
								{ showBackButton && <Nav.BackButton /> }
								{ icon && (
									<span className="fluid-page-title-icon">
										{icon}
									</span>
								)}
								{ title && <div className="fluid-page-toolbar-content">
									<span
										className="fluid-page-title"
										role="heading"
										aria-level="1" style={ { flex: '1 1 auto' } }
									>{title}</span>
								</div> }
								{ actions && <span className="fluid-page-actions">{actions}</span> }
							</div>
						)}
						{ header && <div className="fluid-toolbar fluid-page-header">{header}</div> }
					</div>

					<Layout.Box padX={ padX } padY={ padY } style={ contentBoxStyle }>
						<Error.Boundary>{children}</Error.Boundary>
					</Layout.Box>
				</div>
			</div>
			{ footer && <div className="fluid-page-footer">{footer}</div> }
			{ overlay && <div className="fluid-page-overlay">{overlay}</div> }
		</div>
	)
}

Page.Section = Section
Page.Section.displayName = 'Page.Section'

export default Page
