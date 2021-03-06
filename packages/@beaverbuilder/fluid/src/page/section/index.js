import React from 'react'
import c from 'classnames'
import * as Layout from '../../layout'
import './style.scss'

const Section = ( {
	children,
	className,
	label,
	handle,
	contentStyle = {},
	padX = true,
	padY = true,
	footer,
	description,
	...rest
} ) => {

	const classes = c( 'fluid-section', {
		[`${handle}-section`]: handle,
	}, className )

	return (
		<div className={ classes } { ...rest }>
			{ label && <div className="fluid-section-title"><span className="fluid-section-title-text">{label}</span></div> }
			{ description && <Layout.Row className="fluid-section-description">{description}</Layout.Row> }
			<Layout.Box
				className="fluid-section-content"
				padX={ padX }
				padY={ padY }
				style={ contentStyle }
			>{children}</Layout.Box>
			{ footer && (
				<Layout.Box
					padY={ false }
					className="fluid-section-footer"
				>{footer}</Layout.Box>
			)}
		</div>
	)
}

export default Section
