import React, { useEffect } from 'react'
import c from 'classnames'
import Section from './section'
import ErrorBoundary from './error-boundary'
import * as Layout from '../layout'
import BackButton from './back-button'
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

	tag: Tag = 'div',
	contentBoxTag: ContentTag = 'div',
	contentBoxProps = {},
	contentBoxStyle = null,

	overlay,

	...rest
} ) => {
	const classes = c( 'fluid-page', className )

	// Handle initial loading, like focusing.
	useEffect( onLoad, [] )

	// Handle whether or not to show the back button
	const showBackButton = 'function' === typeof shouldShowBackButton ? shouldShowBackButton() : shouldShowBackButton

	const Hero = ( { children } ) => {

		if ( ! children ) {
			return null
		}
		const isString = 'string' === typeof children

		const style = {
			transformOrigin: '0 0',
			flex: '0 0 auto',
			borderBottom: '2px solid var(--fluid-line-color)'
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
		minWidth: 0,
		maxWidth: '100%',
		display: 'flex',
		flexDirection: 'column'
	}

	const contentBoxStyles = {
		maxHeight: shouldScroll ? '' : '100%',
		minHeight: 0,
		flexShrink: shouldScroll ? 0 : 1,
		...contentBoxStyle
	}

	const contentWrapperStyle = {
		flexGrow: 1,
		flexShrink: 1,
		minHeight: 0,
		maxHeight: '100%', /* yes, for scroll loading to work */
		...contentWrapStyle,
	}

	return (
		<Tag className="fluid-page-wrap" style={ wrapStyle }>
			<div className={ classes } { ...rest } style={ styles }>

				{ hero && <Hero>{hero}</Hero> }

				<ContentTag className="fluid-page-content" { ...contentBoxProps } style={ contentBoxStyles }>
					<div className="fluid-sticky-element fluid-page-top-content" style={ topContentStyle }>

						{ toolbar }

						{ false !== toolbar && ! toolbar && (
							<Layout.Toolbar className="fluid-page-top-toolbar">

								{ showBackButton && <BackButton /> }

								{ icon && <span className="fluid-page-title-icon">{icon}</span> }

								{ title && <div className="fluid-page-toolbar-content">
									<span
										className="fluid-page-title"
										role="heading"
										aria-level="1" style={ { flex: '1 1 auto' } }
									>{title}</span>
								</div> }

								{ actions && <span className="fluid-page-actions">{actions}</span> }

							</Layout.Toolbar>
						)}
						{ header && <Layout.Toolbar size="sm" className="fluid-page-header">{header}</Layout.Toolbar > }
					</div>

					<Layout.Box padX={ padX } padY={ padY } style={ contentWrapperStyle }>
						<ErrorBoundary>{children}</ErrorBoundary>
					</Layout.Box>
				</ContentTag>
			</div>
			{ footer && <div className="fluid-page-footer">{footer}</div> }
			{ overlay && <div className="fluid-page-overlay">{overlay}</div> }
		</Tag>
	)
}

Page.Section = Section

export default Page
